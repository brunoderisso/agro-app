import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import ServiceProfileStore from "../../../stores/ServiceProfileStore";
import ServiceProfileForm from "./ServiceProfileForm";
import DeviceProfileList from "../DeviceProfile/DeviceProfileList"
import PredizaTabs from "../../Common/PredizaTabs";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";
import history from "../../../history";
import toolsUtils from "../../../utils/toolsUtils"
import usePrevious from "../../../Hook/usePrevious"
export default withStyles(style)(function ServiceProfileEditPage(props) {

    const [service, setService] = useState(null);

    const [params, setParams] = useState({});
    const prev = usePrevious(params);

    const tokenList = new tokens();

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "organizationID") && !toolsUtils.isNullOrEmpty(props, "serv")) {
            getParams();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(params, "organizationID") && !toolsUtils.isNullOrEmpty(params, "ObjectID") && !toolsUtils.isEquals(prev, params)) {
            getService();
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

    const responseGetService = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null) {
            setService(response.data);
        }

    };

    const getParams = () => {
        let device = props || {};
        setParams({
            ...params,
            organizationID: device.organizationID || "",
            ObjectID: device.serv || "",
        });
    }

    const getService = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.getService(params, cancelToken, responseGetService);
    };

    const getOrganization = () => {
        let org = {
            objectid: params.organizationID,
        }
        return org;
    }

    const getTabs = (tab) => {
        return (
            <PredizaTabs tab={tab} data={[
                { label: "Device Profile", component: <Grid container> <DeviceProfileList organization={getOrganization()} /> </Grid> },
                { label: "Service Profile", component: <Grid container> <ServiceProfileForm serviceProfile={service} organizationObjectID={params.organizationID} /> </Grid> },
            ]} />

        );
    }

    const redirect = (tab) => {
        if (tab === 0) {
            history.push("/admin/organizations/" + params.organizationID);
        }
    }

    return (
        <Grid container>
            <Grid item xs={12}>

                <Grid container>
                    <Grid item xs={12} style={style.header}>
                        {!toolsUtils.isNullOrEmpty(service, "ObjectID")
                            && <PredizaTabs onChange={redirect} tab={1} data={[{ label: "Configuração", component: <Grid></Grid> },
                            { label: "Profiles", component: getTabs(1) },
                            { label: "Aplicação", component: <Grid /> },
                            { label: "Gateways", component: <Grid /> }]} />}

                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    );

});