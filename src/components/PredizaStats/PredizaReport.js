import React, { useState, useEffect, useRef } from "react";
import Timer from "react-interval";
import { useTranslation } from "react-i18next";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Grow } from "@material-ui/core";

import ReportChartL from "./ReportL";
import ReportChartDayNigth from "./ReportDayNight";
import ReportStore from "../../stores/ReportStore";
import toolsUtils from "../../utils/toolsUtils";
import MeasureStore from "../../stores/MeasureStore";
import DeviceStore from "../../stores/DeviceStore";
import EnvironmentStore from "../../stores/EnvironmentStore";
import SessionStore from "../../stores/SessionStore";
import TimeSerieStore from "../../stores/TimeSerieStore";
import Style from "../../styles/Report/PredizaReport";
import BoxPlot from "./PredizaBoxplot";
import Histogram from "./PredizaHistogram";
import useResize from "../../Hook/useResize";
import tokens from "../../stores/CancelTokenList";
import sizes from "../../styles/Utils/DashboardTheme";
import MUIReportTable from "../MUIReportTable";

export default withStyles(Style)(function PredizaReport(props) {
  const tokenList = new tokens();
  const { classes } = props;
  const { t } = useTranslation();

  const measure = useRef({});

  const [scale, setScale] = useState(null);
  const [zoning, setZoning] = useState(null);

  const [devices, setDevices] = useState(null);
  const [environment, setEnvironment] = useState(null);
  const [timerPeriod, setTimerPeriod] = useState(SessionStore.timeRefresh);

  const [data, setData] = useState([]);
  const [timeSerie, setTimeSerie] = useState([]);

  const window = useResize();

  useEffect(() => {
    bind();
    init();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getLimit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measure.current]);

  const getLimit = () => {
    if (
      !toolsUtils.isNullOrEmpty(measure.current, "name") &&
      (measure.current.name.toUpperCase() === "NOISE" ||
        measure.current.name.toUpperCase() === "LAEQ") &&
      zoning === null
    ) {
      if (
        SessionStore.getEnvironmentDetail().device !== null &&
        SessionStore.getEnvironmentDetail().device !== undefined
      ) {
        getDeviceControlLimit(SessionStore.getEnvironmentDetail().device);
      } else {
        getEnvironmentZoning();
      }
    } else {
      setZoning(null);
    }
  };

  const clear = () => {
    MeasureStore.removeListener("measure_init", measureInit);
    MeasureStore.removeListener("change.measure", updateData);
    SessionStore.removeListener("change.meta", changeMeta);
    SessionStore.removeListener("function.change", updateData);
    SessionStore.removeListener("fill.change", updateData);
    SessionStore.removeListener("scale.change", onScaleChange);
    SessionStore.removeListener("time.change", updateData);
    SessionStore.removeListener("environment.change", onEnvironmenteChange);
    SessionStore.removeListener("time.reload", onTimeReload);

    tokenList.clear();
  };

  const bind = () => {
    MeasureStore.addListener("measure_init", measureInit);
    MeasureStore.addListener("change.measure", updateData);
    SessionStore.addListener("change.meta", changeMeta);
    SessionStore.addListener("function.change", updateData);
    SessionStore.addListener("fill.change", updateData);
    SessionStore.addListener("scale.change", onScaleChange);
    SessionStore.addListener("time.change", updateData);
    SessionStore.addListener("environment.change", onEnvironmenteChange);
    SessionStore.addListener("time.reload", onTimeReload);
  };

  const changeMeta = () => {
    setScale(SessionStore.scale);
    measure.current = SessionStore.getMeasure(MeasureStore.measures[0]);
    updateData();
  };

  const onTimeReload = (time) => {
    setTimerPeriod(time);
  };

  const measureInit = () => {
    SessionStore.setWithMeta(SessionStore.getMeasure(MeasureStore.measures[0]));
  };

  const onScaleChange = () => {
    setScale(SessionStore.scale);
  };

  const toParameters = () => {
    return {
      measure: MeasureStore.measures[0],
      start: SessionStore.getTime().start,
      end: SessionStore.getTime().end,
      function: SessionStore.function,
      group: "1h",
      fill: SessionStore.fill,
    };
  };

  const onEnvironmenteChange = () => {
    setDevices([]);
    setEnvironment(null);
    setData([]);
    setTimeSerie([]);
    init();
  };

  const init = () => {
    MeasureStore.init("report");
    setDevices(SessionStore.getDevices());
    setEnvironment(SessionStore.getEnvironmentDetail());
  };

  const updateData = () => {
    measure.current = SessionStore.getMeasure(MeasureStore.measures[0]);
    getData();
    getTimeSerie();
    getLimit();
  };

  const sortFunctionDN = (a, b) => {
    if (
      toolsUtils.getDeviceName(DeviceStore.getDeviceDetail(a.device)) >
      toolsUtils.getDeviceName(DeviceStore.getDeviceDetail(b.device))
    ) {
      return 1;
    }
    if (
      toolsUtils.getDeviceName(
        DeviceStore.getDeviceDetail(a.device) <
          toolsUtils.getDeviceName(DeviceStore.getDeviceDetail(b.device))
      )
    ) {
      return -1;
    }
    return 0;
  };

  const getData = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    ReportStore.getReportSerie(cancelToken, toParameters(), responseGetData);
  };

  const responseGetData = (response) => {
    tokenList.remove(response.id);
    if (
      !toolsUtils.isNullOrEmpty(response, "data.devices.daynight") &&
      response.data.devices.daynight.length > 0
    ) {
      response.data.devices.daynight.sort(sortFunctionDN);
    }
    if (response.data !== null) {
      setData(response.data);
    }
  };

  const downloadData = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    ReportStore.downloadSerie(cancelToken, toParameters(), responseDownload);
  };

  const responseDownload = (response) => {
    tokenList.remove(response.id);

    if (response.data !== null) {
      let name = "arquivo.csv";
      if (
        response.headers !== null &&
        response.headers["content-disposition"] !== undefined &&
        response.headers["content-disposition"].split("filename=").length >= 1
      ) {
        name = response.headers["content-disposition"].split("filename=")[1];
      }

      var hiddenElement = document.createElement("a");
      hiddenElement.href =
        "data:text/csv;charset=utf-8," + encodeURI(response.data);
      hiddenElement.target = "_blank";
      hiddenElement.download = name;
      hiddenElement.click();
    }
  };

  const getTimeSerie = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    TimeSerieStore.getTimeSerie_WT(
      cancelToken,
      toParameters(),
      responseGetTimeSerie
    );
  };

  const responseGetTimeSerie = (response) => {
    tokenList.remove(response.id);
    if (response.data !== null) {
      setTimeSerie(response.data);
    }
  };

  const getDeviceControlLimit = (device) => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    DeviceStore.getLimitControl(device, cancelToken, responseGetDeviceLimit);
  };

  const responseGetDeviceLimit = (response) => {
    tokenList.remove(response.id);
    if (
      response.data !== null ||
      response.data !== undefined ||
      response.data.length > 0
    ) {
      if (response.data[0].value !== undefined) {
        let z = {
          nightSoundLevel: response.data[0].value.night,
          daySoundLevel: response.data[0].value.day,
        };
        setZoning(z);
      }
    }
  };

  const getEnvironmentZoning = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    EnvironmentStore.getEnvironmentZoning(
      cancelToken,
      responseGetEnvironmentZoning
    );
  };

  const responseGetEnvironmentZoning = (response) => {
    tokenList.remove(response.id);
    if (response.data !== null) {
      setZoning(response.data);
    }
  };

  const refresh = () => {
    let diff = SessionStore.getTimeDiff() / 3600000;
    SessionStore.setTime(diff);
  };

  const getChart = () => {
    return (
      <Grid item xs={12} className={classes.chartl}>
        <Grid container justifyContent="center">
          <Typography variant="h4" gutterBottom>
            {getTitle({ environment: true })}
          </Typography>
          <Grid item xs={12}>
            {!toolsUtils.isNullOrEmpty(data, "environment") && (
              <ReportChartL
                percentil={data.environment.percentiles}
                measure={measure.current}
                data={timeSerie}
                refresh={refresh}
                update={refresh}
                ydomain={scale}
                function={SessionStore.function}
                fill={SessionStore.fill}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getDayNightChart = () => {
    return (
      <Grid item xs={12} className={classes.chartdn}>
        <Grid container justifyContent="center">
          <Typography variant="h4" gutterBottom>
            {" "}
            {getTitle({
              string: `${t("common.perDevice").toUpperCase()}`,
            })}{" "}
          </Typography>
          <Grid item xs={12}>
            {!toolsUtils.isNullOrEmpty(data, "environment.percentiles") && (
              <ReportChartDayNigth
                percentil={data.environment.percentiles}
                zoning={zoning}
                measure={measure.current}
                data={data}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getPlots = () => {
    return (
      <Grid item xs={12} className={classes.chartl}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center">
              <Typography variant="h4" gutterBottom>
                {getTitle({ environment: true })}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={4}>
            <Grid container>
              {!toolsUtils.isNullOrEmpty(window, "width") && (
                <BoxPlot sizes={getSize()} />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={6} xl={4}>
            <Grid container>
              {!toolsUtils.isNullOrEmpty(window, "width") && (
                <Histogram sizes={getSize()} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getSize = () => {
    if (window.width <= sizes.xs) {
      return { height: 330, width: 330 };
    }

    if (window.width > sizes.xs && window.width <= sizes.sm) {
      return { height: 240, width: 240 };
    }

    if (window.width > sizes.sm && window.width <= sizes.md) {
      return { height: 335, width: 335 };
    }

    if (window.width > sizes.md && window.width <= sizes.lg) {
      return { height: 370, width: 370 };
    }

    if (window.width > sizes.lg && window.width <= sizes.xl) {
      return { height: 450, width: 450 };
    }

    if (window.width > sizes.xl && window.width <= sizes.xxl) {
      return { height: 470, width: 470 };
    }

    if (window.width >= sizes.xxl) {
      return { height: 500, width: 500 };
    }
  };

  const getDeviceBoxplot = (element) => {
    return (
      <Grid
        key={element.deveui}
        item
        xs={12}
        sm={6}
        xl={4}
        className={classes.devicescard}
      >
        <Grid container className={classes.devicesitem}>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              {!toolsUtils.isEmptyString(SessionStore.function) &&
                SessionStore.function !== null &&
                !toolsUtils.isNullOrEmpty(environment, "name") && (
                  <Typography
                    variant="h4"
                    gutterBottom
                    className={classes.title}
                  >
                    {getTitle({ device: toolsUtils.getDeviceName(element) })}
                  </Typography>
                )}
            </Grid>
          </Grid>
          {!toolsUtils.isNullOrEmpty(window, "width") && (
            <BoxPlot device={element.deveui} sizes={getSize()} />
          )}
        </Grid>
      </Grid>
    );
  };

  const getTable = () => {
    return (
      <Grid item xs={12} className={classes.table}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Typography variant="h4" gutterBottom>
                {getTitle({ environment: true })}
              </Typography>
            </Grid>
          </Grid>
          <Grid className={classes.csvButton}>
            <Grid container justifyContent="center">
              <Button color="primary" onClick={downloadData}>
                Download CSV
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {!toolsUtils.isNullOrEmpty(data, "devices.rows") &&
          !toolsUtils.isEmptyString(measure.current) && (
            <MUIReportTable data={data.devices.rows} />
          )}
      </Grid>
    );
  };

  const getTitle = (append) => {
    let label = "";

    if (
      !toolsUtils.isNullOrEmpty(measure.current, "meta.title") &&
      !toolsUtils.isEmptyString(measure.current.meta.title)
    ) {
      label = label + t(`measures.${measure.current.name}`);
    }
    if (
      !toolsUtils.isNullOrEmpty(append, "string") &&
      !toolsUtils.isEmptyString(append.string)
    ) {
      label = label + " " + append.string.toUpperCase();
      return label;
    }
    if (
      append.environment &&
      !toolsUtils.isNullOrEmpty(environment, "name") &&
      !toolsUtils.isEmptyString(environment.name)
    ) {
      label =
        label +
        ` ${t("common.at").toUpperCase()} ` +
        environment.name.toUpperCase();
      return label;
    }
    if (
      !toolsUtils.isNullOrEmpty(append, "device") &&
      !toolsUtils.isEmptyString(append.device)
    ) {
      label =
        label +
        ` ${t("common.at").toUpperCase()} ` +
        append.device.toUpperCase();
      return label;
    }

    return label;
  };

  if (
    devices === null ||
    scale === null ||
    measure.current === null ||
    environment === null ||
    toolsUtils.isNullOrEmpty(measure.current, "name") ||
    toolsUtils.isEmptyString(measure.current.name)
  ) {
    return <Grid></Grid>;
  }

  return (
    <Grid container>
      <Grid item xs={12} style={{ overflowX: "hidden" }}>
        <Grid container style={{ maxWidth: "95%" }}>
          <Grow in={data.length !== 0} mountOnEnter unmountOnExit>
            <Grid container>
              {measure.current && getChart()}
              {getDayNightChart()}
              {getPlots()}
              {devices.length > 0 &&
                devices.sort(DeviceStore.sortFunction).map((element) => {
                  return getDeviceBoxplot(element);
                })}
              {getTable()}
            </Grid>
          </Grow>
          <Timer
            timeout={timerPeriod}
            enabled={timerPeriod > 0}
            callback={refresh}
          />
        </Grid>
      </Grid>
    </Grid>
  );
});
