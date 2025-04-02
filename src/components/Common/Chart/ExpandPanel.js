import React, { useState, useEffect } from 'react';
import Timer from 'react-interval'
import BeatLoader from "react-spinners/BeatLoader"

import { IconButton, withStyles } from "@material-ui/core";
import { Accordion } from '@material-ui/core';
import { AccordionSummary } from '@material-ui/core'
import { AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

import Bar from './Bar';
import ExpandHeader from "./ExpandHeader";
import toolsUtils from "../../../utils/toolsUtils";
import SessionStore from "../../../stores/SessionStore";
import TimeSerieStore from "../../../stores/TimeSerieStore";
import LSTMStore from "../../../stores/LSTMStore";
import TokenList from '../../../stores/CancelTokenList';
import styles from "../../../styles/Common/Chart/ExpandPanel";
import theme from '../../../styles/Utils/theme';
import { useTranslation } from 'react-i18next';

import { ReactComponent as IAIcon } from "../../../img/BrainIAIcon.svg";
export default withStyles(styles)(function ExpandPanel(props) {
    let _chart = {};

    const { classes } = props;

    const [flags, setFlags] = useState({});
    const [chart, setChart] = useState({});
    const [data, setData] = useState(null)
    const [parameters, setParameters] = useState(null);
    const [timePeriod, setTimePeriod] = useState("");
    const [chartLoader, setChartLoader] = useState(false);

    const tokenList = new TokenList();

    const { t } = useTranslation();

    useEffect(() => {
        initParameters();
        initChart();
        startFlags();
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (parameters && flags.open) {
            getTimeSerie();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);

    useEffect(() => {
        if (flags.open) {
            getTimeSerie();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flags.open]);

    useEffect(() => {
        setChartLoader(false);
        setFlags({
            ...flags,
            LSTMLoad: false
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const getFunction = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.function") && !toolsUtils.isEmptyString(props.measure.meta.function)) {
            return props.measure.meta.function;
        }

        return SessionStore.function || "mean";
    };

    const getFill = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.fill") && !toolsUtils.isEmptyString(props.measure.meta.fill)) {
            return props.measure.meta.fill;
        }

        return SessionStore.fill || "none";
    };

    const startFlags = () => {
        setFlags({
            open: false,
            isRecived: true,
            refresh: false,
            first: true
        });
    };

    const bind = () => {
        SessionStore.on("time.reload", setTimePeriod);
        SessionStore.on("time.change", timeChange);
        SessionStore.on("function.change", functionChange)
        SessionStore.on("fill.change", fillChange)
        SessionStore.on("scale.change", scaleChange);
    };

    const clear = () => {
        SessionStore.removeListener("time.reload", setTimePeriod);
        SessionStore.removeListener("time.change", timeChange);
        SessionStore.removeListener("function.change", functionChange);
        SessionStore.removeListener("fill.change", fillChange);
        SessionStore.removeListener("scale.change", scaleChange);
        tokenList.clear();
    };

    const scaleChange = () => {
        _chart = { ..._chart, ydomain: SessionStore.scale };

        setChart(_chart);
    };

    const fillChange = () => {
        _chart = { ..._chart, fill: SessionStore.fill };

        setChart(_chart);

        let p = parameters || getParameters();
        setParameters({ ...p, fill: SessionStore.fill });
    };

    const functionChange = () => {
        _chart = { ..._chart, function: SessionStore.function };

        setChart(_chart);

        let p = parameters || getParameters();
        setParameters({ ...p, function: SessionStore.function })
    };

    const timeChange = () => {
        let p = parameters || getParameters();
        setParameters({ ...p });

        if (flags.first) {
            setFlags({ ...flags, first: false });
        }
    };

    const initChart = () => {
        _chart = { ydomain: getScale() };
        setChart(_chart);
    };

    const initParameters = () => {
        setParameters(getParameters());
    };

    const getParameters = () => {
        return {
            measure: props.measure.name,
            device: props.device.deveui,
            function: getFunction(),
            fill: getFill(),
            group: TimeSerieStore.getGroup(SessionStore.getHour()),
        };
    };

    const getScale = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.scale") && !toolsUtils.isEmptyString(props.measure.meta.scale)) {
            SessionStore.setScale(props.measure.meta.scale)

            return props.measure.meta.scale;
        }

        return SessionStore.scale || "";
    };

    const getTimeSerieResponse = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data !== null) {
            setData(resp.data);
        } else {
            setChartLoader(false);
        }
    };

    const getTimeSerie = () => {
        let cancelToken = {};

        setChartLoader(true);

        setFlags({
            ...flags,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        TimeSerieStore.getTimeSerie_WT(cancelToken, parameters, getTimeSerieResponse);
    };

    const toggleExpandPanel = () => {
        const modal = flags.open;
        setFlags({ ...flags, open: !modal });
    };

    const LSTMForecast = () => {
        if (data && flags.open) {
            let lstmData = LSTMStore.convertToLSTMArray(data.serie);
            setFlags({
                ...flags,
                LSTMLoad: true
            });
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            LSTMStore.getLSTMForecast(cancelToken, lstmData, responseLSTMForecast)
        }
    }

    const responseLSTMForecast = (response) => {
        tokenList.remove(response.id);

        let lastTime = data.serie[data.serie.length - 1].time;
        let predict = LSTMStore.convertToTimeserieArray(lastTime, parameters.group, response?.data?.predict);
        let newData = data;
        newData["serie"] = [...data.serie, ...predict];
        setData({ ...newData });
    }

    return (
        <Grid container className={classes.container}>
            {parameters && <Accordion
                key={"painel" + props.device.deveui + props.measure.name}
                expanded={flags.open}
                onChange={toggleExpandPanel}
                style={{width: "100%"}}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <ExpandHeader device={props.device} measure={props.measure} />
                </AccordionSummary>
                {!chartLoader &&
                    <AccordionDetails className={classes.panel}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container className={classes.xs} style={{alignItems: "center"}}>
                                    <Grid item xs={4} >
                                        <Grid container justifyContent="flex-end" className={classes.min}>
                                            <Typography className={classes.label}>{t('common.minimum')}: </Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(data, "min") ? parseFloat(data.min).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""} </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Grid container justifyContent="center" className={classes.max}>
                                            <Typography className={classes.label}>{t('common.maximum')}: </Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(data, "max") ? parseFloat(data.max).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Grid container justifyContent="flex-start" className={classes.min}>
                                            <Typography className={classes.label}>{t('common.last')}: </Typography>
                                            <Typography className={classes.number}>{data?.serie ? parseFloat(data.serie[data.serie.length - 1].value).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={1}>

                                        <IconButton disabled={flags.LSTMLoad} onClick={LSTMForecast}>
                                            {!flags.LSTMLoad &&
                                                <IAIcon />
                                            }
                                            {flags.LSTMLoad &&
                                                <CircularProgress size={24} />
                                            }
                                        </IconButton>

                                    </Grid>
                                </Grid>
                                <Grid container className={classes.md}>
                                    <Grid item xs={12} >
                                        <Grid container justifyContent="center" className={classes.min}>
                                            <Typography className={classes.label}>{t('common.minimum')}: </Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(data, "min") ? parseFloat(data.min).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="center" className={classes.max}>
                                            <Typography className={classes.label}>{t('common.maximum')}: </Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(data, "max") ? parseFloat(data.max).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Grid container justifyContent="center" className={classes.min}>
                                            <Typography className={classes.label}>{t('common.last')}: </Typography>
                                            <Typography className={classes.number}>{data?.serie ? parseFloat(data.serie[data.serie.length - 1].value).toFixed(2) : ""}</Typography>
                                            <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid item xs={12}>
                                <Bar data={data?.serie} ydomain={chart.ydomain} measure={props.measure} />
                            </Grid>
                        </Grid>
                        <Timer timeout={timePeriod}
                            enabled={timePeriod > 0}
                            callback={() => {
                                if (flags.open) {
                                    let diff = SessionStore.getTimeDiff() / 3600000
                                    SessionStore.setTime(diff)
                                }
                            }}>
                        </Timer>
                    </AccordionDetails>
                }
                {chartLoader &&
                    <Grid container justifyContent="center" alignItems="center" className={classes.wrapperSpinning}>
                        <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={"px"} size={12} />
                    </Grid>
                }
            </Accordion>
            }
        </Grid>
    );
})