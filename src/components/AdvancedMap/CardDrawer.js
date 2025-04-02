import React from 'react';
import { Grid, Typography } from "@material-ui/core";
import styles from '../../styles/AdvancedMap/ManegementPanel'

const CardDrawer = (props) => {

    const classes = styles();

    return (
        <Grid className={classes.gatewaysBox}>
            <Grid className={classes.gatewaysFlex}>
                <Typography variant='Text' className={classes.gatewaysText}><span style={{marginRight: "8px"}}>{props.icons}</span> <span style={{fontWeight: 600, color:"#00174B"}}>{props.title}</span> </Typography>
                <Typography variant='Text' className={classes.gatewaysTotal}>Total: <span className={classes.gatewaysValue} >{props.total}</span></Typography>
            </Grid>
            <Grid className={classes.gatewaysFlexState}>
                <Grid className={classes.gatewaysActive}>
                    <Typography variant='h5' className={classes.gatewaysTextActive}>{props.active}</Typography>
                    <Typography variant='Text' className={classes.gatewaysTotal}>Ativos</Typography>
                </Grid>
                <Grid className={classes.gatewaysInAlert}>
                    <Typography variant='h5' className={classes.gatewaysTextInAlert}>{props.alert}</Typography>
                    <Typography variant='Text' className={classes.gatewaysTotal}>Em alerta</Typography>
                </Grid>
                <Grid className={classes.gatewaysInactive}>
                    <Typography variant='h5' className={classes.gatewaysTextInactive}>{props.inactive}</Typography>
                    <Typography variant='Text' className={classes.gatewaysTotal}>Inativos</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CardDrawer;
