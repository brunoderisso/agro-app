import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment"

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import toolsUtils from "../../utils/toolsUtils"
import ChillHourStore from "../../stores/ChillHourStore"
import CalendarFilter from "./CalendarFilter"
import EnvironmentStore from "../../stores/EnvironmentStore"
import tokens from "../../stores/CancelTokenList";
import SessionStore from "../../stores/SessionStore"
import styles from "../../styles/ChillHour/ChillHourCharts";
import ChartChill from "./ChillingHoursSum"
import ChartChill10 from "./ChillingHours10Sum"
import ColdUnit from "./ColdUnit"
import UserFeedback from '../Common/UserFeedback';
import CropList from "./CropList";
import { ConstantsUtils } from "../../utils/constantsUtils";
import GDD from "./GDD";


export default withStyles(styles)(function ChillHourCharts(props) {
    const { classes } = props;
    const { t } = useTranslation();
    const tokenList = new tokens();

    const [dataGDD, setDataGDD] = useState([]);
    const [list, setList] = useState([]);
    const [flagList, setFlagList] = useState(false);
    const [environmentList, setEnvironmentList] = useState({});
    const [environment, setEnvironment] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [errorResponse, setErrorResponse] = useState("");
    const [errorMessageResponse, setErrorMessageResponse] = useState(null);
    const [cropsCheckbox, setCropsCheckbox] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const date = useRef();
    const flagTimeSerieGDDRef = useRef(false);

    useEffect(() => {
        getEnvironments();
        bind();
        EnvironmentStore.getEnvironmentAccount(SessionStore.getEnvironment(), getEnvironment);

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeSlide === 3 && list?.length > 0) {
            const newCropsCheckbox = {};

            list.forEach(crop => {
                newCropsCheckbox[crop.objectid] = true;
            })

            setCropsCheckbox(newCropsCheckbox);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSlide]);

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
        if (list?.length > 0 && flagList && !flagTimeSerieGDDRef.current) {
            flagTimeSerieGDDRef.current = true;
            getTimeSerieGDD(list);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list, flagList]);

    useEffect(() => {
        if (environment.name !== undefined) {
            initialize();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environment]);

    useEffect(() => {
        ChillHourStore.emit("cropsCheckbox.change", cropsCheckbox)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropsCheckbox]);

    const bind = () => {
        SessionStore.on("environment.change", environmentUpdate);
        ChillHourStore.on("time.change", reloadTimeChange);
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", environmentUpdate);
        ChillHourStore.removeListener("time.change", reloadTimeChange);

        tokenList.clear();
    }

    const reloadTimeChange = () => {
        flagTimeSerieGDDRef.current = false;
        setFlagList(true);
        cropsEnvironment();
    }

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;

        return (
            <div
                className={className}
                style={{ ...style, top: "25px", right: "10vw", backgroundColor: "#2196f3", borderRadius: 29 }}
                onClick={onClick}
            />
        );
    }

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;

        return (
            <div
                className={className}
                style={{ ...style, top: "25px", left: "10vw", backgroundColor: "#2196f3", borderRadius: 29, zIndex: 2000 }}
                onClick={onClick}
            />
        );
    }

    const getTimeSerieGDD = (crops) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const params = {
            start: ChillHourStore.date.start,
            end: ChillHourStore.date.end,
        }

        ChillHourStore.getGDDCrop(cancelToken, params, crops, resp => responseGetTimeSerieGDD(resp, params));
    }

    const responseGetTimeSerieGDD = (response, date) => {
        tokenList.remove(response.id);

        const timeserieResult = [];

        if (response.status) {
            setErrorResponse(response.status.toString());

            return;
        }

        if (response.length > 0) {
            // Criação do 'data' para o gráfico de linhas do GDD
            for (let i = +date.start; i <= +date.end; i = i + 86400000) {
                const formatSecond = i / 1000;

                response.forEach(crop => {
                    const timeSerie = crop.data?.serie?.find(item => (item.time / 1000) + 10800 === formatSecond);
                    let isNewItemArray = true;

                    if (timeSerie) {
                        timeserieResult.forEach((timeSerieItem, index) => {
                            if (timeSerieItem.name === i) {
                                timeserieResult[index] = {
                                    ...timeserieResult[index],
                                    [crop.config.params.objectid]: timeSerie.value
                                }
                                isNewItemArray = false;
                            }
                        })

                        if (timeserieResult.length === 0 || isNewItemArray) {
                            timeserieResult.push({
                                name: i,
                                [crop.config.params.objectid]: timeSerie.value
                            })
                        }
                    }
                })
            }

            setDataGDD(timeserieResult);
        }
    }

    const cropsEnvironment = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        ChillHourStore.getListCropsEnvironment(cancelToken, responseCropsEnvironment);
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

    const getStatusError = (props) => {
        setErrorResponse(props.status);
        setErrorMessageResponse(props.message);
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
                }
            },
        ],
        beforeChange: (_, next) => {
            setActiveSlide(next);
        },
    };

    const getEnvironments = () => {
        setEnvironmentList(SessionStore.getEnvironments());
    };

    const environmentUpdate = () => {
        EnvironmentStore.getAccountEnvironment(SessionStore.getEnvironment(), getEnvironment);
    }

    const initialize = () => {
        let end = moment();
        let start = moment().startOf('year');

        start.set({ hour: 0 });
        start.set({ minutes: 0 });
        start.set({ seconds: 0 });
        end.set({ hour: 23 });
        end.set({ minutes: 59 });
        end.set({ seconds: 59 });

        start = moment(start).format('x');
        end = moment(end).format('x');

        date.current = { start, end };
        ChillHourStore.setDate(date.current)
    }

    const handleClose = () => {
        setAnchor(null);
    };

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    };

    const onEnvClick = (env) => {
        const p = { ...SessionStore.getPreference(), environment: env.objectid };
        SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
        SessionStore.setEnvironment(env.objectid)
        handleClose();
    }

    const menu = () => {
        return (
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <KeyboardArrowDownIcon />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={Boolean(anchor)}
                    onClose={handleClose}
                >
                    {
                        environmentList.map((env) => {
                            return (
                                <MenuItem key={env.objectid} onClick={() => onEnvClick(env)}>{env.name.toUpperCase()}</MenuItem>
                            );
                        })
                    }
                </Menu>
            </div>
        );
    }

    const getEnvironment = (data) => {
        setEnvironment(data);
    }

    const getDate = (start, end) => {
        date.current = { start, end };
        ChillHourStore.setDate({ start: start, end: end });
    }

    return (
        <Grid container className={classes.containerExterno}>
            <UserFeedback error={errorResponse} message={errorMessageResponse} setError={setErrorResponse} />
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} sm={3}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container className={classes.paper}>
                                    {!toolsUtils.isNullOrEmpty(environment, "name") && environmentList.length > 0 &&
                                        <Grid container>
                                            <Grid item xs={9} className={classes.environmentName}>
                                                {environment.name.toUpperCase()}
                                            </Grid>
                                            <Grid item xs={3}>
                                                {menu()}
                                            </Grid>
                                        </Grid>
                                    }
                                    {list?.length > 0 &&
                                        <Grid item xs={12} className={classes.talhoesContainer}>
                                            <CropList crops={list} handleCropsCheckbox={setCropsCheckbox} />
                                        </Grid>
                                    }
                                    <CalendarFilter get={getDate} date={ChillHourStore.date} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={9} className={classes.chartContainer}>
                        <Slider  {...settings}>
                            <div id="Chill7">
                                <Grid item xs={12} className={classes.chartName} style={{ textAlign: "center" }}>
                                    {t('common.chillHours')} ≤ 7.2 °C
                                </Grid>
                                <Grid item xs={12}>
                                    <ChartChill getStatusError={getStatusError} crops={list} cropsCheckbox={cropsCheckbox} />
                                </Grid>
                            </div>
                            <div id="Chill10">
                                <Grid item xs={12} className={classes.chartName} style={{ textAlign: "center" }}>
                                    {t('common.chillHours')} ≤ 10 °C
                                </Grid>
                                <Grid item xs={12}>
                                    <ChartChill10 getStatusError={getStatusError} crops={list} cropsCheckbox={cropsCheckbox} />
                                </Grid>
                            </div>
                            <div id="ColdUnit">
                                <Grid item xs={12} className={classes.chartName} style={{ textAlign: "center" }}>
                                    {t('chillhours.modifiedNC')}
                                </Grid>
                                <Grid item xs={12}>
                                    <ColdUnit getStatusError={getStatusError} crops={list} cropsCheckbox={cropsCheckbox} />
                                </Grid>
                            </div>
                            <div id="GDD">
                                <Grid item xs={12} className={classes.chartName} style={{ textAlign: "center" }}>
                                    {t('chillhours.degreeDayDevelopment')}
                                </Grid>
                                <Grid item xs={12}>
                                    <GDD crops={list} cropsCheckbox={cropsCheckbox} data={dataGDD} />
                                </Grid>
                            </div>
                        </Slider>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
})