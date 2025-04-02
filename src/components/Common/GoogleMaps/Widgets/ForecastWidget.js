import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';
import classNames from "classnames";

import Grid from "@material-ui/core/Grid";
import { Box, Grow, IconButton, Typography } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";

import useStyles from "../../../../styles/GoogleMaps/ForecastWidget";
import TokenList from '../../../../stores/CancelTokenList';
import GoogleMapStore from "../../../../stores/GoogleMapsStore";
import WeatherForecastStore from "../../../../stores/WeatherForecastStore";
import SessionStore from "../../../../stores/SessionStore";

function ForecastWidget() {
  const tokenList = new TokenList();
  const classes = useStyles();
  const { i18n: { language } } = useTranslation();

  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    moment.locale(language.toLowerCase())
    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    SessionStore.addListener("time.change", getForecast);
  }

  const clear = () => {
    SessionStore.removeListener("time.change", getForecast);
  }

  const getForecast = () => {

    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    GoogleMapStore.getWidgetForecast(cancelToken, responseWidgetForecast)
  }

  const responseWidgetForecast = (response) => {
    tokenList.remove(response.id);
    setForecast(null)
    if (response.data) {
      setForecast(response.data[0]);
      return
    }
  }

  return (
    <Grow in={Boolean(forecast)} timeout={2000}>
      <Grid container className={classes.container}>
        {forecast !== null &&
          <Box className={classes.card}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={10}>
                    <Typography className={classes.day}>
                      {moment(forecast.time).format("dddd")}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton size="small">
                      <CloseOutlined style={{ fontSize: "10px" }} />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography className={classes.date}>
                      {moment(forecast.time).format("DD/MM")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6}>
                    <Grid container direction="column" alignItems="center">
                      <Grid item xs={12}>
                        <Grid style={{ width: "40px", height: "40px" }}></Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className={classes.precipitation}>
                          {forecast?.precipitation_amount !== undefined ? forecast.precipitation_amount.toFixed(2) : "NaN"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container style={{ height: "100%", textAlign: "right" }} alignContent="flex-end">
                      <Grid item xs={12} style={{ height: "fit-content" }}>
                        <Typography className={classes.min}>
                          {forecast?.air_temperature_min !== undefined ? forecast.air_temperature_min.toFixed(1) + "℃" : "NaN"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} style={{ height: "fit-content" }}>
                        <Typography className={classes.max}>
                          {forecast?.air_temperature_max !== undefined ? forecast.air_temperature_max.toFixed(1) + "℃" : "NaN"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <i className={classNames(classes.sprite, classes[WeatherForecastStore.getIconID(forecast.symbol_id) + "fundobranco"], classes.iconWeather)}>
            </i>
          </Box>

        }
      </Grid>
    </Grow>
  )
}

export default ForecastWidget;