import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Line } from 'recharts';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

import toolsUtils from "../../../utils/toolsUtils";
import SessionStore from "../../../stores/SessionStore";
import ComposedChart from "./ComposedChartContainer";
import "../../../css/chart.css";


export default function CustomBar(props) {
    const { i18n: { language }, t } = useTranslation();

    const [domainMax, setDomainMax] = useState('dataMax')
    const [domainMin, setDomainMin] = useState('dataMin')
    const [data, setData] = useState([])
    const [keys, setKeys] = useState([])

    useEffect(() => {
        initData();
        bind();
        moment.locale(language.toLowerCase());

        return clear
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (props.ydomain?.toString().toLowerCase() === SessionStore.getScales()[0].value) {
            setDomainMin(0)
            setDomainMax(props.ydomain)
        } else {
            setDomainMin('dataMin')
            setDomainMax('dataMax')
        }

    }, [props.ydomain])

    useEffect(() => {
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])

    const bind = () => {
        SessionStore.on("scale.change", scaleChange)
    }

    const clear = () => {
        SessionStore.removeListener("scale.change", scaleChange)
    }

    const scaleChange = () => {
        if (SessionStore.scale.toLowerCase() === SessionStore.getScales()[0].value) {
            setDomainMin(0)
            setDomainMax(SessionStore.scale)
        } else {
            setDomainMin('dataMin')
            setDomainMax('dataMax')
        }
    }

    const addPercentilValues = () => {
        if (props.percentil !== undefined) {
            let keys = Object.keys(props.percentil);
            let data = [];
            data = props.data.map((val) => {
                let v = val;
                keys.forEach((key) => {
                    v[key.toUpperCase()] = props.percentil[key]
                })
                return v;
            });
            setKeys(Object.keys(props.percentil))
            setData(data)
            return
        }
    }

    const initData = () => {
        if (!toolsUtils.isNullOrEmpty(props, "data") && props.data.length > 0) {
            if (!toolsUtils.isNullOrEmpty(props, "percentil")) {
                addPercentilValues()
                return
            }
            else {
                setData(props.data)
            }
            setKeys([])
            return

        }
        setKeys([])
        setData([])
    }

    const getLabel = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value)

        if (isNaN(val)) {
            return ""
        }
        if (props.context === 'InmetEvapo') {
            return value.toFixed(1)
        }
        return value.toFixed(0)
    }

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value)

        if (isNaN(val)) {
            return ""
        }

        if (!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") && !toolsUtils.isEmptyString(props.measure.meta.ylegend)) {
            return value.toFixed(2) + " " + props.measure.meta.ylegend
        }

        return value.toFixed(2)
    }

    const formatDate = (unixTime) => {
        if (props.context === "InmetEvapo")
            return moment(unixTime, "x").format("DD/MM");
        else
            return moment(unixTime, "x").format("DD/MM HH:mm");
    }

    const CustomBar = (props) => {
        const { x, y, width, height, payload } = props;
        const fillColor = payload.predict ? '#ff7300' : '#8884d8'; // Cor diferente para "predict: true"

        // Ajuste para valores negativos
        const adjustedY = height < 0 ? y + height : y;
        const adjustedHeight = Math.abs(height);

        return <rect x={x} y={adjustedY} width={width} height={adjustedHeight} fill={fillColor} />;
    };

    return (
        <ComposedChart
            width={300}
            data={data}
            barGap="0"
            barCategoryGap="0"
            isAnimationActive={false}
            margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
            syncId="chartlist"
        >
            <Bar
                dataKey="value"
                fill="#8884d0"
                shape={<CustomBar />}
                name={props.measure?.name ? t("measures." + props.measure.name) : ""}
            />
            <XAxis
                dataKey="time"
                domain={["auto", "auto"]}
                name="Data"
                tickFormatter={(unixTime) => formatDate(unixTime)}
                padding={{ left: 0, rigth: 0, top: 0, bottom: 0 }}

            />
            {props.context !== 'InmetEvapo' &&
                <YAxis
                    dataKey="value"
                    padding={{ left: 0, rigth: 0, bottom: 0, top: 0 }}
                    tickFormatter={getLabel}
                    domain={[domainMin, domainMax]}
                />
            }

            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
                formatter={getValue}
                labelFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM HH:mm")}
            />

            {props.percentil !== undefined && keys[0] !== undefined
                ? <Line dot={false} dataKey={keys[1].toUpperCase()} stroke="#ff7300" />
                : ""}
            {props.percentil !== undefined && keys[1] !== undefined
                ? <Line dot={false} dataKey={keys[2].toUpperCase()} stroke="#fc4e03" />
                : ""}

            <Line dot={false} isAnimationActive={false} dataKey={"max"} stroke="#ff7300" />
            <Line dot={false} isAnimationActive={false} dataKey={"min"} stroke="#fc4e03" />
            <Line dot={false} isAnimationActive={false} dataKey={"cumulative"} stroke="#008800" />
        </ComposedChart>
    );
}