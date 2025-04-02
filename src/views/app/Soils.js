import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";
import MenuBar from '../../components/ViewComponents/MenuBar';
import SoilsPage from '../../components/Soils/SoilsPage';
import SessionStore from '../../stores/SessionStore';
import history from '../../history';

export default withRouter(function Soils(props) {

    const [id, setId] = useState("");

    useEffect(() => {
        setId(props.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (id !== "") {
            const p = { ...SessionStore.getPreference(), environment: id };
            SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
            SessionStore.setEnvironment(id);
        } else {
            let env = SessionStore.getPreference().environment;
            history.push("/soil/" + env);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Solos | Prediza" });
    })

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Solos | Prediza</title>
                <meta name="description" content="Solos" />
            </Helmet>
            <MenuBar />
            {id !== "" &&
                <SoilsPage environmentId={id} />
            }
        </Grid >
    );
});