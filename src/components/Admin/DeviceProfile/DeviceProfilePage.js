import React from 'react';

//Material UI
import Grid from "@material-ui/core/Grid";

import toolsUtils from "../../../utils/toolsUtils"
//Prediza
import DeviceProfileList from "./DeviceProfileList";

export default (function DeviceProfilePage(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                {!toolsUtils.isNullOrEmpty(props, "organization") && <DeviceProfileList organization={props.organization} />}
            </Grid>
        </Grid>
    );
});