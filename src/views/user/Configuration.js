import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet"
import { withRouter } from "react-router-dom";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MenuBar from "../../components/ViewComponents/MenuBar";
import View from "../../components/PredizaView";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Common/Screens";
import ConfigurationPage from "../../components/Configuration/ConfigurationPage";
import history from "../../history";


export default withStyles(styles)(withRouter(function Configuration(props) {
    const { classes } = props;

    const [envId, setEnvId] = useState("");
    const [flags, setFlags] = useState({ environment: false });

    useEffect(() => {
        SessionStore.setView("map");
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if ((props.match.params.envid || "") !== envId) {
            setEnvId(props.match.params.envid || "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

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

    const bind = () => {
        SessionStore.addListener("environment.change", handleEnvironmentChange);
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", handleEnvironmentChange);
    }

    const handleEnvironmentChange = (id) => {
        SessionStore.emit("environmentName.update", SessionStore.getSelectedEnvironment())

        if (id !== envId && id !== "preference") {
            let path = history.location.pathname.split("/");
            path = "/" + path[1] + "/" + id;
            history.replace(path);
        }
    }

    return (
        <div className={classes.contentPdTop}>
            <View>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prediza | Configuration</title>
                    <meta name="description" content="Prediza Configuração" />
                </Helmet>
                <Grid container>
                    <MenuBar />
                    {flags.environment &&
                        <ConfigurationPage environmentId={envId} />
                    }
                </Grid>
            </View>
        </div>
    );
}))
