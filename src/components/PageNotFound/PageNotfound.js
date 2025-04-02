import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import styles from '../../styles/PageNotFound/PageNotFound'


export default withStyles(styles)(function PageNotFound(props) {
    const { classes } = props;

    return (
        <Card className={classes.card}>
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h1" className={classes.title}>
                            {props.title}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            {props.subtitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="overline">
                            {props.message}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
})