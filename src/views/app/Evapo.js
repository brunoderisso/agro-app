import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";

import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import EvapoPage from "../../components/Evapo/EvapoPage";
import { Helmet } from "react-helmet"
import SessionStore from "../../stores/SessionStore";
import { LocalConfig } from "../../LocalConfig"
import history from '../../history';

export default withRouter(function Evapo() {
    useEffect(() => {
        SessionStore.setView("Evapo")

        const script = document.createElement('script');

        script.src = "https://maps.googleapis.com/maps/api/js?key="+ LocalConfig.googleMapsToken + "&libraries=geometry";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Evapo | Prediza" });
    })

    return (
        <View>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Evapo | Prediza</title>
                <meta name="description" content="Evapo | Prediza" />
            </Helmet>
            <Grid container style={{ width: "100%" }}>
                <MenuBar />
                <EvapoPage />
            </Grid>
        </View>
    );
});