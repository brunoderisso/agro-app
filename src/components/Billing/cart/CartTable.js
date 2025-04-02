import React, { useState, useEffect } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Divider, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import BillingStore from "../../../stores/BillingStore";
import TokenList from '../../../stores/CancelTokenList';
import styles from "../../../styles/Billing/CartTable";
import masksUtils from '../../../utils/masksUtils';
import history from '../../../history';
import theme from '../../../styles/Utils/theme';
import { useTranslation } from 'react-i18next';

// TODO: trechos comentados para corrigir build em prod

export default withStyles(styles)(function CartTable(props) {
    const [coupon, setCoupon] = useState("");
    const [couponId, setCouponId] = useState("");
    const [discount, setDiscount] = useState(null);
    const [valueDiscount, setValueDiscount] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [addPerHa, setaddPerHa] = useState(0);
    const [haTax, setHaTax] = useState(0);
    const [hectare, setHectare] = useState(0);
    const [total, setTotal] = useState(0);
    const [loader, setLoader] = useState(false);
    const [disableBuyFlag, setDisableBuyFlag] = useState(false);
    const [disableCouponFlag, setDisableCouponFlag] = useState(false);
    const [errorCoupon, setErrorCoupon] = useState(false);
    const [errorMessageCoupon, setErrorMessageCoupon] = useState('');

    const { classes } = props;

    const { t } = useTranslation();

    const tokenList = new TokenList();

    useEffect(() => {
        invoiceSubtotal();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (valueDiscount) {
            setTotal(total - valueDiscount);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [valueDiscount]);

    useEffect(() => {

        if (subtotal > 0 && addPerHa > 0) {
            setTotal(parseFloat(subtotal + addPerHa));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtotal, addPerHa]);


    const onChangeCoupon = (e) => {
        setCoupon(e.target.value);
    }

    const onClickAddCoupon = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        BillingStore.searchCoupon(cancelToken, coupon, responseGetCoupon);
    }

    const responseGetCoupon = (response) => {
        tokenList.remove(response.id);

        if (response.status === 404) {
            setErrorCoupon(true);
            setErrorMessageCoupon(t('subscription.incorrectCoupon'));
        }

        if (!response.data?.enable) {
            setErrorCoupon(true);
            setErrorMessageCoupon(t('subscription.couponDeactivated'));
        } else if (response.data?.amount === 0) {
            setErrorCoupon(true);
            setErrorMessageCoupon(t('subscription.couponExhausted'));
        } else if (response.data?.expirer_at && new Date() > new Date(response.data.expirer_at)) {
            setErrorCoupon(true);
            setErrorMessageCoupon(t('subscription.couponExpired'));
        } else if (response.data?.plan_objectid !== props.plans[0].objectid) {
            setErrorCoupon(true);
            setErrorMessageCoupon(t('subscription.invalidCouponForSelectedProducts'));
        } else {
            setDiscount(response.data.discount);
            setValueDiscount(BillingStore.calculateDiscountValue(response.data.discount, subtotal));
            setCouponId(response.data.objectid);
            setDisableCouponFlag(true);
            setErrorCoupon(false);
            setErrorMessageCoupon('');
        }
    }

    const invoiceSubtotal = () => {
        let subtotal = 0;

        props.plans.forEach((plan) => { subtotal = subtotal + plan.value_cents / 100 });
        setSubtotal(parseFloat(subtotal));

        invoiceHa();
    }

    const invoiceHa = () => {
        let ha = 0;
        const properties = BillingStore.getProperties();

        properties.forEach(propertie => {
            if (propertie.size) {
                ha = ha + parseFloat(propertie.size);
            }
        });

        setHectare(ha);
        let tax = BillingStore.findPlanHaTAX(props.plans[0]);
        setHaTax(tax);
        setaddPerHa(ha * tax);
    }

    const buy = () => {
        if (props.cart) {
            if (props.cart.planId && props.cart.customerId) {
                setDisableBuyFlag(true);
                setLoader(true);

                const cancelToken = {};
                cancelToken.id = tokenList.add();
                cancelToken.token = tokenList.get(cancelToken.id);

                BillingStore.setTotal(total);
                BillingStore.setDiscount(discount);
                BillingStore.purchase({ ...props.cart, couponId, area: hectare, haTax }, cancelToken, responsePurchase);
            }
        }
    }

    const responsePurchase = (response) => {
        tokenList.remove(response.id);

        if (response.data && response.data.objectid) {
            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            BillingStore.getUserPayments(cancelToken, responseGetPayments);
        }

        if (response.status) {
            setLoader(false);
            setDisableBuyFlag(false);
            props.getStatusError(response.status.toString());
        }
    }

    const responseGetPayments = (response) => {
        tokenList.remove(response.id);
        setLoader(false);
        setDisableBuyFlag(false);

        if (response.data) {
            if (response.data.length === 0) {
                history.push("/subscription/pay");
            } else {
                BillingStore.setSuccess();
                history.push("/subscription/success");
            }
        }
    }

    const getProduct = (plan, index) => {
        return (
            <Grid key={index}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography className={classes.productName}>
                                {plan.name}
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
                        <Grid item xs={12}>
                            <Typography variant='caption'>
                                {plan.description || ""}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider style={{ marginTop: "16px" }} />
            </Grid>
        )
    }

    return (
        <Grid container justifyContent='center'>
            <Card className={classes.cardItems}>
                <Grid container spacing={2}>
                    <Grid className={classes.subtitle}>
                        <Typography variant='overline'>
                            {t('common.products')}
                        </Typography>
                    </Grid>
                    {props.plans.map((plan, index) => {
                        return (
                            getProduct(plan, index)
                        )
                    })}
                </Grid>
            </Card>
            <Card className={classes.cardTable}>
                <Grid container className={classes.mainCard}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography className={classes.text} variant='overline'>
                                            {t('subscription.purchaseSummary')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell >
                                        <Typography className={classes.text} variant='caption'>
                                            {t('common.subtotal')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={classes.subtotal}>
                                            {masksUtils.currencyFormat(subtotal)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                {BillingStore.findPlanWithArea(props.plans[0].subitems) &&
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant='caption' className={classes.text}>
                                                {t('subscription.additionalPerHectare')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='caption' className={classes.textWarning}>
                                                {masksUtils.currencyFormat(addPerHa) + " (" + hectare.toFixed(2).replace('.', ',') + " ha)"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            id="coupon"
                                            name="coupon"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                endAdornment:
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={onClickAddCoupon} disabled={disableCouponFlag}>
                                                            <AddCircleIcon className={classes.couponIcon} />
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}

                                            className={classes.inputs}
                                            value={coupon}
                                            onChange={onChangeCoupon}
                                            label={t('subscription.discountCoupon')}
                                            variant="outlined"
                                            placeholder={t('subscription.enterCode')}
                                            size='small'
                                            disabled={disableCouponFlag}
                                            error={errorCoupon}
                                            helperText={errorMessageCoupon}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {discount && valueDiscount &&
                                            <Typography variant='caption' className={classes.textCoupon}>
                                                {`- ${masksUtils.currencyFormat(valueDiscount)}
                                                    (${discount * 100}%)`}
                                            </Typography>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Grid item xs={12} style={{ margin: "24px 0px" }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography className={classes.text} variant='overline'>
                                        {t('common.total')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.totalText}>
                                        {masksUtils.currencyFormat(total)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Button
                                        className={classes.prevButton}
                                        startIcon={<ArrowBackIosIcon className={classes.iconSize} />}
                                        onClick={() => { history.push("/subscription/property") }}
                                        variant='outlined'
                                    >
                                        {t('common.backButton')}
                                    </Button>
                                </Grid>
                                <Grid item md>
                                    <Button
                                        id='bt-buy'
                                        className={classes.nextButton}
                                        endIcon={!loader && <ArrowForwardIosIcon className={classes.iconSize} />}
                                        fullWidth
                                        onClick={buy}
                                        variant='contained'
                                        disabled={disableBuyFlag}
                                    >
                                        {!loader && t('common.forwardButton')}
                                        {loader &&
                                            <Grid container justifyContent='center' alignItems='center'>
                                                <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={8} />
                                            </Grid>
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </TableContainer>

                </Grid>
            </Card>
        </Grid>
    );
});