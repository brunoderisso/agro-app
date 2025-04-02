import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";

import ChillHourPage from "../../components/ChillHour/ChillHourPage";
import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";

import { Helmet } from "react-helmet"
import SessionStore from "../../stores/SessionStore";
import { useTranslation } from 'react-i18next';
import history from '../../history';


export default withRouter(function ChillHour() {
    const { t } = useTranslation();

    useEffect(() => {
        SessionStore.setView("Evapo")

        const script = document.createElement('script');
        script.src = "http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Horas de Frio | Prediza" });
    })

    return (
        <View>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{t('common.chillHours')} | Prediza</title>
                <meta name="description" content={t('common.chillHours')} />
            </Helmet>
            <Grid container>
                <MenuBar />
                <ChillHourPage />
            </Grid>
        </View>
    );
});