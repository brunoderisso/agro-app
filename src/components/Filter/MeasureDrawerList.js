import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

//Prediza
import SessionStore from "../../stores/SessionStore";
import MeasureStore from "../../stores/MeasureStore";
import tokens from "../../stores/CancelTokenList";

//Others
import { useTranslation } from 'react-i18next';
import { AnalitycsEvent } from '../../LocalConfig';

const style = () => ({
    conatiner: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 8,
        margin: 7,
        maxWidth: "95%",
        cursor: "pointer"
    },
    icon: {
        fontSize: 20
    },
    button: {
        minWidth: 15
    },
    font: {
        fontSize: "1.1rem"
    },
    text: {
        paddingTop: 8
    }
});

export default withStyles(style)(function MeasureDrawerList(props) {
    const [list, setList] = useState([]);
    const [measure, setMeasure] = useState("");

    const tokenList = new tokens();

    const { t } = useTranslation();

    useEffect(() => {
        bind();
        getMeasure();
        getMeasures();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getMeasure);
        MeasureStore.on("change.measure", getMeasure);
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getMeasure);
        MeasureStore.removeListener("change.measure", getMeasure);
        tokenList.clear();
    };

    const onSelectButtonClick = (m) => {
        if (m.name !== "all") {
            AnalitycsEvent('Tool Bar', 'click/toolbar/measure/' + m.name, 'Change Measure');

            const p = { ...SessionStore.getPreference(), measure: m.name };
            SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
            MeasureStore.setMeasure(m.name);
            props.onClose();
            return
        }

        AnalitycsEvent('Tool Bar', 'click/toolbar/measure/all', 'Change Measure');

        MeasureStore.setMeasure("all")
        props.onClose();
    }

    const Row = (m) => {
        const { classes } = props;

        return (
            <Grid key={"MeasureDrawerList" + m.name} container className={classes.conatiner} style={{ backgroundColor: measure.includes(m.name) || measure.includes("all") ? "#2196f31c" : "" }} onClick={() => { onSelectButtonClick(m) }}>
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">
                            {m.name === "all" ? m.meta.title : t("measures." + m.name) }
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //Store
    const getMeasures = () => {
        setList(SessionStore.getEnvironmentMeasures());
    };

    const getMeasure = () => {
        setMeasure(MeasureStore.measures);
    }

    return (
        <Grid container>
            {(props.view === "dashboard" || props.view === "chart") && Row({ name: "all", meta: { title: t("common.allText") } })}
            {list && list.map((val) => {
                return Row(val)
            })}
        </Grid>
    );
});