import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';

import BillingStore from '../../../stores/BillingStore';
import history from '../../../history';
import CartTable from './CartTable';
import UserFeedback from '../../Common/UserFeedback';


export default function ResumePage() {
    const [cart, setCart] = useState({});
    const [plan, setPlan] = useState({});
    const [errorResponse, setErrorResponse] = useState("");

    useEffect(() => {
        const cart = BillingStore.getCart();

        if (!cart.planId) {
            history.push("/subscription");
        } else if (!cart.customerId) {
            history.push("/subscription/customer");
        }
        setPlan(BillingStore.getPlanDetails());

        setCart(cart);

    }, []);

    const getStatusError = (status) => {
        setErrorResponse(status)
    };

    return (
        <Grid container>
            {plan.objectid &&
                <CartTable plans={[plan]} cart={cart} getStatusError={getStatusError} />
            }

            <UserFeedback error={errorResponse} etError={setErrorResponse}/>
        </Grid>
    )
}