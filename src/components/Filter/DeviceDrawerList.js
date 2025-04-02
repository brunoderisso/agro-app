import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

//Prediza
import SessionStore from "../../stores/SessionStore";
import DeviceStore from "../../stores/DeviceStore";
import toolsUtils from "../../utils/toolsUtils";
import tokens from "../../stores/CancelTokenList";

//Others
import { useTranslation } from 'react-i18next';
import { AnalitycsEvent } from '../../LocalConfig';

const style = () => ({
    conatiner: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 8,
        margin: 7,
        maxWidth: "95%",
        cursor: "pointer"
    },
    icon: {
        fontSize: 20
    },
    button: {
        minWidth: 15
    },
    font: {
        fontSize: "1.1rem"
    },
    text: {
        paddingTop: 8
    }
});

export default withStyles(style)(function DeviceDrawerList(props) {
    const [list, setList] = useState([]);
    const [device, setDevice] = useState("");

    const {t} = useTranslation();
    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getDevice();
        getDevices();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getDevice);
        DeviceStore.on("change.device", getDevice);
        DeviceStore.on("device_init", getDevice);
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getDevice);
        DeviceStore.removeListener("change.device", getDevice);
        DeviceStore.removeListener("device_init", getDevice);
        tokenList.clear();
    };

    const onSelectButtonClick = (d) => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/device/' + toolsUtils.getDeviceName(d), 'Change Device');

        DeviceStore.setDevice(d.deveui);
        props.onClose();
    }

    const Row = (d) => {
        const { classes } = props;
        return (
            <Grid key={d.deveui} container className={classes.conatiner} style={{ backgroundColor: device.includes(d.deveui) || (device.includes("all") && d.deveui !== "environment") ? "#2196f31c" : "" }} onClick={() => { onSelectButtonClick(d) }}>
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">{toolsUtils.getDeviceName(d)}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //Store
    const getDevices = () => {
        let devs = SessionStore.envDevices;
        devs = devs.sort(DeviceStore.sortFunction);
        setList(devs);
    };

    const getDevice = () => {
        setDevice(DeviceStore.devices || []);
    }

    return (
        <Grid container>
            {(props.view === "dashboard" || props.view === "chillhour") && Row({ deveui: "environment", description: t("dashboard.textEnvironment") })}
            {props.view !== "chillhour" && Row({ deveui: "all", description: /* "Todosss" */ t("common.allText") })}
            {list.map((val) => {
                return Row(val)
            })}

        </Grid>
    );
});