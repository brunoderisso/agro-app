import React, { useState, useEffect, useRef } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core";
import Typography from '@material-ui/core/Typography';



import SessionStorage from '../../stores/SessionStore'
import TokenList from '../../stores/CancelTokenList'
import toolsUtils from '../../utils/toolsUtils'
import stringsUtils from '../../utils/stringsUtils'
import Style from '../../styles/Forgot/ForgotForm'
import PredizaAlertDialog from "../PredizaAlertDialog";
import history from '../../history'

export default withStyles(Style)(function PredizaForgotForm(props) {



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

    const closeMessage = () => {
        setMessage("");
    }

    const clear = () => {
        tokenList.clear();
    }

    useEffect(() => {
        startFlags();
        const to = stringsUtils.getParameterByName('to')
        if(to !== null && to !== undefined && to !== '' && to !== ""){
            setEmail({to:to})
        }
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const to = stringsUtils.getParameterByName('to')
        if(to !== null && to !== undefined && to !== '' && to !== ""){
            setEmail({to:to})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);


    const handleChange = event => {
        setEmail({
            ...email,
            [event.target.name]: event.target.value
        });
    }

    const isValid = () => {
        if (!toolsUtils.isNullOrEmpty(email, "to")) {
            return true;
        }
        return false;
    }

    const responseForgot = (response) => {
        tokenList.remove(response.id);
        if (!toolsUtils.isNullOrEmpty(response, "data")) {
            sent.current = true;
        }
        setFlags({
            ...flags,
            isDisabled: false
        });

    }
    const toData = () => {
        let e = email;
        e.to = email.to || ""

        return e;
    };



    const onSubmit = () => {
        setFlags({
            ...flags,
            isDisabled: true
        });
        if (isValid()) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            SessionStorage.forgot(toData(), cancelToken, responseForgot);
            return
        }
        setFlags({
            ...flags,
            isDisabled: false
        });
        setMessage("Preencha corretamente os campos");
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
        <Grid container>
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
                    value={email.to || ""}
                    fullWidth
                    required
                />
            }

            <Grid container>
                {sent.current && <Grid item xs={12}> {getButtonBack()} </Grid>}
                {!sent.current && <Grid item xs={5}> {getButtonCancel()} </Grid>}



                {!sent.current &&
                    <Grid item xs={7}>
                        <Grid container justifyContent="flex-end" >
                            <Button onClick={onSubmit} color="primary" disabled={flags.isDisabled} className={classes.buttons}>
                                Enviar
                        </Button>
                        </Grid>
                    </Grid>
                }
            </Grid>

        </Grid>
    );

})



