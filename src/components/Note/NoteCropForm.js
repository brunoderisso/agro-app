import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import Button from "@material-ui/core/Button";

//Prediza
import PredizaAlertDialog from "../PredizaAlertDialog";

import toolsUtils from "../../utils/toolsUtils";
import NoteStore from "../../stores/NoteStore";
import SessionStore from "../../stores/SessionStore";

import tokens from "../../stores/CancelTokenList";
import style from "../../styles/Treshold/TresholdForm";
import moment from "moment";

export default withStyles(style)(function NoteCropForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [crops, setCrops] = useState([]);
    const [crop, setCrop] = useState();
    const [stages, setStages] = useState([])
    const [check, setCheck] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        startFlags();
        startInputs();
        getStages();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCrops(props.crops);
    }, [props.crops]);

    useEffect(() => {
        if (crop !== null && crop !== undefined && !toolsUtils.isEmptyString(crop)){
            getStages();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [crop]);

    const toData = () => {
        const envcrop = props.envcrop || {};

        let newCrop = {
            objectid: envcrop.objectid || null,
            environmentobjectid: envcrop.environmentobjectid || SessionStore.getEnvironment(),
            cropobjectid: crop || null,
            croptype: input.croptype,
            cropsoil: input.cropsoil,
            croprootstock: input.croprootstock,
            cropphenologicalstage: input.cropphenologicalstage || "",

        }

        if (toolsUtils.isEmptyString(input.cropspacing)) {
            newCrop.cropspacing = null
        } else {
            newCrop.cropspacing = parseFloat(input.cropspacing)
        }

        if (toolsUtils.isEmptyString(input.cropnumberofplants)) {
            newCrop.cropnumberofplants = null
        } else {
            newCrop.cropnumberofplants = parseInt(input.cropnumberofplants)
        }

        if (toolsUtils.isEmptyString(input.cropplantingdate)) {
            newCrop.cropplantingdate = null
        } else {
            newCrop.cropplantingdate = new Date(moment(input.cropplantingdate, "DD/MM/YYYY").valueOf()).toISOString()
        }

        return newCrop;

    };

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(props, "envcrop") && (crop === null || crop === undefined || toolsUtils.isEmptyString(crop))) {
            setMessage("A variedade deve ser preenchida");
            return false;
        };


        if (!toolsUtils.isNullOrEmpty(input, "cropspacing") && !toolsUtils.isEmptyString(input.cropspacing)) {
            if (isNaN(parseFloat(input.cropspacing))) {
                setMessage("O valor do espaçamento deve ser decimal");
                return false;
            }
        }

        if (!toolsUtils.isNullOrEmpty(input, "cropnumberofplants") && !toolsUtils.isEmptyString(input.cropnumberofplants)) {
            if (isNaN(parseInt(input.cropnumberofplants))) {
                setMessage("O valor do número de plantas deve ser inteiro");
                return false;
            }
        }

        if (!toolsUtils.isNullOrEmpty(input, "cropplantingdate") && !toolsUtils.isEmptyString(input.cropplantingdate)) {
            var date = moment(input.cropplantingdate, "DD/MM/YYYY")
            if (!date.isValid()) {
                setMessage("A data do plantio deve estar no formato DD/MM/YYYY");
                return false;
            }
        }


        return true;
    };

    const back = () => {
        props.back();
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

    const handleSelectChange = (e) => {
        setCrop(e.target.value);
    }

    const handleSelectStageChange = (e) => setInput({...input, cropphenologicalstage: e.target.value});

    const startFlags = () => {
        setCheck(
            {
                submit: false
            }
        );
    };

    const startInputs = () => {
        const envcrop = props.envcrop || {};
        setInput(
            {
                objectid: envcrop.objectid || "",
                environmentobjectid: envcrop.environmentobjectid || SessionStore.getEnvironment(),
                cropobjectid: envcrop.cropobjectid || "",
                croptype: envcrop.croptype || "",
                cropsoil: envcrop.cropsoil || "",
                croprootstock: envcrop.croprootstock || "",
                cropspacing: envcrop.cropspacing || "",
                cropnumberofplants: envcrop.cropnumberofplants || "",
                cropphenologicalstage: envcrop.cropphenologicalstage || "",
                cropplantingdate: (envcrop.cropplantingdate !== null && moment(envcrop.cropplantingdate).format("DD/MM/YYYY")) || ""
            }
        );

    }

    //Stores
    const addCropResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar o cultivo");
            return
        };

        setInput({
            ...input,
            objectid: resp.data.objectid
        });

        setMessage("Cultivo adicionado com sucesso");
        props.back();
    };

    const updateCropResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alterar o cultivo");
            return
        };

        setMessage("Cultivo atualizado com sucesso");
        props.back();
    };

    const getStages = () => {
        if (toolsUtils.isNullOrEmpty(props, "envcrop") && (crop === null || crop === undefined || toolsUtils.isEmptyString(crop))){
            return
        }

        if (!toolsUtils.isNullOrEmpty(props, "envcrop") && toolsUtils.isNullOrEmpty(props, "envcrop.cropobjectid") && toolsUtils.isNullOrEmpty(props, "envcrop.objectid")){
            return
        }

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        if (toolsUtils.isNullOrEmpty(props, "envcrop")){
            NoteStore.getCropStages(crop, cancelToken, responseGetStages)
        }

        const envcrop = props.envcrop || {}
        if (!toolsUtils.isNullOrEmpty(props, "envcrop")){
            NoteStore.getCropStages(envcrop.cropobjectid, cancelToken, responseGetStages)
        }
    }

    const responseGetStages = (resp) => {
        tokenList.remove(resp.id);
        setStages(resp.data || [])
    }

    const addCrop = () => {
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
        NoteStore.addNoteCrop(toData(), cancelToken, addCropResponse);
    };

    const updateCrop = () => {
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
        NoteStore.editNoteCrop(toData(), cancelToken, updateCropResponse);
    };

    const getTitle = () => {
        if (!toolsUtils.isNullOrEmpty(props, "envcrop.cropname") && !toolsUtils.isNullOrEmpty(props, "envcrop.cropvariety") && !toolsUtils.isEmptyString(props.envcrop.cropname) && !toolsUtils.isEmptyString(props.envcrop.cropvariety)) {
            return (props.envcrop.cropname + " " + props.envcrop.cropvariety).toUpperCase();
        }

        if (!toolsUtils.isNullOrEmpty(props, "envcrop.cropname") && !toolsUtils.isEmptyString(props.envcrop.cropname)) {
            return props.envcrop.cropname.toUpperCase();
        }

        return "";
    }

    return (
        <Grid container>
            <Grid item xs={12} style={{ margin: 5 }}>
                <Grid container>
                    {toolsUtils.isNullOrEmpty(props, "envcrop") && <Grid item xs={12}>
                        <TextField
                            select
                            label="Variedade"
                            value={crop}
                            onChange={handleSelectChange}
                            className={classes.textInput}
                        >
                            {crops.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>}
                    {!toolsUtils.isNullOrEmpty(props, "envcrop") && <Grid item xs={12}>

                        <TextField
                            label="Variedade"
                            className={classes.textInput}
                            value={getTitle()}
                            margin="normal"
                            required
                            disabled
                        />
                    </Grid>}
                    <Grid item xs={12}>
                        <TextField
                            label="Tipo"
                            className={classes.textInput}
                            value={input.croptype}
                            onChange={handleInputChange}
                            margin="normal"
                            name="croptype"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Data de Plantio"
                            className={classes.textInput}
                            value={input.cropplantingdate}
                            onChange={handleInputChange}
                            margin="normal"
                            name="cropplantingdate"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Solo"
                            className={classes.textInput}
                            value={input.cropsoil}
                            onChange={handleInputChange}
                            margin="normal"
                            name="cropsoil"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Porta Enxerto"
                            className={classes.textInput}
                            value={input.croprootstock}
                            onChange={handleInputChange}
                            margin="normal"
                            name="croprootstock"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Espaçamento"
                            className={classes.textInput}
                            value={input.cropspacing}
                            onChange={handleInputChange}
                            margin="normal"
                            name="cropspacing"
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Número de Plantas"
                            className={classes.textInput}
                            value={input.cropnumberofplants}
                            onChange={handleInputChange}
                            margin="normal"
                            name="cropnumberofplants"
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                            select
                            label="Estádio Fenológico"
                            value={input.cropphenologicalstage}
                            onChange={handleSelectStageChange}
                            className={classes.textInput}
                        >
                            {stages.map((option) => (
                                <MenuItem key={option.objectid} value={option.objectid}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
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
                    {toolsUtils.isNullOrEmpty(props, "envcrop") && check !== null && <Button color="primary" name="submit" onClick={addCrop} disabled={check.submit}>Criar</Button>}
                    {!toolsUtils.isNullOrEmpty(props, "envcrop") && check !== null && <Button color="primary" name="submit" onClick={updateCrop} disabled={check.submit}>Salvar</Button>}
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );
});