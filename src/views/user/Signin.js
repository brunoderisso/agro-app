import React from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet"
//Material UI
import Grid from "@material-ui/core/Grid";

//Prediza
import SigninPage from "../../components/PredizaSignin/PredizaSigninPage";


export default withRouter(function Signin() {
    return (
        <Grid container justifyContent="center" alignItems="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Signin</title>
                <meta name="description" content="Cadastre-se" />
            </Helmet>
            <Grid item>
                <SigninPage />
            </Grid>

        </Grid >

    );
});