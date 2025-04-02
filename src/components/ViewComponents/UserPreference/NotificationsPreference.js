import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { FormControlLabel, Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/UserPreference/NotificationsPreference";
import CustomSwitch from "../../Common/CustomSwitch";
import { ReactComponent as InfoIcon } from "../../../img/InfoIconSecond.svg";
import CustomTooltip from "../../Common/CustomTooltip";
import TokenList from "../../../stores/CancelTokenList";
import sessionStore from "../../../stores/SessionStore";


function NotificationsPreference(props) {
  const classes = styles();
  const { t } = useTranslation();
  const tokenList = new TokenList();

  const [notifications, setNotifications] = useState({
    notify_email: true,
    notify_sms: true,
    notify_telegram: true,
  });

  useEffect(() => {
    if (props.locale) {
      const newNotifications = { ...notifications };

      if (props.locale.notify_email !== null) {
        newNotifications.notify_email = props.locale.notify_email;
      }

      if (props.locale.notify_sms !== null) {
        newNotifications.notify_sms = props.locale.notify_sms;
      }

      if (props.locale.notify_telegram !== null) {
        newNotifications.notify_telegram = props.locale.notify_telegram;
      }

      setNotifications(newNotifications);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.locale])

  useEffect(() => {
    if (props.hasPhone === false) {
      setNotifications(prev => ({ ...prev, notify_sms: false }));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.hasPhone])

  useEffect(() => {
    if (props.hasTelegram === false) {
      setNotifications(prev => ({ ...prev, notify_telegram: false }));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.hasTelegram])

  const handleChange = (event) => {
    setNotifications(prev => ({ ...prev, [event.target.name]: event.target.checked }));

    updatePreference(event.target.name, event.target.checked);
  }

  const updatePreference = (name, status) => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    const preference = {
      ...sessionStore.getPreference(),
      [name]: status
    };

    sessionStore.pushPreference_WT(cancelToken, preference, responseUpdatePreference);
  }

  const responseUpdatePreference = (response) => {
    tokenList.remove(response.id);

    if (response.status && typeof props.setErrorStatus === "function") {
      props.setErrorStatus(response.status.toString());
    }
  }

  return (
    <Grid container className={classes.container}>
      <Grid item>
        <Grid container>
          <Typography variant="overline" className={classes.title}>{t("preference.alertAndNotification")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.outlineText}>
            {t("preference.question_alertAndNotification")}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container className={classes.containerSwitch}>
        <Grid item xs={4}>
          <FormControlLabel
            control={<CustomSwitch size="small" checked={notifications?.notify_email} onChange={handleChange} name="notify_email" />}
            label={t("common.email")}
            className={classes.switch}
          />
        </Grid>
        <Grid item xs={4} className={classes.containerNotification}>
          <FormControlLabel
            control={<CustomSwitch
              size="small"
              checked={notifications?.notify_sms}
              onChange={handleChange}
              name="notify_sms"
              disabled={!props.hasPhone}
            />}
            label={t("common.phoneMessage")}
            className={classes.switch}
          />
          <CustomTooltip title={
            <React.Fragment>
              <Typography className={classes.tooltipText}>
                {t("preference.smsTooltip")}
              </Typography>
            </React.Fragment>
          }>
            <InfoIcon />
          </CustomTooltip>
        </Grid>
        <Grid item xs={4} className={classes.containerNotification}>
          <FormControlLabel
            control={<CustomSwitch
              size="small"
              checked={notifications?.notify_telegram}
              onChange={handleChange}
              name="notify_telegram"
              disabled={!props.hasTelegram}
            />}
            label="Telegram"
            className={classes.switch}
          />
          <CustomTooltip title={
            <React.Fragment>
              <Typography className={classes.tooltipText}>
                {t("preference.telegramTooltip")}
              </Typography>
            </React.Fragment>
          }>
            <InfoIcon />
          </CustomTooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}

NotificationsPreference.propTypes = {
  hasPhone: PropTypes.bool.isRequired,
  hasTelegram: PropTypes.bool.isRequired,
  setErrorStatus: PropTypes.func,
  locale: PropTypes.object
}

export default NotificationsPreference