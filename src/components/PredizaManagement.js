import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza 
import NoteDashboard from "../components/NoteDashboard";

const styles = () => ({ 

    
});


class PredizaMangement extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            task: null,
            name: ""
        };

    }

    //Component default methods

    //Event methods
  
    //Component methods

    //Store methods

    render() {
        return (
            <Grid item xs={12}>
                <NoteDashboard />
            </Grid>
        );
    }

}

export default withStyles(styles)(PredizaMangement);