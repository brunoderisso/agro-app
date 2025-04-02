import React from 'react';

//Material UI
import Grid from "@material-ui/core/Grid";

import toolsUtils from "../../../utils/toolsUtils"
//Prediza
import ServiceProfileList from "./ServiceProfileList";

export default (function ServiceProfilePage(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                {!toolsUtils.isNullOrEmpty(props, "organization") && <ServiceProfileList organization={props.organization} />}
            </Grid>
        </Grid>
    );
});