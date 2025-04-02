import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

import DeviceProfileForm from "./DeviceProfileForm";
import PredizaTabs from "../../Common/PredizaTabs";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";
import history from "../../../history";
import toolsUtils from "../../../utils/toolsUtils"
import { useTranslation } from "react-i18next";


export default withStyles(style)(function DeviceProfileAddPage(props) {
    const [params, setParams] = useState({});

    const tokenList = new tokens();

    const { t } = useTranslation();

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "organizationObjectID")) {
            getParams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    useEffect(() => {

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const clear = () => {
        tokenList.clear();
    };


    const getParams = () => {
        let device = props || {};
        setParams({
            ...params,
            organizationObjectID: device.organizationObjectID || "",
        });
    }


    const getTabs = () => {
        return (
            <PredizaTabs data={[
                { label: "Device Profile", component: <Grid container> <DeviceProfileForm  organizationObjectID={params.organizationObjectID} /> </Grid> },
                { label: "Service Profile", component: <Grid></Grid> },
            ]} />

        );
    }

    const redirect = (tab) => {
        if(tab === 0){
           history.push("/admin/organizations/" + params.organizationObjectID);
        }
    }

    return (
        <Grid container>
            <Grid item xs={12}>

                <Grid container>
                    <Grid item xs={12} style={style.header}>
                        {!toolsUtils.isNullOrEmpty(params, "organizationObjectID")
                            && <PredizaTabs onChange={redirect} tab={1} data={[{ label: t('common.settings'), component: <Grid></Grid> },
                            { label: t('common.profiles'), component: getTabs() },
                            { label:t('common.application') , component: <Grid /> },
                            { label: "Gateways", component: <Grid /> }]} />}

                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );

});