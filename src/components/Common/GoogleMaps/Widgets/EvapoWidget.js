import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';

import Grid from "@material-ui/core/Grid";
import { Box, Grow, IconButton, Typography } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";

import useStyles from "../../../../styles/GoogleMaps/EvapoWidget";
import { ReactComponent as EvapoIcon } from "../../../../img/AdvancedMapIcons/EvapoIcon.svg";
import TokenList from '../../../../stores/CancelTokenList';
import GoogleMapStore from "../../../../stores/GoogleMapsStore";
import SessionStore from "../../../../stores/SessionStore";


function EvapoWidget() {

  const [evapo, setEvapo] = useState(null);

  const tokenList = new TokenList();
  const classes = useStyles();

  const { i18n: { language } } = useTranslation();


  useEffect(() => {
    moment.locale(language.toLowerCase())
    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    SessionStore.addListener("time.change", getEvapo);
  }

  const clear = () => {
    SessionStore.removeListener("time.change", getEvapo);
  }

  const getEvapo = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    GoogleMapStore.getWidgetEvapo(cancelToken, responseWidgetEvapo)
  }

  const responseWidgetEvapo = (response) => {
    tokenList.remove(response.id);
    setEvapo(null)
    if (response.data) {
      setEvapo(response.data);
      return
    }
  }

  return (
    <Grow in={Boolean(evapo)}>
      <Grid container className={classes.container}>
        {evapo !== null &&
          <Box className={classes.card}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={10}>
                    <Typography className={classes.title}>
                      Evapo
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton size="small">
                      <CloseOutlined style={{ fontSize: "10px" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.measure}>
                  ETO
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent="center" alignItems="flex-start">
                  <Grid item xs={4} style={{ paddingTop: "4px" }}>
                    <EvapoIcon />
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.value}>
                          {evapo.value.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className={classes.legend}>
                          mm/d
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        }
      </Grid>
    </Grow>
  )
}

export default EvapoWidget;