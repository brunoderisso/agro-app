import React, { Suspense, useState, useRef, useEffect, lazy } from "react";
import { Route, Router, Switch } from "react-router-dom";
import ReactGA from "react-ga4";
import { CookiesProvider } from 'react-cookie';
import BeatLoader from "react-spinners/BeatLoader"

import classNames from "classnames";
import './css/App.css';
import "typeface-roboto";
import "./translate/i18n"

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import { Grow } from "@material-ui/core";
import { css } from '@emotion/core';

import Notifications from "./components/Notifications";
import history from "./history";
import SessionStore from "./stores/SessionStore";
import styles from "./styles/App";
import { useTranslation } from "react-i18next";
// import theme from "./styles/Utils/themes/PredizaTheme";

import { getThemeByDomain } from "./styles/Utils/theme2";
const domain = window.location.hostname;
const theme = getThemeByDomain(domain);


const Root = lazy(() => import('./views/app/Root'));
const Charts = lazy(() => import('./views/app/Charts'));
const Dashboard = lazy(() => import('./views/app/Dashboard'));
const Dashboard2 = lazy(() => import('./views/app/Dashboard2'));
const Inmet = lazy(() => import('./views/app/Inmet'));
const DataSheet = lazy(() => import('./views/app/DataSheet'));
const EnvironmentNotFound = lazy(() => import('./views/app/EnvironmentNotFound'));
const Preference = lazy(() => import('./views/user/Preference'));
const Gallery = lazy(() => import('./views/app/Gallery'));
const Device = lazy(() => import('./views/app/Device'));
const ChillHour = lazy(() => import('./views/app/ChillHour'));
const Notebook = lazy(() => import('./views/app/Notebook'));
const NotebookTag = lazy(() => import('./views/app/NotebookTag'));
const NotebookRastreabilityPage = lazy(() => import('./views/app/NotebookRastreabilityPage'));
const Report = lazy(() => import('./views/app/Report'));
const ReportManagement = lazy(() => import('./views/app/ReportManagement'));
const Admin = lazy(() => import('./views/admin/Admin'));
const AdminGateway = lazy(() => import('./views/admin/AdminGateway'));
const Organizations = lazy(() => import('./views/admin/Organizations'));
const Organization = lazy(() => import('./views/admin/Organization'));
const OrganizationAdd = lazy(() => import('./views/admin/OrganizationAdd'));
const Users = lazy(() => import('./views/admin/Users'));
const User = lazy(() => import('./views/admin/User'));
const UserAdd = lazy(() => import('./views/admin/UserAdd'));
const EnvironmentAdd = lazy(() => import('./views/admin/EnvironmentAdd'));
const Environment = lazy(() => import('./views/admin/Environment'));
const Environments = lazy(() => import('./views/admin/Environments'));
const DeviceEdit = lazy(() => import('./views/admin/Device'));
const Devices = lazy(() => import('./views/admin/Devices'));
const DevicesAdd = lazy(() => import('./views/admin/DeviceAdd'));
const Articles = lazy(() => import('./views/admin/Articles'));
const Article = lazy(() => import('./views/admin/Article'));
const ArticleAdd = lazy(() => import('./views/admin/ArticleAdd'));
const NetworkProfileAdd = lazy(() => import('./views/admin/NetworkProfileAdd'));
const NetworkProfile = lazy(() => import('./views/admin/NetworkProfile'));
const NetworkProfiles = lazy(() => import('./views/admin/NetworkProfiles'));
const Access = lazy(() => import('./views/user/Access'));
const DeviceProfile = lazy(() => import('./views/admin/DeviceProfile'));
const ServiceProfile = lazy(() => import('./views/admin/ServiceProfile'));
const WeatherForecast = lazy(() => import('./views/app/WeatherForecast'));
const Evapo = lazy(() => import('./views/app/Evapo'));
const Subscription = lazy(() => import('./views/app/Subscription'));
const Soils = lazy(() => import('./views/app/Soils'));
const Map = lazy(() => import('./views/app/Map'));
const RedirectMap = lazy(() => import('./views/app/RedirectMap'));
const Configuration = lazy(() => import('./views/user/Configuration'));
const RedirectConfiguration = lazy(() => import('./views/user/RedirectConfiguration'));
const ManagementAccount = lazy(() => import('./views/app/ManagementAccount'));
const Share = lazy(() => import('./views/user/RedirectShare'));


const loader = css`
    display: block;
    margin: 2 auto;
    border-color: red;
`;

ReactGA.initialize('G-2GQSBZXXTG');

// history.listen((location) => {
// 	ReactGA.send({ hitType: "pageview", page: location, title: "Custom Title" });
// })

export default withStyles(styles)(function App(props) {
	const [verticalDrawer, setVerticalDrawer] = useState(false);
	const [view, setView] = useState(SessionStore.view || "");
	const [location, setLocation] = useState("");

	const { classes } = props;

	const open = useRef(false);

	const {
		i18n: { changeLanguage }
	} = useTranslation()

	useEffect(() => {
		bind();
		setLanguage();

		open.current = true;

		return clear
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setLocation(window.location)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.location])

	const bind = () => {
		SessionStore.on("change", change);
		SessionStore.on("environment.change", changePreference);
		SessionStore.on("vertical_drawer", changeVerticalDrawer);
		SessionStore.on("change_view", changeView);
	}

	const clear = () => {
		SessionStore.removeListener("change", change);
		SessionStore.removeListener("environment.change", changePreference);
		SessionStore.removeListener("vertical_drawer", changeVerticalDrawer);
		SessionStore.removeListener("change_view", changeView);

		open.current = false
	}

	// TODO: checar se tem utilidade
	const change = () => {
		if (!open.current) {
			return;
		}
	}

	const changeVerticalDrawer = (val) => {
		if (!open.current) {
			return;
		}

		setVerticalDrawer(val);
	}

	const changeView = () => {
		setView(SessionStore.view);
	}

	// Funções para polígono
	// function circlePointSerialize(initialPoint, finalPoint, testPoint) {
	// 	function midPoint(p1, p2) {
	// 		return [
	// 			(p1[0] + p2[0]) / 2,
	// 			(p1[1] + p2[1]) / 2
	// 		];
	// 	}

	// 	function distancePoint(p1, p2) {
	// 		const deltaX = p1[0] - p2[0];
	// 		const deltaY = p1[1] - p2[1];
	// 		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	// 	}

	// 	const midPointResult = midPoint(initialPoint, finalPoint);
	// 	const raio = distancePoint(midPointResult, initialPoint);
	// 	const centerPoint = distancePoint(testPoint, midPointResult);

	// 	return {
	// 		resultadoPontoMeio: midPointResult,
	// 		raio: raio,
	// 		pontoTeste: testPoint,
	// 		pontoDentro: centerPoint <= raio
	// 	};
	// }

	// function isPointInsidePolygon(polygonArea, point) {
	// 	const polygonCoords = polygonArea
	// 		.replace(/\(\(/, '') // Remover os parênteses externos
	// 		.replace(/\)\)/, '')
	// 		.split('),(') // Separar as coordenadas
	// 		.map(coordGroup => coordGroup.split(',').map(coord => parseFloat(coord.trim())));

	// 	const polygonPoints = polygonCoords.map(coord => [coord[0], coord[1]]);

	// 	if (polygonPoints.length === 2) {

	// 		const point1 = polygonPoints[0];
	// 		const point2 = polygonPoints[1];

	// 		const outputResult = circlePointSerialize(point1, point2, point);

	// 		return outputResult;

	// 	} else {

	// 		let inside = false;
	// 		for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
	// 			const xi = polygonPoints[i][0], yi = polygonPoints[i][1];
	// 			const xj = polygonPoints[j][0], yj = polygonPoints[j][1];

	// 			const intersect = ((yi > point[1]) !== (yj > point[1])) &&
	// 				(point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);

	// 			if (intersect) inside = !inside;
	// 		}

	// 		return inside;
	// 	}

	// }

	const changePreference = (value) => {
		if (value === "preference") {
			setLanguage();
		}
	}

	const setLanguage = () => {
		const preference = SessionStore.getPreference()

		if (preference?.locale?.length > 0) {
			changeLanguage(preference.locale);
		} else {
			changeLanguage(navigator.language);
		}
	}

	const getFallback = () => {
		return (
			<Grid container alignItems="center" justifyContent="center" direction="column">
				<Grid item className={classes.stylesLoader}>
					<Grow in={true}>
						<BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={"px"} size={12} css={loader} />
					</Grow>
				</Grid>
			</Grid>
		);
	}

	if (location.hash === undefined) {
		return (<div></div>)
	}

	return (
		<Router history={history}>
			<CookiesProvider>
				<React.Fragment>
					<CssBaseline />
					<MuiThemeProvider theme={theme}>
						<div className={classes.root}>
							<div className={classNames(
								view === "plans" && classes.mainPlans,
								(view === "forecast" || view === "Evapo" || view === "heatmap" || view === "notebook" || view === "reportManagement" || view === "active") &&
								classes.mainForecast,
								verticalDrawer && classes.mainPoligon,
								(location.hash.split('/')[location.hash.split('/').length - 1] === "login" || location.hash.split('/')[location.hash.split('/').length - 1].includes("active")) &&
								classes.login,
								(["alarm", "gallery", "device", "view", "forecast", "Evapo", "notebook", "reportManagement", "active"].includes(view) || ["alarm", "gallery", "device", "view", "forecast", "Evapo", "notebook", "reportManagement", "active"].includes(SessionStore.view)) &&
								classes.alarm,
								view === "admin" && classes.admin,
								view === "error" && classes.notFoundError
							)}>
								<Grid container className={classes.container}>
									<Suspense fallback={getFallback()}>
										<Switch>
											<Route path="/preference" component={Preference} exact={true} />
											<Route path="/environmentnotfound" component={EnvironmentNotFound} exact={true} />

											<Route path="/chart" component={Charts} exact={true} />
											<Route path="/data" component={DataSheet} exact={true} />
											<Route path="/dashboard" component={Dashboard} exact={true} />
											<Route path="/dashboard/:envid" component={Dashboard2} exact={true} />
											<Route path="/gallery" component={Gallery} exact={true} />
											<Route path="/device" component={Device} exact={true} />

											<Route path="/inmet/:tab" component={Inmet} exact={true} />

											<Route path="/note/:envid/:tab/:taskid" component={Notebook} exact={true} />
											<Route path="/note/:envid/:tab" component={Notebook} exact={true} />
											<Route path="/notebook/:envid/tracer/:cropid" component={NotebookTag} exact={true} />
											<Route path="/notebook/:envid/rastreability/:cropid" component={NotebookRastreabilityPage} exact={true} />

											<Route path="/map" component={RedirectMap} exact={true} />
											<Route path="/map/:envid" component={Map} exact={true} />

											<Route path="/management/:tab" component={ManagementAccount} exact={true} />

											<Route path="/configuration" component={RedirectConfiguration} exact={true} />
											<Route path="/configuration/:envid" component={Configuration} exact={true} />

											<Route path="/stats" component={Report} />
											<Route path="/report/:envid/:page" component={ReportManagement} />
											<Route path="/report/:envid" component={ReportManagement} />

											<Route path="/admin/organizations" component={Organizations} exact={true} />
											<Route path="/admin/organizations/new" component={OrganizationAdd} exact={true} />
											<Route path="/admin/organizations/:id" component={Organization} exact={true} />
											<Route path="/admin/users" component={Users} exact={true} />
											<Route path="/admin" component={Admin} exact={true} />
											<Route path="/admin/gateways" component={AdminGateway} exact={true} />
											<Route path="/admin/gateway/:id" component={AdminGateway} exact={true} />
											<Route path="/admin/users/new" component={UserAdd} exact={true} />
											<Route path="/admin/devices/new" component={DevicesAdd} exact={true} />
											<Route path="/admin/devices/:id" component={DeviceEdit} exact={true} />
											<Route path="/admin/devices" component={Devices} exact={true} />
											<Route path="/admin/environments" component={Environments} exact={true} />
											<Route path="/admin/environments/new" component={EnvironmentAdd} exact={true} />
											<Route path="/admin/environments/:id" component={Environment} exact={true} />
											<Route path="/admin/users/:id" component={User} exact={true} />
											<Route path="/admin/organizations/:id/profile/device/:dev" component={DeviceProfile} exact={true} />
											<Route path="/admin/organizations/:id/profile/service/:serv" component={ServiceProfile} exact={true} />
											<Route path="/admin/networkserver" component={NetworkProfiles} exact={true} />
											<Route path="/admin/networkserver/new" component={NetworkProfileAdd} exact={true} />
											<Route path="/admin/networkserver/:id" component={NetworkProfile} exact={true} />

											<Route path="/article" component={Articles} exact={true} />
											<Route path="/article/:id" component={Article} exact={true} />
											<Route path="/article/new" component={ArticleAdd} exact={true} />

											<Route path="/subscription" component={Subscription} exact={true} />
											<Route path="/subscription/:id" component={Subscription} exact={true} />

											<Route path="/soil" component={Soils} exact={true} />
											<Route path="/soil/:id" component={Soils} exact={true} />

											<Route path="/chillhour" component={ChillHour} exact={true} />
											<Route path="/forecast" component={WeatherForecast} exact={true} />
											<Route path="/evapo" component={Evapo} exact={true} />

											<Route path="/share/:hash" component={Share} exact={true} />

											<Route path="/" component={Root} exact={true} />
											<Route path="/:page" component={Access} />

										</Switch>
									</Suspense>
								</Grid>
								<Notifications />
							</div>
						</div>
					</MuiThemeProvider>
				</React.Fragment>
			</CookiesProvider>
		</Router>
	);
})
