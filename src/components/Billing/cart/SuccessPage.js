import React, { useState, useEffect } from 'react';

import { Button, Card, Grid, Link, Table, TableCell, TableContainer, TableRow, Typography, TableBody } from '@material-ui/core';

import styles from '../../../styles/Billing/SuccessPage';
import history from '../../../history';
import BillingStore from '../../../stores/BillingStore';
import masksUtils from '../../../utils/masksUtils';

import { ReactComponent as SuccessIcon } from '../../../img/SuccessIcon.svg'
import { useTranslation } from 'react-i18next';


export default function SuccessPage() {
    const classes = styles();

    const [plans, setPlans] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {
        let cart = BillingStore.getCart();

        if (!cart.success) {
            history.push('/subscription');
        }

        setTotal(cart.total);
        setPlans([BillingStore.getPlanDetails()]);

        if (cart.discount) {
            setDiscount(cart.discount);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        invoiceSubtotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plans]);

    const invoiceSubtotal = () => {
        let subtotal = 0;

        if (plans) {
            plans.forEach((plan) => { subtotal = subtotal + plan.value_cents / 100 });
            setSubtotal(parseFloat(subtotal));
        }
    }

    const calculateTotalHectare = () => {
        let total = 0;

        BillingStore.getProperties().forEach(prop => {
            total += +prop.size;
        });

        return total * BillingStore.HATAX;
    }

    const getProduct = (plan, index) => {
        return (
            <Grid key={index}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography className={classes.productName}>
                                {plan.name?.toUpperCase()}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography className={classes.text} variant='subtitle1'>
                                        {masksUtils.currencyFormat(parseFloat(plan.value_cents / 100))}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography className={classes.intervalText} variant='caption'>
                                        {BillingStore.getPeriod(plan.interval_type) || `* ${t('subscription.monthlyCharge')}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container spacing={3} justifyContent='center'>
                    <Grid item>
                        <Card className={classes.cardContainer}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant='overline'>
                                        {t('common.summary')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {plans && plans.map((plan, i) => {
                                        return (
                                            getProduct(plan, i)
                                        )
                                    })}
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell >
                                                        <Typography className={classes.text} variant='caption'>
                                                            {t('subscription.subtotalProducts')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography className={classes.subtotal}>
                                                            {masksUtils.currencyFormat(subtotal)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                {plans && BillingStore.findPlanWithArea(plans[0].subitems) &&
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography className={classes.text} variant='caption'>
                                                                {t('subscription.subtotalPerHectare')}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className={classes.subtotal}>
                                                                {masksUtils.currencyFormat(calculateTotalHectare())}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                                {discount && subtotal &&
                                                    <TableRow>
                                                        <TableCell>
                                                            <Typography variant='caption'>
                                                                {t('subscription.discountCoupon')}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography className={classes.textCupom}>
                                                                {`- ${masksUtils.currencyFormat(
                                                                    BillingStore.calculateDiscountValue(discount, subtotal)
                                                                )}
                                                                    (${discount * 100}%)`}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography variant='overline'>
                                                {t('common.total')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography className={classes.total}>
                                                {masksUtils.currencyFormat(total)}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='caption'>
                                        {t('subscription.subscriptionDetailsEmail')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={classes.cardContainer}>
                            <Grid container spacing={5} justifyContent='center'>
                                <Grid item xs={12} style={{ textAlign: 'center' }}>
                                    <SuccessIcon />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1' className={classes.message}>
                                        {t('subscription.thankYouForChoosingPrediza')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth variant='outlined' className={classes.button} href='https://prediza.io/app/#/'>
                                        <Typography>
                                            {t('common.accessTheApp')}
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} style={{ textAlign: 'center', fontSize: '12px' }}>
                                    <Typography>
                                        {`${t('common.orVisit')} `}
                                        <Link className={classes.link} href='https://prediza.io/' target='_blank'>{t('common.ourWebsite')}</Link>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};