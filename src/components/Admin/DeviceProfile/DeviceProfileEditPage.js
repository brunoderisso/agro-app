import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

import DeviceProfileStore from "../../../stores/DeviceProfileStore";
import DeviceProfileForm from "./DeviceProfileForm";
import ServiceProfileList from "../ServiceProfile/ServiceProfileList";
import PredizaTabs from "../../Common/PredizaTabs";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";
import history from "../../../history";
import toolsUtils from "../../../utils/toolsUtils"
import usePrevious from "../../../Hook/usePrevious"
import { useTranslation } from "react-i18next";


export default withStyles(style)(function DeviceProfileEditPage(props) {

    const [device, setDevice] = useState(null);

    const [params, setParams] = useState({});
    const prev = usePrevious(params);

    const { t } = useTranslation();

    const tokenList = new tokens();

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "organizationID") && !toolsUtils.isNullOrEmpty(props, "dev")) {
            getParams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(params, "organizationID") && !toolsUtils.isNullOrEmpty(params, "ObjectID") && !toolsUtils.isEquals(prev,params)) {
        getDevice();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    useEffect(() => {
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const clear = () => {
        tokenList.clear();
    };

    const responseGetDevice = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null) {
            setDevice(response.data);
        }

    };

    const getParams = () => {
        let device = props || {};
        setParams({
            ...params,
            organizationID: device.organizationID || "",
            ObjectID: device.dev || "",
        });
    }

    const getDevice = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceProfileStore.getDevice(params, cancelToken, responseGetDevice);
    };
    const getOrganization = () => {
        let org = {
            objectid: params.organizationID,
        }
        return org;
    }

    const getTabs = () => {
        return (
            <PredizaTabs data={[
                { label: "Device Profile", component: <Grid container> <DeviceProfileForm deviceProfile={device} organizationObjectID={params.organizationID} /> </Grid> },
                { label: "Service Profile", component: <Grid container> <ServiceProfileList organization={getOrganization()} /> </Grid> },
            ]} />

        );
    }

    const redirect = (tab) => {
        if(tab === 0){
           history.push("/admin/organizations/" + params.organizationID);
        }
    }

    return (
        <Grid container>
            <Grid item xs={12}>

                <Grid container>
                    <Grid item xs={12} style={style.header}>
                        {!toolsUtils.isNullOrEmpty(device, "ObjectID")
                            && <PredizaTabs onChange={redirect} tab={1} data={[{ label: t('common.settings'), component: <Grid></Grid> },
                            { label: t('common.profiles'), component: getTabs() },
                            { label: t('common.application'), component: <Grid /> },
                            { label: "Gateways", component: <Grid /> }]} />}

                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );

});