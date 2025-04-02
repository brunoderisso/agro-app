import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza
import styles from "../../../styles/Notebook/NotebookStateCard";
import toolsUtils from "../../../utils/toolsUtils";
import { Tooltip } from '@material-ui/core';



export default withStyles(styles)(function CardWeatherForecast(props) {
    const { classes } = props

    const [state, setState] = useState({});


    useEffect(() => {
        setState(props.state);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tooltip title={state.name}>
            <Grid item xs={2} style={{ cursor: "pointer" }} className={classes.stateCardContainer}>
                <Grid id={"div-slide" + props.divid} container direction="row" justifyContent="center" alignItems="center" className={classes.stateCard}>
                    {!toolsUtils.isNullOrEmpty(state, "label") &&
                        state.label
                    }
                </Grid>
            </Grid>
        </Tooltip>
    )
})