import React, { useEffect, useState } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import EnvironmentStore from "../../../stores/EnvironmentStore";
import DeviceStore from "../../../stores/DeviceStore";
import toolsUtils from "../../../utils/toolsUtils";
import EnvironmentDeviceList from "./EnvironmentDeviceList";
import AssociateEnvironmentDevice from "../../AssociateEnvironmentDevice";
import styles from "../../../styles/Admin/Environment/EnvironmentForm";
import tokens from "../../../stores/CancelTokenList"


export default withStyles(styles)(function EnvironmentDevice(props) {
    const [environmentdevice, setEnvironmentdevice] = useState([]);
    const [environmentOptions, setEnvironmentOptions] = useState([]);

    const [flags, setFlags] = useState({
        isRecived: false,
    });

    const tokenList = new tokens();
    const { classes } = props;

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "environment.objectid")) {
            bind();
            getEnvironmentDevice();
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const clear = () => {
        tokenList.clear();

        EnvironmentStore.removeListener("associate_device", getEnvironmentDevice);
        EnvironmentStore.removeListener("desassociate_device", getEnvironmentDevice);
    }

    const bind = () => {
        EnvironmentStore.on("associate_device", getEnvironmentDevice);
        EnvironmentStore.on("desassociate_device", getEnvironmentDevice);
    }

    const responseGetEnvironmentDevices = (value) => {
        tokenList.remove(value.id);
        setEnvironmentdevice(value.data);

        getDevices();
    }

    const responseGetDevices = (value) => {
        tokenList.remove(value.id);
        let diff = value.data.map((val) => {
            let find = environmentdevice.find((value) => {
                return value.deveui === val.deveui
            })

            if (find === undefined) {
                return val;
            } else {
                return null
            }
        })

        let arr = []

        diff.forEach((val) => {
            if (val !== null) {
                arr.push({ value: val.deveui, label: val.name })
            }
        })

        setEnvironmentOptions(arr);

        setFlags({
            ...flags,
            isRecived: true,
        })
    };

    const getEnvironmentDevice = () => {
        if (props.environment !== undefined && props.environment.objectid !== undefined) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            EnvironmentStore.getEnvironmentDevices(cancelToken, props.environment.objectid, responseGetEnvironmentDevices)
        }
    };

    const getDevices = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        DeviceStore.getDevices(cancelToken, responseGetDevices)
    };

    return (
        <Grid container className={classes.containerBox}>
            <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                    Dispositivos
                    </Typography>
            </Grid>
            <Grid item xs={12}>
                {flags.isRecived && !props.disabled &&
                    <AssociateEnvironmentDevice environment={props.environment} options={environmentOptions} />
                }
            </Grid>
            <Grid item xs={12}>
                {flags.isRecived &&
                    <EnvironmentDeviceList disabled={props.disabled} environment={props.environment} devices={environmentdevice} />
                }
            </Grid>
        </Grid>
    );
})
