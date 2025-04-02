import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import InmetPage from "../../components/Inmet/NotebookInmetPage";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";
import history from '../../history';


export default withStyles(styles)(withRouter(function Inmet(props) {
    const [tab, setTab] = useState("");

    const { classes } = props

    useEffect(() => {
        SessionStore.setView("Inmet");

        if ((props.match.params.tab || "") !== tab) {
            setTab(props.match.params.tab || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if ((props.match.params.tab || "") !== tab) {
            setTab(props.match.params.tab || "");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "INMET | Prediza" });
    })

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>INMET | Prediza</title>
                    <meta name="description" content="Dados do Instituto Nacional de Meteorologia" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <InmetPage tab={tab} />
                </Grid>
            </View>
        </div>
    );
}))