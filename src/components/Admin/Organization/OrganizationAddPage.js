import React from 'react';

import Grid from "@material-ui/core/Grid";

import OrganizationForm from "./OrganizationForm";
import PredizaTabs from "../../Common/PredizaTabs"

export default function OrganizationAddPage() {

    return (
        <Grid container >
            <Grid item xs={12} style={{ paddingLeft: "150px" }}>
                <PredizaTabs data={[{ label: "Configuração", component: <OrganizationForm/>},
                                    { label: "Profiles", component: <Grid />},
                                    { label: "Aplicação", component: <Grid />},
                                    { label: "Gateways", component: <Grid />}]} />
            </Grid>
        </Grid>
    );


}

