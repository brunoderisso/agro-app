import React, { useEffect, useState } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

import styles from "../../../styles/Admin/Environment/EnvironmentAdd"
import PredizaTabs from "../../Common/PredizaTabs";
import EnvironmentStore from "../../../stores/EnvironmentStore";
import toolsUtils from "../../../utils/toolsUtils"
import EnvironmentForm from "./EnvironmentForm";
import GoogleMaps from "../../Common/GoogleMaps/GoogleMaps"


export default withStyles(styles)(function EnvironmentEditPage(props) {
    const [environment, setEnvironment] = useState({})

    useEffect(() => {
        getEnvironment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getEnvironment = () => {
        EnvironmentStore.getEnvironment(props.id, responseGetEnvironment);
    }

    const responseGetEnvironment = (response) => {
        setEnvironment(response);
    }

    return (
        <Grid container>
            {!toolsUtils.isNullOrEmpty(environment, "objectid") &&
                <Grid item xs={12} >
                    <PredizaTabs data={[{ label: "Configuração", component: <EnvironmentForm environment={environment} method={"PUT"} /> },
                    { label: "Localização", component: <GoogleMaps environment envId={props.id} config={{center: { lat: environment.latitude, lng: environment.longitude }, zoom: 19}} /> }]} />
                </Grid>
            }
        </Grid>
    );
})
