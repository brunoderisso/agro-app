import React, { useState, useEffect } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import clsx from 'clsx';

import { Card, Grid, Button, Typography, FormControl, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import useStyles from '../../../../../styles/Billing/user/managementAccount/billingUser/CardInfoData';
import { ReactComponent as EditIcon } from '../../../../../img/EditIcon.svg';
import theme from '../../../../../styles/Utils/theme';
import TokenList from '../../../../../stores/CancelTokenList';
import BillingStore from '../../../../../stores/BillingStore';
import CustomerForm from '../../../../Common/Billing/CustomerForm';
import UserFeedback from '../../../../Common/UserFeedback';
import PredizaModal from '../../../../Common/PredizaModal';
import InfoDisplay from './InfoDisplay';
import { useTranslation } from 'react-i18next';


function CardInfoData() {
    const classes = useStyles();

    const [customer, setCustomer] = useState(null);
    const [flagShowForm, setFlagShowForm] = useState(false);
    const [flagCheckForm, setFlagCheckForm] = useState(false);
    const [loader, setLoader] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [errorResponse, setErrorResponse] = useState('');
    const [messageError, setMessageError] = useState('');
    const [codeSMS, setCodeSMS] = useState('');

    const { t } = useTranslation();

    const modalButtons = [
        { label: t('common.cancelButton'), action: (status) => handleModal(status) },
        { label: t('common.confirmButton'), action: () => checkForm() }
    ];

    const tokenList = new TokenList();

    useEffect(() => {
        getCustomer();
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        BillingStore.addListener('status_field.update', (status) => {setFlagCheckForm(status)});
    }

    const clear = () => {
        BillingStore.removeListener('status_field.update', (status) => {setFlagCheckForm(status)});
    }

    const handleModal = (status) => {
        setOpenModal(status);
    }

    const handleLoader = (status) => {
        setLoader(status);
    }

    const checkForm = () => {
        setFlagCheckForm(true);
        handleModal(false);
    }

    const updateEffect = () => {
        getCustomer();
        setFlagCheckForm(false);
    }

    const getCustomer = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setFlagShowForm(false);
        setLoader(true);

        BillingStore.getCustomer(cancelToken, responseGetCustomer);
    }

    const responseGetCustomer = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.status) {
            setErrorResponse(response.status.toString());
            setCustomer({});
        }

        if (response.data) {
            setCustomer(response.data);
        }
    }

    const getStatusError = (status, message = null) => {
        setErrorResponse(status);

        if (message) {
            setMessageError(message);
        }
    };

    const handleEditForm = () => {
        setFlagShowForm(true);
    }

    const displayIconsForm = () => {
        return (
            <Grid className={classes.gapIcons}>
                <Button
                    className={classes.iconButton}
                    onClick={() => setFlagShowForm(false)}
                >
                    <CloseIcon fontSize='small' className={classes.iconProp}/>
                </Button>
                <Button
                    className={classes.iconButton}
                    onClick={() => handleModal(true)}
                >
                    <DoneIcon fontSize='small' className={classes.iconProp}/>
                </Button>
            </Grid>
        );
    }

    const handleChangeValueCode = (e) => {
        if (e.target.name === 'code') {
            setCodeSMS(e.target.value);
        }
    }

    const bodyModal = () => {
        return (
            <Grid>
                <Typography className={classes.textModal}>
                    <span>{t('management.validateRegistrationChange')}</span>
                    <span className={classes.highlightText}> (**) ***** - {customer?.phone?.substring(customer.phone.length - 4)}</span>
                    <span>. {t('management.changesEffectiveNextInvoice')}.</span>
                </Typography>
                <FormControl fullWidth>
                    <TextField
                        name='code'
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={codeSMS}
                        onChange={handleChangeValueCode}
                        label={t('common.codeTitle')}
                        variant='outlined'
                        placeholder={t('management.enterValidationCode')}
                        size='small'
                        className={classes.inputs}
                    />
                </FormControl>
            </Grid>
        );
    }

    return (
        <Grid>
            {!loader &&
                <Card className={classes.wrapperCard}>
                    <Grid container className={clsx(
                        classes.iconContent,
                        classes.marginContent
                    )}>
                        {!flagShowForm &&
                            <Button
                                className={classes.iconButton}
                                onClick={handleEditForm}
                            >
                                <EditIcon />
                            </Button>
                        }
                        {flagShowForm && displayIconsForm()}
                    </Grid>

                    {!flagShowForm &&
                        <InfoDisplay customer={customer}/>
                    }

                    {flagShowForm &&
                        <CustomerForm
                            customer={customer}
                            getStatusError={getStatusError}
                            callback={handleLoader}
                            updateEffect={updateEffect}
                            checkInputs={flagCheckForm}
                        />
                    }
                </Card>
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
            <UserFeedback error={errorResponse} message={messageError} setError={setErrorResponse}/>
            <PredizaModal
                open={openModal}
                dispense={modalButtons[0]}
                confirm={modalButtons[1]}
                title={t('management.registrationChange')}
                size={'medium'}
            >
                {bodyModal()}
            </PredizaModal>
        </Grid>
    );
}

export default CardInfoData;