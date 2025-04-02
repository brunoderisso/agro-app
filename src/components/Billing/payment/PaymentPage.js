import React, { useEffect, useRef, useState } from 'react';

import { Grid } from '@material-ui/core';

import useScript from '../../../Hook/useScript';
import CreditCardForm from '../../Common/CreditCard/CreditCardForm';
import BillingStore from '../../../stores/BillingStore';
import TokenList from '../../../stores/CancelTokenList';
import { LocalConfig } from '../../../LocalConfig';
import history from '../../../history';
import UserFeedback from '../../Common/UserFeedback';
import { useTranslation } from 'react-i18next';


export default function PaymentPage() {
    const [creditCard, setCreditCard] = useState({});
    const [errorResponse, setErrorResponse] = useState("");
    const [errorMessageResponse, setErrorMessageResponse] = useState("");

    const Iugu = useRef(null);

    const tokenList = new TokenList();

    const { t } = useTranslation();

    useScript("https://js.iugu.com/v2");

    useEffect(() => {
        if (BillingStore.getCart().customerId === '') {
            history.push("/subscription/customer");
        }
        storeIuguReference();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (card) => {
        setCreditCard(card);
    }

    const onSubmit = () => {
        BillingStore.emit('credit_card.process', true);
        BillingStore.emit('confirm.disable', true);
        BillingStore.createTokenIugu(creditCard, Iugu.current, tokenResponseHandler);
    }

    const tokenResponseHandler = (data) => {
        if (data.errors) {
            BillingStore.emit('credit_card.process', false);
            BillingStore.emit('confirm.disable', false);

            setErrorResponse('400');
            setErrorMessageResponse(t('management.payment_checkCardData'));
            console.error(data.errors);
        } else if (data.id) {
            BillingStore.setPayment(data);

            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            BillingStore.setPaymentMethod(data, creditCard.description, cancelToken, responseAttCustomer);
        }
    }

    const responseAttCustomer = (response) => {
        tokenList.remove(response.id)

        if (response.data) {
            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            BillingStore.setAsDefaultPayment(response.data.objectid, cancelToken, responseSetAsDefaultPayment);
        }

        if (response.status) {
            BillingStore.emit('credit_card.process', false);
            BillingStore.emit('confirm.disable', false);
            setErrorResponse(response.status.toString());
        }
    }

    const responseSetAsDefaultPayment = (response) => {
        tokenList.remove(response.id);
        BillingStore.emit('credit_card.process', false);
        BillingStore.emit('confirm.disable', false);

        if (response.data) {
            BillingStore.setSuccess();
            history.push("/subscription/success");
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const getBrand = (n) => {
        return BillingStore.getBrandCreditCard(n, Iugu.current);
    }

    const storeIuguReference = () => {
        const interval = setInterval(() => {
            if (window.Iugu) {
                Iugu.current = window.Iugu;
                clearInterval(interval);
                init();
            }
        }, 1000);
    }

    const init = () => {
        Iugu.current.setAccountID(LocalConfig.iuguID);
        // TODO: remover
        //Iugu.current.setTestMode(true);
        Iugu.current.setup();
    }

    const previous = () => {
        history.push("/subscription/resume");
    }

    return (
        <Grid container>
            <CreditCardForm
                submit={onSubmit}
                getBrand={getBrand}
                onChange={onChange}
                billing={true}
                revert={previous}
            />
            <UserFeedback error={errorResponse} message={errorMessageResponse} setError={setErrorResponse} />
        </Grid>
    )
}