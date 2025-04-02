import React from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/UserPreference/LocaleInfoPreference";
import { ConstantsUtils } from "../../../utils/constantsUtils";
import stringsUtils from "../../../utils/stringsUtils";


function LocaleInfoPreference(props) {
  const classes = styles();
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item xs={6} className={classes.spacing}>
        <Grid container>
          <Typography variant="caption" className={classes.label}>{t("common.country")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.text}>
            {props.locale?.country || ConstantsUtils.NullFieldMask}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={6} className={classes.spacing}>
        <Grid container>
          <Typography variant="caption" className={classes.label}>{t("common.state")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.text}>
            {props.locale?.state ? stringsUtils.toCapitalize(props.locale.state.toLowerCase()) : ConstantsUtils.NullFieldMask}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container>
          <Typography variant="caption" className={classes.label}>{t("common.city")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.text}>
            {props.locale?.city ? stringsUtils.toCapitalize(props.locale.city.toLowerCase()) : ConstantsUtils.NullFieldMask}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid container>
          <Typography variant="caption" className={classes.label}>{t("common.phone")}</Typography>
        </Grid>
        <Grid container>
          <Typography variant="caption" className={classes.text}>
            {props.locale?.mobilephone?.length > 0 ? props.locale.mobilephone : ConstantsUtils.NullFieldMask}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

LocaleInfoPreference.propTypes = {
  locale: PropTypes.object,
};

export default LocaleInfoPreference