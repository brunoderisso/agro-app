import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { Grid, Typography } from "@material-ui/core";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import styles from "../../../styles/ViewComponents/UserPreference/TelegramPreference";
import TelegramLoginButton from "./TelegramLoginButton";
import sessionStore from "../../../stores/SessionStore";
import TokenList from "../../../stores/CancelTokenList";


function TelegramPreference(props) {
  const [linked, setLinked] = useState(false);

  const classes = styles({ linked });
  const { t } = useTranslation();
  const tokenList = new TokenList();

  useEffect(() => {
    setLinked(props.hasTelegram);
  }, [props.hasTelegram])

  const handleTelegramAuth = (user) => {
    if (user?.id) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      const preference = {
        ...sessionStore.getPreference(),
        telegram_userid: user.id
      };

      sessionStore.pushPreference_WT(cancelToken, preference, responseUpdatePreference);
    }
  }

  const responseUpdatePreference = (response) => {
    tokenList.remove(response.id);

    if (response.data && typeof props.setErrorStatus === "function") {
      props.setErrorStatus("200");
    }

    if (response.status && typeof props.setErrorStatus === "function") {
      props.setErrorStatus(response.status.toString());
    }
  }

  return (
    <Grid container className={classes.container}>
      <Grid item>
        <Grid container>
          <Typography variant="overline" className={classes.title}>{t("preference.linkTelegram")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.outlineText}>{t("preference.descriptionTelegram")}</Typography>
        </Grid>
      </Grid>
      <Grid item container className={classes.containerTelegram}>
        <Grid item xs={6}>
          <TelegramLoginButton
            botUsername="PredizaBot"
            onAuthCallback={handleTelegramAuth}
          />
        </Grid>
        <Grid item xs={6} className={classes.containerStatus}>
          {linked
            ? <>
              <CheckCircleIcon className={classes.iconProps} />
              <Typography variant="caption" className={classes.checkedText}>{t("common.linked")}</Typography>
            </>
            : <>
              <CancelOutlinedIcon className={classes.iconProps} />
              <Typography variant="caption" className={classes.outlineText}>{t("common.notLinked")}</Typography>
            </>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

TelegramPreference.propTypes = {
  hasTelegram: PropTypes.bool.isRequired,
  setErrorStatus: PropTypes.func.isRequired
}

export default TelegramPreference