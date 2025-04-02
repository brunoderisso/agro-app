import React, { useState, useEffect, useRef } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';

import SessionStore from '../../stores/SessionStore'
import toolsUtils from '../../utils/toolsUtils'
import TokenList from '../../stores/CancelTokenList'
import history from '../../history'

import PredizaAlertDialog from "../PredizaAlertDialog";
import Style from "../../styles/Signin/SigninForm"

export default withStyles(Style)(function PredizaSingIn(props) {

    const [email, setEmail] = useState({});
    const [flags, setFlags] = useState({});
    const sent = useRef(false);
    const tokenList = new TokenList();
    const [message, setMessage] = useState("");
    const { classes } = props;

    const startFlags = () => {
        setFlags(
            {
                isDisabled: false
            }
        );
    }

    useEffect(() => {
        startFlags();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const clear = () => {
        tokenList.clear();
    }

    const handleChange = event => {
        setEmail({
            ...email,
            [event.target.name]: event.target.value
        });
    };

    const toData = () => {
        let e = email;
        e.to = email.to || ""

        return e;
    };

    const responseLogin = (response) => {
        tokenList.remove(response.id);
        if (!toolsUtils.isNullOrEmpty(response, "data")) {
            sent.current = true;
        }
        setFlags({
            ...flags,
            isDisabled: false
        });

    }

    const isValid = () => {
        if (!toolsUtils.isNullOrEmpty(email, "to")) {
            return true;
        }
        return false;
    }

    const closeMessage = () => {
        setMessage("");
    };

    const onSubmit = () => {
        setFlags({
            ...flags,
            isDisabled: true
        });
        if (isValid()) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            SessionStore.signin(toData(), cancelToken, responseLogin);
            return
        }
        setFlags({
            ...flags,
            isDisabled: false
        });
        setMessage("Revise os dados inseridos");

    }

    const showOkMessage = () => {
        return (
            <Grid container justifyContent="flex-start" alignContent="center" className={classes.message}>
                <Typography variant="subtitle1" gutterBottom >
                    Email enviado para a conta solicitada.
                </Typography>
            </Grid>
        );
    }
    const backPage = () => {
        history.push("/login")
    }

    const getButtonCancel = () => {
        return (
            <Grid container justifyContent="flex-start" alignContent="center">
                <Button onClick={backPage} color="primary" className={classes.buttons}>
                    <span data-modal={props.modal}> Cancelar </span>
                </Button>
            </Grid>
        );
    }

    const getButtonBack = () => {
        return (
            <Grid container justifyContent="flex-start" alignContent="center">
                <Button onClick={backPage} color="primary" className={classes.buttons}>
                    <span data-modal={props.modal}> Voltar </span>
                </Button>
            </Grid>
        );
    }

    return (

        <div>
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />

            {sent.current && <Grid container>{showOkMessage()}</Grid>}
            {!sent.current &&
                <TextField
                    autoFocus
                    margin="dense"
                    name="to"
                    id="email"
                    label="Informe o email"
                    type="email"
                    onChange={handleChange}
                    fullWidth
                    required
                />}
            <Grid container >
                {sent.current && <Grid item xs={12}> {getButtonBack()} </Grid>}
                {!sent.current && <Grid item xs={5}> {getButtonCancel()} </Grid>}

                {!sent.current &&
                    <Grid item xs={7}>
                        <Grid container justifyContent="flex-end" alignContent="center">
                            <Button onClick={onSubmit} color="primary" disabled={flags.isDisabled} className={classes.buttons}>
                                Enviar
                         </Button>
                        </Grid>
                    </Grid>}
            </Grid>

        </div>

    );
})
