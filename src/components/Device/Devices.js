import React, { useState, useEffect } from 'react';

import Grid from "@material-ui/core/Grid";
import Grow from '@material-ui/core/Grow';

import DeviceCard from "./DeviceCard"
import AccountStore from "../../stores/AccountStore";
import SessionStore from "../../stores/SessionStore";


export default function PredizaDevice() {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        bind();
        getDevices();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getDevices);
        AccountStore.on("associate_device", getDevices);
        AccountStore.on("desassociate_device", getDevices);
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", getDevices);
        AccountStore.removeListener("associate_device", getDevices);
        AccountStore.removeListener("desassociate_device", getDevices);
    }

    const getDevices = () => {
        AccountStore.getEnvironmentDevices(resp => {
            setDevices(resp);
        });
    }

    const reload = () => {
        let devs = devices;
        setDevices([]);
        setDevices(devs);
    }

    return (
        <Grow in={devices.length > 0} unmountOnExit timeout={1000}>
            <Grid container>
                {devices.map((device) => (
                    <DeviceCard device={device} reload={reload} key={device.deveui} />
                ))}
            </Grid>
        </Grow>
    );
}