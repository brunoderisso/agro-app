import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import theme from "../styles/Utils/theme";

//Prediza 

const styles = () => ({
    item: {
        paddingTop: 0,
        "&:hover": {
            backgroundColor: "white"
        },
        "&:focus": {
            backgroundColor: "white"
        }
    },
    line: {
        width: "100%",
        "& span": {
            [theme.breakpoints.between('xs', 'md')]: {
                paddingLeft: "20vw",
                fontSize: "7vw",
                paddingTop: "4vw",
                paddingBottom: "4vw"
            },
            [theme.breakpoints.between('lg', 'xl')]: {
                fontSize: "1.25vw",
                paddingLeft: "2.3vw"
            },

        }
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
        };
    }

    //Component default methods

    //Event methods

    //Component methods

    //Store methods

    render() {
        const { classes } = this.props;
        return (
        <Grid container justifyContent="center">
            <Grid item xs={12}>
                <ListItem disableGutters={true} button className={classes.item}>
                    <ListItemText primary={this.props.text} onClick={this.onClickListHour} className={classes.line} style={{ backgroundColor: this.props.isSelect ? "#85c8fe7a" : "white" }}/>
                </ListItem>
            </Grid>
        </Grid> );
    }

}

export default withStyles(styles)(FilterQuick);
