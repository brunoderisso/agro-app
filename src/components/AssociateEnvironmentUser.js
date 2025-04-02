import React, { useState } from 'react';
import Select from "react-select";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"

import UserStore from "../stores/UserStore";


export default function AssociateEnvironmentUser(props) {
    const [environmentUser, setEnvironmentUser] = useState({selected: ""});

    const onChangeSelect = (value) => {
        setEnvironmentUser({selected: value});
    };

    const onClickSubmit = () =>{
        setUserEnvironments();
    }

    const responseSetUserEnvironment = () =>{
        setEnvironmentUser({selected: ""});
    }

    const setUserEnvironments = () => {
        UserStore.setUserEnvironment(props.environment.objectid, environmentUser.selected.value, responseSetUserEnvironment);
    };

    return (
        <Grid container>
            <Grid item xs={8}>
                <Select
                    options={props.options}
                    value={environmentUser.selected}
                    onChange = {onChangeSelect}/>
            </Grid>
            <Grid item xs={4}>
                <Grid container justifyContent="flex-end">
                <Button onClick={onClickSubmit}>Adicionar</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}