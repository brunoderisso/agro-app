import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet"

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import EnvironmentPage from "../../components/Admin/Environment/EnvironmentAdmin";
import MenuBar from "../../components/ViewComponents/MenuBar";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import history from "../../history"
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";


export default withStyles(styles)(withRouter(function Environments(props) {
    const { classes } = props;

    useEffect(() => {
        SessionStore.setView("environments")
    }, []);

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prediza | Ambientes</title>
                    <meta name="description" content="Prediza Ambientes" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <EnvironmentPage />
                    <AdminMenu  change={() => { history.push("/admin") }} selected="environments"/>
                </Grid>
            </View>
        </div>
    );
}))
