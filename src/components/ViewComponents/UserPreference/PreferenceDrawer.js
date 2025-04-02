import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { IconButton, Grid, Typography, Drawer } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";

import styles from "../../../styles/ViewComponents/UserPreference/PreferenceDrawer";
import MainInfoPreference from "./MainInfoPreference";
import LocaleInfoPreference from "./LocaleInfoPreference";
import UserFeedback from "../../Common/UserFeedback";
import TokenList from '../../../stores/CancelTokenList';
import { ConstantsUtils } from "../../../utils/constantsUtils";
import masksUtils from "../../../utils/masksUtils";
import LocaleFormPreference from "./LocaleFormPreference";
import NotificationsPreference from "./NotificationsPreference";
import TelegramPreference from "./TelegramPreference";
import PredizaScrollBar from "../../Common/PredizaScrollBar";
import sessionStore from "../../../stores/SessionStore";
import LogInfoPreference from "./LogInfoPreference";


function PreferenceDrawer(props) {
  const classes = styles();
  const tokenList = new TokenList();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [locale, setLocale] = useState(null);
  const [hasPhone, setHasPhone] = useState(true);
  const [hasTelegram, setHasTelegram] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  useEffect(() => {
    if (locale) {
      setFormData(locale);
    }

  }, [locale])

  useEffect(() => {
    if (open) {
      getPreference();
    } else {
      setEditMode(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const bind = () => {
    sessionStore.addListener("push.preference", getPreference);
  }

  const clear = () => {
    sessionStore.removeListener("push.preference", getPreference);
  }

  const getPreference = () => {
    const preference = sessionStore.getPreference();

    if (preference) {
      let country = null;
      let phone = "";

      if (preference.country) {
        country = ConstantsUtils.CountriesList.find(country => country.value === preference.country);
        country = country ? country.label : preference.country;
      }

      if (preference.mobilephone?.length > 0) {
        let ddi = "";
        let numberPhone = "";

        if (preference.mobilephone?.length > 4) {
          if (
            ["+54", "+55"].includes(preference.mobilephone.substring(0, 3)) ||
            ["54", "55"].includes(preference.mobilephone.substring(0, 2))
          ) {
            ddi = preference.mobilephone[0] === "+"
              ? preference.mobilephone.substring(1, 3)
              : preference.mobilephone.substring(0, 2);

            numberPhone = preference.mobilephone[0] === "+"
              ? preference.mobilephone.substring(3)
              : preference.mobilephone.substring(2);
          } else if (
            ["+591", "+595"].includes(preference.mobilephone.substring(0, 4)) ||
            ["591", "595"].includes(preference.mobilephone.substring(0, 3))
          ) {
            ddi = preference.mobilephone[0] === "+"
              ? preference.mobilephone.substring(1, 4)
              : preference.mobilephone.substring(0, 3);

            numberPhone = preference.mobilephone[0] === "+"
              ? preference.mobilephone.substring(4)
              : preference.mobilephone.substring(3);
          }
        }

        phone = masksUtils.formatPhone(numberPhone, ddi);
      } else {
        setHasPhone(false);
      }

      setLocale({
        ...preference,
        country: country,
        mobilephone: phone
      });
    }

    if (preference?.telegram_userid) {
      setHasTelegram(Boolean(preference.telegram_userid));
    }
  }

  const submitUpdate = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    const preference = {
      ...sessionStore.getPreference(),
      mobilephone: formData.mobilephone.replaceAll("-", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", ""),
      country: formData.country,
      state: formData.state,
      city: formData.city,
      locale: formData.locale
    };

    setLoading(true);
    sessionStore.pushPreference_WT(cancelToken, preference, responseSubmitUpdate);
  }

  const responseSubmitUpdate = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      sessionStore.emit("environment.change", "preference");

      setErrorStatus("200");
      setErrorMessage(t("alert.updateData"));
      getPreference();
      setEditMode(false);
    }

    if (response.status) {
      setErrorStatus(response.status.toString());
    }
  }

  return (
    <Grid>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        onClose={props.onClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <PredizaScrollBar customHeight={"610px"}>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <IconButton onClick={props.onClose} size="small">
                <CloseOutlined fontSize="small" className={classes.iconClose} />
              </IconButton>
            </Grid>
            <Grid item xs={editMode ? 9 : 10} className={classes.wrapperTitle}>
              <Typography variant="h5" className={classes.title}>
                {t("preference.myProfile")}
              </Typography>
            </Grid>
            {editMode
              ? <Grid item xs={2} container className={classes.wrapperSmallerIcons}>
                <Grid item>
                  <IconButton onClick={() => setEditMode(false)} size="small" disabled={loading}>
                    <CloseOutlined fontSize="small" className={classes.smallerIcon} />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton onClick={submitUpdate} size="small" disabled={loading || loadingCities}>
                    <DoneIcon fontSize="small" className={classes.smallerIcon} />
                  </IconButton>
                </Grid>
              </Grid>
              : <Grid item xs={1} container justifyContent="flex-end">
                <IconButton size="small" onClick={() => setEditMode(true)}>
                  <EditIcon className={classes.iconEdit} />
                </IconButton>
              </Grid>
            }
          </Grid>
          <MainInfoPreference editMode={editMode} />
          {editMode
            ? <LocaleFormPreference
              locale={locale}
              handleFormState={setFormData}
              handleLoadingCities={setLoadingCities}
              loading={loading}
            />
            : <LocaleInfoPreference locale={locale} />
          }
          <NotificationsPreference hasPhone={hasPhone} hasTelegram={hasTelegram} locale={locale} />
          <TelegramPreference setErrorStatus={setErrorStatus} hasTelegram={hasTelegram} />
          <LogInfoPreference open={open} />
        </PredizaScrollBar>
      </Drawer>
      <UserFeedback error={errorStatus} setError={setErrorStatus} message={errorMessage} />
    </Grid>
  )
}

PreferenceDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PreferenceDrawer