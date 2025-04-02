import React, { useEffect, useState, useRef } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import styles from '../../../../../styles/Billing/user/managementAccount/paymentUser/PaymentMethodPage';
import theme from '../../../../../styles/Utils/theme';
import { LocalConfig } from '../../../../../LocalConfig';
import useScript from '../../../../../Hook/useScript';
import TokenList from '../../../../../stores/CancelTokenList';
import BillingStore from '../../../../../stores/BillingStore';
import UserFeedback from '../../../../Common/UserFeedback';
import CreditCardForm from '../../../../Common/CreditCard/CreditCardForm';
import ListCreditCard from './ListCreditCard';
import { useTranslation } from 'react-i18next';


function PaymentMethodPage(props) {
    const { classes } = props;

    const [payments, setPayments] = useState(null);
    const [creditCard, setCreditCard] = useState({});
    const [errorStatusResponse, setErrorStatusResponse] = useState('');
    const [errorMessageResponse, setErrorMessageResponse] = useState('');
    const [newCreditCard, setNewCreditCard] = useState(false);
    const [loader, setLoader] = useState(false);

    const Iugu = useRef(null);
    const tokenList = new TokenList();

    const { t } = useTranslation();

    useScript('https://js.iugu.com/v2');

    useEffect(() => {
        getPayments();
        bind();
        storeIuguReference();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        BillingStore.addListener('credit_card.reload', getPayments);
        BillingStore.addListener('method_payment.process', handleLoader);
        BillingStore.addListener('method_payment.error', handleErrorResponse);
    }

    const clear = () => {
        BillingStore.removeListener('credit_card.reload', getPayments);
        BillingStore.removeListener('method_payment.process', handleLoader);
        BillingStore.removeListener('method_payment.error', handleErrorResponse);
    }

    const handleLoader = (status) => {
        setLoader(status);
    }

    const storeIuguReference = () => {
        const interval = setInterval(() => {
            if (window.Iugu) {
                Iugu.current = window.Iugu;
                clearInterval(interval);
                initIugu();
            }
        }, 1000);
    }

    const initIugu = () => {
        Iugu.current.setAccountID(LocalConfig.iuguID);
        Iugu.current.setup();
    }

    const getPayments = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoader(true);
        BillingStore.getUserPayments(cancelToken, responseGetPayments);
    }

    const responseGetPayments = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data) {
            setPayments(response.data);
        }
    }

    const handleErrorResponse = (error) => {
        setErrorStatusResponse(error[0]);
        setErrorMessageResponse(error[1] || '');
    }

    const onSubmitCc = () => {
        BillingStore.emit('credit_card.process', true);
        BillingStore.emit('confirm.disable', true);

        BillingStore.createTokenIugu(creditCard, Iugu.current, tokenResponseHandler);
    }

    const tokenResponseHandler = (data) => {
        if (data.errors) {
            BillingStore.emit('credit_card.process', false);
            BillingStore.emit('confirm.disable', false);

            setErrorStatusResponse('400');
            setErrorMessageResponse(t('management.payment_checkCardData'));
            console.error(data.errors);
        } else if (data.id) {
            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            BillingStore.setPaymentMethod(data, creditCard.description, cancelToken, responseAttCustomer);
        }
    }

    const responseAttCustomer = (response) => {
        tokenList.remove(response.id)

        if (response.data) {
            setNewCreditCard(false);

            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            BillingStore.setAsDefaultPayment(response.data.objectid, cancelToken, responseSetAsDefaultPayment);
        }

        if (response.status) {
            BillingStore.emit('credit_card.process', false);
            BillingStore.emit('confirm.disable', false);
            setErrorStatusResponse(response.status.toString());
        }
    }

    const responseSetAsDefaultPayment = (response) => {
        tokenList.remove(response.id);
        getPayments();
        BillingStore.emit('credit_card.process', false);
        BillingStore.emit('confirm.disable', false);

        if (response.data) {
            BillingStore.setSuccess();
        }

        if (response.status) {
            setErrorStatusResponse(response.status.toString());
        }
    }

    const getBrandCc = (n) => {
        return BillingStore.getBrandCreditCard(n, Iugu.current);
    }

    const onChangeCc = (card) => {
        setCreditCard(card);
    }

    const cancelNewCard = () => {
        setNewCreditCard(false);
    }

    const addNewCreditCard = (status) => {
        setNewCreditCard(status);
    }

    return (
        <Grid className={classes.wrapper}>
            <Typography variant='h4' className={classes.subtitle}>
                {payments?.length === 0 || newCreditCard
                    ? t('management.payment_addCreditCard')
                    : t('management.payment_title')
                }
            </Typography>
            {(payments?.length === 0 || newCreditCard) &&
                <Grid>
                    <Typography className={classes.text}>
                        {t('management.payment_noRegisteredCards')}
                    </Typography>
                    <CreditCardForm submit={onSubmitCc} getBrand={getBrandCc} onChange={onChangeCc} revert={cancelNewCard} />
                </Grid>
            }
            {payments?.length > 0 && !newCreditCard && !loader &&
                <ListCreditCard listCards={payments} addNewCreditCard={addNewCreditCard} />
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
            <UserFeedback error={errorStatusResponse} message={errorMessageResponse} setError={setErrorStatusResponse} />
        </Grid>
    );
}

export default withStyles(styles)(PaymentMethodPage);