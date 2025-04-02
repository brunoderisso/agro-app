import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Schedule from "@material-ui/icons/Schedule";
import SessionStore from "../../stores/SessionStore";
import WidgetStore from "../../stores/WidgetStore";
import MeasureStore from "../../stores/MeasureStore";
import toolsUtils from "../../utils/toolsUtils";
import TokenList from "../../stores/CancelTokenList";

import style from "../../styles/Widgets/ChillingHours";
import { useTranslation } from "react-i18next";

export default withStyles(style)(function ChillingHours(props) {
  const [data, setData] = useState({});
  const [environment, setEnvironment] = useState({});
  const [time, setTime] = useState({});
  const [color, setColor] = useState("#ff0afa");
  const [mounted, setMounted] = useState(true);

  const tokenList = new TokenList();

  const { t } = useTranslation();

  useEffect(() => {
    start();
    bind();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    SessionStore.on("environment.change", dataUpdate);
  };

  const clear = () => {
    setMounted(false);
    SessionStore.clear();
    WidgetStore.cancel();
    MeasureStore.clear();
    tokenList.clear();
  };

  const start = () => {
    SessionStore.on("environment.change", () => {
      if (!mounted) {
        return;
      }
      environmentUpdate();
      if (environment !== null) {
        dataUpdate();
      }
    });
    if (SessionStore.getEnvironment() !== null) {
      environmentUpdate();
    }
    if (time === null) {
      timeUpdate();
    }
    SessionStore.on("time.change", () => {
      if (!mounted) {
        return;
      }
      dataUpdate();
      timeUpdate();
    });
    timeUpdate();
    dataUpdate();
  };

  const dataUpdate = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (mounted) {
      WidgetStore.getChillingHours(cancelToken, (retrievedata) => {
        tokenList.remove(retrievedata.id);
        if (
          retrievedata.data.min !== undefined &&
          retrievedata.data.max !== undefined &&
          retrievedata.data.mean !== undefined
        ) {
          let t = MeasureStore.getGradientColor(
            "AirTemperature",
            retrievedata.data.min,
            retrievedata.data.max,
            retrievedata.data.mean
          );
          if (t !== "") {
            setColor(t);
          }
        }
        setData(retrievedata.data);
      });
    }
  };

  const timeUpdate = () => {
    if (mounted) {
      setTime(SessionStore.getTime());
    }
  };

  const environmentUpdate = () => {
    if (mounted) {
      setEnvironment(SessionStore.getEnvironmentDetail());
    }
  };

  const { classes } = props;

  let name = "";

  if (
    environment !== undefined &&
    environment.name !== undefined &&
    environment.name !== ""
  ) {
    name = environment.name;
  }

  let diff = null;
  let label = null;

  diff = parseInt((time.end - time.start) / 1000 / 86400);
  if (diff <= 1) {
    label = t('common.lastMasculine') + diff + t('common.dayLowcase');
  } else {
    label = t('common.lastMasculine') + diff + t('common.days');
  }

  let gradient = { backgroundColor: "white" };

  if (color.length > 0) {
    if (color[0].percent < color[1].percent) {
      gradient = {
        background:
          "radial-gradient(circle, " +
          color[1].color +
          " 0%, " +
          color[0].color +
          " " +
          (100 - color[0].percent) +
          "%)",
      };
    } else {
      gradient = {
        background:
          "radial-gradient(circle, " +
          color[0].color +
          " 0%, " +
          color[1].color +
          " " +
          (100 - color[1].percent) +
          "%)",
      };
    }
  }

  return (
    <Card
      className={classes.widgetCard}
      classes={{ root: classes.root }}
      style={gradient}
    >
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Typography
                className={classes.widgetTitle}
                color="textSecondary"
                gutterBottom
              >
                {!toolsUtils.isEmptyString(name) &&
                  name !== null &&
                  name.toUpperCase()}
                {toolsUtils.isEmptyString(name) &&
                  name === null &&
                  t("common.myEnvironment")}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Schedule className={classes.widgetIcon} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography
                variant="h5"
                component="h2"
                className={classes.center}
              >
                {data.value}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography className={classes.widgetPos}>
                {t('common.chillHours')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12}>
                <Typography component="p" className={classes.data}>
                  {t('common.belowOf')} 7.2 ºC
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography component="p" className={classes.data}>
                  {label}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});
