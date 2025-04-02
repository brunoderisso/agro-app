import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import styles from "../../styles/GoogleMaps/AdvancedMap";

import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";
import ServicesDrawer from "./AdvancedSettings/ServicesDrawer";
import GoogleMapsv2 from "../Common/GoogleMaps/GoogleMapsv2";

import PolygonStore from "../../stores/PoligonStore";
import TokenList from '../../stores/CancelTokenList';
import GoogleMapsStore from "../../stores/GoogleMapsStore";
import ImplementsDrawer from "./ImplementsDrawer";
import DeviceStore from "../../stores/DeviceStore";
import UserFeedback from "../Common/UserFeedback";

export default withStyles(styles)(function AdvancedMap(props) {
    const tokenList = new TokenList();
    const { t } = useTranslation();

    const [environment, setEnvironment] = useState(null);
    const [environmentBounds, setEnvironmentBounds] = useState([]);
    const [areas, setAreas] = useState([]);
    const [devices, setDevices] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [machines, setMachines] = useState([]);

    const [openServices, setOpenServices] = useState(false);
    const [openImplements, setOpenImplements] = useState(false);

    const [viewWidgets, setViewWidgets] = useState({});
    const [errorResponse, setErrorResponse] = useState('');

    const ref = useRef();
    const flagServicesFeaturesRef = useRef();

    useEffect(() => {
        bind();
        getServicesFeatures(true);
        getAreas();
        getWidgetsPreference();
        getMachines();

        GoogleMapsStore.storeEnableCards(true);

        return clear;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.environmentId) {
            // Solução paliativa
            getMeasures();
            getDevices();

            const env = SessionStore.getEnvironment(props.environmentId);
            const bounds = env.polygon;

            setEnvironmentBounds(bounds);
            setEnvironment(env);
            setPolygons(SessionStore.getDataLocalStorage("polygons"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (environment) {
            setDevices(environment.devices);
        }
    }, [environment]);

    const bind = () => {
        GoogleMapsStore.addListener("advancedDrawer_click", onServicesDrawerOpen);
        GoogleMapsStore.addListener("servicesFeatures_refresh", getServicesFeatures);
    }

    const clear = () => {
        GoogleMapsStore.removeListener("advancedDrawer_click", onServicesDrawerOpen);
        GoogleMapsStore.removeListener("servicesFeatures_refresh", getServicesFeatures);
    }

    const getWidgetsPreference = () => {
        setViewWidgets(
            {
                forecast: true,
                evapo: true,
                ch: true,
                ch10: true,
                cold: true
            }
        )
    }

    const getMeasures = () => {
        const allMeasures = JSON.parse(localStorage.getItem("measures"));
        const environment = localStorage.getItem("environment");

        if (allMeasures) {
            const envMeasures = allMeasures.find(measu => measu.environment === environment);

            if (envMeasures) {
                SessionStore.setMeasuresToEnvironment(envMeasures.measures);
            }
        }
    }

    const getDevices = () => {
        const allDevices = JSON.parse(localStorage.getItem("devices"));
        const environment = localStorage.getItem("environment");

        if (allDevices) {
            const envDevices = allDevices.find(dev => dev.environment === environment);

            if (envDevices) {
                SessionStore.setDevicesToEnvironment(envDevices.devices);
            }
        }
    }

    const getServicesFeatures = (start = null) => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        flagServicesFeaturesRef.current = start;
        GoogleMapsStore.getServicesFeatures(cancelToken, responseServicesFeatures);
    }

    const responseServicesFeatures = (response) => {
        tokenList.remove(response.id);
        GoogleMapsStore.emit("googleMapsLoader_set", false);

        if (response.data) {
            // Ordena o objeto por ordem alfabética
            const sortedServicesAdvanced = Object.keys(response.data)
                .sort()
                .reduce((acc, key) => {
                    acc[key] = response.data[key];

                    return acc;
                }, {});

            // Ordena os arrays das features por ordem alfabética
            Object.entries(sortedServicesAdvanced).forEach(([name]) => {
                sortedServicesAdvanced[name].features.sort((a, b) => {
                    if (['inmet', 'coletor'].includes(name)) {
                        if (a.measure && b.measure) {
                            return t(`measures.${a.measure.replaceAll(" ", "_")}`)
                                .localeCompare(t(`measures.${b.measure.replaceAll(" ", "_")}`));
                        } else {
                            return a.name.localeCompare(b.name);
                        }
                    } else {
                        return t(`features.${name}_${a.name.replaceAll(" ", "_")}`)
                            .localeCompare(t(`features.${name}_${b.name.replaceAll(" ", "_")}`));
                    }
                });
            })

            GoogleMapsStore.storeServicesAdvancedMap(sortedServicesAdvanced, flagServicesFeaturesRef.current);
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const onServicesDrawerOpen = () => {
        setOpenServices(true);
    }

    const getAreas = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        PolygonStore.getAreas(cancelToken, responseGetAreas);
    }

    const getMachines = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        DeviceStore.getMachinesData(cancelToken, responseGetMachines);
    }

    const responseGetMachines = (response) => {
        tokenList.remove(response.id);

        if (response.data?.length > 0) {
            let data = [];

            response.data.forEach(element => {
                data.push({ ...element, path: [{ lat: element.latitude, lng: element.longitude }] })
            });
            setMachines(data);
        }
    }

    const responseGetAreas = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setAreas(response.data);
        }
    }

    const toggleServicesDrawer = () => {
        setOpenServices(!openServices);
        GoogleMapsStore.emit('advancedPanel_close', false)
    }
    const toggleImplementsDrawer = () => {
        setOpenImplements(!openImplements);
    }

    return (
        <Grid container>
            {!toolsUtils.isNullOrEmpty(environment, "latitude") &&
                <GoogleMapsv2
                    environment={environment}
                    environmentBounds={environmentBounds}
                    polygons={polygons}
                    areas={areas}
                    devices={devices}
                    machines={machines}
                    widgets={viewWidgets}
                    centerEnvironment
                    advancedMapControls
                    disableDefaultControls
                />
            }
            <ServicesDrawer open={openServices} reference={ref} onClose={toggleServicesDrawer} />
            <ImplementsDrawer open={openImplements} onClose={toggleImplementsDrawer} />
            <UserFeedback error={errorResponse} setError={setErrorResponse} />
        </Grid>
    )
})