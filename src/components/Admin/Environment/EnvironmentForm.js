import React, { useState, useEffect } from 'react';
import moment from 'moment'
// eslint-disable-next-line
import tz from 'moment-timezone'

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";

import EnvironmentUser from "./EnvironmentUser";
import EnvironmentDevice from "./EnvironmentDevice";
import PredizaAlertDialog from "../../PredizaAlertDialog";
import UserFeedback from '../../Common/UserFeedback';
import EnvironmentStore from "../../../stores/EnvironmentStore";
import tokens from "../../../stores/CancelTokenList";
import SessionStore from '../../../stores/SessionStore';
import styles from '../../../styles/Admin/Environment/EnvironmentForm'
import history from "../../../history";
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function EnvironmentForm(props) {
    const [environment, setEnvironment] = useState({});
    const [flags, setFlags] = useState({});
    const [timezones, setTimezones] = useState([]);
    const [zonings, setZonings] = useState([]);
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const tokenList = new tokens();

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        let env = props.environment || {};

        if (env.latitude === undefined) {
            env.latitude = -23.54892;
        }

        if (env.longitude === undefined) {
            env.longitude = -46.72001;
        }

        setFlags({
            isDisabled: false,
            isClicked: false,
            dialogIsOpen: false,
        });
        setTimezones(moment.tz.names());
        setEnvironment(env);
        getZonings();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleDialog = () => {
        const dialog = flags.dialogIsOpen;
        setFlags({ ...flags, dialogIsOpen: !dialog });
    };

    const onChangeInput = propriety => event => {
        setEnvironment({
            ...environment,
            [propriety]: event.target.value,
        })
    };

    const onSubmit = () => {
        setFlags({
            ...flags,
            isClicked: true,
        })

        if (props.method === "POST") {
            addEnvironment();
        } else if (props.method === "PUT") {
            updateEnvironment();
        }
    }

    const responseUpdateEnvironment = (response) => {
        setFlags({
            ...flags,
            isClicked: false,
            isDisabled: false,
            dialogIsOpen: true,
        })
    };

    const onClickBack = () => {
        history.push("/admin/environments");
    }

    const responseAddEnvironment = (data, response) => {
        setFlags({
            ...flags,
            isDisabled: false,
        })

        if (response === "inserted") {
            if (environment.objectid === undefined) {
                setEnvironment({
                    ...environment,
                    objectid: data.objectid,
                })

                history.push("/admin/environments")
            }
        }

        if (data?.status === 400) {
            setError(data.status.toString());
            setErrorMessage(t('alert.existingEnvironmentName'));
        }
    };

    const addEnvironment = () => {
        let env = environment

        env.latitude = parseFloat(env.latitude);
        env.longitude = parseFloat(env.longitude);
        setFlags({
            ...flags,
            isDisabled: true,
        })
        EnvironmentStore.addEnvironment(env, responseAddEnvironment);
    }

    const updateEnvironment = () => {
        let env = environment
        env.latitude = parseFloat(env.latitude);
        env.longitude = parseFloat(env.longitude);
        setFlags({
            ...flags,
            isDisabled: true,
        })
        EnvironmentStore.updateEnvironment(env, responseUpdateEnvironment);
    }

    const getZonings = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        SessionStore.getZonings(cancelToken, responseGetzonings)
    }

    const responseGetzonings = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null) {
            setZonings(response.data);
        }
    }

    return (
        <form className={classes.formControl} noValidate autoComplete="off">
            <Grid>
                <Grid item xs={12}>
                    <TextField
                        id="name"
                        label={t('common.name')}
                        margin="normal"
                        value={environment.name || ""}
                        onChange={onChangeInput("name")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="description"
                        label={t('common.description')}
                        margin="normal"
                        value={environment.description || ""}
                        onChange={onChangeInput("description")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="latitude"
                        label="Latitude"
                        margin="normal"
                        value={environment.latitude || ""}
                        onChange={onChangeInput("latitude")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                        type="number"
                        inputProps={{ step: 0.01 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="longitude"
                        label="Longitude"
                        margin="normal"
                        value={environment.longitude || ""}
                        onChange={onChangeInput("longitude")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                        type="number"
                        inputProps={{ step: 0.01 }}
                    />
                </Grid>
                <FormControl required className={classes.Input}>
                    <InputLabel htmlFor="timezone">Timezone</InputLabel>
                    {timezones.length !== 0 &&
                        <Select
                            value={environment.timezone || "America/Sao_Paulo"}
                            onChange={onChangeInput("timezone")}
                            name="timezone"
                            disabled={props.method === "GET"}
                        >
                            {timezones.map((timezone, index) => {
                                return (<MenuItem key={index} value={timezone}>{timezone}</MenuItem>)
                            })}
                        </Select>
                    }
                    <FormHelperText>Required</FormHelperText>
                </FormControl>
                <FormControl className={classes.Input}>
                    <InputLabel htmlFor="zoning">Zona</InputLabel>
                    {zonings.length !== 0 &&
                        <Select
                            value={environment.zoning || null}
                            onChange={onChangeInput("zoning")}
                            name="zoning"
                            disabled={props.method === "GET"}
                        >
                            {zonings.map((zoning, index) => {
                                return (<MenuItem key={index} value={zoning.objectid}>{zoning.name}</MenuItem>)
                            })}
                        </Select>
                    }
                </FormControl>
                <Grid item xs={12}>
                    <EnvironmentUser disabled={props.method === "GET"} environment={environment} />
                </Grid>
                <Grid item xs={12}>
                    <EnvironmentDevice disabled={props.method === "GET"} environment={environment} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <Button onClick={onClickBack} className={classes.Button} color="primary">Cancelar</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                {props.method !== "GET" &&
                                    <Button onClick={onSubmit} className={classes.Button} disabled={flags.isDisabled} color="primary">Salvar</Button>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <UserFeedback error={error} message={errorMessage} setError={setError}/>
                <PredizaAlertDialog method="alert" title={t('alert.environmentSuccessfullyUpdated')} open={flags.dialogIsOpen} close={toggleDialog} submit={toggleDialog} />
            </Grid>
        </form>
    );
})