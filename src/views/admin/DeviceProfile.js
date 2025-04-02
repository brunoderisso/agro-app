import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import DeviceProfileEditPage from "../../components/Admin/DeviceProfile/DeviceProfileEditPage";
import AdminMenu from "../../components/Admin/AdminMenu";
import DeviceProfileAddPage from "../../components/Admin/DeviceProfile/DeviceProfileAddPage"
import history from "../../history";
import styles from "../../styles/Admin/Organization/OrganizationView"
import toolsUtils from "../../utils/toolsUtils";


export default withRouter(withStyles(styles)(function DeviceProfile(props) {
    const [organizationObjectId, setOrganizationObjectId] = useState("");
    const [profileId, setProfileId] = useState("");
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if ((props.match.params.id || "") !== organizationObjectId) {
            setOrganizationObjectId(props.match.params.id || "");
        };
        if ((props.match.params.dev || "") !== profileId) {
            setProfileId(props.match.params.dev || "");
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        setFlag(isValid())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organizationObjectId, profileId]);

    const isValid = () => {
        if (organizationObjectId !== undefined && organizationObjectId !== null && !toolsUtils.isEmptyString(organizationObjectId)) {
            if (profileId !== undefined && profileId !== null && !toolsUtils.isEmptyString(profileId)) {
                return true;
            }
        }
        return false;
    }

    return (
        <Grid container >
            <MenuBar />
            {flag &&
                <Grid>
                    <AdminMenu change={() => { history.push("/admin") }} selected="organizations" />
                    {profileId === "new" && <DeviceProfileAddPage organizationObjectID={organizationObjectId} />}
                    {profileId !== "new" && <DeviceProfileEditPage organizationID={organizationObjectId} dev={profileId} />}
                </Grid>}
        </Grid>
    );

}))


