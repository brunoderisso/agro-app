import React, {useEffect} from 'react';
import { withRouter } from "react-router-dom";

import Grid from "@material-ui/core/Grid";

import NetworkProfilePage from "../../components/Admin/NetworkProfile/NetworkProfilePage";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import MenuBar from "../../components/ViewComponents/MenuBar";
import history from "../../history";


import SessionStore from "../../stores/SessionStore";


export default withRouter(function NetworkProfiles() {
    useEffect(()=>{
        SessionStore.setView("admin")
    },[]);

    return (
        <View>
            <Grid container>
                <MenuBar/>
                <AdminMenu change={()=>{history.push("/admin")}} selected="networkprofile" />
                <NetworkProfilePage/>
            </Grid>
        </View>
    );
})