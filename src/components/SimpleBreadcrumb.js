import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// Material UI
import Grid from "@material-ui/core/Grid";
import Chip from '@material-ui/core/Chip';

//Prediza 

const StyledBreadcrumb = withStyles(theme => ({
    root: {
        backgroundColor: "transparent",
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
    },
}))(Chip);

const styles = () => ({
    grid: {
        display: "contents"
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
    redirect = () => {
        let location = window.location.href.split('#/');
        location[1] = this.props.url

        let url = location.join('#/');

        window.location.href = url;
    }
    //Store methods

    render() {
        const { classes } = this.props;
        return (<Grid className={classes.grid} justifyContent="flex-end" alignItems="flex-end">
            <StyledBreadcrumb
                // component="p"
                // label={this.props.label.toUpperCase()}
                // onClick={this.redirect}
                icon={this.props.icon !== undefined ? this.props.icon() : null}
                
            />
        </Grid>);
    }

}

export default withStyles(styles)(FilterQuick);