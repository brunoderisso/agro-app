import React, { useEffect, useRef, useState } from 'react';
import InputMask from 'react-input-mask';
import clsx from 'clsx';

import { withStyles } from "@material-ui/core/styles";
import { Grid, Button, TextField, MenuItem, Link, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FormControl from '@material-ui/core/FormControl';

import TokenList from '../../../stores/CancelTokenList';
import BillingStore from "../../../stores/BillingStore";
import styles from "../../../styles/Common/Billing/CustomerForm";
import history from '../../../history';
import toolsUtils from '../../../utils/toolsUtils';
import { ConstantsUtils } from '../../../utils/constantsUtils';
import masksUtils from '../../../utils/masksUtils';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function CustomerForm(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const [customer, setCustomer] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [payment, setPayment] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [apartment, setApartment] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [cpfCnpjMask, setCpfCnpjMask] = useState("99999999999");
    const [numberMask, setNumberMask] = useState("(99) 99999-9999");
    const cepMask = "99999-999";

    const [isMounted, setIsMounted] = useState(false);

    const [flagNameError, setFlagNameError] = useState(false);
    const [textNameError, setTextNameError] = useState('');
    const [flagEmailError, setFlagEmailError] = useState(false);
    const [textEmailError, setTextEmailError] = useState('');
    const [flagCpfCnpjError, setFlagCpfCnpjError] = useState(false);
    const [textCpfCnpjError, setTextCpfCnpjError] = useState('');
    const [flagNumberError, setFlagNumberError] = useState(false);
    const [textNumberError, setTextNumberError] = useState('');
    const [flagCepError, setFlagCepError] = useState(false);
    const [textCepError, setTextCepError] = useState('');
    const [flagAddressError, setFlagAddressError] = useState(false);
    const [textAddressError, setTextAddressError] = useState('');
    const [flagAddressNumberError, setFlagAddressNumberError] = useState(false);
    const [textAddressNumberError, setTextAddressNumberError] = useState('');
    const [flagNeighborhoodError, setFlagNeighborhoodError] = useState(false);
    const [textNeighborhoodError, setTextNeighborhoodError] = useState('');
    const [flagCityError, setFlagCityError] = useState(false);
    const [textCityError, setTextCityError] = useState('');
    const [flagStateError, setFlagStateError] = useState(false);
    const [textStateError, setTextStateError] = useState('');

    const timercpf = useRef();
    const timernumber = useRef();
    const cpfCnpjRef = useRef();

    const tokenList = new TokenList();

    useEffect(() => {
        initialize();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (name.length > 0) {
            setFlagNameError(false);
            setTextNameError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    useEffect(() => {
        if (email.length > 0) {
            setFlagEmailError(false);
            setTextEmailError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email]);

    useEffect(() => {
        if (timercpf.current) {
            clearTimeout(timercpf.current);
        }

        if (cpfCnpj.length > 0) {
            setFlagCpfCnpjError(false);
            setTextCpfCnpjError('');
        }

        timercpf.current = setTimeout(() => {
            generateCpfCnpjMask();
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cpfCnpj]);

    useEffect(() => {
        if (timernumber.current) {
            clearTimeout(timernumber.current);
        }

        if (number.length > 0) {
            setFlagNumberError(false);
            setTextNumberError('');
        }

        timernumber.current = setTimeout(() => {
            setNumberMask(masksUtils.maskPhone(number));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [number]);

    useEffect(() => {
        if (cep.length > 0) {
            setFlagCepError(false);
            setTextCepError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cep]);

    useEffect(() => {
        if (address.length > 0) {
            setFlagAddressError(false);
            setTextAddressError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    useEffect(() => {
        if (addressNumber.length > 0) {
            setFlagAddressNumberError(false);
            setTextAddressNumberError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressNumber]);

    useEffect(() => {
        if (neighborhood.length > 0) {
            setFlagNeighborhoodError(false);
            setTextNeighborhoodError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [neighborhood]);

    useEffect(() => {
        if (city.length > 0) {
            setFlagCityError(false);
            setTextCityError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city]);

    useEffect(() => {
        if (state.length > 0) {
            setFlagStateError(false);
            setTextStateError('');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (BillingStore.getCart().planId === '' && props.isPurchase) {
            history.push("/subscription");
        }

    }, [props.isPurchase]);

    useEffect(() => {
        if (props.checkInputs) {
            BillingStore.emit('status_field.update', false);
            confirm();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.checkInputs]);

    const clear = () => {
        setIsMounted(false);
    }

    const initialize = () => {
        setIsMounted(true);
        const customer = props.customer;

        if (customer.objectid) {
            setCustomer(customer)
            setName(customer.name);
            setEmail(customer.email);

            if (customer.cpf_cnpj !== null) {
                setCpfCnpj(customer.cpf_cnpj);
            }
            if (customer.phone_prefix !== null && customer.phone !== null) {
                setNumber(customer.phone_prefix + " " + customer.phone);
            }
            if (customer.payment_methods) {
                setPayment(customer.payment_methods[0]);
            }
            if (customer.zip_code) {
                setCep(customer.zip_code);
            }
            if (customer.street) {
                setAddress(customer.street);
            }
            if (customer.number) {
                setAddressNumber(customer.number);
            }
            if (customer.complement) {
                setApartment(customer.complement);
            }
            if (customer.district) {
                setNeighborhood(customer.district);
            }
            if (customer.city) {
                setCity(customer.city);
            }
            if (customer.state) {
                setState(customer.state.toUpperCase());
            }

            return;
        }

        if (props.preferences?.name && props.preferences?.surname) {
            setName(props.preferences.name + " " + props.preferences.surname);
        }
        if (props.preferences?.email) {
            setEmail(props.preferences.email);
        }

    }

    const handleChangeValue = (event) => {
        let value = event.target.value;
        if (event.target.name === "name") {
            setName(value);
        }
        if (event.target.name === "email") {
            setEmail(value);
        }
        if (event.target.name === "cpf_cnpj") {
            setCpfCnpj(value);
        }
        if (event.target.name === "contact") {
            setNumber(value);
        }
        if (event.target.name === "cep") {
            setCep(value);
        }
        if (event.target.name === "address") {
            setAddress(value);
        }
        if (event.target.name === "address_number") {
            setAddressNumber(value);
        }
        if (event.target.name === "apartment") {
            setApartment(value);
        }
        if (event.target.name === "neighborhood") {
            setNeighborhood(value);
        }
        if (event.target.name === "city") {
            setCity(value);
        }
        if (event.target.name === "state") {
            setState(value);
        }

        return;
    }

    const prev = () => {
        history.push("/subscription");
    }

    const cleanFields = () => {
        setName('');
        setEmail('');
        setCpfCnpj('');
        setNumber('');
        setCep('');
        setAddress('');
        setAddressNumber('');
        setApartment('');
        setNeighborhood('');
        setCity('');
        setState('');
    }

    const confirm = () => {
        if (name !== "" && email !== "" && number !== "" && cpfCnpj !== "" && address !== "" &&
            addressNumber !== "" && neighborhood !== "" && city !== "" && state !== "" && cep !== ""
        ) {
            const phoneNoMask = masksUtils.unMaskPhone(number);
            const phone = phoneNoMask.substring(2, number.length);
            const phonePrefix = phoneNoMask.substring(0, 2);

            if (cpfCnpj.length < 11) {
                setFlagCpfCnpjError(true);
                setTextCpfCnpjError(t("management.incompleteCPF"));
                return;
            } else if (phone.length < 8) {
                setFlagNumberError(true);
                setTextNumberError(t("management.incompleteContact"));
                return;
            }

            let length = cpfCnpj.replace(/\D/g, '').length;

            if (length === 11) {
                if (!toolsUtils.isCpf(cpfCnpj)) {
                    setFlagCpfCnpjError(true);
                    setTextCpfCnpjError(t("management.invalidCPF"));
                    return;
                }
            } else if (!toolsUtils.isCnpj(cpfCnpj)) {
                setFlagCpfCnpjError(true);
                setTextCpfCnpjError(t("management.invalidCNPJ"));
                return;
            }

            const newCustomer = {
                name,
                email,
                cpf_cnpj: masksUtils.unMaskCpfCnpj(cpfCnpj),
                phone,
                phone_prefix: phonePrefix,
                payment_methods: payment ? [payment] : [],
                zip_code: cep,
                city,
                state,
                street: address,
                number: addressNumber,
                district: neighborhood,
                complement: apartment.length > 0 ? apartment : null
            }

            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            if (isMounted) {
                props.callback(true);
            }

            if (toolsUtils.isNullOrEmpty(customer, "objectid")) {
                BillingStore.addCustomer(newCustomer, cancelToken, addCustomerResponse);
            } else {
                BillingStore.attCustomer(newCustomer, cancelToken, addCustomerResponse);
            }
        }
        handleFieldsError();
    }

    const handleFieldsError = () => {

        if (name.length === 0) {
            setFlagNameError(true);
            setTextNameError(t("alert.requiredToFillIn"));
        }

        if (email.length === 0) {
            setFlagEmailError(true);
            setTextEmailError(t("alert.requiredToFillIn"));
        }

        if (cpfCnpj.length === 0) {
            setFlagCpfCnpjError(true);
            setTextCpfCnpjError(t("alert.requiredToFillIn"));
        }

        if (number.length === 0) {
            setFlagNumberError(true);
            setTextNumberError(t("alert.requiredToFillIn"));
        }

        if (cep.length === 0) {
            setFlagCepError(true);
            setTextCepError(t("alert.requiredToFillIn"));
        }

        if (address.length === 0) {
            setFlagAddressError(true);
            setTextAddressError(t("alert.requiredToFillIn"));
        }

        if (addressNumber.length === 0) {
            setFlagAddressNumberError(true);
            setTextAddressNumberError(t("alert.requiredToFillIn"));
        }

        if (neighborhood.length === 0) {
            setFlagNeighborhoodError(true);
            setTextNeighborhoodError(t("alert.requiredToFillIn"));
        }

        if (city.length === 0) {
            setFlagCityError(true);
            setTextCityError(t("alert.requiredToFillIn"));
        }

        if (state.length === 0) {
            setFlagStateError(true);
            setTextStateError(t("alert.requiredToFillIn"));
        }
    }

    const addCustomerResponse = (response) => {
        tokenList.remove(response.id);

        if (isMounted) {
            props.callback(false);
        }

        if (response.data) {
            BillingStore.setCustomerId(customer.objectid || response.data.objectid);
            BillingStore.setCustomerName(customer.name);

            if (props.checkInputs) {
                props.updateEffect();
            } else {
                history.push("/subscription/property");
            }
        }

        if (response.status) {
            props.getStatusError(response.status.toString());
        }
        if (response.status === 500) {
            props.getStatusError(response.status.toString(), t('management.useDifferentValidCPF'));
        }
    }

    const generateCpfCnpjMask = () => {
        const docUnMask = masksUtils.unMaskCpfCnpj(cpfCnpj);
        let ctrl = null;

        if (cpfCnpjRef.current) {
            ctrl = cpfCnpjRef.current.firstChild;
        } else {
            return;
        }

        setCpfCnpjMask(masksUtils.maskCpfCnpj(docUnMask));

        if (ctrl && docUnMask.length) {
            ctrl.focus();
        }
    }

    return (
        <Grid>
            <FormControl fullWidth className={classes.paddingInputs}>
                <TextField
                    id="name"
                    name="name"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.inputs}
                    value={name}
                    onChange={handleChangeValue}
                    label={t('common.name')}
                    variant="outlined"
                    placeholder={t('management.insertFullName')}
                    size='small'
                    error={flagNameError}
                    helperText={textNameError}
                />
            </FormControl>

            <FormControl fullWidth className={classes.paddingInputs}>
                <TextField
                    id="email"
                    name="email"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.inputs}
                    value={email}
                    onChange={handleChangeValue}
                    label={t('common.email')}
                    variant="outlined"
                    placeholder={t('management.insertEmailAddress')}
                    size='small'
                    error={flagEmailError}
                    helperText={textEmailError}
                />
            </FormControl>

            <FormControl fullWidth className={classes.paddingInputs}>
                <InputMask mask={cpfCnpjMask}
                    id="cpf_cnpj"
                    placeholder={t('management.insertCPFOrCNPJ')}
                    name="cpf_cnpj"
                    className={classes.inputs}
                    value={cpfCnpj}
                    onChange={handleChangeValue}
                    size='small'>
                    {(inputProps) =>
                        <TextField
                            variant="outlined"
                            label={t('management.CPFOrCNPJ')}
                            InputLabelProps={{ shrink: true, }}
                            ref={cpfCnpjRef}
                            error={flagCpfCnpjError}
                            helperText={textCpfCnpjError}
                            {...inputProps}
                        />
                    }
                </InputMask>
            </FormControl>

            <FormControl fullWidth className={classes.paddingInputs}>
                <InputMask mask={numberMask}
                    id="contact"
                    placeholder={t('management.insertContactPhone')}
                    name="contact"
                    className={classes.inputs}
                    value={number}
                    size='small'
                    onChange={handleChangeValue}>
                    {(inputProps) =>
                        <TextField
                            variant="outlined"
                            label={t('common.contact')}
                            InputLabelProps={{ shrink: true, }}
                            error={flagNumberError}
                            helperText={textNumberError}
                            {...inputProps}
                        />
                    }
                </InputMask>
            </FormControl>

            <FormControl fullWidth className={classes.paddingInputs}>
                <InputMask mask={cepMask}
                    id="cep"
                    placeholder={t('management.insertPropertyCEP')}
                    name="cep"
                    value={cep}
                    className={classes.inputs}
                    size='small'
                    onChange={handleChangeValue}>
                    {(inputProps) =>
                        <TextField
                            variant="outlined"
                            label={t('common.CEP')}
                            InputLabelProps={{ shrink: true, }}
                            error={flagCepError}
                            helperText={textCepError}
                            {...inputProps}
                        />
                    }
                </InputMask>
            </FormControl>

            <FormControl fullWidth className={classes.paddingInputs}>
                <TextField
                    id="address"
                    placeholder={t('common.address')}
                    name="address"
                    value={address}
                    onChange={handleChangeValue}
                    className={classes.inputs}
                    size='small'
                    variant="outlined"
                    label={t('common.address')}
                    InputLabelProps={{ shrink: true, }}
                    error={flagAddressError}
                    helperText={textAddressError}
                />
            </FormControl>

            <Grid container>
                <Grid item xs={6}>
                    <FormControl className={clsx(classes.paddingInputs, classes.leftInput)}>
                        <TextField
                            id="address_number"
                            placeholder={t('management.insertPropertyNumber')}
                            name="address_number"
                            value={addressNumber}
                            onChange={handleChangeValue}
                            className={classes.inputs}
                            size='small'
                            variant="outlined"
                            label={t('common.numberHouse')}
                            InputLabelProps={{ shrink: true, }}
                            error={flagAddressNumberError}
                            helperText={textAddressNumberError}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl className={clsx(classes.paddingInputs, classes.rightInput)}>
                        <TextField
                            id="apartment"
                            placeholder={t('optional')}
                            name="apartment"
                            value={apartment}
                            onChange={handleChangeValue}
                            className={classes.inputs}
                            size='small'
                            variant="outlined"
                            label={t('common.complement')}
                            InputLabelProps={{ shrink: true, }}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <FormControl fullWidth className={classes.paddingInputs}>
                <TextField
                    id="neighborhood"
                    placeholder={t('management.insertNeighborhood')}
                    name="neighborhood"
                    value={neighborhood}
                    onChange={handleChangeValue}
                    className={classes.inputs}
                    size='small'
                    variant="outlined"
                    label={t('common.neighborhood')}
                    InputLabelProps={{ shrink: true, }}
                    error={flagNeighborhoodError}
                    helperText={textNeighborhoodError}
                />
            </FormControl>

            <Grid container>
                <Grid item xs={8}>
                    <FormControl fullWidth className={clsx(classes.paddingInputs, classes.leftInput)}>
                        <TextField
                            id="city"
                            placeholder={t('management.insertCity')}
                            name="city"
                            value={city}
                            onChange={handleChangeValue}
                            className={classes.inputs}
                            size='small'
                            variant="outlined"
                            label={t('common.city')}
                            InputLabelProps={{ shrink: true, }}
                            error={flagCityError}
                            helperText={textCityError}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth className={clsx(classes.paddingInputs, classes.rightInput)}>
                        <TextField
                            id="state"
                            placeholder={t('common.select')}
                            name="state"
                            select
                            value={state}
                            onChange={handleChangeValue}
                            className={classes.inputs}
                            size='small'
                            variant="outlined"
                            label={t('common.state')}
                            InputLabelProps={{ shrink: true, }}
                            error={flagStateError}
                            helperText={textStateError}
                        >
                            {ConstantsUtils.StatesList.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>

            {props.isPurchase &&
                <Grid item xs={12} style={{ margin: "37px 0 40px 0" }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button className={classes.cleanButton} onClick={cleanFields}>
                                {t('common.clearButton')}
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                className={classes.prevButton}
                                startIcon={<ArrowBackIosIcon className={classes.iconSize} />}
                                onClick={prev}
                                variant='outlined'
                            >
                                 {t('common.backButton')}
                            </Button>
                        </Grid>
                        <Grid item md>
                            <Button
                                className={classes.nextButton}
                                endIcon={<ArrowForwardIosIcon className={classes.iconSize} />}
                                fullWidth
                                onClick={confirm}
                                variant='contained'
                            >
                                {t('common.forwardButton')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Grid style={{ textAlign: "center", marginTop: "16px" }}>
                <Typography variant='caption'>
                    <span>{t('management.dataProcessingDisclaimer')} </span>
                    <Link className={classes.link} href='https://prediza.io/politica-de-privacidade/' target='_blank'>{t('common.privacyPolicy')}</Link>
                </Typography>
            </Grid>
        </Grid>
    )
});