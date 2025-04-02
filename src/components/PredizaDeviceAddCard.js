import React from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid"

//Prediza 
import DeviceCardScan from "../components/Device/CardScan"
const styles = () => ({

});

export default withStyles(styles)(function FilterQuick(props) {

    //Component default methods

    //Event methods

    //Component methods

    //Store methods

    return (
        <Grid container>
            <Grid item xs={12}>
                <DeviceCardScan change={props.change} close={props.close} />
            </Grid>
        </Grid>
    );

})

