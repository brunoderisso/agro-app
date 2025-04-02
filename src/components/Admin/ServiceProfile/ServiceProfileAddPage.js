import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import ServiceProfileForm from "./ServiceProfileForm";
import PredizaTabs from "../../Common/PredizaTabs";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";
import history from "../../../history";
import toolsUtils from "../../../utils/toolsUtils"

export default withStyles(style)(function ServiceProfileAddPage(props) {
    const [params, setParams] = useState({});

    const tokenList = new tokens();

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

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);


    const clear = () => {
        tokenList.clear();
    };


    const getParams = () => {
        let service = props || {};
        setParams({
            ...params,
            organizationObjectID: service.organizationObjectID || "",
        });
    }


    const getTabs = () => {
        return (
            <PredizaTabs tab = {1} data={[
                { label: "Device Profile", component: <Grid container> </Grid> },
                { label: "Service Profile", component: <Grid container> <ServiceProfileForm  organizationObjectID={params.organizationObjectID} /> </Grid> },
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
                            && <PredizaTabs onChange={redirect} tab={1} data={[{ label: "Configuração", component: <Grid></Grid> },
                            { label: "Profiles", component: getTabs() },
                            { label: "Aplicação", component: <Grid /> },
                            { label: "Gateways", component: <Grid /> }]} />}

                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );

});