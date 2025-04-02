import React, { useState, useEffect } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ErrorBar,
} from "recharts";

import Grid from "@material-ui/core/Grid";

import ComposedChart from "../Common/Chart/ComposedChartContainer";
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";
import DeviceStore from "../../stores/DeviceStore";
import { useTranslation } from "react-i18next";

export default function ReportDayNight(props) {
  const [data, setData] = useState([]);
  const [ylabel, setLegend] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    init();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (props.zoning !== null && props.zoning !== undefined) {
      const pdata = props.data;
      setTimeout(() => {
        setData(getDayNightZoning(pdata));
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.zoning]);

  const init = () => {
    if (props.zoning === null || props.zoning === undefined) {
      setData(getData());
    }
    setLegend(getLegend());
  };

  const clear = () => {
    setData([]);
    let f = (" " + ylabel)[0];

    setLegend(f === " " ? null : null);
  };

  const getData = () => {
    const pdata = props.data;
    if (!toolsUtils.isEmptyString(pdata, "devices.daynight")) {
      return getDayNight(pdata);
    }

    return [];
  };

  const getLegend = () => {
    if (
      !toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") &&
      !toolsUtils.isEmptyString(props.measure.meta.ylegend)
    ) {
      return {
        value: props.measure.meta.ylegend,
        angle: -90,
        position: "center",
      };
    }

    if (
      !toolsUtils.isNullOrEmpty(props, "measure.name") &&
      !toolsUtils.isEmptyString(props.measure.name)
    ) {
      return { value: props.measure.name, angle: -90, position: "center" };
    }

    return null;
  };

  const getDayNight = (pdata) => {
    const env = SessionStore.getEnvironmentDetail();
    let data = [];
    let obj = {};
    pdata.devices.daynight.forEach((value) => {
      obj = {};
      obj.name = toolsUtils.getDeviceName(
        DeviceStore.getDeviceDetail(value.device)
      );
      obj.day = value.value.day;
      obj.night = value.value.night;
      if (env.zoning !== null && env.zoning !== undefined) {
        obj.nightSoundLevel = env.zoning.nightSoundLevel;
        obj.daySoundLevel = env.zoning.daySoundLevel;
      }
      if (value.stddev !== null && value.stddev !== undefined) {
        obj.erroryday = [value.stddev.day, value.stddev.day];
        obj.erroynight = [value.stddev.night, value.stddev.night];
      }
      data.push(obj);
    });

    return data;
  };

  const getDayNightZoning = (pdata) => {
    let data = [];
    let obj = {};
    pdata.devices.daynight.forEach((value) => {
      obj = {};
      obj.name = toolsUtils.getDeviceName(
        DeviceStore.getDeviceDetail(value.device)
      );
      obj.day = value.value.day;
      obj.night = value.value.night;
      if (props.zoning !== null && props.zoning !== undefined) {
        obj.nightSoundLevel = props.zoning.nightSoundLevel;
        obj.daySoundLevel = props.zoning.daySoundLevel;
      }
      if (value.stddev !== null && value.stddev !== undefined) {
        obj.erroryday = [value.stddev.day, value.stddev.day];
        obj.erroynight = [value.stddev.night, value.stddev.night];
      }
      data.push(obj);
    });
    return data;
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <ComposedChart data={data} margin={{ top: 15, bottom: 5 }}>
          <XAxis
            dataKey="name"
            domain={["auto", "auto"]}
            name="Data"
            padding={{ left: 0, rigth: 0, top: 0, bottom: 0 }}
          />
          <YAxis tickFormatter={(value) => parseFloat(value).toFixed(0)} type="number" />

          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => parseFloat(value).toFixed(2)} />

          <Bar
            name={t("common.day")}
            dataKey="day"
            fill="#8884d0"
            legendType="none"
          >
            <ErrorBar
              dataKey="erroryday"
              width={10}
              strokeWidth={10}
              stroke="green"
            />
          </Bar>

          <Bar
            name={t("common.night")}
            dataKey="night"
            fill="#231abd"
            legendType="none"
          >
            <ErrorBar
              dataKey="erroynight"
              width={10}
              strokeWidth={10}
              stroke="green"
            />
          </Bar>

          {!toolsUtils.isNullOrEmpty(props, "zoning") && (
            <Line
              dots={false}
              dataKey="daySoundLevel"
              stroke="#fc4e03"
              name="Limite Diurno"
            />
          )}
          {!toolsUtils.isNullOrEmpty(props, "zoning") && (
            <Line
              dots={false}
              dataKey="nightSoundLevel"
              stroke="#002bff"
              name="Limite Noturno"
            />
          )}
        </ComposedChart>
      </Grid>
    </Grid>
  );
}
