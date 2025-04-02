import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import styles from "../../../styles/GoogleMaps/GradientBar";
import MeasureStore from "../../../stores/MeasureStore";
import Canvas from "../Canvas";


export default withStyles(styles)(function GradientBar(props) {
    const [indexGradient, setIndexGradient] = useState(null);
    const [gradient, setGradient] = useState(null);
    const [evapoGradient, setEvapoGradient] = useState(null);
    const [meta, setMeta] = useState(null);

    const { classes } = props;

    useEffect(() => {
        bind();
        MeasureStore.setDefaultMeasure();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.indexGradient) {
            setIndexGradient(props.indexGradient);
        }
    }, [props.indexGradient]);

    useEffect(() => {
        if (props.evapoGradient) {
            setEvapoGradient(props.evapoGradient);
        }
    }, [props.evapoGradient]);

    useEffect(() => {
        if (indexGradient) {
            setGradient(null);
            setMeta(null);
        }
    }, [indexGradient]);

    useEffect(() => {
        if (gradient) {
            setIndexGradient(null);
            setEvapoGradient(null);
        }
    }, [gradient]);

    useEffect(() => {
        if (evapoGradient) {
            setIndexGradient(null);
            setGradient(null);
        }
    }, [evapoGradient]);

    const bind = () => {
        MeasureStore.addListener('change.measure', onChangeMeasure);
        MeasureStore.addListener('gradient_reset', setGradients);
    }

    const clear = () => {
        MeasureStore.removeListener('change.measure', onChangeMeasure);
        MeasureStore.removeListener('gradient_reset', setGradients);
    }

    const setGradients = (value) => {
        setIndexGradient(value);
        setEvapoGradient(value);
        setGradient(value);
    }

    const onChangeMeasure = () => {
        const measure = MeasureStore.getMeasure();
        const m = MeasureStore.getMeasureDetail(measure);

        if (m) {
            setGradient(m.gradient);
            setMeta(m.meta);
        }
    }

    return (
        <>
            {gradient &&
                <Grid container className={classes.gradientContainer} justifyContent="flex-end">
                    <Canvas gradient={gradient} meta={meta} />
                </Grid>
            }
            {indexGradient && typeof indexGradient === 'object' &&
                <Grid container className={classes.gradientContainer} justifyContent="flex-end">
                    <Canvas advancedGradient={indexGradient} />
                </Grid>
            }
            {evapoGradient && typeof evapoGradient === 'object' &&
                <Grid container className={classes.gradientContainer} justifyContent="flex-end">
                    <Canvas evapoGradient={evapoGradient} />
                </Grid>
            }
        </>
    )
})