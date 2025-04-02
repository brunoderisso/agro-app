import React from "react";

import Grid from '@material-ui/core/Grid';
import ButtonBase from '@material-ui/core/ButtonBase';

//Prediza
import useStyles from '../../../styles/Login/SocialButton'
import { ReactComponent as GoogleIcon } from '../../../img/IconsGoogle.svg';
import { ReactComponent as MicrosoftIcon } from '../../../img/IconsMicrosoft.svg';
import { ReactComponent as YahooIcon } from '../../../img/IconsYahoo.svg';
import { ReactComponent as PredizaIcon } from '../../../img/PALogoBranco.svg';
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";

function GoogleButton(props) {

  const classes = useStyles();

  const { t } = useTranslation();

  const getSocialClassName = () => {
    if (props.social === "google") {
      return classes.containerGoogle
    }
    if (props.social === "microsoft") {
      return classes.containerMicrosoft
    }
    if (props.social === "yahoo") {
      return classes.containerYahoo
    }
    if (props.social === "prediza") {
      return classes.containerPrediza
    }
  }

  const getTextClassName = () => {
    if (props.social === "google") {
      return classes.textGoogle
    }
    if (props.social === "microsoft") {
      return classes.textMicrosoft
    }
    if (props.social === "yahoo") {
      return classes.textYahoo
    }
    if (props.social === "prediza") {
      return classes.textPrediza
    }
  }

  return (
    <Grid>
      <ButtonBase onClick={props.onClick} className={classes.buttonBase}>
        <Grid container className={getSocialClassName()} alignItems="center" justifyContent="center">

          <Grid item className={classes.googleIconContainer}>
            {props.social === "google" &&
              <GoogleIcon className={classes.googleIcon} />
            }
            {props.social === "microsoft" &&
              <MicrosoftIcon className={classes.googleIcon} />
            }
            {props.social === "yahoo" &&
              <YahooIcon className={classes.googleIcon} />
            }
            {props.social === "prediza" &&
              <PredizaIcon className={classes.googleIcon} />

              // <img src={PredizaLogo} alt={"LogoPrediza"} className={classes.predizaLogo} />
            }
          </Grid>

          <Grid item>
            <Typography className={getTextClassName()}>
              {props.label || ((props.social === "google" && "Sign In With Google") ||
                (props.social === "yahoo" && "Sign In With Yahoo") ||
                (props.social === "prediza" && t("login.enterWith")) ||
                (props.social === "microsoft" && "Sign In With Microsoft"))}
            </Typography>
          </Grid>
        </Grid>
      </ButtonBase>
    </Grid>
  );

}

export default GoogleButton;