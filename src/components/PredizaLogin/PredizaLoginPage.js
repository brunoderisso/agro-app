import React from "react";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from "@material-ui/core/styles";

import Style from '../../styles/Login/LoginForm'
import LoginForm from './PredizaLoginForm'
export default withStyles(Style)(function PredizaLoginPage(props) {

    const { classes } = props;

    return (
        <Grid container justifyContent="center" className={classes.container}>
            <Grid item xs={12} >
                <Card>
                    <CardHeader
                        title="Login"
                    />
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

})