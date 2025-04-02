import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import Grid from '@material-ui/core/Grid';

import MenuBar from "../../components/ViewComponents/MenuBar";
import PredizaAdmin from "../../components/Admin/PredizaAdmin";
import ValidationStore from "../../stores/ValidationStore";
import SessionStore from "../../stores/SessionStore";


export default withRouter(function Admin() {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        ValidationStore.validate(() => {
            if (ValidationStore.isAdmin()) {
                setIsValid(true);
            }
        });

        SessionStore.setView("admin");
    }, []);

    return (
        <Grid container style={{ paddingTop: '69px' }}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Administrativo </title>
                <meta name="description" content="Prediza Dispositivos" />
            </Helmet>
            {isValid ? <MenuBar /> : ""}
            {isValid ? <PredizaAdmin /> : ""}
        </Grid>
    );
})
