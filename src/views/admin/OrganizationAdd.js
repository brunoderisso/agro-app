import React from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import AdminMenu from "../../components/Admin/AdminMenu";
import MenuBar from "../../components/ViewComponents/MenuBar";
import OrganizationAddPage from "../../components/Admin/Organization/OrganizationAddPage";
import history from "../../history";
import styles from "../../styles/Admin/Organization/OrganizationView"



export default withRouter(withStyles(styles)(function Dashboard(props) {
    return (
        <Grid container >
            <MenuBar />
            <AdminMenu change={() => { history.push("/admin") }} selected="organizations" />
            <OrganizationAddPage />
        </Grid>
    );

}))

