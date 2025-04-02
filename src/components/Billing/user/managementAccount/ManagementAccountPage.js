import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Typography, Grid, Button } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import history from '../../../../history';
import useStyles from '../../../../styles/Billing/user/managementAccount/ManagementAccountPage';
import ManagementAccountMenu from './ManagementAccountMenu';
import TabPanel from '../../../Common/TabPanel';
import PlanUserAccountPage from './planUser/PlanUserAccountPage';
import PropertyAccountPage from './propertyUser/PropertyAccountPage';
import PaymentMethodPage from './paymentUser/PaymentMethodPage';
import BillingDataPage from './billingDataUser/BillingDataPage';
import BillingHistoryPage from './billingReportUser/BillingHistoryPage';
import DiscountCouponPage from './couponUser/DiscountCouponPage';
import BillingStore from '../../../../stores/BillingStore';
import { ConstantsUtils } from '../../../../utils/constantsUtils';


function ManagementAccountPage(props) {
    const classes = useStyles();

    const [page, setPage] = useState(null);
    const [tab, setTab] = useState('');
    const [search, setSearch] = useState('');
    const [showBanner, setShowBanner] = useState(false);
    const [contentBanner, setContentBanner] = useState('');
    const [buttonsBanner, setButtonsBanner] = useState([]);

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.tab !== tab) {
            setTab(props.tab || 'plan');
        }

        if (props.search !== search) {
            setSearch(props.search);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (tab === 'plan') {
            setPage(0);
        } else if (tab === 'properties') {
            setPage(1);
        } else if (tab === 'billing-info') {
            setPage(2);
        } else if (tab === 'payment') {
            setPage(3);
        } else if (tab === 'billing-history') {
            setPage(4);
        } else if (tab === 'coupon') {
            setPage(5);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const bind = () => {
        BillingStore.addListener('tab_menu_account.change', handleChange);
        BillingStore.addListener('banner.handle', handleBanner);
    }

    const clear = () => {
        BillingStore.removeListener('tab_menu_account.change', handleChange);
        BillingStore.removeListener('banner.handle', handleBanner);
    }

    const handleChange = (newValue) => {
        let newTab = '';

        if (newValue === 0) {
            newTab = 'plan';
        } else if (newValue === 1) {
            newTab = 'properties';
        } else if (newValue === 2) {
            newTab = 'billing-info';
        } else if (newValue === 3) {
            newTab = 'payment';
        } else if (newValue === 4) {
            newTab = 'billing-history?start=0&limit=' + ConstantsUtils.RowsPerPage;
        } else if (newValue === 5) {
            newTab = 'coupon?start=0&limit=' + ConstantsUtils.RowsPerPage;
        }

        if (tab !== newTab) {
            history.push('/management/' + newTab);
        }
    }

    const handleBanner = (object) => {
        setShowBanner(object.status);
        setContentBanner(object.content);
        setButtonsBanner(object.buttons);
    }

    const warningBanner = () => {
        return (
            <Grid className={classes.warningMessage}>
                <Grid className={classes.contentWarning}>
                    <ErrorIcon />
                    <Typography className={classes.warningText}>
                        {contentBanner}
                    </Typography>
                </Grid>
                <Grid className={classes.wrapperWarningBtn}>
                    {buttonsBanner.map((button, index) => {
                        return (
                            <Button key={index} color='primary' className={classes.propBtn} onClick={button.action}>
                                <Typography className={classes.warningTextBtn}>{button.label}</Typography>
                            </Button>
                        );
                    })}
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container className={classes.wrapper}>
            <ManagementAccountMenu onChange={handleChange} page={page} />

            {tab === 'plan' &&
                <TabPanel value={page} index={0} Banner={showBanner ? warningBanner : null}>
                    <PlanUserAccountPage />
                </TabPanel>
            }
            {tab === 'properties' &&
                <TabPanel value={page} index={1}>
                    <PropertyAccountPage />
                </TabPanel>
            }
            {tab === 'billing-info' &&
                <TabPanel value={page} index={2}>
                    <BillingDataPage />
                </TabPanel>
            }
            {tab === 'payment' &&
                <TabPanel value={page} index={3}>
                    <PaymentMethodPage />
                </TabPanel>
            }
            {tab === 'billing-history' &&
                <TabPanel value={page} index={4}>
                    <BillingHistoryPage search={search}/>
                </TabPanel>
            }
            {tab === 'coupon' &&
                <TabPanel value={page} index={5}>
                    <DiscountCouponPage search={search}/>
                </TabPanel>
            }
        </Grid>
    );
}

ManagementAccountPage.propTypes = {
    tab: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
};

export default ManagementAccountPage;