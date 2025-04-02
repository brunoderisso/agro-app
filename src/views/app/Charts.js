import React, { useEffect } from "react";
import { Helmet } from "react-helmet"
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import DashboardFooter from "../../components/Dashboard/DashboardFooter";
import Chart from "../../components/Common/Chart/Chart";
import VerticalBar from "../../components/Dashboard/VerticalBar";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";
import { useTranslation } from "react-i18next";
import history from "../../history";


export default withStyles(styles)(withRouter(function Charts(props) {
    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        SessionStore.setView("chart");
    }, [])

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Charts | Prediza" });
    })

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Charts | Prediza</title>
                    <meta name="description" content={t('common.predizaCharts')} />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    <VerticalBar view="chart" />
                    <Chart />
                    <DashboardFooter tab={2} />
                </Grid>
            </View>
        </div>
    );
}))
