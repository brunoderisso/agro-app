import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import moment from 'moment'

import {withStyles} from "@material-ui/core"

import "../../css/chart.css";


const style = {
    chart:{
        height:"200px!important"
    }
};

//PROPS
//data - [{key: value}] - [data, data1, ...]
//width - int - valor
export default withStyles(style) (function PredizaLineChart(props) {
    const {classes} = props;
    const { t } = useTranslation();

    return (
        <ResponsiveContainer className={classes.chart}>
            <LineChart
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                data={props.data}
                barGap="0"
                barCategoryGap="0"
                isAnimationActive={false}

            >
                <XAxis
                    dataKey="time"
                    domain={["auto", "auto"]}
                    name="Data"
                    tickFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM HH:mm")}
                    padding={{ left: 0, rigth: 0, top: 0, bottom: 0 }}

                />
                <YAxis
                    dataKey={t("common.valueText")}
                    padding={{ left: 0, rigth: 0, bottom: 0, top: 0 }}
                    tickFormatter={(value) => parseFloat(value).toFixed(0)}
                    domain={['auto', 'auto']}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                    formatter={(value) => parseFloat(value).toFixed(2)}
                    labelFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM HH:mm")}
                />
                <Line dot={false} type="monotone" dataKey={t("common.valueText")} stroke="#2196f3" />
            </LineChart>
        </ResponsiveContainer>
    );
})
