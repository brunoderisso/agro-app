import React, { useState, useEffect } from "react";

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import EmailIcon from '@material-ui/icons/Email';
//Prediza
import useStyles from '../../../styles/Login/ActiveForm'
import { Button, Link } from "@material-ui/core";

import SessionStore from "../../../stores/SessionStore";
import history from '../../../history'
import useKeyPress from '../../../Hook/useKeyPress'
import TokenList from '../../../stores/CancelTokenList'
import BootstrapInput from "../../Common/PredizaInput";
import { useTranslation } from "react-i18next";

function ForgotSentForm(props) {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const classes = useStyles();

    const enter = useKeyPress('Enter');

    const tokenList = new TokenList();

    const { t } = useTranslation();

    useEffect(() => {
        if (enter) {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enter]);

    const handleChangeValue = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        if (email !== "") {
            SessionStore.forgot({ to: email }, cancelToken, responseForgot);
        }
    }

    const responseForgot = (resp) => {
        tokenList.remove(resp.id);
        if (resp.data !== null) {
            setMessage(t('login.linkSentToEmail'));
        }
    }



    const getForm = () => {


        return (
            <Grid container className={classes.boxContainer}>
                <Grid item xs={12}>
                    <Grid className={classes.formHeader}>
                        {t('login.passwordRecovery')}
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ color: "green" }}>
                    {message.length > 0 && message + "*"}
                </Grid>
                <Grid item xs={12} className={classes.formControl}>
                    <Grid container >
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <FormControl fullWidth className={classes.margin}>
                                    <BootstrapInput
                                        className={classes.activeInputs}
                                        classes={{ input: classes.placeHolder }}

                                        id="input-with-icon-adornment"
                                        placeholder={t('common.email')}
                                        name="email"
                                        value={email}
                                        onChange={handleChangeValue}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "15px", marginBottom: "20px" }}>
                                <Button className={classes.buttonForgot} variant="contained" color="primary" onClick={handleSubmit}>
                                    {t('common.sandButton')}
                                </Button>
                            </Grid>
                            <Grid item xs={12} className={classes.loginPosition}>
                                {t('login.alreadyHaveAccount')}

                                <Link className={classes.createAccount} href="#"
                                    onClick={(e) => { history.push("/login"); e.preventDefault() }}
                                    data-modal="loginUser">
                                    {t('login.signInHere')}
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container className={classes.formContainer}>
            <Grid item xs={12}>
                {getForm()}
            </Grid>
        </Grid>
    );

}

export default ForgotSentForm;