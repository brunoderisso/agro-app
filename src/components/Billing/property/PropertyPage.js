import React, { useEffect, useState } from 'react';

import { Grid } from '@material-ui/core';

import PropertyForm from './PropertyForm';
import FileUploaderModal from '../../Common/FileUploaderModal';
import BillingStore from '../../../stores/BillingStore';
import history from '../../../history';
import UserFeedback from '../../Common/UserFeedback';


export default function PropertyPage() {
    const [open, setOpen] = useState(true);
    const [index, setIndex] = useState(null);
    const [errorResponse, setErrorResponse] = useState('');

    useEffect(() => {
        bind();
        const cart = BillingStore.getCart();

        if (!cart.planId) {
            history.push('/subscription');
        } else if (!cart.customerId) {
            history.push('/subscription/customer');
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        BillingStore.addListener("import_click", handleImportClick);
    }

    const clear = () => {
        BillingStore.removeListener("import_click", handleImportClick);
    }

    const handleImportClick = (index) => {
        setIndex(index);
        setOpen(true);
    }

    const handleClose = (error) => {
        if (error) {
            setErrorResponse(error);
        } else {
            setOpen(false);
        }
    };

    return (
        <Grid container justifyContent='center'>

            <PropertyForm />
            {open &&
                <FileUploaderModal index={index} open={open} handleClose={handleClose} />
            }
            <UserFeedback error={errorResponse} setError={setErrorResponse} />
        </Grid>
    )
}