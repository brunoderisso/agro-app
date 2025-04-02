import React, { useState, useEffect, useRef } from 'react';
import {
    Bar,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line
} from 'recharts';
import moment from 'moment';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid"

import tokens from "../../stores/CancelTokenList";
import TimeSerieStore from '../../stores/TimeSerieStore';
import ChillHoursStore from '../../stores/ChillHourStore';
import toolsUtils from '../../utils/toolsUtils';
import styles from "../../styles/Evapo/EvapoCharts";
import { GetHeightChart } from './Util';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function ChillingHoursSum(props) {
    const tokenList = new tokens();
    const { t } = useTranslation();

    const [data, setData] = useState(null);
    const [crops, setCrops] = useState(null);
    const [flagData, setFlagData] = useState(false);
    const [cropsCheckbox, setCropsCheckbox] = useState(null);

    const refData = useRef(null);

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCrops(props.crops)
    }, [props.crops]);

    useEffect(() => {
        if (props.cropsCheckbox) {
            setCropsCheckbox(props.cropsCheckbox);
        }
    }, [props.cropsCheckbox]);

    useEffect(() => {
        if (flagData && crops?.length > 0) {
            const newData = [...data];

            crops.forEach(crop => {
                if (crop.crop_chillhours) {
                    newData.forEach((_, index) => {
                        newData[index][crop.crop_objectid] = crop.crop_chillhours;
                    })
                }
            })

            setData(newData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flagData, crops]);

    const clear = () => {
        ChillHoursStore.removeListener("time.change", updateDataChart);

        tokenList.clear();
    };

    const bind = () => {
        ChillHoursStore.on("time.change", updateDataChart);
    }

    const updateDataChart = () => {
        refData.current = null;
        getTimeSerie({ objectid: "hf" });
    }

    const getParameters = () => {
        return {
            measure: "7",
            start: ChillHoursStore.date.start,
            end: ChillHoursStore.date.end,
        };
    }

    const getTimeSerie = (object) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        TimeSerieStore.getTimeSerieChillHour(cancelToken, getParameters(), (resp) => { getTimeSerieResponse(resp, object) });
    }

    const getTimeSerieResponse = (response, object) => {
        tokenList.remove(response.id);

        if (!toolsUtils.isNullOrEmpty(response, "data.serie")) {
            let d = [];

            if (refData.current === null) {
                response.data.serie.forEach((e) => {
                    if (e.value) {
                        let obj = e;
                        obj[object.objectid] = e.value;
                        d.push(obj);
                    }
                });

                refData.current = d;
                setData(d);
                setFlagData(false);
                setFlagData(true);

                return;
            }
        } else {
            setData(null);

            if (response?.status) {
                props.getStatusError({
                    status: response.status.toString(),
                    message: null,
                });
            }
        }
    }

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value)

        if (isNaN(val)) {
            return "";
        }

        return value.toFixed(2) + t('common.hours');
    }

    if (ChillHoursStore.date === null || ChillHoursStore.date === undefined) {
        return "";
    }

    return (
        <Grid>
            <ResponsiveContainer width="100%" height={GetHeightChart()}>
                <ComposedChart data={data}>
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="time" tickFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM")} />
                    <YAxis />
                    <Tooltip formatter={getValue} labelFormatter={t => moment(t, "x").format("DD/MM")} />

                    <Bar type="monotone" dataKey="hf" name={t('common.chillHours')} fill="#2196f3" dot={false} />
                    {
                        cropsCheckbox && crops && crops.map(crop => {
                            return <>
                                {crop.crop_chillhours && cropsCheckbox[crop.objectid] &&
                                    <Line
                                        type="monotone"
                                        key={crop.crop_objectid}
                                        dataKey={crop.crop_objectid}
                                        name={crop.crop_name + ' ' + crop.crop_variety}
                                        stroke={crop.color}
                                        dot={false}
                                    />

                                }
                            </>
                        })
                    }
                </ComposedChart>
            </ResponsiveContainer>
        </Grid>

    )
})