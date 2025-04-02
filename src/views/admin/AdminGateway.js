import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import PredizaAdminGateway from "../../components/Admin/Gateway/PredizaAdminGateway";
import AdminMenu from "../../components/Admin/AdminMenu";
import history from "../../history"


export default withRouter(function AdminGateway(props) {
    const [id, setId] = useState("");

    useEffect(() => {
        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <Grid container style={{ paddingTop: '69px' }}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Gateways </title>
                <meta name="description" content="Prediza Gateways" />
            </Helmet>
            <MenuBar />
            <PredizaAdminGateway id={id} />
            <AdminMenu change={() => { history.push("/admin") }} selected="gateways"/>
        </Grid>
    );
})
