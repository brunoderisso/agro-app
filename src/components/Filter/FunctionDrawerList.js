import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";
import { AnalitycsEvent } from '../../LocalConfig';


const style = () => ({
    container: {
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

export default withStyles(style)(function FunctionDrawerList(props) {
    const [list, setList] = useState([]);
    const [func, setFunction] = useState("");

    const { t } = useTranslation();
    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getFunction();
        getFunctions();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getFunction);
        SessionStore.on("function.change", getFunction)
        SessionStore.on("change.meta", getFunction)
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getFunction);
        SessionStore.removeListener("function.change", getFunction)
        SessionStore.removeListener("change.meta", getFunction)
        tokenList.clear();
    };

    const onSelectButtonClick = (f) => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/function/' + f.value, 'Change Function');

        SessionStore.setFunction(f.value);
        SessionStore.setIsSelectedFunction(true);
        props.onClose();
    }

    const Row = (f) => {
        const { classes } = props;

        return (
            <Grid
                key={"functionDrawerList" + f.label}
                container
                className={classes.container}
                style={{ backgroundColor: f.value === func ? "#2196f31c" : "" }}
                onClick={() => { onSelectButtonClick(f) }}
            >
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">{t(f.label)}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    const getFunctions = () => {
        setList(SessionStore.functions);
    };

    const getFunction = () => {
        setFunction(SessionStore.function);
    }

    return (
        <Grid container>
            {list.map((val) => {
                return Row(val)
            })}
        </Grid>
    );
});