import React, { useState, useEffect } from "react";
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils"
import WidgetStore from '../../stores/WidgetStore';
import TokenList from '../../stores/CancelTokenList'

import style from "../../styles/Widgets/Weather"

// External weather icons
import '../../css/weather-icons.css';
import { Grid } from "@material-ui/core";

export default withStyles(style)(function Weather(props) {

  const [data, setData] = useState({});
  const [symbol, setSymbol] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [mounted, setMounted] = useState(true);

  const tokenList = new TokenList();

  useEffect(() => {

    start();
    bind();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () =>{
    SessionStore.on("environment.change", dataUpdate);

  }

  const clear = () =>{
    setMounted(false);
    tokenList.clear();
  }

  const start = () => {
    SessionStore.on("environment.change", () => {
      environmentUpdate();
      if (environment !== null) {
        dataUpdate();
      };
    });
    if (SessionStore.getEnvironment() !== null) {
      environmentUpdate();
    };
    dataUpdate();
  }

  const dataUpdate = () => {
    let cancelToken = {}
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (mounted) {
      WidgetStore.getWeatherForecast(cancelToken, (retrievedata) => {
        tokenList.remove(retrievedata.id);
        setData(retrievedata.data);
        setSymbol(symbolUpdate(retrievedata.data.symbol.number));
      });
    };
  };

  const symbolUpdate = (symbol) => {
    let icon = null;
    // Provider by API met weather icons
    switch (symbol) {
      //1 Sun
      case 1:
        icon = 'wi wi-day-sunny';
        break;
      // 2 LightCloud
      case 2:
        icon = 'wi wi-day-cloudy';
        break;
      // 3 PartlyCloud
      case 3:
        icon = 'wi wi-day-cloudy-high';
        break;
      // 4 Cloud
      case 4:
        icon = 'wi wi-cloud';
        break;
      // 5 LightRainSun
      case 5:
        icon = 'wi wi-day-rain';
        break;
      // 6 LightRainThunderSun
      case 6:
        icon = 'wi wi-day-thunderstorm';
        break;
      // 7 SleetSun
      case 7:
        icon = 'wi wi-day-sleet';
        break;
      // 8 SnowSun
      case 8:
        icon = 'wi wi-day-snow';
        break;
      // 9 LightRain
      case 9:
        icon = 'wi wi-rain';
        break;
      // 10 Rain
      case 10:
        icon = 'wi wi-showers';
        break;
      // 11 RainThunder
      case 11:
        icon = 'wi wi-thunderstorm';
        break;
      // 12 Sleet
      case 12:
        icon = 'wi wi-sleet';
        break;
      // 13 Snow
      case 13:
        icon = 'wi wi-snow';
        break;
      // 14 SnowThunder
      case 14:
        icon = 'wi wi-storm-showers';
        break;
      // 15 Fog
      case 15:
        icon = 'wi wi-fog';
        break;
      // 20 SleetSunThundercase
      case 20:
        icon = 'wi wi-day-sleet-storm';
        break;
      // 21 SnowSunThunder
      case 21:
        icon = 'wi wi-day-snow';
        break;
      // 22 LightRainThunder
      case 22:
        icon = 'wi wi-storm-showers';
        break;
      // 23 SleetThunder
      case 23:
        icon = 'wi wi-storm-showers';
        break;
      // 24 DrizzleThunderSun
      case 24:
        icon = 'wi wi-day-sleet-storm';
        break;
      // 25 RainThunderSun
      case 25:
        icon = 'wi wi-day-storm-showers';
        break;
      // 26 LightSleetThunderSun
      case 26:
        icon = 'wi wi-day-sleet-storm';
        break;
      // 27 HeavySleetThunderSun
      case 27:
        icon = 'wi wi-day-sleet-storm';
        break;
      // 28 LightSnowThunderSun
      case 28:
        icon = 'wi wi-day-snow-thunderstorm';
        break;
      // 29 HeavySnowThunderSun
      case 29:
        icon = 'wi wi-day-snow-thunderstorm';
        break;
      // 30 DrizzleThunder
      case 30:
        icon = 'wi wi-storm-showers';
        break;
      // 31 LightSleetThunder
      case 31:
        icon = 'wi wi-storm-showers';
        break;
      // 32 HeavySleetThunder
      case 32:
        icon = 'wi wi-storm-showers';
        break;
      // 33 LightSnowThunder
      case 33:
        icon = 'wi wi-snow-thunderstorm';
        break;
      // 34 HeavySnowThunder
      case 34:
        icon = 'wi wi-snow-thunderstorm';
        break;
      // 40 DrizzleSun
      case 40:
        icon = 'wi wi-day-sprinkle';
        break;
      // 41 RainSun
      case 41:
        icon = 'wi wi-day-rain';
        break;
      // 42 LightSleetSun
      case 42:
        icon = 'wi wi-day-sleet';
        break;
      // 43 HeavySleetSun
      case 43:
        icon = 'wi wi-day-sleet-storm';
        break;
      // 44 LightSnowSun
      case 44:
        icon = 'wi wi-day-snow';
        break;
      // 45 HeavysnowSun
      case 45:
        icon = 'wi wi-day-snow-thunderstorm';
        break;
      // 46 Drizzle
      case 46:
        icon = 'wi wi-sprinkle';
        break;
      // 47 LightSleet
      case 47:
        icon = 'wi wi-sleet';
        break;
      // 48 HeavySleet
      case 48:
        icon = 'wi wi-sleet';
        break;
      // 49 LightSnow
      case 49:
        icon = 'wi wi-snow';
        break;
      // 50 HeavySnow
      case 50:
        icon = 'wi wi-snow';
        break;
      default:
        icon = null;
        break;
    };
    return icon;
  };

  const environmentUpdate = () => {
    if (mounted) {
      setEnvironment(SessionStore.getEnvironmentDetail())
    };
  };

  const { classes } = props;

  let name = '';

  if (environment !== null) {
    if (environment !== undefined && environment.name !== undefined && environment.name !== "") {
      name = environment.name
    };
  };

  const isValid = () => {
    if (data !== null) {
      if (data.cloudiness !== undefined) {
        return true;
      }
    }
    return false;
  }

  return (
    <Card className={classes.widgetCard} classes={{ root: classes.root }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                {!toolsUtils.isEmptyString(name) && name !== null && name.toUpperCase()}
                {toolsUtils.isEmptyString(name) && name === null && "meu ambiente"}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <div className={classes.widgetIcon}>
                <i className={symbol}></i>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography variant="h5" component="h2" className={classes.center}>
                {!toolsUtils.isNullOrEmpty(data, "airTemperature") && parseFloat(data.airTemperature).toFixed(1)}
                {toolsUtils.isNullOrEmpty(data, "airTemperature") && "NaN"} ºC
                    </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography className={classes.widgetPos}>
                Previsão do tempo
                    </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12}>
                <Grid container>
                  <Grid className={classes.label} style={{ marginRight: 2.5 }}>
                    {"Nebulosidade: "}
                  </Grid>
                  <Grid className={classes.data}>
                    {isValid() && data.cloudiness.percent === 100 && "100%"}
                    {isValid() && data.cloudiness.percent !== 100 && parseFloat(data.cloudiness.percent).toFixed(1) + "% "}
                    {!isValid() && "NaN %"}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography component="p" className={classes.data}>
                  Vento: {!toolsUtils.isNullOrEmpty(data, "windSpeed") && parseFloat(data.windSpeed * 1, 609).toFixed(1)}
                         {toolsUtils.isNullOrEmpty(data, "windSpeed") && "NaN"} m/s
                         {!toolsUtils.isNullOrEmpty(data, "windDirection") && "  " + data.windDirection}
                         {toolsUtils.isNullOrEmpty(data, "windDirection") && "  -"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});