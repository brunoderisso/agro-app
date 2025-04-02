import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid"

import ChillHoursStore from '../../stores/ChillHourStore';
import styles from "../../styles/Evapo/EvapoCharts";
import { GetHeightChart } from './Util';

import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart
} from 'recharts';
import moment from 'moment';


export default withStyles(styles)(function GDD(props) {
    const [data, setData] = useState(null);
    const [crops, setCrops] = useState(null);
    const [cropsCheckbox, setCropsCheckbox] = useState(null);

    useEffect(() => {
        setCrops(props.crops)
    }, [props.crops]);

    useEffect(() => {
        if (props.cropsCheckbox) {
            setCropsCheckbox(props.cropsCheckbox);
        }
    }, [props.cropsCheckbox]);

    useEffect(() => {
        if (props.data) {
            setData(props.data);
        }
    }, [props.data]);

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value)

        if (isNaN(val)) {
            return "";
        }

        return value.toFixed(2);
    }

    if (ChillHoursStore.date === null || ChillHoursStore.date === undefined) {
        return "";
    }

    return (
        <Grid>
            <ResponsiveContainer width="100%" height={GetHeightChart()}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM")} />
                    <YAxis />
                    <Tooltip formatter={getValue} labelFormatter={t => moment(t, "x").format("DD/MM")} />
                    {
                        cropsCheckbox && crops && crops.map(crop => {
                            return <>
                                {cropsCheckbox[crop.objectid] &&
                                    <Line
                                        type="monotone"
                                        key={crop.objectid}
                                        dataKey={crop.objectid}
                                        name={crop.crop_name + ' ' + crop.crop_variety}
                                        stroke={crop.color}
                                        dot={false}
                                    />

                                }
                            </>
                        })
                    }
                </LineChart>
            </ResponsiveContainer>
        </Grid>
    )
})