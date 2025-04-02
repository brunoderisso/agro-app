import React, { useEffect, useRef, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import moment from 'moment';
import PropTypes from 'prop-types';

import { Grid, Typography } from '@material-ui/core';

import useStyles from '../../../../../styles/Billing/user/managementAccount/couponUser/DiscountCouponPage';
import FilterOptions from './FilterOptions';
import TokenList from '../../../../../stores/CancelTokenList';
import BillingStore from '../../../../../stores/BillingStore';
import TableCoupons from './TableCoupons';
import theme from '../../../../../styles/Utils/theme';
import masksUtils from '../../../../../utils/masksUtils';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import toolsUtils from '../../../../../utils/toolsUtils';
import { useTranslation } from 'react-i18next';


function DiscountCouponPage(props) {
    const classes = useStyles();

    const [loader, setLoader] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [totalItemsPag, setTotalItemsPag] = useState(0);
    const [isEmptyState, setIsEmptyState] = useState(false);

    const couponsRef = useRef();

    const { t } = useTranslation();

    const tokenList = new TokenList();

    useEffect(() => {
        bind();
        getDiscountCoupons();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        BillingStore.addListener('coupons.reload', getDiscountCoupons);
        BillingStore.addListener('coupons.filter', getFilterCoupon);
    }

    const clear = () => {
        BillingStore.removeListener('coupons.reload', getDiscountCoupons);
        BillingStore.removeListener('coupons.filter', getFilterCoupon);
    }

    const getDiscountCoupons = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        // TODO: desmockar start e limit
        const pagination = {
            start: 0,
            limit: 10
        }

        setLoader(true);
        BillingStore.getListCoupons(cancelToken, pagination, responseDiscountCoupons);
    }

    const responseDiscountCoupons = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data?.itens.length > 0) {
            setTotalItemsPag(response.data.totalItens);

            const newCoupons = response.data.itens.map(item => {
                return {
                    name: item.name ? item.name.toUpperCase() : null,
                    discount: item.discount ? masksUtils.percentageNumberFormat(item.discount) : null,
                    created_at: item.created_at ? moment(item.created_at).format('DD/MM/YYYY') : null,
                    recurrent: item.recurrent ? 'Sim' : 'Não'
                }
            })

            couponsRef.current = newCoupons;
            setCoupons(newCoupons);
        } else if (response.data?.itens.length === 0) {
            setIsEmptyState(true);
        }
    }

    const selectDateWithoutRepeat = (couponsToCheck, couponsCheckbox) => {
        const resultingCoupons = [...couponsCheckbox];

        couponsToCheck.forEach(coupon => {
            if (!resultingCoupons.some(finalCoupon => finalCoupon.name === coupon.name)) {
                resultingCoupons.push(coupon);
            }
        });

        return resultingCoupons;
    }

    const getFilterCoupon = (filters) => {
        let couponsToFilter = [...couponsRef.current];
        let checkboxesDateFilter = [];

        filters.forEach(filter => {
            const filteredParam = ConstantsUtils.MapCoupon.filter(
                coupon => coupon.label === Object.keys(filter)[0].toLowerCase()
            )[0].value;

            if (filter.isLessThan && filter.isCheckbox && Object.keys(filter)[0] === 'data de aplicação') {
                const initYear = '01/01/' + moment().format('YYYY');

                const couponsFilteredCheckbox = couponsRef.current.filter(coupon =>
                    moment(initYear, 'DD MM YYYY').format('x') > moment(coupon[filteredParam], 'DD MM YYYY').format('x')
                );

                checkboxesDateFilter = selectDateWithoutRepeat(couponsFilteredCheckbox, checkboxesDateFilter);

                return;
            }

            if (filter.isRange) {
                if (Object.keys(filter)[0] === 'desconto') {
                    const discounts = Object.values(filter)[0].split(' a ');
                    // Caso o usuário passe o desconto maior primeiro, coloca na ordem crescente
                    discounts.sort((a, b) => +a - +b);

                    couponsToFilter = couponsToFilter.filter(coupon => {
                        const selectedDiscount = +coupon[filteredParam].split('%')[0];

                        return selectedDiscount >= +discounts[0] && selectedDiscount <= +discounts[1];
                    });
                } else if (Object.keys(filter)[0] === 'data de aplicação') {
                    const dates = Object.values(filter)[0].split(' a ');

                    if (filter.isCheckbox) {
                        const couponsFilteredCheckbox = couponsRef.current.filter(coupon => {
                            return moment(dates[0], 'DD MM YYYY').format('x') <= moment(coupon[filteredParam], 'DD MM YYYY').format('x') &&
                                moment(dates[1], 'DD MM YYYY').format('x') >= moment(coupon[filteredParam], 'DD MM YYYY').format('x');
                        });

                        checkboxesDateFilter = selectDateWithoutRepeat(couponsFilteredCheckbox, checkboxesDateFilter);
                    } else {
                        // Caso o usuário passe a data final primeiro, coloca na ordem crescente
                        toolsUtils.orderDates(dates);

                        couponsToFilter = couponsToFilter.filter(coupon => {
                            return moment(dates[0], 'DD MM YYYY').format('x') <= moment(coupon[filteredParam], 'DD MM YYYY').format('x') &&
                                moment(dates[1], 'DD MM YYYY').format('x') >= moment(coupon[filteredParam], 'DD MM YYYY').format('x');
                        });
                    }
                }

            } else {
                couponsToFilter = couponsToFilter.filter(coupon =>
                    coupon[filteredParam].toLowerCase().includes(Object.values(filter)[0].toLowerCase())
                );
            }

        });

        // Caso haja filtro com checkBox de data, precisa atualizar a filtragem geral com esse filtro
        if (checkboxesDateFilter.length > 0) {
            const resultingCoupons = [];

            checkboxesDateFilter.forEach(couponCheckbox => {
                if (couponsToFilter.some(coupon => coupon.name === couponCheckbox.name)) {
                    resultingCoupons.push(couponCheckbox);
                }
            })

            couponsToFilter = resultingCoupons;
        }

        setCoupons(couponsToFilter);
    }

    return (
        <Grid className={classes.content}>
            <Typography variant='h4' className={classes.subtitle}>{t("management.coupons_title")}</Typography>
            <FilterOptions />
            {!loader &&
                <TableCoupons couponsList={coupons} isEmptyState={isEmptyState} search={props.search} totalItemsPag={totalItemsPag} />
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
        </Grid>
    );
}

DiscountCouponPage.propTypes = {
    search: PropTypes.string,
};

export default DiscountCouponPage;