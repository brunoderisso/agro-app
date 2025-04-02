import React from 'react';

import Grid from "@material-ui/core/Grid";

import Bar from "../Common/Chart/Bar";


export default function ReportL(props) {
    return (
        <Grid container >
            <Grid item xs={12} >
                <Bar percentil={props.percentil} measure={props.measure} data={props.data.serie} ydomain={props.ydomain} />
            </Grid>
        </Grid>
    );
}