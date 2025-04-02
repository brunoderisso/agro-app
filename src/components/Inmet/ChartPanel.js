import React, { useState, useEffect, useRef } from 'react';

import { withStyles } from "@material-ui/core";
import { Accordion } from '@material-ui/core';
import { AccordionSummary } from '@material-ui/core'
import { AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";

import Bar from '../Common/Chart/Bar';
import ExpandHeader from "../Common/Chart/ExpandHeader";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import theme from "../../styles/Utils/theme";
import TokenList from '../../stores/CancelTokenList';
import Timer from 'react-interval'
import InmetStore from '../../stores/InmetStore';
import UserFeedback from '../Common/UserFeedback';
import { useTranslation } from 'react-i18next';

const style = {
    min: {
        [theme.breakpoints.between('sm', 'xl')]: {
            paddingLeft: "5vw"
        }
    },
    max: {
        [theme.breakpoints.between('sm', 'xl')]: {
            paddingLeft: "5vw"
        }

    },
    contai: {
    },
    number: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw"
        },
        marginRight: 2
    },
    label: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw",
            fontWeight: 500
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw",
            fontWeight: 500
        },
        marginRight: 5
    },
    xs: {
        [theme.breakpoints.only('xs')]: {
            display: "none"
        }
    },
    md: {
        [theme.breakpoints.between('sm', 'xl')]: {
            display: "none"
        },
        marginLeft: 24
    },
    panel: { paddingLeft: 0 }
};

export default withStyles(style)(function ChartPanel(props) {
    const { classes } = props;

    const { t } = useTranslation();

    const getFunction = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.function") && !toolsUtils.isEmptyString(props.measure.meta.function)) {
            return props.measure.meta.function;
        };
        return SessionStore.function.value || "mean";
    };

    const getFill = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.fill") && !toolsUtils.isEmptyString(props.measure.meta.fill)) {
            return props.measure.meta.fill;
        };
        return SessionStore.fill || "none";
    };

    let _chart = {};

    const [flags, setFlags] = useState({});
    const [chart, setChart] = useState({});
    const [data, setData] = useState([])
    const [parameters, setParameters] = useState(null);
    const [timePeriod, setTimePeriod] = useState("");

    const [error, setError] = useState("");
    const tokenList = new TokenList();


    const dataBackup = useRef([]);

    useEffect(() => {
        initParameters();
        initChart();
        startFlags();
        bind();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (parameters !== null && flags.open) {
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


    const startFlags = () => {
        setFlags({
            open: false,
            isRecived: true,
            refresh: false,
            first: true
        });
    }

    const bind = () => {
        SessionStore.on("time.reload", setTimePeriod);
        SessionStore.on("time.change", timeChange);
        SessionStore.on("function.change", functionChange)
        SessionStore.on("fill.change", fillChange)
        SessionStore.on("scale.change", scaleChange);
    }

    const clear = () => {
        SessionStore.removeListener("time.reload", setTimePeriod);
        SessionStore.removeListener("time.change", timeChange);
        SessionStore.removeListener("function.change", functionChange);
        SessionStore.removeListener("fill.change", fillChange);
        SessionStore.removeListener("scale.change", scaleChange);
        tokenList.clear();
    }

    const scaleChange = () => {
        _chart = { ..._chart, ydomain: SessionStore.scale };

        setChart(_chart);

    };

    const fillChange = () => {
        _chart = { ..._chart, fill: SessionStore.fill };

        setChart(_chart);
        let p = parameters || {
            measure: props.measure.name,
            device: props.device.CD_ESTACAO,
            hours: 0,
            function: getFunction(),
            fill: getFill()
        }
        setParameters({ ...p, fill: SessionStore.fill });
    };

    const functionChange = () => {
        _chart = { ..._chart, function: SessionStore.function.value };

        setChart(_chart)
        let p = parameters || {
            measure: props.measure.name,
            device: props.device.CD_ESTACAO,
            hours: 0,
            function: getFunction(),
            fill: getFill()
        }
        setParameters({ ...p, function: SessionStore.function.value })
    }

    const timeChange = (h) => {
        update(h, true);
    }

    const initChart = () => {
        _chart = { ydomain: getScale() }
        setChart(_chart)
    };

    const initParameters = () => {

        setParameters({
            measure: props.measure.name,
            device: props.device.CD_ESTACAO,
            hours: 0,
            group: (props.measure.name === "_ETO" && "1d") || "1h",
            function: getFunction(),
            fill: getFill()
        })
    };

    const getScale = () => {
        if (!toolsUtils.isNullOrEmpty(props.measure, "meta.scale") && !toolsUtils.isEmptyString(props.measure.meta.scale)) {
            return props.measure.meta.scale;
        };
        return SessionStore.scale || "";
    };




    const update = (h, isChanged) => {
        if (flags.first || isChanged || timePeriod > 0) {
            let p = parameters || {
                measure: props.measure.name,
                device: props.device.CD_ESTACAO,
                hours: 0,
                function: getFunction(),
                fill: getFill()
            }
            setParameters({ ...p, hours: h });
        }

        if (flags.first) {
            setFlags({ ...flags, first: false });
        }
    };

    const getTimeSerieResponse = (resp) => {
        tokenList.remove(resp.id);

        if (props.context === "InmetEvapo") {
            let d = {};
            d.max = resp.data.max;
            d.min = resp.data.min;
            d.name = resp.data.name;
            let s = [];
            let m = 0;
            for (let i = 0; i < resp.data.serie.length; i++) {
                if (dataBackup.current[0].serie.serie[i].value > m) {
                    m = dataBackup.current[0].serie.serie[i].value
                }
                s.push({ time: resp.data.serie[i].time, value: resp.data.serie[i].value, cumulative: dataBackup.current[0].serie.serie[i].value });
            }
            d.serie = s;
            setChart({ ...chart, ydomain: m });
            setData(d);
        } else
            if (resp.data !== null) {
                let d = {};
                d.max = resp.data.max;
                d.min = resp.data.min;
                d.name = resp.data.name;
                let s = [];
                let m = 0;
                for (let i = 0; i < resp.data.serie.length; i++) {
                    s.push({ time: resp.data.serie[i].time, value: resp.data.serie[i].value, max: dataBackup.current[0].serie.serie[i].value, min: dataBackup.current[1].serie.serie[i].value });
                    if (dataBackup.current[0].serie.serie[i].value > m) {
                        m = dataBackup.current[0].serie.serie[i].value
                    }
                }
                d.serie = s;
                setChart({ ...chart, ydomain: m });
                setData(d);
            }
    }

    const getTimeSerieResponseCumulative = (resp) => {
        tokenList.remove(resp.id);
        if (resp.status === 404) {
            setError("404");
            return
        }

        if (resp.data !== null) {
            let arr = Array.from(dataBackup.current);
            arr.push({ function: "CUMULATIVE", serie: resp.data });

            dataBackup.current = arr;
        }

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        InmetStore.getTimeSerie(cancelToken, parameters, getTimeSerieResponse);
    }

    const getTimeSerieResponseMax = (resp) => {
        tokenList.remove(resp.id);
        if (resp.status === 404) {
            setError("404");
            return
        }
        if (resp.data !== null) {
            let arr = Array.from(dataBackup.current);
            arr.push({ function: "MAX", serie: resp.data });

            dataBackup.current = arr;
        }

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        InmetStore.getTimeSerie(cancelToken, { ...parameters, function: "MIN" }, getTimeSerieResponseMin);
    }

    const getTimeSerieResponseMin = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data !== null) {
            let arr = Array.from(dataBackup.current);
            arr.push({ function: "MIN", serie: resp.data })
            dataBackup.current = arr;
        }

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        InmetStore.getTimeSerie(cancelToken, parameters, getTimeSerieResponse);
    }

    const getTimeSerie = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        dataBackup.current = [];
        if (props.context === "InmetEvapo") {
            InmetStore.getTimeSerie(cancelToken, { ...parameters, cumulative: true }, getTimeSerieResponseCumulative);

        } else {

            InmetStore.getTimeSerie(cancelToken, { ...parameters, function: "MAX" }, getTimeSerieResponseMax);
        }
    }

    const toggleExpandPanel = () => {
        const modal = flags.open;
        setFlags({ ...flags, open: !modal });
    };

    return (
        <Grid container style={{ marginBottom: "5px" }}>
            <UserFeedback error={error} setError={setError} />
            {parameters !== null && <Accordion
                key={"painel" + props.device.objectid + props.measure.name}
                expanded={flags.open}
                onChange={toggleExpandPanel}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <ExpandHeader device={props.device} measure={props.measure} />
                </AccordionSummary>
                <AccordionDetails className={classes.panel}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container className={classes.xs}>
                                <Grid item xs={4} >
                                    <Grid container justifyContent="flex-end" className={classes.min}>
                                        <Typography className={classes.label}>{t('common.minimum')}:    </Typography>
                                        <Typography className={classes.number}>{data.min ? parseFloat(data.min).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""} </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4} >
                                    <Grid container justifyContent="center" className={classes.min}>
                                        <Typography className={classes.label}>{t('common.last')}: </Typography>
                                        <Typography className={classes.number}>{data.serie ? parseFloat(data.serie[data.serie.length - 1].value).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container justifyContent="flex-start" className={classes.max}>
                                        <Typography className={classes.label}>{t('common.maximum')}:    </Typography>
                                        <Typography className={classes.number}>{data.max ? parseFloat(data.max).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container className={classes.md}>
                                <Grid item xs={12} >
                                    <Grid container justifyContent="center" className={classes.min}>
                                        <Typography className={classes.label}>{t('common.minimum')}: </Typography>
                                        <Typography className={classes.number}>{data.min ? parseFloat(data.min).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} >
                                    <Grid container justifyContent="center" className={classes.min}>
                                        <Typography className={classes.label}>{t('common.last')}: </Typography>
                                        <Typography className={classes.number}>{data.serie ? parseFloat(data.serie[data.serie.length - 1].value).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent="center" className={classes.max}>
                                        <Typography className={classes.label}>{t('common.maximum')}: </Typography>
                                        <Typography className={classes.number}>{data.max ? parseFloat(data.max).toFixed(2) : ""}</Typography>
                                        <Typography className={classes.number}>{!toolsUtils.isNullOrEmpty(props, "measure.meta.ylegend") ? props.measure.meta.ylegend : ""}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Bar context={props.context} parameters={parameters} data={data.serie} device={props.device.CD_ESTACAO} function={parameters.function} ydomain={chart.ydomain} measure={props.measure} key={"chart" + props.device.objectid + props.measure.name ? props.measure.name : "no-data"} />
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
            </Accordion>
            }
        </Grid>
    );


})