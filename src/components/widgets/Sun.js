import React, { useEffect, useState } from "react";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SessionStore from "../../stores/SessionStore";
import WidgetStore from '../../stores/WidgetStore';
import toolsUtils from "../../utils/toolsUtils"
import TokenList from '../../stores/CancelTokenList'

import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';

import style from "../../styles/Widgets/Sun"
// External weather icons
import '../../css/weather-icons.css';

export default withStyles(style)(function Sun(props) {

  const [data, setData] = useState({});
  const [environment, setEnvironment] = useState({});
  const [icon, setIcon] = useState(null);
  const [label, setLabel] = useState(null);
  const [date, setDate] = useState(null);
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

  const start = () => {


    SessionStore.on("environment.change", () => {
      if (!mounted) {
        return
      }
      environmentUpdate();
      if (environment !== null) {
        dataUpdate();
      };
    });

    if (SessionStore.getEnvironment() !== null) {
      environmentUpdate();
    };

    SessionStore.on("time.change", () => {
      if (!mounted) {
        return
      }
      dataUpdate();
    });
    dataUpdate();
  }


  const clear = () => {
    setMounted(false);
    tokenList.clear();
    SessionStore.clear();
    WidgetStore.clear();
  }

  const dataUpdate = () => {

    let cancelToken = {}
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (mounted) {
      WidgetStore.getAstronomical(cancelToken, (retrievedata) => {
        tokenList.remove(retrievedata.id);
        let data = retrievedata.data;
        let now = moment().format('x');
        let sunrise = moment(data.sunrise, 'h:mma').format('x');
        if (now < sunrise) {
          setData(data);
          setDate(data.sunrise);
          setIcon('wi wi-sunrise');
          setLabel('Nascer do sol');
        } else {
          setData(data);
          setDate(data.sunset);
          setIcon('wi wi-sunset');
          setLabel('Por do sol');
        };
      });
    };
  };

  const environmentUpdate = () => {

    if (mounted) {
      setEnvironment(SessionStore.getEnvironmentDetail());
    };

  };

  const { classes } = props;


  let name = '';

  if (environment !== undefined && environment.name !== undefined && environment.name !== "") {
    name = environment.name
  };

  return (
    <Card className={classes.widgetCard} classes={{ root: classes.root }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                {!toolsUtils.isEmptyString(name) && name.toUpperCase()}
                {toolsUtils.isEmptyString(name) && "Meu Ambiente"}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Grid container justifyContent="center">
              <div className={classes.widgetIcon}>
                <i className={icon}></i>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography variant="h5" component="h2" className={classes.center}>
                {date}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography className={classes.widgetPos}>
                {label}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={7} sm={8} lg={9} className={classes.label}>
                    Próximo Nascer:
                                        </Grid>
                  <Grid className={classes.data} item xs={5} sm={4} lg={3}>
                    {data.nextsunrise}
                  </Grid>
                </Grid>


                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={7} sm={8} lg={9} className={classes.label}>
                      Próximo Poente:
                                        </Grid>
                    <Grid className={classes.data} item xs={5} sm={4} lg={3}>
                      {data.nextsunset}
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card >
  );
});