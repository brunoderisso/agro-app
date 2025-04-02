import React, { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import clsx from 'clsx';
import moment from 'moment';

import { Typography, Grid } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import useStyles from '../../../../../styles/Billing/user/managementAccount/planUser/PlanUserAccountPage';
import PlanCardDetails from './PlanCardDetails';
import TokenList from '../../../../../stores/CancelTokenList';
import BillingStore from '../../../../../stores/BillingStore';
import theme from '../../../../../styles/Utils/theme';
import masksUtils from '../../../../../utils/masksUtils';
import UserFeedback from '../../../../Common/UserFeedback';
import PredizaModal from '../../../../Common/PredizaModal';
import history from '../../../../../history';
import { useTranslation } from 'react-i18next';


function PlanUserAccountPage() {
    const classes = useStyles();

    const [loader, setLoader] = useState(false);
    const [tableContent, setTableContent] = useState([]);
    const [errorStatusResponse, setErrorStatusResponse] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [objectidSubscription, setObjectidSubscription] = useState(null);

    const tokenList = new TokenList();

    const { t } = useTranslation();

    const modalButtons = [
        { label: t('common.cancelButton'), action: (status, objectid) => handleModal(status, objectid) },
        { label: t('management.myPlan_credCardSuspendSubscription'), action: () => handleSubscription('suspend'), color: theme.colors.error[40] }
    ];

    useEffect(() => {
        getSubscriptionUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleModal = (status, objectid) => {
        setOpenModal(status);

        if (objectid) {
            setObjectidSubscription(objectid);
        }
    }

    const selectNewPlan = () => {
        history.push('/subscription')
    }

    const getSubscriptionUser = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoader(true);
        BillingStore.getUserSubscriptions(cancelToken, responseGetSubscriptionUser);
    }

    const responseGetSubscriptionUser = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        let statusSubscription = 'Ativo';
        let isStatusActive = true;

        if (response.data) {
            const data = response.data;

            const subscriptions = data.map(plan => {
                const objectBanner = {};


                if (plan.suspended) {
                    objectBanner.status = true;
                    objectBanner.content = t('alert.YourAccountSuspended');
                    objectBanner.buttons = [{ label: t('alert.selectPlan'), action: selectNewPlan }];
                    statusSubscription = t('alert.accountSuspended');
                    isStatusActive = false;

                    BillingStore.emit('banner.handle', objectBanner);
                } else if (checkIsPendingPayment(plan.expires_at)) {
                    objectBanner.status = true;
                    objectBanner.content = t('alert.pendingPaymentsWarning');
                    objectBanner.buttons = [
                        { label: t('management.payment_payWithPix'), action: () => { } },
                        { label: t('management.payment_changeCard'), action: changePaymentMethod }
                    ];
                    statusSubscription = t('alert.paymentPending');
                    isStatusActive = false;

                    BillingStore.emit('banner.handle', objectBanner);
                }
                //MOCK
                // plan.subitems = [
                //     {
                //         "objectid": "ckts6c6c3uks73f0f4v0",
                //         "description": "area",
                //         "price_cents": 100,
                //         "quantity": 16,
                //     },
                //     {
                //         "objectid": "ckts6c6c3uks73f0f4v0",
                //         "description": "activation",
                //         "price_cents": 9990,
                //         "quantity": 16,
                //     },
                //     {
                //         "objectid": "ckts6c6c3uks73f0f4v0",
                //         "description": "cupom",
                //         "price_cents": -799,
                //         "quantity": 16,
                //     },


                // ]
                let Total = 0;
                //PREÇO DO PLANO
                let planContent = [
                    {
                        item: t('management.myPlan_subtotalProducts'),
                        value: masksUtils.currencyFormatToReal(plan.price_cents),
                        identifier: plan.plan_identifier
                    }
                ]
                Total += plan.price_cents;

                //PREÇO DO HECATRE (OPCIONAL)
                let area = plan.subitems.find((item) => { return item.description === "area" })
                let additionalPrice = 0;
                let hectare = 0;
                if (area) {
                    additionalPrice = area?.price_cents * area?.quantity;
                    hectare = area?.quantity;
                    planContent.push({
                        item: t('management.myPlan_additionalCostPerHectare'),
                        value: masksUtils.currencyFormatToReal(additionalPrice), valueHa: `(${hectare} ha.)`
                    })
                }
                Total += additionalPrice;

                //DEMAIS SUBITEMS (OPCIONAL)
                if (plan?.subitems) {
                    plan.subitems.forEach((subitem) => {
                        if (subitem?.description !== "area") {
                            let item = {
                                item: subitem.description,
                                value: masksUtils.currencyFormatToReal(subitem.price_cents)
                            }
                            planContent.push(item);
                            Total += subitem.price_cents;
                        }
                    })
                }

                //TESTAR CUPOM DESCONTO
                //{ item: t('management.myPlan_discountCoupon'), value: null, append: null },

                return {
                    planContent,
                    credCardContent: [
                        { item: t('management.myPlan_credCardOrderStatus'), value: statusSubscription },
                        {
                            item: t('management.myPlan_credCardNextBilling'),
                            value: plan.expires_at ? moment(plan.expires_at).format('DD/MM/YYYY') : null
                        },
                        {
                            item: t('management.myPlan_credCardInstallment'),
                            value: plan.cycles_count && plan.max_cycles ? `${plan.cycles_count}/${plan.max_cycles}` : null
                        },
                        { item: t('management.myPlan_credCardPaymentMethod'), value: 'Crédito', card: 'Visa', numberCard: '**** 1234' }
                    ],
                    objectid: plan.objectid,
                    status: isStatusActive,
                    Total: masksUtils.currencyFormatToReal(Total)
                };
            });

            setTableContent(subscriptions);
        }

        if (response.status) {
            setErrorStatusResponse(response.status.toString());

            if (response.status === 404) {
                const objectBanner = {};

                objectBanner.status = true;
                objectBanner.content = t("alert.subscriptionsMessage");
                objectBanner.buttons = [
                    { label: t("alert.checkPlan"), action: redirectToBuyPlan }
                ];

                BillingStore.emit('banner.handle', objectBanner);
            }
        }
    }

    const handleSubscription = (action) => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setOpenModal(false);
        setLoader(true);
        BillingStore.postUserSubscription(cancelToken, objectidSubscription, action, responseHandleSubscription);
    }

    const responseHandleSubscription = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            getSubscriptionUser();
        }

        if (response.status) {
            setLoader(false);
            setErrorStatusResponse(response.status.toString());
        }
    }

    const changePaymentMethod = () => {
        BillingStore.emit('tab_menu_account.change', 3);
    }

    const checkIsPendingPayment = (date) => {
        const today = moment().format('YYYY-MM-DD');
        const expirationDate = moment().subtract(3, 'month').format('YYYY-MM-DD');

        date = moment(date).format('YYYY-MM-DD');

        if (date && moment(expirationDate).isSameOrBefore(date) && moment(date).isBefore(today)) {
            return true;
        }

        return false;
    }

    const redirectToBuyPlan = () => {
        history.push('/subscription');
    }

    const bodyModal = () => {
        return (
            <Grid>
                <Typography className={classes.textModal}>
                    {t("alert.confirmSubscriptionCancellation")}
                </Typography>
                <Grid container className={classes.contentWarningText}>
                    <Grid item xs={1}>
                        <InfoIcon className={classes.iconWarning} />
                    </Grid>
                    <Grid item xs={11}>
                        <Typography className={classes.warningText}>
                            {t("alert.accessPlatformSubscriptionPending")}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid className={classes.content}>
            <Grid>
                <Typography variant="h4" className={classes.subtitle}>{t('management.myPlan_title')}</Typography>
            </Grid>
            {!loader &&
                tableContent.map((subscription, index) => {
                    return (
                        <Grid key={index} className={clsx(
                            classes.contentCards,
                            { [classes.wrapperSubscription]: index < tableContent.length - 1 }
                        )}>
                            <PlanCardDetails
                                contentInfo={subscription.planContent}
                                total={subscription.Total}
                                infoType='plan'
                                openModal={handleModal}
                                objectid={subscription.objectid}
                            />
                            <PlanCardDetails
                                contentInfo={subscription.credCardContent}
                                infoType='credCard'
                                status={subscription.status}
                                changePaymentMethod={changePaymentMethod}
                            />
                        </Grid>
                    );
                })
            }
            {!loader && tableContent.length === 0 &&
                <Typography className={classes.emptyText}>
                    {t('management.myPlan_noSignedPlan')}
                </Typography>
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
            <PredizaModal
                open={openModal}
                dispense={modalButtons[0]}
                confirm={modalButtons[1]}
                title={t('management.myPlan_credCardSuspendSubscription')}
                size={'medium'}
            >
                {bodyModal()}
            </PredizaModal>
            <UserFeedback error={errorStatusResponse} setError={setErrorStatusResponse} />
        </Grid>
    );
}

export default PlanUserAccountPage;