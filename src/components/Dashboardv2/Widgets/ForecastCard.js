import React, { useState, useEffect } from "react";
import LaunchIcon from "@material-ui/icons/Launch";

//import { Skeleton } from "@material-ui/lab";

import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import useStyles from "../../../styles/Dashboardv2/ForecastCard";


import WeatherIcons from "../../../styles/WeatherForecast/WeatherIcons";
import MeasureIcons from "../../../styles/WeatherForecast/MeasureIcons"
import WeatherForecastStore from "../../../stores/WeatherForecastStore";

import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

let allStyles = Object.assign({}, WeatherIcons, MeasureIcons);
const forecastStyles = makeStyles((theme) => (allStyles));

function ForecastCard({ edit }) {

  const [forecast, setForecast] = useState({});

  const classes = useStyles();
  const forecastClasses = forecastStyles();

  const { t, i18n: { language } } = useTranslation();

  useEffect(() => {
    console.log(language)

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setForecast({
      "air_pressure_at_sea_level": 1012.4,
      "air_temperature": 17.1,
      "cloud_area_fraction": 1.6,
      "cloud_area_fraction_high": 0,
      "cloud_area_fraction_low": 0,
      "dew_point_temperature": 14.1,
      "fog_area_fraction": 0,
      "precipitation_amount": 0,
      "relative_humidity": 81.7,
      "symbol_code": "clearsky",
      "symbol_id": 1,
      "ultraviolet_index_clear_sky": 0,
      "wind_from_direction": 37.9,
      "wind_speed": 4.5,
      "time": "2025-01-10T03:00:00Z"
    });

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Card
      style={{
        boxShadow: edit ? '0px 8px 15px rgba(0, 0, 0, 0.2)' : '0px 4px 6px rgba(0, 0, 0, 0.1)',
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={<Typography variant="h6" className={classes.cardTitle}>{t('services.previsão')}</Typography>}
        action={
          <IconButton size="small" className={classes.externalButton}>
            <LaunchIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          height: "75%"
        }}
      >
        {forecast && forecast.air_temperature &&
          <Grid container style={{ height: "100%" }}>
            <Grid item xs={12} style={{ marginLeft: "16px" }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item >
                  <Typography className={classes.temperature}>{(forecast?.air_temperature).toFixed(1) + " ºC"}</Typography>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography variant="body2" className={classes.temperatureMin}>
                            {(forecast?.air_temperature - 2).toFixed(1) + " ºC"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" className={classes.temperatureMax}>
                            {(forecast?.air_temperature + 2).toFixed(1) + " ºC"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item style={{ height: "0px", width: "50px" }}>
                      <i className={classNames(forecastClasses.sprite, forecastClasses[WeatherForecastStore.getIcon({ icon: forecast.symbol_code }, "icon") + "fundobranco"], classes.iconWeather)}>
                      </i>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginLeft: "16px" }}>
              <Grid container alignItems="center">
                <Grid item style={{ marginRight: "8px" }}>
                  <Typography variant="body1"> 17.2 mm </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="caption" className={classes.rainText}> de chuva em 2h</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      </CardContent>
    </Card>
  )
}

export default ForecastCard;