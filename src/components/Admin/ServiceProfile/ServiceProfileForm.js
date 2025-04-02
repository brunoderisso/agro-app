import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

// Material UI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// //Prediza
import history from "../../../history";
import TokenList from '../../../stores/CancelTokenList'
import PredizaAlertDialog from "../../PredizaAlertDialog";
import toolsUtils from "../../../utils/toolsUtils";
import style from "../../../styles/Admin/Profiles/DeviceProfileForm";
import ServiceProfileStore from "../../../stores/ServiceProfileStore";
import NetworkServerStore from "../../../stores/NetworProfileStore";


export default withStyles(style)(function DeviceProfileForm(props) {

    const [serviceProfile, setServiceProfile] = useState({});
    const [message, setMessage] = useState("");
    const [flags, setFlags] = useState({});
    const tokenList = new TokenList();

    const [networks, setNetworks] = useState([]);

    const { classes } = props;

    useEffect(() => {
        startFlags();
        startInputs();
        getNetworkServers();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceProfile]);


    const clear = () => {
        tokenList.clear();
    }

    const startFlags = () => {
        setFlags({
            submit: false,
            submitLora: false,
        });
    }

    const getNetworkServers = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworkServerStore.getNetworkServers(cancelToken, responseGetNetorkServers);

    }

    const responseGetNetorkServers = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setNetworks(response.data);
            return
        };

    };



    const startInputs = () => {
        const serv = props.serviceProfile || {};
        const organization = props.organizationObjectID || null;

        setServiceProfile(
            {
                organizationObjectID: organization || null,
                ObjectID: serv.ObjectID || null,
                name: serv.name || "",
                networkServerObjectID: serv.networkServerObjectID || null,
                serviceProfileID: serv.serviceProfileID || null,
                gatewayMetaData: serv.gatewayMetaData || false,
            });



    }



    const addServiceProfile = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submit: true,
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.addServiceProfile(toData(), cancelToken, addServiceProfileResponse);

    }

    const toData = () => {
        const serv = serviceProfile || {};
        return {
            organizationObjectID: serv.organizationObjectID || null,
            ObjectID: serv.ObjectID || null,
            name: serv.name || "",
            networkServerObjectID: serv.networkServerObjectID || null,
            serviceProfileID: serv.serviceProfileID || null,
        }
    }

    const addServiceProfileResponse = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submit: false
        });

        if (response.data === null) {
            setMessage("Ocorreu um erro ao adicionar o servidor");
        } else {
            setMessage("Servidor adicionado com sucesso");
            redirectTo(response.data.objectid);
        }
    }


    const updateServiceProfile = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submit: true,
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.updateServiceProfile(serviceProfile, cancelToken, updateServiceProfileResponse);

    }

    const updateServiceProfileResponse = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submit: false
        });

        if (response.data === null) {
            setMessage("Ocorreu um erro ao alterar o servidor");
        } else {
            setMessage("Servidor atualizado com sucesso");
        };
    }

    const redirectTo = (id) => {
        history.push("/admin/organizations/" + props.organizationObjectID + "/profile/service/" + id);
    }

    const onChangeSelect = (event) => {
        setServiceProfile({
            ...serviceProfile,
            networkServerObjectID: event.target.value,
        });
    }


    const onChangeInput = (event) => {
        setServiceProfile({
            ...serviceProfile,
            [event.target.name]: event.target.value,
        });
    };

    const onChangeCheck = (event) => {
        setServiceProfile({
            ...serviceProfile,
            [event.target.name]: event.target.checked,
        });
    };

    //Component methods
    const clearMessage = () => {
        setMessage("");
    }

    const back = () => {

        history.push("/admin/organizations/" + props.organizationObjectID)
    }

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(serviceProfile, "name") || toolsUtils.isEmptyString(serviceProfile.name)) {
            setMessage("Todos os campos devem ser preenchidos")
            return false;
        };
        return true;
    };

    const publicServiceProfile = () => {
        if (!isValid()) {
            return
        };

        let cancelToken = {};
        setFlags({
            ...flags,
            submitLora: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.addLoraServiceProfile(serviceProfile, cancelToken, publicServiceProfileResponse);
    };

    const publicServiceProfileResponse = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false
        });

        if (response.data === null) {
            setMessage("Ocorreu um erro ao publicar no lora o servidor");
        } else {
            setServiceProfile({
                ...serviceProfile,
                serviceProfileID: response.data.serviceProfileID
            });
            setMessage("Servidor publicado com sucesso no lora");
        };
    }

    const removeLoraService = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submitLora: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.deleteLoraServiceProfile(toData(), cancelToken, removeLoraResponse);
    };

    const removeLoraResponse = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false
        });


        if (response.data === null) {
            setMessage("Ocorreu um erro ao deletar o servidor no lora");
        } else {
            setServiceProfile({
                ...serviceProfile,
                serviceProfileID: null,
            })
            setMessage("Servidor no lora deletado com sucesso");
        };


    };

    return (

        <Grid container >

            <Grid item xs={12} >
                <TextField
                    id="name"
                    label="Nome"
                    name="name"
                    margin="normal"
                    value={serviceProfile.name || ""}
                    onChange={onChangeInput}
                    fullWidth
                    required
                    disabled={serviceProfile.name === null}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="serviceProfileID"
                    label="Service Profile ID"
                    margin="normal"
                    name="serviceProfileID"
                    value={serviceProfile.serviceProfileID || ""}
                    fullWidth
                    required
                    disabled
                />
            </Grid>
            <Grid item xs={12} >
                <FormControl className={classes.select}>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Servidor
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={serviceProfile.networkServerObjectID || ""}
                        onChange={onChangeSelect}
                        displayEmpty
                    >
                        <MenuItem value={""}> Nenhum </MenuItem>
                        {networks.map((val, id) => {
                            return (<MenuItem key={id} value={val.ObjectID}> {val.name} </MenuItem>)
                        })}
                    </Select>
                    <FormHelperText>Selecione o Servidor</FormHelperText>
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={serviceProfile.gatewayMetaData || false}
                            onChange={onChangeCheck}
                            name="gatewayMetaData"
                            color="primary"
                        />
                    }
                    label="Add gateway meta-data"
                />
            </Grid>
            <Grid item xs={12} className={classes.buttons}>
                <Grid container>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={back} color="primary">Voltar</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} >
                        {!toolsUtils.isNullOrEmpty(serviceProfile, "ObjectID") && !toolsUtils.isEmptyString(serviceProfile.ObjectID) && <Grid container justifyContent="center">
                            {toolsUtils.isNullOrEmpty(serviceProfile, "networkServerID") && flags !== null && <Button color="primary" onClick={publicServiceProfile} disabled={flags.submitLora}>Publicar</Button>}
                            {!toolsUtils.isNullOrEmpty(serviceProfile, "networkServerID") && flags !== null && <Button color="primary" onClick={removeLoraService} disabled={flags.submitLora}>Remover</Button>}
                        </Grid>}
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-end">
                            {(!(toolsUtils.isNullOrEmpty(serviceProfile, "ObjectID")) && !toolsUtils.isEmptyString(serviceProfile.ObjectID)) && <Button disabled={flags.submit} onClick={updateServiceProfile} color="primary">Salvar</Button>}
                            {((toolsUtils.isNullOrEmpty(serviceProfile, "ObjectID")) || toolsUtils.isEmptyString(serviceProfile.ObjectID)) && <Button disabled={flags.submit} onClick={addServiceProfile} color="primary">Adiconar</Button>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>

    );

})


