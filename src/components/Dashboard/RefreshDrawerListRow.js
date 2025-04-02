import React, { useEffect, useState } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SessionStore from "../../stores/SessionStore"
import styles from '../../styles/Dashboard/RefreshDrawerListRow'
import { AnalitycsEvent } from '../../LocalConfig';


export default withStyles(styles)(function RefreshDrawerListRow(props) {
    const { classes } = props;

    const [time, SetTime] = useState(SessionStore.timeRefresh);

    useEffect(() => {
       bind();

       return clear;
    }, []);

    const bind = () => {
        SessionStore.on("time.reload", val => { SetTime(val) });
    };

    const clear = () => {
        SessionStore.removeListener("time.reload", val => { SetTime(val) });
    };

    const onSelectButtonClick = () => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/time/refresh/' + props.time.value, 'Change Refresh Time');

        SessionStore.timeRefresh = props.time.value;
        SessionStore.emitTimer(props.time.value);
        props.close();
    }

    return (
        <Grid
            container
            className={classes.container}
            style={{ backgroundColor:  props.time.value === time ? "#2196f31c" : "" }}
            onClick={onSelectButtonClick}
        >
            <Grid item xs={8} className={classes.text}>
                <Grid container alignItems="flex-end">
                    <Typography className={classes.font} variant="button">{props.time.label}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
})