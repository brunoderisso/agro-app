import React, { useState, useEffect } from "react";

import Grid from '@material-ui/core/Grid';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import PersonIcon from '@material-ui/icons/Person';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

import useStyles from '../../../styles/Login/LoginForm'
import { Button, Collapse, Link, Typography } from "@material-ui/core";
import SocialLoginButton from "./SocialLoginButton";

import SessionStore from "../../../stores/SessionStore";
import toolsUtils from "../../../utils/toolsUtils";
import history from '../../../history'
import useKeyPress from '../../../Hook/useKeyPress'
import TokenList from '../../../stores/CancelTokenList'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import BootstrapInput from "../../Common/PredizaInput";
import { useTranslation } from "react-i18next";
import { LocalConfig } from "../../../LocalConfig";

function LoginForm(props) {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isFailed, setIsFailed] = useState(true);

    const { t } = useTranslation();

    const classes = useStyles();

    const enter = useKeyPress('Enter');

    const tokenList = new TokenList();

    useEffect(() => {
        SessionStore.logout(() => { });
        SessionStore.setView('login')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsFailed(false);
        setMessage("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login, password]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleGoogleLogin = () => {
        window.location.href = LocalConfig.apiURL + "/api/oauth/google/login";
    }

    const handleMicrosoftLogin = () => {
        window.location.href = LocalConfig.apiURL + "/api/oauth/microsoft/login";

    }

    const handleYahooLogin = () => {
        window.location.href = LocalConfig.apiURL + "/api/oauth/yahoo/login";

    }

    const handlePredizaLogin = () => {
        if (!showForm) {
            setShowForm(true);
            return;
        }
        handleLogin()
    }

    const handleChangeValue = (e) => {
        if (e.target.name === "login") {
            setLogin(e.target.value);
        } else {
            setPassword(e.target.value)
        }
    }

    const isValid = () => {
        let f = !(toolsUtils.isEmptyString(login) && toolsUtils.isEmptyString(password));
        return f;
    }

    const handleLogin = () => {
        setDisabled(true);
        if (isValid()) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            SessionStore.login(toData(), cancelToken, responseLogin);
        }
    }

    const catchError = (data) => {
        let error = data || null;
        if (error) {
            if (error.status === 401) {
                setIsFailed(true);
                setMessage(t('login.incorrectUsernameOrPassword'))
            }
        }
    }

    const responseLogin = (response) => {
        if (!toolsUtils.isNullOrEmpty(tokenList.get(response.id), "pending")) {
            tokenList.remove(response.id);
        }

        if (!toolsUtils.isNullOrEmpty(response, "data")) {
            if (response.data.isAxiosError) {
                catchError(response.data.toJSON());
                setDisabled(false);
                return;
            }
            history.push("/dashboard");
            return
        }

        setDisabled(false);
    }

    const toData = () => {
        let data = {};
        data.username = login
        data.password = password

        return data;
    };

    const getForm = () => {
        return (
            <Grid container className={classes.boxContainer} spacing={3} justifyContent="center" direction="column">
                <Grid item xs={12}>
                    <Typography variant="subtitle2" className={classes.formHeader}>
                        {t("login.enter")}
                    </Typography>
                </Grid>
                {showForm &&
                    <Grid item xs={12} className={classes.backButton}>
                        <IconButton aria-label="back" onClick={() => { setShowForm(false) }}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Grid>
                }
                {message.length > 0 &&
                    <Grid item xs={12} style={{ color: "red" }}>
                        {message}
                    </Grid>
                }
                <Collapse in={showForm} style={{ width: "100%" }} mountOnEnter unmountOnExit>
                    <Grid item xs={12} className={classes.formControl}>
                        <Grid container >
                            <Grid item xs={12}>

                                <FormControl fullWidth className={classes.margin}>
                                    <BootstrapInput
                                        id="input-with-icon-adornment"
                                        placeholder={t('login.usernameOrEmail')}
                                        name="login"
                                        disabled={disabled}
                                        value={login}
                                        style={isFailed ? { border: "1px solid red" } : {}}
                                        onKeyPress={(enter && handleLogin) || null}
                                        onChange={handleChangeValue}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth className={classes.margin}>
                                    <BootstrapInput
                                        id="input-with-icon-adornment2"
                                        placeholder={t('common.password')}
                                        name="password"
                                        disabled={disabled}
                                        value={password}
                                        onKeyPress={(enter && handleLogin) || null}
                                        style={isFailed ? { border: "1px solid red", marginTop: "20px" } : { marginTop: "20px" }}
                                        onChange={handleChangeValue}
                                        type={(!showPassword && "password") || "text"}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <VpnKeyIcon />
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} style={{ marginTop: "25px" }}>
                            <Typography>
                                <Link className={classes.missed} href="#" onClick={(e) => { history.push("/forgotsent"); e.preventDefault() }}>
                                    {t('login.forgotPassword')}
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: "15px" }}>
                            <Button className={classes.button} variant="contained" color="primary" onClick={handlePredizaLogin}>
                                {t("login.enter")}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
                <Collapse in={!showForm} style={{ width: "100%", textAlign: "-webkit-center" }}>
                    <Grid container className={classes.buttonsContainer} spacing={3}>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: "10px" }}>
                            <SocialLoginButton label={t("login.enterGoogle")} social={"google"} onClick={handleGoogleLogin} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: "10px" }}>
                            <SocialLoginButton label={t("login.enterMicrosoft")} social={"microsoft"} onClick={handleMicrosoftLogin} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: "10px" }}>
                            <SocialLoginButton label={t("login.enterYahoo")} social={"yahoo"} onClick={handleYahooLogin} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: "10px" }}>
                            <SocialLoginButton social={"prediza"} onClick={handlePredizaLogin} />
                        </Grid>
                    </Grid>
                </Collapse>
                <Grid item xs={12} className={classes.createPosition}>
                    <Typography variant="caption">
                        {t("login.messageCreateAccount")}

                        <Link className={classes.createAccount} href="#"
                            onClick={(e) => { history.push("/signin"); e.preventDefault() }}
                            data-modal="registerUser">
                            {t("login.register")}
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container className={classes.justify}>
            <Grid item xs={12} className={classes.formContainer}>
                <Grid container>
                    <Grid item xs={12}>
                        {getForm()}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{maxWidth: "336px"}}>
                <Grid container justifyContent="center">
                    <Typography variant="caption" className={classes.powered}>
                        Powered by Prediza
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

}

export default LoginForm;
