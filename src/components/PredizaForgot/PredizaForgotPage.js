import React from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//Prediza
import PredizaForgotForm from "./PredizaForgotForm";
import style from "../../styles/Signin/SigninBox";



export default withStyles(style)(function PredizaSigninPage(props) {
    const { classes } = props;



    return (

        <Grid container justifyContent="center" className={classes.box}>
            <Grid item xs={12}>
                <Card>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                        Recuperação de senha
                    </Typography>
                    <CardContent className={classes.teste}>

                        <Grid container direction="column">

                            <Grid item xs={12}>
                                <PredizaForgotForm />
                            </Grid>
                        </Grid>

                    </CardContent>

                </Card>
            </Grid>
        </Grid>


    );
});