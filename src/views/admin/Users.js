import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet"

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import UsersPage from "../../components/Admin/User/UsersPage";
import MenuBar from "../../components/ViewComponents/MenuBar";
import AdminMenu from "../../components/Admin/AdminMenu";
import View from "../../components/PredizaView";
import history from "../../history"
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";


export default withStyles(styles)(withRouter(function Users(props) {
    const { classes } = props;

    useEffect(() => {
        SessionStore.setView("user")
    }, []);

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prediza | Usuários</title>
                    <meta name="description" content="Prediza Usuários" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <UsersPage />
                    <AdminMenu change={() => { history.push("/admin") }} selected="users"/>
                </Grid>
            </View>
        </div>
    );
}))