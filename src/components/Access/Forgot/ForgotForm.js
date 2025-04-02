import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
//Prediza
import useStyles from "../../../styles/Login/ActiveForm";
import { Link } from "@material-ui/core";

import SessionStore from "../../../stores/SessionStore";
import history from "../../../history";
import useKeyPress from "../../../Hook/useKeyPress";
import BootstrapInput from "../../Common/PredizaInput";
import PasswordStrengthBar from "react-password-strength-bar";
import CheckIcon from "@material-ui/icons/Check";
import { useTranslation } from "react-i18next";


function ForgotForm(props) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const { t } = useTranslation();

  const classes  = useStyles();

  const enter = useKeyPress("Enter");

  useEffect(() => {
    SessionStore.logout(() => { });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    setIsFailed(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, password2]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isValid = () => {
    //Algum campo não foi preenchido
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

  const updatePassword = () => {
    setDisabled(true);
    if (isValid()) {
      SessionStore.password(props.token, password, (status) => {
        if (status === "sent") {
          history.push("/dashboard");
          return;
        }
        setDisabled(false);
        history.push("/login");
      });
    }
  };

  const handleChangePassword = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    } else {
      setPassword2(e.target.value);
    }
  };

  const getForm = () => {
    return (
      <Grid container className={classes.boxContainer}>
        <Grid item xs={12}>
          <Grid className={classes.formHeader}>Recuperação de senha</Grid>
        </Grid>
        <Grid item xs={12} style={{ color: "red" }}>
          {message.length > 0 && message + "*"}
        </Grid>
        <Grid item xs={12} className={classes.formControl}>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth className={classes.margin}>
                <BootstrapInput
                  className={classes.activeInputs}
                  classes={{ input: classes.placeHolder }}
                  id="input-with-icon-adornment2"
                  placeholder={t('common.password')}
                  name="password"
                  disabled={disabled}
                  value={password}
                  onKeyPress={(enter && updatePassword) || null}
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
                  onKeyPress={(enter && updatePassword) || null}
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
            <IconButton
              className={classes.forgotButton}
              variant="contained"
              color="primary"
              onClick={updatePassword}
            >
              <CheckIcon color="white" />
            </IconButton>
          </Grid>
          <Grid item xs={12} className={classes.loginPosition}>
            <Link
              className={classes.createAccount}
              href="#"
              onClick={(e) => {
                history.push("/login");
                e.preventDefault();
              }}
              data-modal="loginUser"
            >
              {t('login.backToLogin')}
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

export default ForgotForm;
