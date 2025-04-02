import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from '@material-ui/core';

import styles from "../../styles/Widgets/MeasureWidget";
import MeasureStore from '../../stores/MeasureStore';
import toolsUtils from '../../utils/toolsUtils';
import TokenList from '../../stores/CancelTokenList';

export default withStyles(styles)(function MeasureWidget(props) {

    const [measure, setMeasure] = useState({});
    const [value, setValue] = useState(0);

    const tokenList = new TokenList();

    useEffect(() => {

        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(measure && measure.name){
            getValue();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measure]);

    const { classes } = props;

    const bind = () => {
        MeasureStore.addListener("measure_init", init);
    }

    const init = () => {
        setMeasure(MeasureStore.getMeasureDetail(MeasureStore.measures[0]));
    }

    const clear = () => {
        MeasureStore.removeListener("measure_init", init);
    }
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const abbreviation = (str) => {
        var palavras = str.split(" ");
        var abreviacoes = palavras.map(function (palavra, i) {
            if (palavra === "do" || palavra === "da" || palavra === "de") {
                return " ";
            }
            if (palavra.length <= 3) {
                return capitalize(palavra);
            } else {
                if (i === 0) {
                    return capitalize(palavra.substr(0, 4));
                }
                return capitalize(palavra.substr(0, 3));
            }
        });
        return abreviacoes.join("");
    }

    const getValue = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        MeasureStore.getMeasureValue(measure.name, cancelToken, responseGetValue);
    }

    const responseGetValue = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setValue(response.data.last);
        }
    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                {measure?.name &&
                    <Typography variant='h2' className={classes.title}>{abbreviation(toolsUtils.getMeasureName(measure))}</Typography>
                }
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h1' className={classes.value}>{ value.toFixed(1) }</Typography>
            </Grid>
        </Grid>
    )
});