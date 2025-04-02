import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import PersonIcon from "@material-ui/icons/Person";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
//Prediza
import useStyles from "../../../styles/Login/ActiveForm";
import { Button, Link } from "@material-ui/core";

import SessionStore from "../../../stores/SessionStore";
import history from "../../../history";
import useKeyPress from "../../../Hook/useKeyPress";
import TokenList from "../../../stores/CancelTokenList";
import BootstrapInput from "../../Common/PredizaInput";
import PasswordStrengthBar from "react-password-strength-bar";
import { useTranslation } from "react-i18next";

function ActiveForm(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const classes = useStyles();

  const enter = useKeyPress("Enter");

  const tokenList = new TokenList();

  const { t } = useTranslation();

  useEffect(() => {
    SessionStore.logout(() => { });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if (surname.length > 0 && name.length > 0) {
      suggestUsername();
    }
    setIsFailed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, surname, username, password, password2]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const suggestUsername = () => {
    let suggest = (name + "." + surname).toLocaleLowerCase();
    setUsername(suggest);
  };

  const handleChangeValue = (e) => {
    let v = e.target.value;

    if (e.target.name === "name") {
      setName(v);
      return;
    }
    if (e.target.name === "surname") {
      setSurname(v);
      return;
    }
    if (e.target.name === "username") {
      setUsername(v);
      return;
    }
  };

  const isValid = () => {
    //Algum campo não foi preenchido
    if (
      name.length < 1 ||
      surname.length < 1 ||
      username.length < 1 ||
      password.length < 1
    ) {
      setMessage(t('login.fillAllFields'));
      setIsFailed(true);
      return false;
    }

    if (password !== password2) {
      setMessage(t('login.passwordsDoNotMatch'));
      return false;
    }

    if (password.length < 6) {
      setMessage(t('login.weakPassword'));
      return false;
    }
    return true;
  };

  const login = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    SessionStore.login(
      { username: username, password: password },
      cancelToken,
      responseLogin
    );
  };

  const responseLogin = (resp) => {
    tokenList.remove(resp.id);

    if (resp.data !== null) {
      history.push("/");
      return;
    }

    history.push("/login");
  };

  const handleActive = () => {
    if (isValid()) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);
      setDisabled(true);
      SessionStore.activeUser(
        cancelToken,
        props.token,
        toData(),
        responsePutUser
      );
    }
  };

  const responsePutUser = (response) => {
    tokenList.remove(response.id);

    if (response.data !== null) {
      login();
    }
  };

  const handleChangePassword = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      setPassword2(e.target.value);
    }
  };

  const toData = () => {
    let data = {
      name: name,
      surname: surname,
      username: username,
      password: password,
    };
    return data;
  };

  const getForm = () => {
    return (
      <Grid container className={classes.boxContainer}>
        <Grid item xs={12}>
          <Grid className={classes.formHeader}>{t('login.register')}</Grid>
        </Grid>
        <Grid item xs={12} style={{ color: "red" }}>
          {message.length > 0 && message + "*"}
        </Grid>
        <Grid item xs={12} className={classes.formControl}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <BootstrapInput
                      className={classes.activeInputs}
                      classes={{ input: classes.placeHolder }}
                      id="input-with-icon-adornment"
                      placeholder={t('common.name')}
                      name="name"
                      disabled={disabled}
                      value={name}
                      style={isFailed ? { border: "1px solid red" } : {}}
                      onKeyPress={(enter && handleActive) || null}
                      onChange={handleChangeValue}
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth className={classes.margin}>
                    <BootstrapInput
                      required
                      className={classes.activeInputs}
                      classes={{ input: classes.placeHolder }}
                      id="input-with-icon-adornment"
                      placeholder={t('common.lastName')}
                      name="surname"
                      disabled={disabled}
                      value={surname}
                      style={isFailed ? { border: "1px solid red" } : {}}
                      onKeyPress={(enter && handleActive) || null}
                      onChange={handleChangeValue}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth className={classes.margin}>
                <BootstrapInput
                  className={classes.activeInputs}
                  classes={{ input: classes.placeHolder }}
                  id="input-with-icon-adornment"
                  placeholder={t('common.username')}
                  name="username"
                  disabled={disabled}
                  value={username}
                  style={isFailed ? { border: "1px solid red" } : {}}
                  onChange={handleChangeValue}
                  startAdornment={
                    <InputAdornment position="start">
                      <SpellcheckIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth className={classes.margin}>
                <BootstrapInput
                  className={classes.activeInputs}
                  classes={{ input: classes.placeHolder }}
                  id="input-with-icon-adornment2"
                  placeholder={t('common.password')}
                  name="password"
                  disabled={disabled}
                  value={password}
                  onKeyPress={(enter && handleActive) || null}
                  style={
                    isFailed
                      ? { border: "1px solid red", marginTop: "20px" }
                      : { marginTop: "20px" }
                  }
                  onChange={handleChangePassword}
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
              <PasswordStrengthBar
                shortScoreWord={t('login.tooShort')}
                scoreWords={[
                  t("common.veryWeak"),
                  t("common.weak"),
                  t("common.average"),
                  t("common.good"),
                  t("common.strong"),
                ]}
                password={password}
              />
              <FormControl fullWidth className={classes.margin}>
                <BootstrapInput
                  className={classes.activeInputs}
                  classes={{ input: classes.placeHolder }}
                  id="input-with-icon-adornment2"
                  placeholder={t('login.repeatPassword')}
                  name="password2"
                  autoComplete="off"
                  disabled={disabled}
                  value={password2}
                  onKeyPress={(enter && handleActive) || null}
                  style={
                    isFailed
                      ? { border: "1px solid red", marginTop: "20px" }
                      : { marginTop: "20px" }
                  }
                  onChange={handleChangePassword}
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
          <Grid
            item
            xs={12}
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleActive}
            >
              {t('login.createAccount')}
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.loginPosition}>
            {t('login.alreadyHaveAccount')}

            <Link
              className={classes.createAccount}
              href="#"
              onClick={(e) => {
                history.push("/login");
                e.preventDefault();
              }}
              data-modal="loginUser"
            >
              {` ${t('login.signInHere')}`}
            </Link>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container className={classes.formContainer}>
      <Grid item xs={12}>
        {getForm()}
      </Grid>
    </Grid>
  );
}

export default ActiveForm;
