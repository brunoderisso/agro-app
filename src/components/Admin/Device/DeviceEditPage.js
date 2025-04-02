import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import styles from "../../../styles/Device/DeviceAdd"
import PredizaTabs from "../../Common/PredizaTabs"
import DeviceForm from "./DeviceForm";
import EnvironmentStore from "../../../stores/EnvironmentStore";
import DeviceStore from "../../../stores/DeviceStore";
import SessionStore from "../../../stores/SessionStore";
import toolsUtils from "../../../utils/toolsUtils";
import GoogleMaps from "../../Common/GoogleMaps/GoogleMaps";
import { useTranslation } from 'react-i18next';

export default withStyles(styles)(function DeviceEditPage(props) {
    const [device, setDevice] = useState({});
    const [environment, setEnvironment] = useState({})

    const { t } = useTranslation();

    useEffect(() => {
        getEnvironment();
        getDevice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getEnvironment = () => {
        EnvironmentStore.getEnvironment(SessionStore.getEnvironment(), responseGetEnvironment);
    }

    const responseGetEnvironment = (response) => {
        setEnvironment(response);
    }

    const getDevice = () => {
        DeviceStore.getDevice(props.id, responseGetDevice);
    }

    const responseGetDevice = (response) => {
        setDevice(response);
    }

    return (
        <Grid container>
            <Grid item xs={12} style={{ paddingLeft: "16vw" }}>
                {!toolsUtils.isNullOrEmpty(device, "objectid") && !toolsUtils.isNullOrEmpty(environment, "objectid") &&
                    <PredizaTabs data={[{ label: t('common.settings'), component: <DeviceForm device={device} method={"PUT"} /> },
                    { label: t('common.location'), component: <GoogleMaps adminDevice devId={props.id} config={{center: { lat: device.latitude, lng: device.longitude }, zoom: 19}} /> }]} />
                }
            </Grid>
        </Grid>
    );
})
