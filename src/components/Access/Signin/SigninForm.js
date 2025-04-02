import React, { useState } from "react";

import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import { Button, Link } from "@material-ui/core";

import useStyles from '../../../styles/Login/SigninForm'
import BootstrapInput from "../../Common/PredizaInput";
import history from '../../../history'
import TokenList from '../../../stores/CancelTokenList'
import toolsUtils from "../../../utils/toolsUtils";
import SessionStore from "../../../stores/SessionStore";
import { useTranslation } from "react-i18next";


function SigninForm(props) {

    const [signin, setSignin] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [sent, setSent] = useState(false);
    const  classes = useStyles();
    const tokenList = new TokenList();
    const { t } = useTranslation();

    const handleChangeValue = (e) => {
        setSignin(e.target.value);
    }

    const isValid = () => {
        let f = !(toolsUtils.isEmptyString(signin));
        return f;
    }

    const toData = () => {
        let e = {};
        e.to = signin;

        return e;
    };

    const handleSignin = () => {
        setDisabled(true);
        if (isValid()) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            SessionStore.signin(toData(), cancelToken, responseSignin);
        }
    }

    const responseSignin = (response) => {
        tokenList.remove(response.id);

        if (!toolsUtils.isNullOrEmpty(response, "data")) {
            setSent(true);
        }
        setDisabled(false);
    }

    const getForm = () => {


        return (
            <Grid container className={classes.boxContainer}>
                <Grid item xs={12}>
                    <Grid className={classes.formHeader}>
                        {t('login.register')}
                    </Grid>
                </Grid>
                {!sent &&
                    <Grid item xs={12} className={classes.formControl}>
                        <Grid container>
                            <Grid item xs={12}>

                                <FormControl fullWidth className={classes.margin}>
                                    <BootstrapInput
                                        id="input-with-icon-adornment"
                                        placeholder={t('common.email')}
                                        name="email"
                                        disabled={disabled}
                                        value={signin}
                                        onChange={handleChangeValue}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} className={classes.alignButton}>

                                <Button className={classes.button} variant="contained" color="primary" onClick={handleSignin}>
                                    {t('login.createAccount')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                {sent &&
                    <Grid item xs={12} style={{ textAlign: "center", fontSize: "18px" }}>
                        {t('login.emailSent')}
                    </Grid>
                }
            </Grid>
        )
    }

    return (
        <Grid container className={classes.formContainer}>
            <Grid item xs={12}>
                {getForm()}
            </Grid>
            <Grid item xs={12} className={classes.loginPosition}>
                {`${t('login.alreadyHaveAccount')} `}

                <Link className={classes.createAccount} href="#"
                    onClick={(e) => { history.push("/login"); e.preventDefault() }}
                    data-modal="loginUser">
                    {` ${t('login.signInHere')}`}
                </Link>
            </Grid>
        </Grid>
    );

}

export default SigninForm;