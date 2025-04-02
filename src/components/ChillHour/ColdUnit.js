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
import { t } from 'i18next';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid"

import tokens from "../../stores/CancelTokenList";
import ChillHoursStore from '../../stores/ChillHourStore';
import toolsUtils from '../../utils/toolsUtils';
import styles from "../../styles/Evapo/EvapoCharts";
import { GetHeightChart } from './Util';


export default withStyles(styles)(function ColdUnit(props) {
    const tokenList = new tokens();

    const [data, setData] = useState(null);
    const [crops, setCrops] = useState(null);
    const [flagData, setFlagData] = useState(false);
    const [cropsCheckbox, setCropsCheckbox] = useState(null);

    const refData = useRef(null)

    useEffect(() => {
        bind();

        return clear
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    }

    const bind = () => {
        ChillHoursStore.on("time.change", updateDataChart);
    }

    const updateDataChart = () => {
        refData.current = null;
        getTimeSerie({ objectid: "hf" });
    }

    const getParameters = () => {
        return {
            start: ChillHoursStore.date.start,
            end: ChillHoursStore.date.end,
        }
    }

    const getTimeSerie = (object) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ChillHoursStore.getColdUnitPolygon(getParameters(), cancelToken, (response) => { getTimeSerieResponse(response, object) });
    }

    const getTimeSerieResponse = (response, object) => {
        tokenList.remove(response.id);

        let d = []

        if (!toolsUtils.isNullOrEmpty(response, "data.serie")) {
            if (refData.current === null) {
                response.data.serie.forEach((e) => {

                    if (e.value !== null && e.value !== undefined) {
                        let obj = e
                        obj[object.objectid] = e.value
                        d.push(obj)
                    }
                });

                refData.current = d
                setData(d);
                setFlagData(false);
                setFlagData(true);

                return
            }

            d = [];

            refData.current.forEach((e, i) => {
                if (e.value !== null && e.value !== undefined && response.data.serie[i] !== null && response.data.serie[i].value !== null && response.data.serie[i].value !== undefined) {
                    let obj = e
                    obj[object.objectid] = response.data.serie[i].value
                    d.push(obj)
                }
            });

            setData(d);
            setFlagData(false);
            setFlagData(true);
        }

        if (response?.status === 404) {
            props.getStatusError({
                status: response.status.toString(),
                message: t('alert.messageNoResultsChillhour'),
            });
        }
    }

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value)

        if (isNaN(val)) {
            return ""
        }

        return value.toFixed(2)
    }

    if (ChillHoursStore.date === null || ChillHoursStore.date === undefined) {
        return ""
    }

    return (
        <Grid>
            <ResponsiveContainer width="100%" height={GetHeightChart()}>
                <ComposedChart
                    data={data}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis dataKey="time" tickFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM")} />
                    <YAxis />
                    <Tooltip formatter={getValue} labelFormatter={t => moment(t, "x").format("DD/MM")} />
                    <Bar type="monotone" dataKey={"hf"} name={t('common.coldUnit')} fill={"#2196f3"} />
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