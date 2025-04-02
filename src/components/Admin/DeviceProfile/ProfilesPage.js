import React, {useEffect} from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";

import toolsUtils from "../../../utils/toolsUtils"
//Prediza
import DeviceProfilePage from "./DeviceProfilePage";
import ServiceProfilePage from "../ServiceProfile/ServiceProfilePage";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";
import PredizaTabs from "../../Common/PredizaTabs";

export default withStyles(style)(function ProfilesPage(props) {
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    return (
        <Grid container>
            <Grid item xs={12}>
                {!toolsUtils.isNullOrEmpty(props, "organization") &&
                    <PredizaTabs data={[
                        { label: "Device Profile", component: <Grid container><DeviceProfilePage organization={props.organization} /></Grid> },
                        { label: "Service Profile", component: <Grid container><ServiceProfilePage organization={props.organization} /></Grid> },
                    ]} />
                }
            </Grid>
        </Grid>
    );
});