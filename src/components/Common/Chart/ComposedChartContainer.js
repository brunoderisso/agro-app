import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import {
    ComposedChart, ResponsiveContainer
} from 'recharts';


const styles = () => ({
    container: {
        maxWidth: "100%"
    }
});

export default withStyles(styles)(function ComposedChartContainer(props) {
    const { classes } = props;

    return (
        <Grid container id="responsivecontainer" className={classes.container} >
            <ResponsiveContainer style={{ float: 'left', width: '100%', height: '100%' }}>
                <ComposedChart
                    margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
                    {...props}
                >
                    {props.children}
                </ComposedChart>
            </ResponsiveContainer>
        </Grid>
    );
})