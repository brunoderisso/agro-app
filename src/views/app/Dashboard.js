import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import VerticalBar from "../../components/Dashboard/VerticalBar";
import DashboardFooter from "../../components/Dashboard/DashboardFooter";
import Dashboard from "../../components/Dashboard/Dashboard";
import View from "../../components/PredizaView";
import styles from "../../styles/Common/Screens";
import SessionStore from "../../stores/SessionStore";
import history from "../../history";


export default withStyles(styles)(withRouter(function DashboardPage(props) {
	const { classes } = props;

	useEffect(() => {
		SessionStore.setView("dashboard");
	}, [])

	history.listen((location) => {
		ReactGA.send({ hitType: "pageview", page: location, title: "Dashboard | Prediza" });
	})

	return (
		<div className={classes.contentHighPdLeft}>
			<View>
				<Helmet>
					<title>Dashboard | Prediza</title>
					<meta name="description" content="Dashboard | Prediza" />
				</Helmet>
				<Grid container>
					<MenuBar />
					<VerticalBar view="dashboard" />
					<Dashboard />
					<DashboardFooter tab={0} />
				</Grid>
			</View>
		</div>
	);
}))