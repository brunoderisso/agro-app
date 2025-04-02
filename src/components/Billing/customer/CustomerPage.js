import React, { useState, useEffect } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import { Grid, Card } from '@material-ui/core';

import CustomerForm from '../../Common/Billing/CustomerForm';
import TokenList from '../../../stores/CancelTokenList';
import BillingStore from '../../../stores/BillingStore';
import SessionStore from '../../../stores/SessionStore';
import UserFeedback from '../../Common/UserFeedback';
import theme from '../../../styles/Utils/theme';
import useStyles from '../../../styles/Billing/CustomerPage';

export default function CustomerPage() {
    const classes = useStyles();

    const [customer, setCustomer] = useState(null);
    const [preference, setPreference] = useState({});
    const [errorResponse, setErrorResponse] = useState('');
    const [messageError, setMessageError] = useState('');
    const [loader, setLoader] = useState(false);

    const tokenList = new TokenList();

    useEffect(() => {
        const preference = SessionStore.getPreference();
        setPreference(preference);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (preference.objectid) {
            getCustomer();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preference]);

    const handleLoader = (status) => {
        setLoader(status);
    }

    const getCustomer = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoader(true);
        BillingStore.getCustomer(cancelToken, responseGetCustomer)
    }

    const getStatusError = (status, message = null) => {
        setErrorResponse(status);

        if (message) {
            setMessageError(message);
        }
    };

    const responseGetCustomer = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data?.objectid) {
            setCustomer(response.data);

            return;
        }

        if (response === '404') {
            setCustomer({});
        }
    }

    return (
        <Grid container justifyContent='center'>
            {customer && !loader &&
                <Card elevation={2} className={classes.container}>
                    <CustomerForm
                        customer={customer}
                        preferences={preference}
                        getStatusError={getStatusError}
                        callback={handleLoader}
                        isPurchase={true}
                    />
                </Card>
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
            <UserFeedback error={errorResponse} message={messageError} setError={setErrorResponse}/>
        </Grid>
    )
}