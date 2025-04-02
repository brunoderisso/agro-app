import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import Grow from "@material-ui/core/Grow";
import Slide from "@material-ui/core/Slide";

import Styles from "../../styles/ChillHour/FieldCard";
import toolsUtils from "../../utils/toolsUtils";
import PredizaAlertDialog from "../PredizaAlertDialog";
import ChillHourStore from "../../stores/ChillHourStore";
import TimeSerieStore from "../../stores/TimeSerieStore";
import EvapoStore from "../../stores/EvapoStore";
import PoligonStore from "../../stores/PoligonStore";
import tokens from "../../stores/CancelTokenList";
import useResize from "../../Hook/useResize";
import Canvas from "../Common/Canvas";

import moment from "moment";
import { useTranslation } from "react-i18next";
import theme from "../../styles/Utils/theme";

const style = {
  borderRadius: "20px",
  border: "solid 3px #ffffff",
};

const style2 = {
  borderRadius: "20px",
  border: "solid 3px #008eff",
};

export default withStyles(Styles)(function FieldCard(props) {
  const [polygon, setPolygon] = useState({});
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [gdd, setGdd] = useState(null);

  const [flags, setFlags] = useState({});
  const { classes } = props;
  const window = useResize();

  const { t } = useTranslation();
  const tokenList = new tokens();

  useEffect(() => {
    setPolygon(props.polygon);
    bind();
    setFlags({
      dialogIsOpen: false,
    });
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!toolsUtils.isNullOrEmpty(polygon, "name") && polygon.isvisible) {
      setSelected(polygon.isvisible);
      setExpanded(polygon.isvisible);
      setTimeout(() => {
        EvapoStore.emit("polygon.stats", polygon);
      }, 2000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon])

  const CustomCheckbox = withStyles({
    root: {
      color: polygon.color || "#000000",
      "&$checked": {
        color: polygon.color || "#000000",
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  const onCheck = (e) => {
    let c = e.target.checked;
    setCheck(c);
    // PARAMETRIZAR
    if (c) {
      ChillHourStore.polygonChillHour(polygon);
    } else {
      ChillHourStore.polygonRemoveChillHour(polygon);
    }
  }

  const bind = () => {
    ChillHourStore.on("time.change", changeTime);
    ChillHourStore.on("change_chill", changeChill);
  };

  const clear = () => {
    ChillHourStore.removeListener("time.change", changeTime);
    ChillHourStore.removeListener("change_chill", changeChill);

    tokenList.clear();
  };

  const changeChill = () => {
    if (ChillHourStore.chill === "_GDD") {
      getTimeSerie();
    }
  }

  const changeTime = () => {
    setCheck(false);
    if (ChillHourStore.chill === "_GDD") {
      getTimeSerie();
    }
  }

  const getParameters = (envcrop) => {
    return {
      measure: "_GDD",
      group: "1d",
      start: ChillHourStore.date.start,
      end: ChillHourStore.date.end,
      function: "LAST",
      fill: "0",
      cumulative: true,
      objectid: envcrop,
    };
  }

  const getTimeSerie = () => {
    if (
      !toolsUtils.isNullOrEmpty(props.polygon, "cropobjectid") &&
      !toolsUtils.isEmptyString(props.polygon.cropobjectid)
    ) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      TimeSerieStore.getTimeSerie(
        cancelToken,
        getParameters(props.polygon.cropobjectid),
        getTimeSerieResponse
      );
    } else {
      setGdd(0);

      let pol = props.polygon;
      pol.chill = 0;

      if (pol.isvisible) {
        ChillHourStore.changeGdd(pol);
      }
    }
  }

  const getTimeSerieResponse = (response) => {
    tokenList.remove(response.id);

    if (
      response !== null &&
      response.serie !== null &&
      response.serie.length > 0
    ) {
      setGdd(response.serie[response.serie.length - 1].value);

      let pol = props.polygon;
      pol.chill = response.serie[response.serie.length - 1].value;

      if (pol.isvisible) {
        ChillHourStore.changeGdd(pol);
      }

      return;
    }

    setGdd(0);
    let pol = props.polygon;

    pol.chill = 0;

    if (pol.isvisible) {
      ChillHourStore.changeGdd(pol);
    }
  }

  const onClickDeletePoligon = () => {
    PoligonStore.delPoligon(polygon.objectid);
  }

  const toggleDialog = () => {
    setFlags({
      ...flags,
      dialogIsOpen: false,
    });
  }

  const onClickCard = () => {
    let s = selected;
    setSelected(!s);
    setVisible();
    let e = expanded || false;
    setExpanded(!e);
    EvapoStore.centerMap(polygon);
    EvapoStore.showStats(polygon);

    if (props.charts && window.width < 600) {
      if (!e) {
        ChillHourStore.polygonChillHour(polygon);
      } else {
        ChillHourStore.polygonRemoveChillHour(polygon);
      }
    }
  }

  const setVisible = () => {
    let visible = !polygon.isvisible || false;

    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    PoligonStore.attPolygon(
      cancelToken,
      { objectid: polygon.objectid, isvisible: visible },
      responseSetVisible
    );
  }

  const responseSetVisible = (response) => {
    tokenList.remove(response.id);
  }

  const getCol = () => {
    if (window.width < 600) {
      return 6;
    }

    if (props.charts && window.width < 600) {
      return 6;
    }

    if ((window.width >= 600 && expanded) || props.charts) {
      return 12;
    }

    return 6;
  }

  return (
    <Grid md={getCol()} className={props.margin}>
      <Grid
        className={
          (props.charts && window.width >= 600) ||
          (expanded && window.width >= 600)
            ? classes.cardContainerExpanded
            : classes.cardContainer
        }
      >
        <div onClick={onClickCard}>
          <Card
            className={classes.card}
            style={selected && !props.charts ? style2 : style}
          >
            {!toolsUtils.isNullOrEmpty(polygon, "name") && (
              <Grow in={polygon.objectid !== undefined}>
                <CardContent
                  className={classes.cardContent}
                  style={{ marginTop: props.charts ? 0 : 10 }}
                >
                  {!props.charts && (
                    <Grid container>
                      {!expanded && (
                        <Grid
                          item
                          xs={expanded && window.width >= 600 ? 6 : 12}
                        >
                          <Typography
                            color="textSecondary"
                            className={
                              expanded && window.width >= 600
                                ? classes.environmentNameExpanded
                                : classes.environmentName
                            }
                          >
                            {polygon.name}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            <Canvas
                              pts={polygon.Points}
                              width="100"
                              height="70"
                            />
                          </Typography>
                          <Typography color="textSecondary">
                            {polygon.area !== null &&
                              (polygon.area / 10000).toFixed(2) + " ha"}
                            {polygon.area === null && "    ha"}
                          </Typography>
                        </Grid>
                      )}
                      {expanded && window.width < 600 && (
                        <Grid item xs={12}>
                          <Typography
                            color="textSecondary"
                            className={
                              expanded && window.width >= 600
                                ? classes.environmentNameExpanded
                                : classes.environmentName
                            }
                          >
                            {polygon.name}
                          </Typography>
                          <Typography variant="h5" component="h2">
                            <Canvas
                              pts={polygon.Points}
                              width="100"
                              height="70"
                            />
                          </Typography>
                          <Typography
                            color="textSecondary"
                            className={classes.hectare}
                          >
                            {polygon.area !== null &&
                              (polygon.area / 10000).toFixed(2) + " ha"}
                            {polygon.area === null && "    ha"}
                          </Typography>
                        </Grid>
                      )}
                      {expanded && window.width >= 600 && (
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={window.width >= 600 ? 6 : 12}>
                              <Typography variant="h5" component="h2">
                                <Canvas
                                  pts={polygon.Points}
                                  width="100"
                                  height="70"
                                />
                              </Typography>
                            </Grid>
                            <Grid item xs={window.width >= 600 ? 6 : 12}>
                              <Grid conatainer justifyContent="center">
                                <Typography
                                  color="textSecondary"
                                  className={
                                    expanded && window.width >= 600
                                      ? classes.environmentNameExpanded
                                      : classes.environmentName
                                  }
                                  style={{ marginTop: 10 }}
                                >
                                  {polygon.name}
                                </Typography>
                                <Typography
                                  color="textSecondary"
                                  style={{ marginTop: 5 }}
                                >
                                  {polygon.area !== null &&
                                    (polygon.area / 10000).toFixed(2) + " ha"}
                                  {polygon.area === null && "    ha"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      {window.width >= 600 && (
                        <Slide
                          direction="up"
                          timeout={2}
                          in={expanded}
                          mountOnEnter
                          unmountOnExit
                        >
                          <Grid item xs={12}>
                            <Grid container>
                              <Grid item xs={12}>
                                <Typography
                                  color="textSecondary"
                                  className={classes.environmentNameExpanded}
                                  style={{ marginTop: 10 }}
                                >
                                  {moment(
                                    ChillHourStore.date.start,
                                    "x"
                                  ).format("DD/MM/YYYY") +
                                    " - " +
                                    moment(ChillHourStore.date.end, "x").format(
                                      "DD/MM/YYYY"
                                    )}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={9}
                                style={{ marginTop: 10, marginBottom: 10 }}
                              >
                                {(ChillHourStore.chill === "_ChillHours" ||
                                  ChillHourStore.chill === "_ChillHours10") &&
                                  t("chillhours.accumulatedChillHours")}
                                {ChillHourStore.chill === "_ColdUnit" &&
                                  "Unidades de Acumuladas"}
                                {ChillHourStore.chill === "_GDD" && "Graus-dia"}
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                style={{
                                  backgroundColor: "#efefef",
                                  borderRadius: 10,
                                  marginTop: 10,
                                  marginBottom: 10,
                                }}
                              >
                                {ChillHourStore.chill !== "_GDD" &&
                                  (polygon.chill || props.info.chill)}
                                {ChillHourStore.chill === "_GDD" &&
                                  gdd !== null &&
                                  (gdd || 0)}
                              </Grid>
                              <Grid item xs={12}>
                                {ChillHourStore.chill === "_ChillHours" && (
                                  <Typography
                                    color="textSecondary"
                                    style={{ marginTop: 5 }}
                                  >{`${t(
                                    "common.chillHours"
                                  )} <= 7.2`}</Typography>
                                )}
                                {ChillHourStore.chill === "_ChillHours10" && (
                                  <Typography
                                    color="textSecondary"
                                    style={{ marginTop: 5 }}
                                  >{`${t(
                                    "common.chillHours"
                                  )} <= 10`}</Typography>
                                )}
                                {ChillHourStore.chill === "_ColdUnit" && (
                                  <Typography
                                    color="textSecondary"
                                    style={{ marginTop: 5 }}
                                  >{`${t(
                                    "common.coldUnit"
                                  )}`}</Typography>
                                )}
                                {ChillHourStore.chill === "_GDD" && (
                                  <Typography
                                    color="textSecondary"
                                    style={{ marginTop: 5 }}
                                  >{`${t(
                                    "chillhours.degreeDayDevelopment"
                                  )}`}</Typography>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Slide>
                      )}
                    </Grid>
                  )}
                  {props.charts && window.width >= 600 && (
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography variant="h5" component="h2">
                          <Canvas
                            pts={polygon.Points}
                            width="100"
                            height="70"
                          />
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          color="textSecondary"
                          className={classes.poligonName}
                        >
                          {polygon.name}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          className={props.charts && classes.sizePolygon}
                        >
                          {polygon.area !== null &&
                            (polygon.area / 10000).toFixed(2) + " ha"}
                          {polygon.area === null && "    ha"}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Grid>
                          <FormControlLabel
                            className={classes.checkbox}
                            control={
                              <CustomCheckbox
                                checked={check}
                                onChange={onCheck}
                                icon={<RadioButtonUncheckedIcon />}
                                checkedIcon={<RadioButtonCheckedIcon />}
                                name="check"
                                color={theme.colors.onPrimaryContainer}
                              />
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  {props.charts && window.width < 600 && (
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography
                          color="textSecondary"
                          className={
                            expanded && window.width >= 600
                              ? classes.environmentNameExpanded
                              : classes.environmentName
                          }
                        >
                          {polygon.name}
                        </Typography>
                        <Typography variant="h5" component="h2">
                          <Canvas
                            pts={polygon.Points}
                            width="100"
                            height="70"
                          />
                        </Typography>
                        <Typography color="textSecondary">
                          {polygon.area !== null &&
                            (polygon.area / 10000).toFixed(2) + " ha"}
                          {polygon.area === null && "    ha"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Grow>
            )}
          </Card>
        </div>
      </Grid>
      <PredizaAlertDialog
        title={t("alert.PredizaAlertDelete")}
        open={flags.dialogIsOpen}
        close={toggleDialog}
        submit={onClickDeletePoligon}
      />
    </Grid>
  )
})
