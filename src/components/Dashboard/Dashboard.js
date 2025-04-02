import React, { useState, useEffect, useRef } from 'react';
import Timer from 'react-interval'

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import OptinModal from "../Common/OptinModal";
import PredizaWidget from '../PredizaWidget2';
import SessionStore from "../../stores/SessionStore";
import MeasureStore from "../../stores/MeasureStore";
import DeviceStore from "../../stores/DeviceStore";
import DashboardStore from "../../stores/DashboardStore";
import toolsUtils from "../../utils/toolsUtils";
import styles from '../../styles/Dashboard/Dashboard';


export default withStyles(styles)(function Dashboard(props) {
    const { classes } = props;

    const [measures, setMeasures] = useState(MeasureStore.getMeasures());
    const [data, setData] = useState({});
    const [timerPeriod, setTimerPeriod] = useState(SessionStore.timeRefresh || 0);
    const [selectedDevice, setSelectedDevice] = useState([]);
    const [preference, setPreference] = useState(SessionStore.getPreference());
    const [flagGetMeasures, setFlagGetMeasures] = useState(false);

    const device = useRef([]);
    const measuresRef = useRef(MeasureStore.getMeasures());

    useEffect(() => {
        restart();
        bind();

        getMeasures();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data.environment === undefined) {
            DeviceStore.init("dashboard");
            MeasureStore.init("dashboard");
        }
    }, [data]);

    const restart = () => {
        SessionStore.clear();
        MeasureStore.clear();
        DeviceStore.clear();
        DashboardStore.clear();
    };

    const getMeasures = () => {
        setFlagGetMeasures(false);

        const allMeasures = JSON.parse(localStorage.getItem("measures"));
        const environment = localStorage.getItem("environment");

        if (allMeasures) {
            const envMeasures = allMeasures.find(measu => measu.environment === environment);

            if (envMeasures) {
                SessionStore.setMeasuresToEnvironment(envMeasures.measures);
            }
        }
    }

    const onMeasureInit = () => {
        setMeasures(MeasureStore.measures);
    };

    const onTimeReload = (val) => {
        restart();
        setTimerPeriod(val);
    };

    const onChangeDevice = () => {
        restart();
        saveDevice();
    };

    const onChangeData = () => {
        restart();
        getData();
    };

    const onEnvironmentChange = (val) => {
        restart();

        if (val === "preference") {
            setPreference(SessionStore.getPreference());
        } else {
            setData({ environment: undefined });
            setMeasures(MeasureStore.getMeasures());
        }
    };

    const bind = () => {
        DeviceStore.addListener("device_init", onChangeData);
        DeviceStore.addListener("change.device", onChangeDevice);
        DeviceStore.addListener("devices_dashboard", getDevice);
        MeasureStore.addListener("change.measure", onMeasureInit);
        MeasureStore.addListener("measure_init", onMeasureInit);
        SessionStore.addListener("environment.change", onEnvironmentChange);
        SessionStore.addListener("environments.update", getMeasures);
        SessionStore.addListener("time.change", onChangeData);
        SessionStore.addListener("time.reload", onTimeReload);
        SessionStore.addListener("device.change", onChangeDevice);
        SessionStore.addListener("function.change", onChangeData);
        SessionStore.addListener("fill.change", onChangeData);
        SessionStore.addListener("measures_get", () => setFlagGetMeasures(true));
    };

    const clear = () => {
        DeviceStore.removeListener("device_init", onChangeData);
        DeviceStore.removeListener("change.device", onChangeDevice);
        DeviceStore.removeListener("devices_dashboard", getDevice);
        MeasureStore.removeListener("change.measure", onChangeData);
        MeasureStore.removeListener("measure_init", onMeasureInit);
        SessionStore.removeListener("environment.change", onEnvironmentChange);
        SessionStore.removeListener("environments.update", getMeasures);
        SessionStore.removeListener("time.change", onChangeData);
        SessionStore.removeListener("time.reload", onTimeReload);
        SessionStore.removeListener("device.change", onChangeDevice);
        SessionStore.removeListener("function.change", onChangeData);
        SessionStore.removeListener("fill.change", onChangeData);
        SessionStore.removeListener("measures_get", () => setFlagGetMeasures(true));

        restart();
    };

    const getData = () => {
        DashboardStore.getDashboardDataOld(responseGetData);
    };

    const getDevice = () => {
        if (!device.current || device.current.length === 0) {
            DashboardStore.getDashboardDevice(reponseGetDevice);
        }
    };

    const reponseGetDevice = (val) => {
        if (val?.devices) {
            device.current = val.devices;
        } else {
            device.current = undefined;
        }
    };

    const saveDevice = () => {
        if (DeviceStore.devices.includes("environment")) {
            return;
        }

        if (device.current) {
            if (DeviceStore.devices.includes("environment")) {
                setSelectedDevice(DeviceStore.devices);

                return;
            }

            const deviceFiltered = device.current.filter(v => { return DeviceStore.devices.includes(v.deveui) || DeviceStore.devices.includes("all") });

            setSelectedDevice(deviceFiltered);
        }
    };

    const getDevices = () => {
        if (!selectedDevice || DeviceStore.devices.includes("environment")) {
            return "";
        }

        return selectedDevice.map((dev) => {
            if (toolsUtils.isNullOrEmpty(dev, "measure")) {
                return "";
            }

            return dev.measure.map((m, index) => {
                let detail = MeasureStore.getMeasureDetail(m.measure);
                if (toolsUtils.isNullOrEmpty(detail, "name") || detail.name.includes("_")) {
                    return "";
                }

                if (!measures.includes("all") && !measures.includes(detail.name)) {
                    return "";
                }

                return (
                    <Grid key={index} className={classes.grid}>
                        <PredizaWidget measure={detail.name} meta={detail.meta} stats={m.stats} device={dev.deveui} />
                    </Grid>
                )
            })
        })
    };

    const getEnvironmentWidgets = () => {
        if (toolsUtils.isNullOrEmpty(data, "environment.measure") ||
            !DeviceStore.devices.includes("environment")) {
            return "";
        }

        let isDuplicateItems = [];

        return data.environment.measure.map((m, index) => {
            const detail = MeasureStore.getMeasureDetail(m.measure);

            if (detail && isDuplicateItems.includes(detail.name)) {
                return ""
            } else {
                isDuplicateItems.push(m.measure)

                if (toolsUtils.isNullOrEmpty(detail, "name") || detail.name.includes("_")) {
                    return "";
                }

                if (!measures.includes("all") && !measures.includes(detail.name)) {
                    return "";
                }

                return (
                    <Grid key={index} className={classes.grid}>
                        <PredizaWidget measure={detail.name} meta={detail.meta} stats={m.stats} environment={data.environment.name} />
                    </Grid>
                )
            }

        });

    };

    const responseGetData = (response) => {
        setData(MeasureStore.alphabeticalSortMeasures(response, measuresRef.current));
    };

    return (
        <Grid container>
            {flagGetMeasures && getEnvironmentWidgets()}

            {getDevices()}

            <OptinModal open={preference.optedat !== null && new Date(preference.optedat).getYear() < 100} />
            <Timer timeout={timerPeriod}
                enabled={timerPeriod > 0}
                callback={() => {
                    let diff = SessionStore.getTimeDiff() / 3600000
                    SessionStore.setTime(diff)
                }}
            ></Timer>
        </Grid>
    );
})