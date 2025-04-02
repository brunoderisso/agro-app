import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from "@material-ui/core/Grid";
import MenuBar from '../../components/ViewComponents/MenuBar';
import sessionStore from '../../stores/SessionStore';
import BillingPage from '../../components/Billing/BillingPage';
import history from '../../history';


export default withRouter(function Billing(props) {
    const [id, setId] = useState("");

    useEffect(() => {
        sessionStore.setView("plans");
        checkId()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        checkId()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const checkId = () => {
        if ((props.match.params.id || "") === "") {
            setId("NaN");
            return;
        }

        if ((props.match.params.id || "") !== id) {
            setId(props.match.params.id || "");
            return;
        }
    }

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Assinatura | Prediza" });
    })

    return (
        <Grid container justifyContent="center" alignItems="center">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Assinatura | Prediza</title>
                <meta name="description" content="Jornada de compra" />
            </Helmet>
            <MenuBar />
            {id !== "" &&
                <BillingPage id={id} />
            }
        </Grid >
    );
});