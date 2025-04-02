import React from 'react';
import clsx from 'clsx';

import { Grid, Typography } from '@material-ui/core';

import masksUtils from '../../../../../utils/masksUtils';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import useStyles from '../../../../../styles/Billing/user/managementAccount/billingUser/InfoDisplay';
import { useTranslation } from 'react-i18next';


function InfoDisplay(props) {
    const classes = useStyles();

    const { t } = useTranslation();

    const formatState = () => {
        if (props.customer?.state) {
            const state = ConstantsUtils.StatesList.filter(state => state.value === props.customer.state.toUpperCase());

            return state[0].label;
        } else {
            return null;
        }
    }

    return (
        <Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.name')}</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.name || ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.email')}</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.email || ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>CPF {t('common.orWord')} CNPJ</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.cpf_cnpj ? masksUtils.formatCpfCnpj(props.customer?.cpf_cnpj) : ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.phoneNumber')}</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.phone
                        ? masksUtils.formatPhone(props.customer.phone_prefix.concat(props.customer.phone))
                        : ConstantsUtils.NullFieldMask
                    }
                </Typography>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>CEP</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.zip_code || ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.address')}</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.street || ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container className={classes.marginContent}>
                <Grid item xs={6} className={classes.containerItemInfo}>
                    <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.numberHouse')}</Typography>
                    <Typography className={clsx(classes.textCommon, classes.itemText)}>
                        {props.customer?.number || ConstantsUtils.NullFieldMask}
                    </Typography>
                </Grid>
                <Grid item xs={6} className={classes.containerItemInfo}>
                    <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.complement')}</Typography>
                    <Typography className={clsx(classes.textCommon, classes.itemText)}>
                        {props.customer?.complement || ConstantsUtils.NullFieldMask}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container className={clsx(classes.containerItemInfo, classes.marginContent)}>
                <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.neighborhood')}</Typography>
                <Typography className={clsx(classes.textCommon, classes.itemText)}>
                    {props.customer?.district || ConstantsUtils.NullFieldMask}
                </Typography>
            </Grid>
            <Grid container>
                <Grid item xs={6} className={classes.containerItemInfo}>
                    <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.city')}</Typography>
                    <Typography className={clsx(classes.textCommon, classes.itemText)}>
                        {props.customer?.city || ConstantsUtils.NullFieldMask}
                    </Typography>
                </Grid>
                <Grid item xs={6} className={classes.containerItemInfo}>
                    <Typography className={clsx(classes.textCommon, classes.subtitle)}>{t('common.state')}</Typography>
                    <Typography className={clsx(classes.textCommon, classes.itemText)}>
                        {formatState() || ConstantsUtils.NullFieldMask}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default InfoDisplay;