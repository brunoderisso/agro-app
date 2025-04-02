import React, { useState, useEffect } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import { withStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import PredizaAlertDialog from "../../PredizaAlertDialog";
import MeasureSelector from "../../Common/MeasureSelector";
import toolsUtils from "../../../utils/toolsUtils";
import UserStore from "../../../stores/UserStore";
import EnvironmentStore from "../../../stores/EnvironmentStore";
import tokens from "../../../stores/CancelTokenList";
import style from "../../../styles/Treshold/TresholdForm";
import history from "../../../history";


export default withStyles(style)(function TresholdForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [preference, setPreference] = useState(null);
    const [environments, setEnvironments] = useState([]);
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        getEnvironments();
        getPreference();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (preference !== null) {
            startInputs();
            startFlags();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preference]);

    const preferenceToData = () => {
        let newPreference = {
            name: input.name || "",
            surname: input.surname || "",
            username: input.username || "",
            mobilephone: input.mobilephone || "",
            heatmapblur: input.heatmapblur || "",
            heatmapradius: input.heatmapradius || "",
            heatmapzoom: input.heatmapzoom || "",
            measure: input.measure || "",
            environment: input.environment || "",
            uuid: input.uuid || "",
            sms: check.sms || false,
            notify: check.notify || false,
            enable: check.enable || false,
            globaladmin: check.globaladmin || false
        }

        if (toolsUtils.isEmptyString(newPreference.heatmapblur)) {
            newPreference.heatmapblur = null
        } else {
            newPreference.heatmapblur = parseInt(newPreference.heatmapblur)
        }

        if (toolsUtils.isEmptyString(newPreference.heatmapradius)) {
            newPreference.heatmapradius = null
        } else {
            newPreference.heatmapradius = parseInt(newPreference.heatmapradius)
        }

        if (toolsUtils.isEmptyString(newPreference.heatmapzoom)) {
            newPreference.heatmapzoom = null
        } else {
            newPreference.heatmapzoom = parseInt(newPreference.heatmapzoom)
        }

        return newPreference;
    };

    const setMeasure = (measure) => {
        setInput({
            ...input,
            measure: measure
        })
    }

    const setPhone = (fone) => {
        setInput({
            ...input,
            mobilephone: fone
        })
    }

    const isValidPreference = () => {
        if (toolsUtils.isNullOrEmpty(input, "environment") || toolsUtils.isEmptyString(input.environment) ||
            toolsUtils.isNullOrEmpty(input, "measure") || toolsUtils.isEmptyString(input.measure)) {
            setMessage("Todos os campos devem ser preenchidos")
            return false;
        };

        if (!(toolsUtils.isNullOrEmpty(input, "heatmapblur") || toolsUtils.isEmptyString(input.heatmapblur)) && isNaN(parseInt(input.heatmapblur))) {
            setMessage("O campo deve ser numérico")
            return false;
        }

        if (!(toolsUtils.isNullOrEmpty(input, "heatmapradius") || toolsUtils.isEmptyString(input.heatmapradius)) && isNaN(parseInt(input.heatmapradius))) {
            setMessage("O campo deve ser numérico")
            return false;
        }

        if (!(toolsUtils.isNullOrEmpty(input, "heatmapzoom") || toolsUtils.isEmptyString(input.heatmapzoom)) && isNaN(parseInt(input.heatmapzoom))) {
            setMessage("O campo deve ser numérico")
            return false;
        }


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

    const handleInputChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    const handleCheckChange = (e) => setCheck({
        ...check,
        [e.currentTarget.name]: !check[e.currentTarget.name]
    });

    const startFlags = () => {
        const user = props.user || {};
        setCheck(
            {
                sms: preference.sms || false,
                notify: preference.notify || false,
                enable: user.enable || false,
                globaladmin: user.globaladmin || false,
                submit: false
            }
        );
    };

    const startInputs = () => {
        setInput(
            {
                mobilephone: preference.mobilephone || "",
                heatmapblur: preference.heatmapblur || "",
                heatmapradius: preference.heatmapradius || "",
                heatmapzoom: preference.heatmapzoom || "",
                measure: preference.measure || "",
                environment: preference.environment || ""
            }
        );
    }

    //Stores
    const getEnvironmentsResponse = (response) => {
        setEnvironments(response)
    }

    const getPrefenceResponse = (resp) => {
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
            setMessage("Ocorreu um erro ao buscar a preferência");
            return
        };

        setPreference(resp.data);
    };

    const addPreferenceResponse = (resp) => {
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
            setMessage("Ocorreu um erro ao adicionar preferência");
            return
        };

        setMessage("Preferência adicionada com sucesso");
    };

    const updatePreferenceResponse = (resp) => {
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
            setMessage("Ocorreu um erro ao alterar a preferência");
            return
        };

        setMessage("Preferência atualizada com sucesso");
    };


    const addPreference = () => {
        if (!isValidPreference()) {
            return
        };

        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        UserStore.addUserPreference(cancelToken, preferenceToData(), addPreferenceResponse);
    };

    const updatePreference = () => {
        if (!toolsUtils.isNullOrEmpty(props, "uuid") && !toolsUtils.isEmptyString(props.uuid)) {
            if (!isValidPreference()) {
                return
            };

            let cancelToken = {};
            setCheck({
                ...check,
                submit: true
            });
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            UserStore.updateUserPreference(cancelToken, props.uuid, preferenceToData(), updatePreferenceResponse);
        }
    };

    const getPreference = () => {
        if (!toolsUtils.isNullOrEmpty(props, "uuid") && !toolsUtils.isEmptyString(props.uuid)) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            UserStore.getUserPreference(cancelToken, props.uuid, getPrefenceResponse);
        }
    }

    const getEnvironments = () => {
        EnvironmentStore.getEnvironments(getEnvironmentsResponse)
    }

    return (
        <Grid item xs={12}>
            {preference !== null && <Grid container>
                <Grid item xs={12}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12}>
                            {!toolsUtils.isNullOrEmpty(input, "environment") && <FormControl className={classes.textInput}>
                                <InputLabel shrink htmlFor="age-label-placeholder">
                                    Ambiente
                                </InputLabel>
                                <Select
                                    value={input.environment}
                                    onChange={handleInputChange}
                                    name="environment"
                                    className={classes.textInput}
                                >
                                    {environments.map((v) => {
                                        if (v.name[0] !== '_') {
                                            return (<MenuItem value={v.objectid} key={v.objectid}>{v.name}</MenuItem>)
                                        } else return ""
                                    })}
                                </Select>
                            </FormControl>}
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl className={classes.textInput}>

                                {!toolsUtils.isNullOrEmpty(input, "measure") && <MeasureSelector style={{ marinTop: 5 }} measure={input.measure} set={setMeasure} />}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel shrink htmlFor="age-label-placeholder">
                                Telefone
                            </InputLabel>
                            <PhoneInput
                                label="Telefone celular"
                                className={classes.Input}
                                value={input.mobilephone}
                                onChange={setPhone}
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                id="blur"
                                name="heatmapblur"
                                label="Blur"
                                margin="normal"
                                value={input.heatmapblur}
                                onChange={handleInputChange}
                                className={classes.Input}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                id="radius"
                                name="heatmapradius"
                                label="Raio"
                                margin="normal"
                                value={input.heatmapradius}
                                onChange={handleInputChange}
                                className={classes.Input}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                id="zoom"
                                label="Zoom"
                                margin="normal"
                                name="heatmapzoom"
                                value={input.heatmapzoom}
                                onChange={handleInputChange}
                                className={classes.Input}
                                fullWidth
                                required
                            />
                        </Grid>
                        {check !== null && <Grid item xs={12}>
                            <FormGroup row>
                                {!toolsUtils.isNullOrEmpty(check, "sms") && <FormControlLabel
                                    control={
                                        <Switch
                                            checked={check.sms}
                                            onChange={handleCheckChange}
                                            value="sms"
                                            name="sms"
                                            color="primary"
                                        />
                                    }
                                    label="SMS"
                                />
                                }
                                {!toolsUtils.isNullOrEmpty(check, "notify") && <FormControlLabel
                                    control={
                                        <Switch
                                            checked={check.notify}
                                            onChange={handleCheckChange}
                                            value="notify"
                                            name="notify"
                                            color="primary"
                                        />
                                    }
                                    label="Email"
                                />}
                            </FormGroup>
                        </Grid>}
                    </Grid>
                </Grid>
                <Grid item xs={6} >
                    <Grid container justifyContent="flex-start">
                        <Button color="primary" onClick={back} >Voltar</Button>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container justifyContent="flex-end">
                        {toolsUtils.isNullOrEmpty(preference, "objectid") && check !== null && <Button color="primary" name="submit" onClick={addPreference} disabled={check.submit}>Criar</Button>}
                        {!toolsUtils.isNullOrEmpty(preference, "objectid") && check !== null && <Button color="primary" name="submit" onClick={updatePreference} disabled={check.submit}>Salvar</Button>}
                    </Grid>
                </Grid>
                <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
            </Grid>}
        </Grid>
    );
});