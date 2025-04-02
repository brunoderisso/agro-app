import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import PredizaAlertDialog from "../PredizaAlertDialog";
import PinMap from "../Common/PinMap";
import toolsUtils from "../../utils/toolsUtils";
import AccountStore from "../../stores/AccountStore";
import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";
import style from "../../styles/Treshold/TresholdForm";
import history from "../../history";


export default withStyles(style)(function NoteEnvironmentForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        startFlags();
        startInputs();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toData = () => {
        let newCrop = {
            objectid: input.objectid || "",
            description: input.description || "",
            name: input.name || "",
            timezone: input.timezone || ""
        }

        if (toolsUtils.isEmptyString(input.area)) {
            newCrop.area = null
        } else {
            newCrop.area = parseFloat(input.area)
        }

        if (toolsUtils.isEmptyString(input.latitude)) {
            newCrop.latitude = null
        } else {
            newCrop.latitude = parseFloat(input.latitude)
        }

        if (toolsUtils.isEmptyString(input.longitude)) {
            newCrop.longitude = null
        } else {
            newCrop.longitude = parseFloat(input.longitude)
        }

        return newCrop;

    };

    const isValid = () => {
        if (!toolsUtils.isNullOrEmpty(input, "area") && !toolsUtils.isEmptyString(input.area)) {

            if (isNaN(parseFloat(input.area))) {
                setMessage("O valor da área deve ser decimal");
                return false;
            }
        }

        if (!toolsUtils.isNullOrEmpty(input, "latitude") && !toolsUtils.isEmptyString(input.latitude)) {
            if (isNaN(parseFloat(input.latitude))) {
                setMessage("O valor da latitude deve ser decimal");
                return false;
            }
        }

        if (!toolsUtils.isNullOrEmpty(input, "longitude") && !toolsUtils.isEmptyString(input.longitude)) {
            if (isNaN(parseInt(input.longitude))) {
                setMessage("O valor da longitutde deve ser decimal");
                return false;
            }
        }


        return true;
    };

    const back = () => {
        history.goBack();
    };

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
        // if (valid && toolsUtils.isNullOrEmpty(props, "alert")) {
        //     history.push("/alert/" + input.objectid);
        // }

    };

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });


    const startFlags = () => {
        setCheck(
            {
                submit: false
            }
        );
    };

    const startInputs = () => {
        const env = SessionStore.getEnvironmentDetail() || {};
        setInput(
            {
                objectid: env.objectid || "",
                area: env.area || "",
                description: env.description || "",
                name: env.name || "",
                timezone: env.timezone || "",
                latitude: env.latitude || "",
                longitude: env.longitude || ""
            }
        );
    }

    const changeLatLong = (latlong) => {

        let lat = parseFloat(latlong.lat).toFixed(5);
        let lng = parseFloat(latlong.lng).toFixed(5);

        if (!isNaN(lat) && !isNaN(lng)) {
            setInput({
                ...input,
                latitude: lat,
                longitude: lng
            })
            return
        }

    }
    //Stores
    const updateEnvironmentResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alterar o ambiente");
            return
        };

        SessionStore.fetchEnvironments(()=>{})
        setMessage("Ambiente atualizado com sucesso");
    };

    const updateEnvironment = () => {
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
        AccountStore.updateEnvironment(cancelToken, toData(), null, updateEnvironmentResponse);
    };


    return (
        <Grid container>
            <Grid item xs={12} style={{ margin: 5 }}>
                <Grid container>
                    <Grid item xs={7}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField
                                    label="Área"
                                    className={classes.textInput}
                                    value={input.area}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    name="area"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Descrição"
                                    className={classes.textInput}
                                    value={input.description}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    name="description"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Latitude"
                                    className={classes.textInput}
                                    value={input.latitude}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    name="latitude"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Longitude"
                                    className={classes.textInput}
                                    value={input.longitude}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    name="longitude"
                                />
                            </Grid>
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
                                    label="Fuso horário"
                                    className={classes.textInput}
                                    value={input.timezone}
                                    onChange={handleInputChange}
                                    margin="normal"
                                    required
                                    name="timezone"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        <PinMap change={changeLatLong} latitude={input.latitude} longitude={input.longitude}/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6} >
                <Grid container justifyContent="flex-start">
                    <Button color="primary" onClick={back} >Voltar</Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container className={classes.container} justifyContent="flex-end">
                    <Button color="primary" name="submit" onClick={updateEnvironment} method="PUT">Salvar</Button>
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );
});