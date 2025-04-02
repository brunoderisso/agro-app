import React from 'react';

import { Grid, Typography } from '@material-ui/core';

import useStyles from '../../../../../styles/Billing/user/managementAccount/billingUser/BillingDataPage';
import CardInfoData from './CardInfoData';
import { useTranslation } from 'react-i18next';


function BillingDataPage() {
    const classes = useStyles();

    const { t } = useTranslation();

    return (
        <Grid className={classes.content}>
            <Typography variant='h4' className={classes.subtitle}>{t("common.billingTitle")}</Typography>
            <CardInfoData />
        </Grid>
    );
}

export default BillingDataPage;