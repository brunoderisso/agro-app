import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

//Prediza
import PredizaAlertDialog from "../../PredizaAlertDialog";

import toolsUtils from "../../../utils/toolsUtils";
import UserStore from "../../../stores/UserStore";

import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Treshold/TresholdForm";
import history from "../../../history";

//Other
import PasswordGenerator from 'generate-password';
import 'react-phone-number-input/style.css'

export default withStyles(style)(function TresholdForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        startInputs();
        startFlags();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const userToData = () => {
        const user = props.user || {};
        let newUser = {
            objectid: user.objectid || "",
            name: input.name || "",
            surname: input.surname || "",
            username: input.username || "",
            password: user.password || "",
            email: input.email || "",
            uuid: input.uuid || "",
            token: user.token || "",
            enable: check.enable || false,
            globaladmin: check.globaladmin || false
        }

        if (toolsUtils.isNullOrEmpty(newUser, "password") || toolsUtils.isEmptyString(newUser.password)) {
            const password = PasswordGenerator.generateMultiple(1, {
                length: 6,
                uppercase: false,
                symbols: true
            });
            newUser.password = password[0];
        }
        return newUser;
    };

    const isValidUser = () => {
        if (toolsUtils.isNullOrEmpty(input, "name") || toolsUtils.isEmptyString(input.name) ||
            toolsUtils.isNullOrEmpty(input, "email") || toolsUtils.isEmptyString(input.email)) {
            setMessage("Todos os campos devem ser preenchidos")
            return false;
        };

        return true;
    };

    const back = () => {
        history.push("/admin/users");
    };

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
    };

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const handleCheckChange = (e) => setCheck({
        ...check,
        [e.currentTarget.name]: !check[e.currentTarget.name]
    });

    const startFlags = () => {
        const user = props.user || {};
        setCheck(
            {
                enable: user.enable || false,
                globaladmin: user.globaladmin || false,
                submit: false
            }
        );
    };

    const startInputs = () => {
        const user = props.user || {};
        setInput(
            {
                name: user.name || "",
                email: user.email || "",
                surname: user.surname || "",
                username: user.username || "",
                uuid: user.uuid || ""
            }
        );
    }

    //Stores
    const addUserResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false,
        });

        if (resp.data === undefined) {
            setMessage("Você não possuí permissão");
            return
        };

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar o usuário");
            return
        };

        setInput({
            ...input,
            uuid: resp.data
        });

        setMessage("Usuário inserido com sucesso");

        history.push("/admin/users/" + resp.data.uuid);

       

    };


    const updateUserResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === undefined) {
            setMessage("Você não possuí permissão");
            return
        };

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alerar o usuário");
            return
        };

        setMessage("Usuário alterado com sucesso");

    };

    

    const addUser = () => {
        if (!isValidUser()) {
            return
        };

        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        UserStore.addUser(cancelToken, userToData(), addUserResponse);
    };


    const updateUser = () => {
        if (!isValidUser()) {
            return
        };

        let cancelToken = {};

        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        UserStore.updateUser(cancelToken, userToData(), updateUserResponse);
    };

    

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        label="Nome"
                        className={classes.textInput}
                        value={input.name}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        name="name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Sobrenome"
                        className={classes.textInput}
                        value={input.surname}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        name="surname"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Usuário"
                        className={classes.textInput}
                        value={input.username}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        name="username"
                        disabled={!(toolsUtils.isNullOrEmpty(props,"user.uuid") || toolsUtils.isEmptyString(props.user.uuid))}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        className={classes.textInput}
                        value={input.email}
                        onChange={handleInputChange}
                        margin="normal"
                        required
                        name="email"
                    />
                </Grid>
                <Grid item xs={12} >
                    <Grid container justifyContent="flex-end">

                        {check !== null && (
                            <FormGroup row
                                className={classes.container}
                            >
                                {!toolsUtils.isNullOrEmpty(check, "globaladmin") && <FormControlLabel
                                    control={
                                        <Switch
                                            checked={check.globaladmin}
                                            onChange={handleCheckChange}
                                            color="primary"
                                            name="globaladmin"
                                        />
                                    }
                                    label="Administrador"
                                />}
                                {!toolsUtils.isNullOrEmpty(check, "enable") && <FormControlLabel
                                    control={
                                        <Switch
                                            checked={check.enable}
                                            onChange={handleCheckChange}
                                            color="primary"
                                            name="enable"
                                        />
                                    }
                                    label="Ativo"
                                />}
                            </FormGroup>
                        )}

                    </Grid>
                </Grid>

                <Grid item xs={6} >
                    <Grid container justifyContent="flex-start">
                        <Button color="primary" onClick={back} >Voltar</Button>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent="flex-end">
                        {toolsUtils.isNullOrEmpty(props, "user") && check !== null && <Button color="primary" name="submit" onClick={addUser} disabled={check.submit}>Criar</Button>}
                        {!toolsUtils.isNullOrEmpty(props, "user") && check !== null && <Button color="primary" name="submit" onClick={updateUser} disabled={check.submit}>Salvar</Button>}
                    </Grid>
                </Grid>
                <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
            </Grid>
        </Grid>
    );
});