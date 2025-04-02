import React from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import clsx from 'clsx';

import { Card, Grid, IconButton, Typography, withStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import styles from "../../../../styles/GoogleMaps/Timeline/AlertsCard";
import stringsUtils from "../../../../utils/stringsUtils";
import AdvancedMapIcons from "../MapSideMenu/AdvancedMapIcons";


const allStyles = Object.assign({}, styles, AdvancedMapIcons);

export default withStyles(allStyles)(function AlertsCard(props) {
  const { classes } = props;
  const { t } = useTranslation();

  const onClose = () => {
    if (typeof props.onClose === "function") {
      props.onClose(props.date);
    }
  }

  return (
    <Card className={classes.container} elevation={4}>
      <Grid container>
        <Grid container item xs={10} alignContent="center" className={classes.containerHeader}>
          <Typography className={classes.text}>{stringsUtils.toCapitalize(t("common.alerts"))}</Typography>
        </Grid>
        <Grid container item xs={2} alignItems="center">
          <IconButton size="small" onClick={onClose} className={classes.containerBt}>
            <CloseIcon className={classes.iconBt} />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container>
        <Typography className={classes.text}>{moment(props.date).format('DD/MM/YYYY')}</Typography>
      </Grid>
      <Grid container className={classes.containerContent}>
        {props.alert.events.map((event, index) => {
          return (
            <Grid container item key={index}>
              <Grid item>
                <i className={clsx(
                  classes.sprite,
                  classes[`${event.icon}E80`],
                  classes.alertIcon
                )}></i>
              </Grid>
              <Grid item alignContent="center">
                <Typography className={classes.textEvent}>{t(event.text)}</Typography>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Card>
  );
})