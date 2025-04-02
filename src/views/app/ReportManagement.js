import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactGA from "react-ga4";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import ReportManagementList from "../../components/ReportManager/ReportManagementList";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import ValidationStore from "../../stores/ValidationStore";
import styles from "../../styles/Common/Screens";
import history from "../../history";


export default withStyles(styles)(withRouter(function ReportManagement(props) {
    const [flags, setFlags] = useState({ environment: false });
    const [page, setPage] = useState("");
    const [envId, setEnvId] = useState("");

    const { classes } = props;

    useEffect(() => {
        if ((props.match.params.page || "") !== page) {
            setPage(props.match.params.page || "");
        }

        if ((props.match.params.envid || "") !== envId) {
            setEnvId(props.match.params.envid || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if ((props.match.params.page || "") !== page) {
            setPage(props.match.params.page || "");
        }

        if ((props.match.params.envid || "") !== envId) {
            setEnvId(props.match.params.envid || "");
        }

        ValidationStore.validate(() => {
            setFlags({ ...flags, isValid: true });
        });
        SessionStore.setView("reportManagement")

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (envId !== "") {
            setFlags({ ...flags, environment: false });
            const p = { ...SessionStore.getPreference(), environment: envId };
            SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
            SessionStore.setEnvironment(envId);
            setTimeout(() => {
                setFlags({ ...flags, environment: true });
            }, 500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [envId]);

    history.listen((location) => {
        ReactGA.send({ hitType: "pageview", page: location, title: "Relatórios | Prediza" });
    })

    return (
        <div className={classes.contentHighPdLeft}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Relatórios | Prediza</title>
                    <meta name="description" content="Relatórios" />
                </Helmet>

                <Grid container >
                    <MenuBar />
                    {flags.isValid && flags.environment && page !== null &&
                        <ReportManagementList page={page} />
                    }
                </Grid>
            </View>
        </div>
    );
}))