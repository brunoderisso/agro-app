import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import DevicePage from "../../components/Device/DevicePage";
import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";
import history from '../../history';


export default withStyles(styles)(withRouter(function Device(props) {
    const { classes } = props;

    useEffect(() => {
		SessionStore.setView("device");
	}, [])

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Dispositivos | Prediza" });
    })

    return (
        <div className={classes.contentLowPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Dispositivos | Prediza</title>
                    <meta name="description" content="Dispositivos | Prediza" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <DevicePage />
                </Grid>
            </View>
        </div>
    );
}))
