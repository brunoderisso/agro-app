import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ExpandPanel from "../../Common/Chart/ExpandPanel";

import SessionStore from '../../../stores/SessionStore';
import MeasureStore from '../../../stores/MeasureStore';
import DeviceStore from '../../../stores/DeviceStore';
import toolsUtils from '../../../utils/toolsUtils';
import styles from '../../../styles/Common/Chart/ChartList'


export default withStyles(styles)(function ChartList(props) {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState([]);
    const [flagGetDevices, setFlagGetDevices] = useState(false);

    const { classes } = props;

    useEffect(() => {
        init();
        bind();
        reloadRequests();
        loadDevices();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        saveDevice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devices]);

    const onChangeDevice = () => {
        setDevices(SessionStore.getDevices());
    }

    const onEnvironmentChange = (val) => {
        if (val === "preference") {
            return;
        }

        init();
    };

    const bind = () => {
        DeviceStore.addListener("change.device", onChangeDevice);
        DeviceStore.addListener("device_init", onChangeDevice);
        MeasureStore.addListener("change.measure", () => { });
        MeasureStore.addListener("measure_init", () => { });
        SessionStore.addListener("environment.change", onEnvironmentChange);
        SessionStore.addListener("environments.update", loadDevices);
        SessionStore.addListener("devices_get", handleGetDevices);
    };

    const clear = () => {
        reloadRequests();

        DeviceStore.removeListener("device_init", onChangeDevice);
        DeviceStore.removeListener("change.device", onChangeDevice);
        MeasureStore.removeListener("change.measure", () => { });
        MeasureStore.removeListener("measure_init", () => { });
        SessionStore.removeListener("environment.change", onEnvironmentChange);
        SessionStore.removeListener("environments.update", loadDevices);
        SessionStore.removeListener("devices_get", handleGetDevices);
    };

    const init = () => {
        DeviceStore.init("chart");
        MeasureStore.init("chart");
    };

    const handleGetDevices = () => {
        setDevices(SessionStore.getDevices());
        setFlagGetDevices(true);
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

    const loadDevices = () => {
        setFlagGetDevices(false);
        getDevices();
    }

    const getPanels = () => {
        if (!selectedDevice) {
            return "";
        }

        let devicesfiltered = selectedDevice.filter((el) => { return el != null; });

        if (devicesfiltered.length === 0) {
            return "";
        }

        return devicesfiltered.map(device => {
            if (toolsUtils.isNullOrEmpty(device, "measures")) {
                return "";
            }

            if (!(DeviceStore.devices.includes(device.deveui) || DeviceStore.devices.includes("all"))) {
                return "";
            }

            return device.measures.map((measure) => {
                if (measure.name[0] === "_") {
                    return "";
                }

                if (!(MeasureStore.measures.includes(measure.name) || MeasureStore.measures.includes("all"))) {
                    return "";
                }

                const fullMeasure = SessionStore.getMeasure(measure.name);

                return (<ExpandPanel measure={fullMeasure} device={device} key={device.deveui + measure.name} />)
            });
        });
    };

    const reloadRequests = () => {
        SessionStore.clear();
        MeasureStore.clear();
        DeviceStore.clear();
    };

    const saveDevice = () => {
        if (!devices) {
            setSelectedDevice([]);

            return;
        }

        let device = devices.filter((v) => { return DeviceStore.devices.includes(v.deveui) || DeviceStore.devices.includes("all") });

        setSelectedDevice(device);
    };

    return (
        <Grid className={classes.root}>
            {flagGetDevices && getPanels()}
        </Grid>
    );
})