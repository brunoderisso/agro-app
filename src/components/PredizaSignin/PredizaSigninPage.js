import React from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

//Prediza
import PredizaSigninForm from "./PredizaSigninForm";
import style from "../../styles/Signin/SigninBox";
import { useTranslation } from 'react-i18next';



export default withStyles(style)(function PredizaSigninPage(props) {
    const { classes } = props;

    const { t } = useTranslation();

    return (

        <Grid container justifyContent="center" className={classes.box}>
            <Grid item xs={12}>
                <Card>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
                        {t('login.register')}
                    </Typography>
                    <CardContent className={classes.teste}>

                        <Grid container direction="column">

                            <Grid item xs={12}>
                                <PredizaSigninForm />
                            </Grid>
                        </Grid>

                    </CardContent>

                </Card>
            </Grid>
        </Grid>


    );
});