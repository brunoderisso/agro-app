import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';

import Grid from "@material-ui/core/Grid";
import { Box, Grow, IconButton, Typography } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";

import useStyles from "../../../../styles/GoogleMaps/ChillHourWidget";
import TokenList from '../../../../stores/CancelTokenList';
import { ReactComponent as ChillHourIcon } from "../../../../img/AdvancedMapIcons/ChillHourIcon.svg";
import GoogleMapStore from "../../../../stores/GoogleMapsStore";
import SessionStore from "../../../../stores/SessionStore";

function ChillHour10Widget() {
  const tokenList = new TokenList();
  const classes = useStyles();
  const { i18n: { language }, t } = useTranslation();

  const [chillHour, setChillHour] = useState(null);

  useEffect(() => {
    moment.locale(language.toLowerCase())
    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    SessionStore.addListener("time.change", getChillHour);
  }

  const clear = () => {
    SessionStore.removeListener("time.change", getChillHour);
  }

  const getChillHour = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    GoogleMapStore.getWidgetChillHour10(cancelToken, responseWidgetChillHour)
  }

  const responseWidgetChillHour = (response) => {
    tokenList.remove(response.id);
    setChillHour(null)
    if (response.data) {
      setChillHour(response.data);
      return
    }
  }

  return (
    <Grow in={Boolean(chillHour)}>
      <Grid container className={classes.container}>
        {chillHour !== null &&
          <Box className={classes.card}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={10}>
                    <Typography className={classes.title}>
                      {t("common.chillHours")}
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
                <Typography className={classes.chill}>
                  ≤ 10°
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container justifyContent="center" alignItems="flex-start">
                  <Grid item xs={4} style={{ paddingTop: "4px" }}>
                    <ChillHourIcon />
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.value}>
                          {chillHour.value.toFixed(0) + "h"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className={classes.legend}>
                          {(moment(SessionStore.getTime().start).isSame(moment().startOf('day')) &&
                            t("common.today")) || moment(SessionStore.getTime().start).format("DD/MM")
                          }
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

export default ChillHour10Widget;