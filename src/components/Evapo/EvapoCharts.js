import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import moment from "moment";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Calendar from "../Common/CalendarFilter";
import EvapoStore from "../../stores/EvapoStore";
import tokens from "../../stores/CancelTokenList";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Evapo/EvapoCharts";
import PredizaBoxplot from "../PredizaStats/PredizaBoxplot";
import CStore from "../../stores/ChillHourStore";
import { ConstantsUtils } from "../../utils/constantsUtils";
import UserFeedback from "../Common/UserFeedback";
import CropList from "../ChillHour/CropList";
import { GetHeightChart } from "../ChillHour/Util";
import timeserieStore from "../../stores/TimeSerieStore";


export default withStyles(styles)(function EvapoCharts(props) {
    const { classes } = props;
    const tokenList = new tokens();
    const { t } = useTranslation();

    const [list, setList] = useState([]);
    const [data, setData] = useState(null);
    const [environment, setEnvironment] = useState({});
    const [errorResponse, setErrorResponse] = useState("");
    const [cropsCheckbox, setCropsCheckbox] = useState(null);

    const date = useRef();
    const dataRef = useRef(null);

    useEffect(() => {
        bind();
        getEnvironment();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (environment.name) {
            initialize();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment]);

    useEffect(() => {
        if (data) {
            dataRef.current = data;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (list?.length > 0) {
            const newCropsCheckbox = {};

            list.forEach(crop => {
                newCropsCheckbox[crop.objectid] = false;
            })

            setCropsCheckbox(newCropsCheckbox);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    useEffect(() => {
        CStore.emit("cropsCheckbox.change", cropsCheckbox)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropsCheckbox]);

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;

        return (
            <div
                className={className}
                style={{ ...style, top: "25px", right: "10vw" }}
                onClick={onClick}
            />
        );
    }

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;

        return (
            <div
                className={className}
                style={{ ...style, top: "25px", left: "10vw" }}
                onClick={onClick}
            />
        );
    }

    const settings = {
        dots: false,
        infinite: true,
        focusOnSelect: false,
        speed: 500,
        slidesToShow: 1,
        swipeToSlide: false,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    }

    const bind = () => {
        SessionStore.on("environment.change", environmentUpdate);
        CStore.on("time.change", reloadTimeChange);
        timeserieStore.on("cropTimeserie.check", (cropObjectid) => getCropsETCData(cropObjectid))
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", environmentUpdate);
        CStore.removeListener("time.change", reloadTimeChange);
        timeserieStore.removeListener("cropTimeserie.check", (cropObjectid) => getCropsETCData(cropObjectid))

        tokenList.clear();
    }

    const reloadTimeChange = () => {
        cropsEnvironment();
        getETOData();
    }

    const environmentUpdate = () => {
        getEnvironment();
    }

    const initialize = () => {
        let end = moment();
        let start = moment().subtract(7, 'days').startOf('day');

        start.set({ hour: 0 });
        start.set({ minutes: 0 });
        start.set({ seconds: 0 });
        end.set({ hour: 23 });
        end.set({ minutes: 59 });
        end.set({ seconds: 59 });

        start = moment(start).format('x');
        end = moment(end).format('x');

        date.current = { start, end };
        CStore.setDate(date.current)
    }

    const getParameters = (cropId) => {
        return {
            start: CStore.date.start,
            end: CStore.date.end,
            cropId
        };
    }

    const getETOData = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        EvapoStore.getEvapoETO(cancelToken, getParameters(), responseGetETOData);
    }

    const responseGetETOData = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            const seriesETO = response.data.serie.map(serie => {
                return {
                    time: serie.time,
                    eto: serie.value
                }
            });

            seriesETO.forEach((_, index) => {
                seriesETO[index].cumulative = response.data.cumulative[index].value;
            })

            setData(seriesETO);
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const getCropsETCData = (cropObjectid) => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        EvapoStore.getEvapoCropETC(cancelToken, getParameters(cropObjectid), resp => responseGetCropsETCData(resp, cropObjectid));
    }

    const responseGetCropsETCData = (response, cropObjectid) => {
        tokenList.remove(response.id);

        if (response.data) {
            const newData = [...dataRef.current];

            newData.forEach((timeserie, index) => {
                const serieETC = response.data.serie.find(serie => serie.time === timeserie.time);

                if (serieETC) {
                    newData[index][cropObjectid] = serieETC.value;
                }
            })

            setData(newData);
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const getEnvironment = () => {
        setEnvironment({});
        setEnvironment(SessionStore.getEnvironmentDetail());
    }

    const cropsEnvironment = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        CStore.getListCropsEnvironment(cancelToken, responseCropsEnvironment);
    }

    const responseCropsEnvironment = (response) => {
        tokenList.remove(response.id);

        if (response.data?.length > 0) {
            const cropsList = response.data.map((crop, index) => {
                return {
                    ...crop,
                    color: index < 10 ? ConstantsUtils.ColorsCrop[index] : ConstantsUtils.ColorsCrop[index % 10]
                }
            })

            setList(cropsList)
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const getDate = (start, end) => {
        date.current = { start, end };
        CStore.setDate({ start: start, end: end });
    }

    const getValue = (value) => {
        if (value === null || value === undefined) {
            return "";
        }

        const val = parseFloat(value);

        if (isNaN(val)) {
            return "";
        }

        return value.toFixed(2) + t('common.mmPerDay');
    }

    const getBoxplotEto = () => {
        return (
            <Grid>
                <Grid item xs={12} className={classes.chartName}>
                    {t("measures._ETO")}
                </Grid>
                <Grid item xs={12} className={classes.centerH}>
                    <PredizaBoxplot
                        sizes={{ height: 750, width: 500 }}
                        measure={"_ETO"}
                    />
                </Grid>
            </Grid>
        );
    }

    const getTimeserieEto = () => {
        return (
            <Grid>
                <ResponsiveContainer width="100%" height={GetHeightChart()}>
                    <ComposedChart data={data}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="time" tickFormatter={(unixTime) => moment(unixTime, "x").format("DD/MM")} />
                        <YAxis />
                        <Tooltip formatter={getValue} labelFormatter={t => moment(t, "x").format("DD/MM")} />

                        <Bar type="monotone" dataKey="eto" name="ETO" fill="#2196f3" dot={false} />
                        <Line
                            type="monotone"
                            key="cumulative"
                            dataKey="cumulative"
                            name="Acumulado"
                            stroke="#db5d27"
                            dot={false}
                        />
                        {
                            cropsCheckbox && list && list.map(crop => {
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
                    </ComposedChart>
                </ResponsiveContainer>
            </Grid>
        );
    }

    return (
        <Grid container className={classes.containerExterno}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container className={classes.paper}>
                                    <Grid
                                        item
                                        xs={12}
                                        style={{ padding: "10px", fontSize: "16px" }}
                                    >
                                        {environment.name && environment.name.toUpperCase()}
                                    </Grid>
                                    {list?.length > 0 && (
                                        <Grid item xs={12} className={classes.talhoesContainer}>
                                            <CropList crops={list} handleCropsCheckbox={setCropsCheckbox} />
                                        </Grid>
                                    )}
                                    <Calendar presets fixed get={getDate} date={CStore.date} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={9} className={classes.chartContainer}>
                        <Slider {...settings}>
                            <Grid id="OtherChart">{getTimeserieEto()}</Grid>
                            <Grid id="EvapoChartBoxplot">{getBoxplotEto()}</Grid>
                        </Slider>
                    </Grid>
                </Grid>
            </Grid>
            <UserFeedback error={errorResponse} setError={setErrorResponse} />
        </Grid>
    )
})