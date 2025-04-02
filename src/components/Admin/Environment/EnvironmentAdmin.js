import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import EnvironmentStore from "../../../stores/EnvironmentStore";
import EnvironmentAdminList from "../../EnvironmentAdminList";
import history from "../../../history";
import styles from "../../../styles/Admin/Environment/EnvironmentPage";

export default withStyles(styles)(function EnvironmentAdmin(props) {
    const [flags, setFlags] = useState({
        isRecived: false,
        modalIsOpen: false
    });
    const [admin, setAdmin] = useState({ environments: [] });
    const [isEnvironment, setIsEnvironment] = useState(false);

    const {classes} = props;
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/admin/environments') {
            setIsEnvironment(true);
        }

        bind();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        EnvironmentStore.on("add_environment",()=>{
            getEnvironments();
        });
        EnvironmentStore.on("del_environment",()=>{
            getEnvironments();
        });

        getEnvironments();
    };

    const onClickAdd = () => {
        history.push("/admin/environments/new");
    }

    const responseGetEnvironments = (response) => {
        setAdmin({
            ...admin,
            environments: response
        });
        setFlags({
            ...flags,
            isRecived: true,
        })
    };

    const getEnvironments = () => {
        setFlags({
            ...flags,
            isRecived: false,
        });

        EnvironmentStore.getEnvironments(responseGetEnvironments);
    };

    return (
        <Grid container className={isEnvironment && classes.container}>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                    <Button onClick={onClickAdd} color="primary">Adicionar Ambiente</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {flags.isRecived && <EnvironmentAdminList environments={admin.environments}/>}
            </Grid>
        </Grid>
    );
})

