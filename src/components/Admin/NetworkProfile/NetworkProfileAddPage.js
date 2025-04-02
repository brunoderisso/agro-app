import React from "react";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import NetworkProfileForm from "./NetworkProfileForm";
import PredizaTabs from "../../Common/PredizaTabs";

export default function NetworkProfileAddPage() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs data={[{label:"Novo servidor",component:<NetworkProfileForm/>}]}/>
            </Grid>
        </Grid>
    );

};