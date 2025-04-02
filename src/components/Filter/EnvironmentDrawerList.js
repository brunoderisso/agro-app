import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

//Prediza
import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";

//Others
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

export default withStyles(style)(function EnvironmentDrawerList(props) {
    const [list, setList] = useState([]);
    const [environment, setEnvironment] = useState("");

    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getEnvironment();
        getEnvironments();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getEnvironment);
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getEnvironment);
        tokenList.clear();
    };

    const onSelectButtonClick = (env) => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/environment/' + env.name, 'Change Environment');

        props.onClose();
        const p = { ...SessionStore.getPreference(), environment: env.objectid };
        SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
        SessionStore.setEnvironment(env.objectid)
    }

    const Row = (env) => {
        const { classes } = props;
        return (
            <Grid key={env.objectid} container className={classes.conatiner} style={{ backgroundColor: env.objectid === environment ? "#2196f31c" : "" }} onClick={() => { onSelectButtonClick(env) }}>
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">{env.name.toUpperCase()}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //Store
    const getEnvironments = () => {
        setList(SessionStore.getEnvironments());
    };

    const getEnvironment = () => {
        setEnvironment(SessionStore.getEnvironment());
    }

    return (
        <Grid container>
            {list.map((val) => {
                return Row(val)
            })}
        </Grid>
    );
});