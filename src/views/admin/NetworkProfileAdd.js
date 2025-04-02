import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import TresholdAddPage from "../../components/Admin/NetworkProfile/NetworkProfileAddPage";
import MenuBar from"../../components/ViewComponents/MenuBar";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import history from "../../history";

export default withRouter(function TresholdAdd() {
    useEffect(() => {
        SessionStore.setView("admin");
    }, []);

    return (
        <View>
            <Grid container>
                <MenuBar />
                <AdminMenu change={()=>{history.push("/admin")}} selected="networkprofile" />
                <TresholdAddPage />
            </Grid>
        </View>
    );

});