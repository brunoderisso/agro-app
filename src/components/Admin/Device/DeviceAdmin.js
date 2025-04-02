import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import DeviceStore from "../../../stores/DeviceStore";
import DeviceAdminList from "./DeviceAdminList";
import history from "../../../history";
import styles from '../../../styles/Admin/Device/DeviceAdmin';
import tokens from "../../../stores/CancelTokenList"
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function PredizaAdminDevice(props) {
    const [flags, setFlags] = useState({
        isRecived: false,
        modalIsOpen: false
    });
    const [admin, setAdmin] = useState({ devices: [] });

    const { classes } = props;
    const tokenList = new tokens();

    const { t } = useTranslation();

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();

        DeviceStore.removeListener("add_device", () => { getDevices() });
        DeviceStore.removeListener("del_device", () => { getDevices() });
    }

    const bind = () => {
        DeviceStore.on("add_device", () => { getDevices() });
        DeviceStore.on("del_device", () => { getDevices() });

        getDevices();
    };

    const onClickAdd = () => {
        history.push("/admin/devices/new");
    }

    const responseGetDevices = (response) => {
        tokenList.remove(response.id);

        setAdmin({
            ...admin,
            devices: response,
        });
        setFlags({
            ...flags,
            isRecived: true,
        })
    };

    const getDevices = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setFlags({
            ...flags,
            isRecived: false,
        })
        DeviceStore.getDevices(cancelToken, responseGetDevices);
    };

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                    <Button onClick={onClickAdd} color="primary">{t('admin.addDevice')}</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {flags.isRecived ? <DeviceAdminList devices={admin.devices.data} /> : ""}
            </Grid>
        </Grid>
    );
})