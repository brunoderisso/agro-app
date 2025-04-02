import React from "react";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import ArticleForm from "./ArticleForm";
import PredizaTabs from "../Common/PredizaTabs";

export default function ArticleAddPage() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs data={[{label:"Novo Artigo",component:<ArticleForm/>}]}/>
            </Grid>
        </Grid>
    );

};