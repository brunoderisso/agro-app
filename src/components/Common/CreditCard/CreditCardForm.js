import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import BeatLoader from 'react-spinners/BeatLoader';

import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Grid, TextField, Tooltip } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { InputAdornment } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import FormControl from '@material-ui/core/FormControl';
import PersonIcon from '@material-ui/icons/Person';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import styles from "../../../styles/Common/CreditCard/CreditCardForm";
import theme from '../../../styles/Utils/theme';
import CreditCardComponent from './CreditCardComponent';
import BillingStore from '../../../stores/BillingStore';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function CreditCardForm(props) {
    const { classes } = props;

    const { t } = useTranslation();

    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [date, setDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [brand, setBrand] = useState("");
    const [loader, setLoader] = useState(false);
    const [disableFlag, setDisableFlag] = useState(false);

    useEffect(() => {
        bind();

        return clear;
    }, []);

    useEffect(() => {
        if (typeof props.onChange === "function") {
            let card = {
                number: number,
                verification_value: cvv,
                expiration: date,
                full_name: name,
                description: nickname
            }

            props.onChange(card);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [number, name, date, cvv, nickname]);

    useEffect(() => {
        if (typeof props.getBrand === "function") {
            setBrand(props.getBrand(number));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [number]);

    const bind = () => {
        BillingStore.addListener('credit_card.process', setLoader);
        BillingStore.addListener('confirm.disable', setDisableFlag);
    }

    const clear = () => {
        BillingStore.removeListener('credit_card.process', setLoader);
        BillingStore.removeListener('confirm.disable', setDisableFlag);
    }


    const handleChangeValue = (event) => {
        let value = event.target.value;

        if (event.target.name === "number") {
            setNumber(value);
        }
        if (event.target.name === "name") {
            setName(value);
        }
        if (event.target.name === "date") {
            setDate(value);
        }
        if (event.target.name === "cvv") {
            setCvv(value);
        }

        if (event.target.name === "nickname") {
            setNickname(value);
        }

        return
    }

    const finalize = () => {
        if (typeof props.submit === "function") {
            props.submit();
        }
    }

    const cleanFields = () => {
        setNumber('');
        setName('');
        setDate('');
        setCvv('');
        setNickname('');
    }

    return (
        <Grid container className={props.billing && classes.alignCenter}>
            <Card elevation={2} className={classes.cardContainer}>
                <Grid item xs={12} style={{ margin: "0px 0px 40px 0px" }}>
                    <Grid container justifyContent='center' alignContent='center'>
                        <CreditCardComponent cvv={cvv} brand={brand} cardNumber={number} name={name} date={date} />
                    </Grid>
                </Grid>

                <FormControl fullWidth className={classes.paddingInput}>
                    <InputMask mask="9999 9999 9999 9999"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        name="number"
                        value={number}
                        size='small'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CreditCardIcon className={classes.iconColor} />
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleChangeValue}>
                        {(inputProps) => <TextField variant="outlined" label={t('management.payment_cardNumber')} InputLabelProps={{ shrink: true, }} {...inputProps} />}
                    </InputMask>
                </FormControl>

                <FormControl fullWidth className={classes.paddingInput}>
                    <TextField
                        id="name"
                        placeholder={t("management.payment_placeholderCardHolder")}
                        name="name"
                        size='small'
                        value={name}
                        variant="outlined"
                        label={t("common.fullName")}
                        InputLabelProps={{ shrink: true, }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon className={classes.iconColor} />
                                </InputAdornment>
                            )
                        }}
                        onChange={handleChangeValue} />

                </FormControl>

                <Grid container className={classes.paddingInput} justifyContent='space-between'>
                    <Grid item xs={6}>
                        <FormControl>
                            <InputMask mask="99/9999"
                                id="card-number"
                                placeholder="MM/AAAA"
                                name="date"
                                value={date}
                                size='small'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarTodayIcon className={classes.iconColor} />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={handleChangeValue}>
                                {(inputProps) => <TextField variant="outlined" label={t('common.dueDate')} InputLabelProps={{ shrink: true, }} {...inputProps} />}
                            </InputMask>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container>
                            <FormControl>
                                <InputMask mask="999"
                                    id="cvv"
                                    placeholder="123"
                                    name="cvv"
                                    value={cvv}
                                    size='small'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Tooltip placement="bottom-start" title={t("alert.threeDigitCodeOnCardBack")}>
                                                    <HelpIcon className={classes.iconColor} />
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={handleChangeValue}>
                                    {(inputProps) => <TextField variant="outlined" label="CVV" InputLabelProps={{ shrink: true, }} {...inputProps} />}
                                </InputMask>
                            </FormControl>
                        </Grid>

                    </Grid>
                </Grid>

                <FormControl fullWidth className={classes.paddingInput}>
                    <TextField
                        id="apelido"
                        placeholder={t("management.payment_placeholderNicknameForCard")}
                        name="nickname"
                        size='small'
                        value={nickname}
                        variant="outlined"
                        label={t("common.nickname")}
                        InputLabelProps={{ shrink: true, }}
                        onChange={handleChangeValue} />

                </FormControl>

                <Grid container spacing={2}>
                    <Grid item>
                        <Button className={classes.cleanButton} onClick={cleanFields}>
                            {t('common.clearButton')}
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.prevButton}
                            startIcon={props.billing && <ArrowBackIosIcon className={classes.iconSize} />}
                            onClick={props.revert}
                            variant='outlined'
                        >
                            {props.billing ? t('common.backButton') : t('common.cancelButton')}
                        </Button>
                    </Grid>
                    <Grid item md>
                        <Button
                            id='bt-create-cc'
                            className={classes.nextButton}
                            fullWidth
                            onClick={finalize}
                            variant='contained'
                            disabled={disableFlag}
                        >
                            {!loader && t('common.finishButton')}
                            {loader &&
                                <Grid container justifyContent='center' alignItems='center'>
                                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={8} />
                                </Grid>
                            }
                        </Button>
                    </Grid>
                </Grid>
            </Card>

        </Grid >
    )
});