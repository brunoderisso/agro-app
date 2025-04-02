import React, { useState, useEffect } from 'react'

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import MeasureStore from "../../stores/MeasureStore";
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";
import TimeSerieStore from "../../stores/TimeSerieStore";

import styles from "../../styles/Report/BoxPlot"

export default withStyles(styles)(function PredizaHistogram(props) {




    const [parameters, setParameters] = useState({});
    const [URI, setURI] = useState("");

    const [size, setSize] = useState({
        height: props.sizes.height,
        width: props.sizes.width
    });

    useEffect(() => {

        setSize(props.sizes);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.sizes]);

    useEffect(() => {
        if (size.width > 1100 && size.width < 1200)
            getValue();

        if (size.width > 700 && size.width < 800)
            getValue();

        if (size.width > 500 && size.width < 600)
            getValue();

        if (size.width < 500)
            getValue();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [size]);


    useEffect(() => {
        getValue();
        bind();

        return clear
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        MeasureStore.addListener("measure_init", onChangeMeasure);
        SessionStore.addListener("environment.change", onChangeMeasure);
        SessionStore.addListener("function.change", onChangeMeasure);
        SessionStore.addListener("time.change", onChangeMeasure);
    }

    const clear = () => {
        MeasureStore.removeListener("measure_init", onChangeMeasure);
        SessionStore.removeListener("environment.change", onChangeMeasure);
        SessionStore.removeListener("function.change", onChangeMeasure);
        SessionStore.removeListener("time.change", onChangeMeasure);

        setParameters(null);
        setURI(null);
        setSize(null);
    }

    const onChangeMeasure = () => {
        getValue();
    }

    useEffect(() => {
        if (Object.keys(parameters).length !== 0) {
            getHistogram();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parameters]);


    const getValue = () => {
        var newparams = {
            measure: MeasureStore.measures[0],
            start: SessionStore.getTime().start,
            end: SessionStore.getTime().end,
            function: SessionStore.function || "MEAN",
            group: "1h",
            fill: SessionStore.fill || "none",
            width: size.width,
            height: size.height,
        }

        if(JSON.stringify(newparams) !== JSON.stringify(parameters)){
            setParameters(newparams);
        }



    }

    const getHistogram = () => {
        setURI("")
        if (!toolsUtils.isNullOrEmpty(parameters, "measure"))
            TimeSerieStore.getHistogram(parameters, responseGetHistogram);
    }

    const responseGetHistogram = (response) => {
        if (response !== null)
            setURI(response);

    }

    const img = () => {
        return (

            <img src={URL.createObjectURL(URI)} alt="Chart" />

        );
    }

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"

        >
            <Grid item xs={12}>
                <Grid container justifyContent="center" alignItems="center" direction="column" style={{ minHeight: size.height }}>
                    {URI !== "" && img()}
                </Grid>
            </Grid>
        </Grid>
    );

});