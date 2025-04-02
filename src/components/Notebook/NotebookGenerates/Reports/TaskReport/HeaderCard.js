import React, { useEffect, useState } from 'react';


import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import styles from "../../../../../styles/Notebook/NotebookHeaderCard";
import { Grow, Paper } from '@material-ui/core';


export default withStyles(styles)(function HeaderCard(props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1000);

    }, []);

    const { classes } = props;

    return (
        <Grow in={show} timeout={1500}>
            <Grid item xs>

                <Paper>
                    <Grid container className={classes.containerHeaderCard}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={1}>
                                    <Grid container className={classes.iconCard}>
                                        <Paper>
                                            <Grid container style={{ backgroundColor: props.color, padding: "10px" }}>
                                                {props.icon}
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Grid item xs={11}>
                                    <Grid container>
                                        <Grid item xs={12} style={{ fontWeight: 600 }}>
                                            {props.title}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                {props.body || null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

            </Grid>
        </Grow>
    )

})