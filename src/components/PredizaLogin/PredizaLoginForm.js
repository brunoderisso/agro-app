import React, { useState, useEffect } from "react";

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core";


import history from '../../history'
import PredizaAlertDialog from "../PredizaAlertDialog";
import useKeyPress from '../../Hook/useKeyPress'

import TokenList from '../../stores/CancelTokenList'
import toolsUtils from '../../utils/toolsUtils'
import SessionStore from '../../stores/SessionStore'
import LeftButtons from './PredizaLoginLinks'

import Style from '../../styles/Login/LoginForm'

export default withStyles(Style)(function LoginForm(props) {

    const { classes } = props;

    const [disabled, setDisabled] = useState(false);
    const [login, setLogin] = useState({});
    const tokenList = new TokenList();

    const [message, setMessage] = useState("");

    const enter = useKeyPress('Enter');


    const startStateLogin = () => {
        setLogin({
            username: "",
            password: ""
        });
    }

    const handleChange = event => {
        setLogin({
            ...login,
            [event.target.name]: event.target.value
        });
    }

    const clear = () => {
        tokenList.clear();
    }

    useEffect(() => {
        startStateLogin();
        SessionStore.logout(() => { });
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(login, "username") ||
            toolsUtils.isNullOrEmpty(login, "password") ||
            toolsUtils.isEmptyString(login.password) ||
            toolsUtils.isEmptyString(login.username)) {
            return false;
        }

        return true;
    }

    const toData = () => {
        let e = login;
        e.username = login.username || ""
        e.password = login.password || ""

        return e;
    };

    const responseLogin = (response) => {

        if (!toolsUtils.isNullOrEmpty(tokenList.get(response.id), "pending")) {
            tokenList.remove(response.id);
        }


        if (!toolsUtils.isNullOrEmpty(response, "data")) {
            history.push("/");
            return
        }

        setDisabled(false);

    }
    const onSubmit = () => {
        setDisabled(true);
        if (isValid()) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            SessionStore.login(toData(), cancelToken, responseLogin);
            return
        }
        setMessage("Preencha corretamente os campos");
        setDisabled(false);
    }

    const closeMessage = () => {
        setMessage("");
    }


    return (
        <Grid container className={classes.width}>
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />

            <Grid className={classes.scale}>
                <TextField
                    id="username"
                    name="username"
                    label="Usuário"
                    margin="normal"
                    value={login.username || ""}
                    inputProps={{autoCapitalize: 'none'}}
                    onChange={handleChange}
                    fullWidth
                    required
                    tabIndex={0}
                    onKeyPress={enter ? onSubmit : null}
                    autoFocus
                />
                <TextField className={classes.margin}
                    id="password"
                    name="password"
                    label="Senha"
                    type="password"
                    margin="normal"
                    value={login.password || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    tabIndex={1}
                    onKeyPress={enter ? onSubmit : null}
                />
            </Grid>
            <Grid container justifyContent="space-between">
                <Grid>
                    <LeftButtons />
                </Grid>
                <Grid>
                    <Button style={{minHeight:"48px"}} color="primary" onClick={onSubmit} disabled={disabled}>Login</Button>
                </Grid>

            </Grid>
        </Grid>

    );

})
