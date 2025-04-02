import React from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from '@material-ui/core/Grid';

// Prediza
import FilterQuick from '../components/FilterQuick';
import Calendar from './Common/CalendarFilter';
import theme from "../styles/Utils/theme";

const styles = {
    title: {
        margin: "12px 0px 10px 0px"
    },
    buttonCalendar: {
        bottom: "auto",
        top: "80px"
    },
    picker: {
        paddingRight: "1vw",
        paddingLeft: "1vw"
    },
    Divider: {
        [theme.breakpoints.between('xs', 'lg')]: {
            marginTop: "5vw",
            marginBottom: "5vw",
        },
        [theme.breakpoints.between('lg', 'xl')]: {
            marginTop: "1vw",
            marginBottom: "1vw",
        }

    },
    timer: {
        margin: 5
    }
};

export default withStyles(styles)(function FilterPicker(props) {


    const { classes } = props;


    return (
        <Grid container className={classes.picker}>

            <Grid item xs={12} style={{ paddingTop: "115px" }}>
                <Grid container>
                    <Calendar styles={{ button: classes.buttonCalendar }} global />
                </Grid>
                <Grid container >
                    <FilterQuick onClose={props.onClose} />
                </Grid>
            </Grid>
        </Grid>
    );
})
