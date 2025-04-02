import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//Prediza
import PredizaAlertDialog from "../../PredizaAlertDialog";

import toolsUtils from "../../../utils/toolsUtils";
import NetworkProfileStore from "../../../stores/NetworProfileStore";

import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Treshold/TresholdForm";
import history from "../../../history";

export default withStyles(style)(function NetworkProfileForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);
    const [valid, setValid] = useState(false);

    const tokenList = new tokens();

    useEffect(() => {

        startFlags();
        startInputs();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toData = () => {
        const network = input || {};
        return {
            ObjectID: network.ObjectID || "",
            name: network.name || "",
            server: network.server || "",
            networkServerID: network.networkServerID || null
        }
    };

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(input, "name") || toolsUtils.isEmptyString(input.name) ||
            toolsUtils.isNullOrEmpty(input, "server") || toolsUtils.isEmptyString(input.server)) {
            setMessage("Todos os campos devem ser preenchidos")
            setValid(false);
            return false;
        };

        setValid(true);
        return true;
    };

    const back = () => {
        history.push("/admin/networkserver/");
    };

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
        if (valid && toolsUtils.isNullOrEmpty(props, "network")) {
            history.push("/admin/networkserver/" + input.ObjectID);
        }

    };

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const startFlags = () => {
        setCheck(
            {
                submit: false,
                lora: false
            }
        );
    };

    const startInputs = () => {
        const network = props.network || {};
        setInput(
            {
                ObjectID: network.ObjectID || "",
                name: network.name || "",
                server: network.server || "",
                networkServerID: network.networkServerID || null
            }
        );
    }

    //Stores
    const addNetworkResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar o servidor");
        } else {
            setInput({
                ...input,
                ObjectID: resp.data.objectid
            });

            setMessage("Servidor adicionado com sucesso");
        }


    };

    const publicResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            lora: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao publicar no lora o servidor");
        }else{
            setInput({
                ...input,
                networkServerID: resp.data.networkServerID
            });
            setMessage("Servidor publicado com sucesso no lora");
        };
    };

    const updateNetworkResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alterar o servidor");
        }else{
            setMessage("Servidor atualizado com sucesso");
        };
        
    };

    const removeLoraResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            lora: false
        });


        if (resp.data === null) {
            setMessage("Ocorreu um erro ao deletar o servidor no lora");
        }else{
            setMessage("Servidor no lora deletado com sucesso");
        };

        
    };

    const addNetwork = () => {
        if (!isValid()) {
            return
        };

        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworkProfileStore.addNetwork(toData(), cancelToken, addNetworkResponse);
    };

    const publicNetwork = () => {
        if (!isValid()) {
            return
        };

        let cancelToken = {};
        setCheck({
            ...check,
            lora: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworkProfileStore.addLoraNetwork(toData(), cancelToken, publicResponse);
    };

    const updateNetwork = () => {
        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworkProfileStore.updateNetwork(toData(), cancelToken, updateNetworkResponse);
    };

    const removeLoraNetwork = () => {
        let cancelToken = {};
        setCheck({
            ...check,
            lora: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworkProfileStore.updateLoraNetwork(toData(), cancelToken, removeLoraResponse);
    };

    return (
        <Grid container className={!toolsUtils.isNullOrEmpty(props, "network") && classes.page}>
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
                    label="Servidor"
                    className={classes.textInput}
                    value={input.server}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    name="server"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="NetworkServerID"
                    className={classes.textInput}
                    value={input.networkServerID}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    name="networkServerID"
                    disabled={true}
                />
            </Grid>
            <Grid item xs={4} >
                <Grid container justifyContent="flex-start">
                    <Button color="primary" onClick={back} >Voltar</Button>
                </Grid>
            </Grid>
            <Grid item xs={4} >
                {!toolsUtils.isNullOrEmpty(props, "network") && <Grid container justifyContent="center">
                    {toolsUtils.isNullOrEmpty(props, "network.networkServerID") && check !== null && <Button color="primary" onClick={publicNetwork} disabled={check.lora}>Publicar</Button>}
                    {!toolsUtils.isNullOrEmpty(props, "network.networkServerID") && check !== null && <Button color="primary" onClick={removeLoraNetwork} disabled={check.lora}>Remover</Button>}
                </Grid>}
            </Grid>
            <Grid item xs={4}>
                <Grid container justifyContent="flex-end">
                    {toolsUtils.isNullOrEmpty(props, "network") && check !== null && <Button color="primary" name="submit" onClick={addNetwork} disabled={check.submit}>Criar</Button>}
                    {!toolsUtils.isNullOrEmpty(props, "network") && check !== null && <Button color="primary" name="submit" onClick={updateNetwork} disabled={check.submit}>Salvar</Button>}
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );
});