import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Divider, Grid, Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/CheckCircleRounded';

import styles from "../../../styles/Billing/PlanCard";
import BillingStore from '../../../stores/BillingStore';
import history from '../../../history';
import stringsUtils from '../../../utils/stringsUtils';
import { ReactComponent as PixIcon } from "../../../img/PixIcon.svg";
import { ReactComponent as CreditCardIcon } from "../../../img/CreditCardIcon.svg";
import { ReactComponent as BarCodeIcon } from "../../../img/BarCodeIcon.svg";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

//espaço n -> <-
//espaço m -> <-
 // eslint-disable-next-line no-lone-blocks
 {/* <span style={{fontWeight:600}}>{stringsUtils.toCapitalize(item.name)}</span> <span>{item.description}</span> */}

function PlanCard(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const [formattedHeightContent, setFormattedHeightContent] = useState('');

    useEffect(() => {
        if (props.height > 0) {
            setFormattedHeightContent(props.height + 'px');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const getInterval = () => {
        if (props.interval === "months") {
            return `/${t('common.month')}`
        }
        if (props.interval === "wekly") {
            return `/${t('common.week')}`
        }
    }

    const onClick = () => {
        if (props.plan) {
            BillingStore.setHatax(props.plan.subitems[0].price_cents / 100);
            BillingStore.setPlanId(props.plan.objectid);
            BillingStore.setPlanDetails(props.plan);
            history.push("/subscription/customer");
        }
    }

    const getPaymentIcon = (payment) => {
        if (payment === 'pix') {
            return (
                <PixIcon />
            )
        } else if (payment === 'credit_card') {
            return (
                <CreditCardIcon />
            )
        } else if ('bank_slip') {
            return (
                <BarCodeIcon />
            )
        }
    }

    const centsToReal = (cents) => {
        if (typeof cents !== 'number'){
            return
        }

        const reais = cents / 100;
        return reais.toFixed(2).toString().replace(".", ",");
      }


    return (
        <Card className={classes.container} elevation={2}>
            <Grid item xs={12}>
                <Typography variant='h5' className={classes.cardTitle}>
                    {props.title.toUpperCase()}
                </Typography>
            </Grid>
            <Grid item xs={12} >
                <Grid container className={classes.cardHeader}>
                    <Grid>
                        <Typography variant='subtitle2' className={classes.priceCurrency}>
                            {props.currency}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography className={classes.price}>
                            {centsToReal(props.price)}
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant='subtitle2' className={classes.priceInterval}>
                            {getInterval()}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>

            <Divider className={classes.divider} />

            <div className='content-card' style={{height: formattedHeightContent, minHeight: "260px"}}>
                <Grid item xs={12}>
                    <Typography variant='body1' className={classes.subtitle}>
                        {props.subtitle}
                    </Typography>
                </Grid>

                <Grid item xs={12} className={classes.contentList} >
                    <Grid container spacing={2}>
                        {props.items.map((item, index) => {

                            return (
                                <Grid item xs={12} key={index}>
                                    <Grid container>
                                        <Grid item xs={1} style={{display: 'flex'}}>
                                            <CheckIcon className={classes.featureIcon} fontSize='small' />
                                        </Grid>
                                        <Grid item xs={11} style={{ paddingLeft: "8px" }}>
                                            <Typography variant='body2' className={classes.featureText}>
                                                {stringsUtils.toCapitalize(item.name)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </div>

            <Grid item xs={12} style={{ marginBottom: "24px", height: "30px" }}>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography variant='caption'>
                            {`${t('subscription.paymentMethods')}: `}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            {props.payments.map((payment, index) => {
                                return (
                                    <Grid item key={index}>
                                        {getPaymentIcon(payment)}
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Button className={classes.button} fullWidth variant="contained" onClick={onClick}>
                    <Typography variant='button' className={classes.buttonText}>
                        {t('common.select')}
                    </Typography>
                </Button>
            </Grid>
        </Card>
    )
}

PlanCard.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    currency: PropTypes.string,
    price: PropTypes.number,
    interval: PropTypes.string,
    items: PropTypes.array,
    payments: PropTypes.array,
    height: PropTypes.string,
};

PlanCard.defaultProps = {
    title: t('common.plan'),
    currency: "R$",
    interval: `/${t('common.month')}`,
    items: [],
    payments: []
};

export default withStyles(styles)(PlanCard);
