import React from 'react';

import Grid from '@material-ui/core/Grid';

import PredizaTabs from "../../Common/PredizaTabs"
import EnvironmentForm from "./EnvironmentForm";
import PinMap from "../../Common/PinMap";

export default function EnvironmentAddPage(props) {
    return (
        <Grid container>
            <Grid item xs={12} style={{paddingLeft:"11vw"}}>
                <PredizaTabs data={[{ label: "Configuração", component: <EnvironmentForm method={"POST"} /> },
                { label: "Localização", component: <PinMap method={"POST"} />, disabled: true }]} />
            </Grid>

        </Grid>
    );
}
