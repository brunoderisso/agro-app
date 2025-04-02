import React, { useState, useEffect, useRef } from 'react';
import Timer from 'react-interval'

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import OptinModal from "../../Common/OptinModal";
import NotebookDashboardWidget from './NotebookDashboardWidget';
import styles from "../../../styles/Notebook/NotebookDashboardPage";
import SessionStore from "../../../stores/SessionStore";
import MeasureStore from "../../../stores/MeasureStore";
import DeviceStore from "../../../stores/DeviceStore";
import DashboardStore from "../../../stores/DashboardStore";
import toolsUtils from "../../../utils/toolsUtils";


export default withStyles(styles)(function NotebookDashboard(props) {
    const [measures, setMeasures] = useState(MeasureStore.getMeasures());
    const [data, setData] = useState({});
    const [timerPeriod, setTimerPeriod] = useState(0);
    const [selectedDevice, setSelectedDevice] = useState([]);
    const [preference, setPreference] = useState(SessionStore.getPreference());

    const device = useRef([]);
    const measuresRef = useRef(MeasureStore.getMeasures());

    const { classes } = props;

    useEffect(() => {
        getDevice()
        DeviceStore.init("dashboard");
        MeasureStore.init("dashboard");
        setTimerPeriod(SessionStore.timeRefresh || 0);
        bind();
        getMeasures();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (data.environment === undefined) {
            MeasureStore.init("dashboard");
            DeviceStore.init("dashboard");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onMeasureInit = () => {
        setMeasures(MeasureStore.measures);
    };

    const onDeviceInit = () => {
        getData();
    }

    const onTimeReload = (val) => {
        setTimerPeriod(val);
    }

    const onChangeDevice = () => {
        saveDevice();
    }

    const onChangeData = () => {
        getData();
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

    const onEnvironmentChange = (val) => {
        if (val === "preference") {
            setPreference(SessionStore.getPreference());
        } else {
            setData({ environment: undefined });
            onMeasureInit();
        }
    };

    const bind = () => {
        DeviceStore.addListener("device_init", onDeviceInit);
        DeviceStore.addListener("change.device", onChangeDevice);
        DeviceStore.addListener("devices_dashboard", getDevice);
        MeasureStore.addListener("change.measure", onMeasureInit);
        MeasureStore.addListener("measure_init", onMeasureInit);
        SessionStore.addListener("environment.change", onEnvironmentChange);
        SessionStore.addListener("time.change", onChangeData);
        SessionStore.addListener("time.reload", onTimeReload);
        SessionStore.addListener("device.change", onChangeDevice);
        SessionStore.addListener("function.change", onChangeData);
        SessionStore.addListener("fill.change", onChangeData);
    };

    const clear = () => {
        DeviceStore.removeListener("device_init", onDeviceInit);
        DeviceStore.removeListener("change.device", onChangeDevice);
        DeviceStore.removeListener("devices_dashboard", getDevice);
        MeasureStore.removeListener("change.measure", onChangeData);
        MeasureStore.removeListener("measure_init", onMeasureInit);
        SessionStore.removeListener("environment.change", onEnvironmentChange);
        SessionStore.removeListener("time.change", onChangeData);
        SessionStore.removeListener("time.reload", onTimeReload);
        SessionStore.removeListener("device.change", onChangeDevice);
        SessionStore.removeListener("function.change", onChangeData);
        SessionStore.removeListener("fill.change", onChangeData);
    }

    const getData = () => {
        DashboardStore.getDashboardDataOld(responseGetData);
    }

    const getDevice = () => {
        if (device.current === undefined || device.current === null || device.current.length === 0) {
            DashboardStore.getDashboardDevice(responseGetDevice);
        }
    }

    const responseGetDevice = (val) => {
        if (val !== undefined &&
            val !== null &&
            val.devices !== undefined &&
            val.devices !== null) {
            device.current = val.devices;
        } else {
            device.current = [];
        }
    }

    const saveDevice = () => {
        if (DeviceStore.devices.includes("environment")) {
            return;
        }
        if (device.current !== null && device.current !== undefined && device.current.length > 0) {
            if (DeviceStore.devices.includes("environment")) {
                setSelectedDevice(DeviceStore.devices);
                return
            }
            let dev = [];
            device.current.forEach(element => {
                if (DeviceStore.devices.includes(element.deveui) || DeviceStore.devices.includes("all")) {
                    dev.push(element);
                }
            });

            setSelectedDevice(dev);
        }
    }

    const getDevices = () => {
        if (selectedDevice.length === 0 ||
            DeviceStore.devices.includes("environment")) {
            return "";
        };

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
                        <NotebookDashboardWidget measure={detail.name} meta={detail.meta} stats={m.stats} device={dev.deveui} />
                    </Grid>
                )
            })
        })
    }

    const getEnvironmentWidgets = () => {
        if (toolsUtils.isNullOrEmpty(data, "environment.measure") ||
            !DeviceStore.devices.includes("environment")) {
            return "";
        }

        return data.environment.measure.map((m, index) => {
            let detail = MeasureStore.getMeasureDetail(m.measure);

            if (toolsUtils.isNullOrEmpty(detail, "name") || detail.name.includes("_")) {
                return "";
            }

            if (!measures.includes("all") && !measures.includes(detail.name)) {
                return "";
            }

            return (
                <Grid key={index} className={classes.grid}>
                    <NotebookDashboardWidget measure={detail.name} meta={detail.meta} stats={m.stats} environment={data.environment.name} />
                </Grid>
            )
        });
    }

    const responseGetData = (response) => {
        setData(MeasureStore.alphabeticalSortMeasures(response, measuresRef.current));
    }

    return (
        <Grid container>
            {getEnvironmentWidgets()}

            {getDevices()}

            <OptinModal open={preference.optedat !== null && new Date(preference.optedat).getYear() < 100} close={() => { }} />
            <Timer
                timeout={timerPeriod}
                enabled={timerPeriod > 0}
                callback={() => {
                    let diff = SessionStore.getTimeDiff() / 3600000
                    SessionStore.setTime(diff)
                }}
            ></Timer>
        </Grid>
    );
});