import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ChillHourCharts from "./ChillHourCharts"
import styles from "../../styles/Evapo/EvapoPage";


export default withStyles(styles)(function EvapoPage(props) {
    const { classes } = props;

    return (
        <Grid container>
            <div className={classes.rootEvapo}>
                <ChillHourCharts />
            </div>
        </Grid>
    )
})