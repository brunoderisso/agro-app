import React,{useEffect} from 'react';
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet"
//Material UI
import Grid from "@material-ui/core/Grid";

//Prediza 
import ForgotPage from "../../components/PredizaForgot/PredizaForgotPage";
import SessionStore from '../../stores/SessionStore';



export default withRouter(function Signin() {
   
    useEffect(()=>{
        SessionStore.setView("forgot")
    },[])   

    return (


        <Grid container justifyContent="center" alignItems="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Login</title>
                <meta name="description" content="Prediza Dispositivos" />
            </Helmet>
            <Grid item >
                <ForgotPage />
            </Grid>

        </Grid >

    );
});