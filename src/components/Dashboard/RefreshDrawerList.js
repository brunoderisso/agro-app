import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import RefreshDrawerListRow from "./RefreshDrawerListRow"
import SessionStore from "../../stores/SessionStore";
import styles from '../../styles/Dashboard/RefreshDrawerList'


export default withStyles(styles)(function RefreshDrawerList(props) {
    const { classes } = props;

    let times = SessionStore.times

    return (
        <Grid container className={classes.container}>
            {times.map((time,id) => {
                return (
                    <Grid item xs={12}  key={id+"grid"}>
                        <RefreshDrawerListRow key={id} time={time} close={props.close} />
                    </Grid>
                )
            })}

        </Grid>
    );
})