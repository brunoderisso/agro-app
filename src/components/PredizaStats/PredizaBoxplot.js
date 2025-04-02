import React, { useState, useEffect } from 'react'

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import MeasureStore from "../../stores/MeasureStore";
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";
import TimeSerieStore from "../../stores/TimeSerieStore";
import styles from "../../styles/Report/BoxPlot"



export default withStyles(styles)(function PredizaBoxplot(props) {
    const [parameters, setParameters] = useState({});
    const [URI, setURI] = useState("");
    const [size, setSize] = useState({
        height: props.sizes.height,
        width: props.sizes.width
    });

    useEffect(() => {
        setSize(props.sizes || {});
        bind();
        return clear

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        MeasureStore.addListener("measure_init", onChangeMeasure);
        SessionStore.addListener("environment.change", onChangeMeasure);
        SessionStore.addListener("function.change", onChangeMeasure);
        SessionStore.addListener("time.change", onChangeMeasure);
        SessionStore.addListener("time.force", onChangeMeasure);

    }

    const clear = () => {
        MeasureStore.removeListener("measure_init", onChangeMeasure);
        SessionStore.removeListener("environment.change", onChangeMeasure);
        SessionStore.removeListener("function.change", onChangeMeasure);
        SessionStore.removeListener("time.change", onChangeMeasure);
        SessionStore.removeListener("time.force", onChangeMeasure);

        setParameters(null);
        setURI(null);
        setSize(null);
    }


    const onChangeMeasure = () => {
        getValue();
    }

    useEffect(() => {
        getValue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);

    useEffect(() => {
        if (Object.keys(parameters).length !== 0) {
            //getTimeSerie();
            getBoxPlot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);



    const getValue = () => {

        let m = MeasureStore.measures[0];

        if(props.measure !== undefined){
            m = props.measure;
        }

        let params = {
            measure: m,
            start: SessionStore.getTime().start,
            end: SessionStore.getTime().end,
            function: "MEAN",
            group: "1d",
            fill: "0",
            width: size.width,
            height: size.height,
        }

        if (props.device !== null && props.device !== undefined) {
            params.device = props.device
        }

        if(JSON.stringify(params) !== JSON.stringify(parameters)){
            setParameters(params);
        }



    }

    const getBoxPlot = () => {
        setURI("")

        if (!toolsUtils.isNullOrEmpty(parameters, "measure"))
            TimeSerieStore.getBoxPlot(parameters, responseGetBoxPlot);
    }

    const responseGetBoxPlot = (response) => {
        if (response !== null)
            setURI(response);

    }

    const img = () => {
        return (
            <img src={URL.createObjectURL(URI)} alt="Chart" />
        );
    }




    return (
        <Grid item xs={12}>
            <Grid container justifyContent="center">
                {!toolsUtils.isNullOrEmpty(props, "sizes.width") && !toolsUtils.isNullOrEmpty(props, "sizes.height") && URI !== "" && img()}
            </Grid>
        </Grid>
    );

});