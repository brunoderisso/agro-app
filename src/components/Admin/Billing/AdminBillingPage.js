import React from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI

import Grid from "@material-ui/core/Grid";


//Prediza 
import styles from "../../../styles/Admin/Billing/BillingPage";
import BillingDrawer from "./BillingDrawer";


export default withStyles(styles)(function AdminBillingPage(props) {


    return(
        <Grid container>
            <BillingDrawer />
        </Grid>
    )
})