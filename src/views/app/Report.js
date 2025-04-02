import React, { useEffect } from "react";
import { Helmet } from "react-helmet"
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import DashboardFooter from "../../components/Dashboard/DashboardFooter";
import VerticalBar from "../../components/Dashboard/VerticalBar";
import PredizaReport from "../../components/PredizaStats/PredizaReport";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import MeasureStore from "../../stores/MeasureStore";
import styles from "../../styles/Common/Screens";
import history from "../../history";


export default withStyles(styles)(withRouter(function Report(props) {
    const { classes } = props;

    useEffect(() => {
        SessionStore.setView("report");
        MeasureStore.init("report");
    }, [])

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Report | Prediza" });
    })

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>Report | Prediza</title>
                    <meta name="description" content="Prediza Relatórios"/>
                </Helmet>
                <Grid container>
                    <MenuBar/>
                    <VerticalBar view="report"/>
                    <PredizaReport/>
                    <DashboardFooter tab={3}/>
                </Grid>
            </View>
        </div>
    );
}))
