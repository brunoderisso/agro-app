import React, { useState, useEffect, useRef } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grow } from '@material-ui/core';

import styles from "../../styles/Notebook/NotebookDashboardPage";
import NotebookDashboardWidget from "../Notebook/NotebookDashboard/NotebookDashboardWidget";
import SessionStore from "../../stores/SessionStore";
import InmetStore from '../../stores/InmetStore';
import tokens from "../../stores/CancelTokenList";
import toolsUtils from '../../utils/toolsUtils';
import MeasureStore from '../../stores/MeasureStore';
import InmetWidgetsInfo from './InmetWidgetsInfo';
import UserFeedback from '../Common/UserFeedback';


export default withStyles(styles)(function InmetDashboard(props) {
    const [measures, setMeasures] = useState([]);
    const [stations, setStations] = useState([]);
    const [progress, setProgress] = useState(0);
    const [list, setList] = useState([]);
    const [errorResponse, setErrorResponse] = useState('');

    const data = useRef([]);

    const tokenList = new tokens();
    const { classes } = props;

    useEffect(() => {
        setMeasures(MeasureStore.measures);
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.value === 0)
            getStationsByRadius();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (stations.length > 0) {
            data.current = [];
            setProgress(0);
            stations.forEach(station => {
                let cancelToken = {};
                cancelToken.id = tokenList.add();
                cancelToken.token = tokenList.get(cancelToken.id);
                let time = SessionStore.getTime();
                let params = {
                    ...time,
                    id: station.CD_ESTACAO,
                }

                InmetStore.getStationData(cancelToken, params, responseGetStation);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stations]);

    function CircularProgressWithLabel(props) {
        return (
            <Box position="relative" display="inline-flex">
                <CircularProgress variant="determinate" {...props} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        );
    }

    const responseGetStation = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            let index = stations.findIndex((s) => { return s.CD_ESTACAO === response.data.Station.CD_ESTACAO });
            let array = [];

            if (index >= 0) {
                let newStation = stations[index];

                newStation = {
                    ...newStation,
                    measures: response.data.measure
                }

                array = Array.from(data.current);
                array.push(newStation);
                data.current = array;
            }

            setProgress(parseInt((data.current.length * 100) / stations.length) - 1);

            if (stations.length === data.current.length) {
                setProgress(101)
                setList(data.current);
            }
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }

    }

    const getMeasures = () => {
        const allMeasures = JSON.parse(localStorage.getItem("measures"));
        const environment = localStorage.getItem("environment");

        if (allMeasures) {
            const envMeasures = allMeasures.find(measu => measu.environment === environment);

            if (envMeasures) {
                SessionStore.setMeasuresToEnvironment(envMeasures.measures);
            }
        }
    }

    const bind = () => {
        SessionStore.addListener("radius.change", getStationsByRadius);
        SessionStore.addListener("environment.change", getStationsByRadius);
        MeasureStore.addListener("change.measure", onMeasureInit);
        SessionStore.addListener("environments.update", getMeasures);
    }

    const clear = () => {
        SessionStore.removeListener("radius.change", getStationsByRadius);
        SessionStore.removeListener("environment.change", getStationsByRadius);
        MeasureStore.removeListener("change.measure", onMeasureInit);
        SessionStore.removeListener("environments.update", getMeasures);

        tokenList.clear();
    }

    const onMeasureInit = () => {
        let m = Array.from(MeasureStore.measures);
        setMeasures(m);
    }

    const getStationsByRadius = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let environment = SessionStore.getEnvironmentDetail();
        let radius = SessionStore.getRadius();

        let params = {
            latitude: environment.latitude,
            longitude: environment.longitude,
            limit: radius
        }
        InmetStore.getStations(cancelToken, params, responsegetStations);
    }

    const responsegetStations = (response) => {
        tokenList.remove(response.id);
        setStations([]);
        setList([]);
        let s = response.data;

        let filter = s.filter((station) => { return station.CD_SITUACAO === "OPERANTE" });

        setStations(filter);
    }

    const getStationsWidgets = () => {

        let data = [];

        list.forEach((station) => {

            let line = station.measures.map((m, index) => {
                let detail = MeasureStore.getMeasureDetail(m.measure);

                if (toolsUtils.isNullOrEmpty(detail, "name") || detail.name.includes("_")) {
                    return "";
                };

                if (!measures.includes("all") && !measures.includes(detail.name)) {
                    return "";
                };

                return (
                    <Grid key={index} className={classes.grid}>
                        <NotebookDashboardWidget station={station} measure={detail.name} meta={detail.meta} stats={m.stats} environment={station.CD_ESTACAO} />
                    </Grid>
                )
            })
            data.push(line);
        });

        return data;
    }

    return (
        <Grid container>
            {progress < 101 &&
                <Grid className={classes.circularProgress}>
                    <CircularProgressWithLabel size={100} variant="determinate" value={progress} />
                </Grid>
            }
            <Grow in={list.length > 0} unmountOnExit mountOnEnter>

                <Grid container className={classes.cardStationContainer}>
                    <InmetWidgetsInfo length={list.length} />

                    {getStationsWidgets()}
                </Grid>
            </Grow>
            <UserFeedback error={errorResponse} setError={setErrorResponse} />
        </Grid>
    );
});