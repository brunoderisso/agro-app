import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import ChartList from './ChartList';
import styles from '../../../styles/Common/Chart/Chart';


export default withStyles(styles)(function Chart(props) {
    const { classes } = props;

    return (
        <Grid container>
            <Grid item className={classes.grid} xs={12}>
                <ChartList />
            </Grid>
        </Grid>
    );
})