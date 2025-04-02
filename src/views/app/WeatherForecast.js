import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";

import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import WeatherForecastPage from "../../components/WeatherForecast/WeatherForecastPage";
import SessionStore from "../../stores/SessionStore";
import history from '../../history';


export default withRouter(function Tresholds() {
    useEffect(() => {
        SessionStore.setView("forecast");
    }, []);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Previsão do Tempo | Prediza" });
    })

    return (
        <View>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Previsão do Tempo | Prediza</title>
                <meta name="description" content="Previsão do Tempo | Prediza" />
            </Helmet>
            <Grid container style={{ width: "100%", marginBottom: "-20px" }}>
                <MenuBar />
                <WeatherForecastPage />
            </Grid>
        </View>
    );
});