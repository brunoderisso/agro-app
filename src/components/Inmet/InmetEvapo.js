import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';

//Material UI
import Grid from '@material-ui/core/Grid';
//Components
import ChartPanel from "./ChartPanel";


//Stores
import SessionStore from '../../stores/SessionStore';
import tokens from "../../stores/CancelTokenList";
import InmetStore from '../../stores/InmetStore';
import { Grow } from '@material-ui/core';
import InmetWidgetsInfo from './InmetWidgetsInfo';
import { useTranslation } from 'react-i18next';


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

export default withStyles(styles)(function InmetEvapo(props) {
    const [stations, setStations] = useState([]);
    const [flag, setFlag] = useState(false);

    const tokenList = new tokens();

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.value === 2)
        getStationByRadius();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);

    useEffect(() => {
        if (stations.length > 0) {
            setFlag(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stations]);

    //Event methods
    const bind = () => {
        SessionStore.addListener("environment.change", getStationByRadius);
        SessionStore.addListener("radius.change", getStationByRadius);
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", getStationByRadius);
        SessionStore.removeListener("radius.change", getStationByRadius);

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
            let measure = {
                name: "_ETO",
                meta: {
                    scale: "auto",
                    title: "ETO",
                    xlegend: "data",
                    ylegend: t('common.mmPerDay'),
                    fill: "0",
                    function: "LAST"
                }
            }

            return (<ChartPanel context={"InmetEvapo"} measure={measure} device={device} key={device.objectid} />)

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
