import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';

import { Box, Grow, IconButton, Typography } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";

import useStyles from "../../../../styles/GoogleMaps/ColdUnitsWidget";
import TokenList from '../../../../stores/CancelTokenList';
import { ReactComponent as ColdUnitsIcon } from "../../../../img/AdvancedMapIcons/ColdUnitsIcon.svg";
import GoogleMapStore from "../../../../stores/GoogleMapsStore";
import SessionStore from "../../../../stores/SessionStore";

function ColdUnitsWidget() {
  const tokenList = new TokenList();
  const classes = useStyles();
  const { i18n: { language }, t } = useTranslation();

  const [coldUnits, setColdUnits] = useState(null);

  useEffect(() => {
    moment.locale(language.toLowerCase())
    bind();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = () => {
    SessionStore.addListener("time.change", getColdUnits);
  }

  const clear = () => {
    SessionStore.removeListener("time.change", getColdUnits);
  }

  const getColdUnits = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    GoogleMapStore.getWidgetColdUnits(cancelToken, responseWidgetColdUnits)
  }

  const responseWidgetColdUnits = (response) => {
    tokenList.remove(response.id);
    setColdUnits(null)
    if (response.data) {
      setColdUnits(response.data);
      return
    }
  }

  return (
    <Grow in={Boolean(coldUnits)}>
      <Grid container className={classes.container}>
        {coldUnits !== null &&
          <Box className={classes.card}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                  <Grid item xs={10}>
                    <Typography className={classes.title}>
                      {t("common.coldUnit")}
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
                <Grid container justifyContent="center" alignItems="flex-start">
                  <Grid item xs={4} style={{ paddingTop: "4px" }}>
                    <ColdUnitsIcon />
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.value}>
                          {coldUnits.value.toFixed(2)}
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

export default ColdUnitsWidget;