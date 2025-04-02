import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";
import clsx from 'clsx';
import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';

import { Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/UserPreference/LogInfoPreference";
import sessionStore from "../../../stores/SessionStore";
import { ConstantsUtils } from "../../../utils/constantsUtils";
import stringsUtils from "../../../utils/stringsUtils";


function LogInfoPreference(props) {
  const classes = styles();
  const { t, i18n: { language } } = useTranslation();

  const [lastAccess, setLastAccess] = useState(null);

  useEffect(() => {
    moment.locale(language.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.open) {
      getLastAccess();
    }
  }, [props.open])

  const getLastAccess = () => {
    const lastAccessReport = sessionStore.getPreference()?.last_access?.[0] || null;
    const countryLog = ConstantsUtils.CountriesList.find(country => country.value === lastAccessReport?.country);

    setLastAccess(lastAccessReport
      ? {
        date: lastAccessReport.created_at
          ? moment(lastAccessReport.created_at).format("DD/MM/YYYY, HH[h]mm")
          : ConstantsUtils.NullFieldMask,
        location: (lastAccessReport.city ? stringsUtils.toCapitalize(lastAccessReport.city.toLowerCase()) : ConstantsUtils.NullFieldMask) + ", " +
          (countryLog ? countryLog.label : ConstantsUtils.NullFieldMask) +
          (lastAccessReport.ip
            ? " (" + (lastAccessReport.ip) + ")"
            : ConstantsUtils.NullFieldMask
          )
      }
      : {
        date: ConstantsUtils.NullFieldMask,
        location: ConstantsUtils.NullFieldMask
      })
  }

  return (
    <Grid container className={classes.containerBottom}>
      {lastAccess
        ? <>
          <Grid item container>
            <Typography variant="caption" className={clsx(classes.commonText, classes.boldText)}>
              {`${t("common.lastAccess")}:`}&nbsp;
            </Typography>
            <Typography variant="caption" className={classes.commonText}>
              {lastAccess.date}
            </Typography>
          </Grid>
          <Grid item container>
            <Typography variant="caption" className={clsx(classes.commonText, classes.boldText)}>
              {`${t("common.location")}:`}&nbsp;
            </Typography>
            <Typography variant="caption" className={classes.commonText}>
              {lastAccess.location}
            </Typography>
          </Grid>
        </>
        : <></>
      }
    </Grid>
  )
}

LogInfoPreference.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default LogInfoPreference