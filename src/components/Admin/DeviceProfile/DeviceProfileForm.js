import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import history from "../../../history";
import TokenList from '../../../stores/CancelTokenList'
import PredizaAlertDialog from "../../PredizaAlertDialog";
import toolsUtils from "../../../utils/toolsUtils";
import style from "../../../styles/Admin/Profiles/DeviceProfileForm";
import DeviceProfileStore from "../../../stores/DeviceProfileStore";
import NetworkServerStore from "../../../stores/NetworProfileStore";


export default withStyles(style)(function DeviceProfileForm(props) {

    const [deviceProfile, setDeviceProfile] = useState({});
    const [message, setMessage] = useState("");
    const [flags, setFlags] = useState({});
    const tokenList = new TokenList();

    const [macVersion, setMacVersion] = useState("");
    const [regionalPameters, setRegionalParameters] = useState("");

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
    }, [deviceProfile]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [macVersion]);

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
        const dev = props.deviceProfile || {};
        const organization = props.organizationObjectID || null;

        setRegionalParameters(dev.regionalPameters || "");
        setMacVersion(dev.macVersion || "");
        setDeviceProfile(
            {
                organizationObjectID: organization || null,
                ObjectID: dev.ObjectID || null,
                name: dev.name || "",
                networkServerObjectID: dev.networkServerObjectID || null,
                deviceProfileID: dev.deviceProfileID || null,
                macVersion: macVersion || "",
                regionalPameters: regionalPameters || "",
            });
    }

    const addDeviceProfile = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submit: true,
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceProfileStore.addDeviceProfile(toData(), cancelToken, addDeviceProfileResponse);

    }

    const toData = () =>{
        const dev = deviceProfile || {};
         return {
            organizationObjectID: dev.organizationObjectID || null,
            ObjectID: dev.ObjectID || null,
            name: dev.name || "",
            networkServerObjectID: dev.networkServerObjectID || null,
            deviceProfileID: dev.deviceProfileID || null,
            macVersion: macVersion,
            regionalParameters: regionalPameters,
        }
    }

    const addDeviceProfileResponse = (response) => {
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

    const updateDeviceProfile = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submit: true,
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceProfileStore.updateDeviceProfile(deviceProfile, cancelToken, updateDeviceProfileResponse);

    }

    const updateDeviceProfileResponse = (response) => {
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
        history.push("/admin/organizations/" + props.organizationObjectID + "/profile/device/" + id);
    }

    const onChangeSelect = (event) => {
        setDeviceProfile({
            ...deviceProfile,
            networkServerObjectID: event.target.value,
        });
    }

    const onChangeInput = (event) => {
        setDeviceProfile({
            ...deviceProfile,
            [event.target.name]: event.target.value,
        });
    };

    //Component methods
    const clearMessage = () => {
        setMessage("");
    }

    const back = () => {
        DeviceProfileStore.setSelected(1);
        history.push("/admin/organizations/" + props.organizationObjectID)
    }

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(deviceProfile, "name") || toolsUtils.isEmptyString(deviceProfile.name)) {
            setMessage("Todos os campos devem ser preenchidos")
            return false;
        };
        return true;
    };

    const publicDeviceProfile = () => {
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
        DeviceProfileStore.addLoraDeviceProfile(deviceProfile, cancelToken, publicDeviceProfileResponse);
    };

    const publicDeviceProfileResponse = (response) =>{
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false
        });

        if (response.data === null) {
            setMessage("Ocorreu um erro ao publicar no lora o servidor");
        }else{
            setDeviceProfile({
                ...deviceProfile,
                deviceProfileID: response.data.deviceProfileID
            });
            setMessage("Servidor publicado com sucesso no lora");
        };
    }

    const removeLoraDevice = () => {
        let cancelToken = {};
        setFlags({
            ...flags,
            submitLora: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceProfileStore.deleteLoraDeviceProfile(toData(), cancelToken, removeLoraResponse);
    };

    const removeLoraResponse = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false,
        });


        if (response.data === null) {
            setMessage("Ocorreu um erro ao deletar o servidor no lora");
        }else{
            setDeviceProfile({
                ...deviceProfile,
                deviceProfileID: null,
            })
            setMessage("Servidor no lora deletado com sucesso");
        };

    }

    const onChangeMacVersion = (event) =>{
        let version = event.target.value;
        setMacVersion(version);
        setDeviceProfile({
            ...deviceProfile,
            macVersion: version,
        })
    }

    const onChangeRegionalPameters = (event) =>{
        let parameters = event.target.value;
        setRegionalParameters(parameters);
        setDeviceProfile({
            ...deviceProfile,
            regionalPameters: parameters,
        })
    }

    return (

        <Grid container >

            <Grid item xs={12} >
                <TextField
                    id="name"
                    label="Nome"
                    name="name"
                    margin="normal"
                    value={deviceProfile.name || ""}
                    onChange={onChangeInput}
                    fullWidth
                    required
                    disabled={deviceProfile.name === null}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    id="deviceProfileID"
                    label="Device Profile ID"
                    margin="normal"
                    name="deviceProfileID"
                    value={deviceProfile.deviceProfileID || ""}
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
                        value={deviceProfile.networkServerObjectID || ""}
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

            </Grid>
            <Grid item xs={12} >
                <FormControl className={classes.select}>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        LoRaWAN MAC version
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={macVersion || ""}
                        onChange={onChangeMacVersion}
                        displayEmpty
                    >
                        <MenuItem value={""}> Nenhum </MenuItem>
                        <MenuItem value={"1.0.0"}> 1.0.0 </MenuItem>
                        <MenuItem value={"1.0.1"}> 1.0.1 </MenuItem>
                        <MenuItem value={"1.0.2"}> 1.0.2 </MenuItem>
                        <MenuItem value={"1.0.3"}> 1.0.3 </MenuItem>
                        <MenuItem value={"1.1.0"}> 1.1.0 </MenuItem>

                    </Select>
                    <FormHelperText>
                        Versão LoRaWAN MAC suportada pelo dispositivo
                    </FormHelperText>
                </FormControl>

            </Grid>
            <Grid item xs={12} >
                <FormControl className={classes.select}>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        LoRaWAN Regional Parameters revision 
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-placeholder-label-label"
                        id="demo-simple-select-placeholder-label"
                        value={regionalPameters || ""}
                        onChange={onChangeRegionalPameters}
                        displayEmpty
                    >
                        <MenuItem value={""}> Nenhum </MenuItem>
                        <MenuItem value={"A"}> A </MenuItem>
                        <MenuItem value={"B"}> B </MenuItem>

                    </Select>
                    <FormHelperText>
                        Revisão da especificação dos parâmetros regionais suportado pelo dispositivo.
                    </FormHelperText>
                </FormControl>

            </Grid>
            <Grid item xs={12} className={classes.buttons}>
                <Grid container>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={back} color="primary">Voltar</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} >
                        {!toolsUtils.isNullOrEmpty(deviceProfile, "ObjectID") && !toolsUtils.isEmptyString(deviceProfile.ObjectID) && <Grid container justifyContent="center">
                            {toolsUtils.isNullOrEmpty(deviceProfile, "networkServerID") && flags !== null && <Button color="primary"  onClick={publicDeviceProfile} disabled={flags.submitLora}>Publicar</Button>}
                            {!toolsUtils.isNullOrEmpty(deviceProfile, "networkServerID") && flags !== null && <Button color="primary" onClick={removeLoraDevice} disabled={flags.submitLora}>Remover</Button>}
                        </Grid>}
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-end">
                            {(!(toolsUtils.isNullOrEmpty(deviceProfile, "ObjectID")) && !toolsUtils.isEmptyString(deviceProfile.ObjectID)) && <Button disabled={flags.submit} onClick={updateDeviceProfile} color="primary">Salvar</Button>}
                            {((toolsUtils.isNullOrEmpty(deviceProfile, "ObjectID")) || toolsUtils.isEmptyString(deviceProfile.ObjectID)) && <Button disabled={flags.submit} onClick={addDeviceProfile} color="primary">Adiconar</Button>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>

    );

});


