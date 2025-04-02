import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet"

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import OrganizationsPage from "../../components/Admin/Organization/OrganizationsPage";
import ValidationStore from "../../stores/ValidationStore";
import AdminMenu from "../../components/Admin/AdminMenu";
import history from "../../history";
import SessionStore from "../../stores/SessionStore";
import View from "../../components/PredizaView";
import styles from "../../styles/Common/Screens";


export default withRouter(withStyles(styles)(function Organizations(props) {
    const { classes } = props;

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        SessionStore.setView("organization")
        ValidationStore.validate(() => {
            if (ValidationStore.isAdmin()) {
                setIsValid(true);
            }
        });
    }, []);

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prediza | Organizações</title>
                    <meta name="description" content="Prediza Organizações" />
                </Helmet>
                <Grid container >
                    {isValid && <MenuBar />}
                    <AdminMenu change={() => { history.push("/admin") }} selected="organizations" />
                    <OrganizationsPage />
                </Grid>
            </View>
        </div>

    );

}))

