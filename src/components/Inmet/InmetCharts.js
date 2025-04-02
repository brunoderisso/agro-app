import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Grow } from '@material-ui/core';

import ChartPanel from "./ChartPanel";
import SessionStore from '../../stores/SessionStore';
import MeasureStore from '../../stores/MeasureStore';
import toolsUtils from '../../utils/toolsUtils';
import tokens from "../../stores/CancelTokenList";
import InmetStore from '../../stores/InmetStore';
import InmetWidgetsInfo from './InmetWidgetsInfo';


const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

export default withStyles(styles)(function InmetChart(props) {
    const [stations, setStations] = useState([]);
    const [flag, setFlag] = useState(false);

    const tokenList = new tokens();

    const { classes } = props;

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.value === 1)
            getStationByRadius();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);

    useEffect(() => {
        if (stations.length > 0) {
            setFlag(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stations]);

    const bind = () => {
        MeasureStore.addListener("change.measure", onChangeMeasure);
        SessionStore.addListener("environment.change", getStationByRadius);
        SessionStore.addListener("radius.change", getStationByRadius);
    }

    const clear = () => {
        MeasureStore.removeListener("change.measure", onChangeMeasure);
        SessionStore.removeListener("environment.change", getStationByRadius);
        SessionStore.removeListener("radius.change", getStationByRadius);
    }

    const onChangeMeasure = () => {
        setFlag(false);
        setTimeout(() => {
            setFlag(true);
        }, 500);
    }


    const getStationByRadius = () => {
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
        setFlag(false);

        InmetStore.getStations(cancelToken, params, responsegetStations);
    }

    const responsegetStations = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null) {
            setStations(response.data);
        }
    }

    const getPanels = () => {

        let devicesfiltered = stations.filter((el) => { return el.CD_SITUACAO === "OPERANTE" });


        if (devicesfiltered.length === 0) {
            return "";
        }

        return devicesfiltered.map((device) => {
            if (toolsUtils.isNullOrEmpty(device, "measures")) {
                return "";
            }

            return device.measures.map((measure) => {

                if (measure.name[0] === "_") {
                    return "";
                }

                if (measure.meta === null) {
                    measure.meta = {};
                }

                if (!(MeasureStore.measures.includes(measure.name) || MeasureStore.measures.includes("all"))) {
                    return "";
                }

                return (<ChartPanel measure={measure} device={device} key={device.deveui + measure.name} />)
            });
        });
    };

    return (
        <Grid className={classes.root}>
            <InmetWidgetsInfo length={stations.length} />
            <Grow in={flag} timeout={{ enter: 1000, exit: 0 }} mountOnEnter unmountOnExit>
                <Grid>
                    {getPanels()}
                </Grid>
            </Grow>
        </Grid>
    );

});
