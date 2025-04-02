import React from 'react';

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza 
import OrganizationForm from "./UserForm";
import PredizaTabs from "../../Common/PredizaTabs"

export default function OrganizationAddPage() {

    return (
        <Grid container >
            <Grid item xs={12} style={{paddingLeft:"11vw"}}>
                <PredizaTabs data={[{ label: "Configuração", component: <OrganizationForm/>}]} />
            </Grid>
        </Grid>
    );


}

