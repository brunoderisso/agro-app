import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import styles from "../../styles/Common/Screens";
import SessionStore from "../../stores/SessionStore";
import history from "../../history";
import DashboardPage from "../../components/Dashboardv2/DashboardPage";

export default withStyles(styles)(withRouter(function Dashboard(props) {

	const [envId, setEnvId] = useState("");
	const [flags, setFlags] = useState({ environment: false });

	const { classes } = props;

	useEffect(() => {
		SessionStore.setView("dashboard");
		bind();

		return clear;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if ((props.match.params.envid || "") !== envId) {
			setEnvId(props.match.params.envid || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]);

	useEffect(() => {
		if (envId !== "") {
			setFlags({ ...flags, environment: false });

			const p = { ...SessionStore.getPreference(), environment: envId };

			SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
			SessionStore.setEnvironment(envId);
			setTimeout(() => {
				setFlags({ ...flags, environment: true });
			}, 300);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [envId]);

	const bind = () => {
		SessionStore.addListener("environment.change", handleEnvironmentChange);
	}

	const clear = () => {
		SessionStore.removeListener("environment.change", handleEnvironmentChange);
	}

	const handleEnvironmentChange = (id) => {
		SessionStore.emit("environmentName.update", SessionStore.getSelectedEnvironment())

		if (id !== envId && id !== "preference") {
			let path = history.location.pathname.split("/");

			path = "/" + path[1] + "/" + id;
			history.replace(path);
		}
	}

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
					<DashboardPage environmentId={envId} />
				</Grid>
			</View>
		</div>
	);
}))
