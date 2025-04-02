import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import OrganizationEditPage from "../../components/Admin/Organization/OrganizationEditPage";
import AdminMenu from "../../components/Admin/AdminMenu";
import history from "../../history";
import styles from "../../styles/Admin/Organization/OrganizationView"
import SessionStore from "../../stores/SessionStore"


export default withRouter(withStyles(styles)(function Dashboard(props) {
    const [id, setId] = useState("");

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        };
        SessionStore.setView("admin");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid container >
            <MenuBar />
            <AdminMenu change={() => { history.push("/admin") }} selected="organizations" />
            {id.length > 0 && <OrganizationEditPage id={id} />}
        </Grid>
    );

}))


