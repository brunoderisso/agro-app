import React from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//Prediza
import NetworkProfileList from "./NetworkProfileList";
import history from "../../../history";
import style from "../../../styles/Admin/NetworkServer/NetworkServerPage";

export default withStyles(style)(function TresholdPage(props) {
    const { classes } = props;

    const goToAddPage = () => {
        history.push("/admin/networkserver/new");
    };
    return (
        <Grid container>
            <Grid item xs={12} >
                <Grid container className={classes.header} justifyContent="flex-end" >
                    <Button onClick={goToAddPage} color="primary">Adicionar Servidor</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <NetworkProfileList />
            </Grid>
        </Grid>
    );
});