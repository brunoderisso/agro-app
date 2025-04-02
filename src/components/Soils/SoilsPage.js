import React, { useState, useEffect } from 'react';

import styles from "../../styles/Soils/SoilsPage";
import { Grid, Typography } from '@material-ui/core';
import SessionStore from '../../stores/SessionStore';
import data from './data';
import SoilChart from './SoilChart';
import SoilTable from './SoilTable';

export default function BillingPage(props) {

    const [environment, setEnvironment] = useState("");



    useEffect(() => {
        console.log(environment)

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        if (props.environmentId) {
            let env = SessionStore.getEnvironment(props.environmentId);
            setEnvironment(env);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const classes = styles();


    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                <Typography variant='h5' className={classes.mainTitle}>
                    {"Assimilação de nutrientes x pH"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={6}>
                    <Grid item xs={5}>
                        <SoilChart data={data} />
                    </Grid>
                    <Grid item xs={7}>
                        <SoilTable data={data.data} headers={["PH", "ASSIMILAÇÃO (%)", "PERDA (%)", "VALOR PERDE DE FERTILIZANTE (R$/TON.)"]} />
                        <SoilTable invert data={data.data} headers={["PH", "necessidade decalcário (ton./ha.)", "investimento de calagem (R$/ha.)", "recuperação do investimento (RS/ha.)"]} />
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
};