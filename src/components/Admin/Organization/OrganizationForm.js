import React, { useState, useEffect} from 'react';

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import history from "../../../history";
import TokenList from '../../../stores/CancelTokenList'
import PredizaAlertDialog from "../../PredizaAlertDialog";
import OrganizationStore from "../../../stores/OrganizationStore"
import toolsUtils from "../../../utils/toolsUtils";
import LoraStore from "../../../stores/LoraStore";
import style from "../../../styles/Treshold/TresholdForm";


export default withStyles(style)(function OrganizationForm(props) {
    const [organization, setOrganization] = useState({});
    const [message, setMessage] = useState("");
    const [flags, setFlags] = useState({});
    const tokenList = new TokenList();

    useEffect(() => {
        startFlags();
        startInputs();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    }

    const startFlags = () => {
        setFlags({
            submitLora: false,
            submit: false
        });
    }

    const startInputs = () => {
        const org = props.organization || {};
        setOrganization(
            {
                objectid: org.objectid || "",
                name: org.name || "",
                description: org.description || "",
                organizationID: org.organizationID || null,
                canHaveGateways: org.canHaveGateways || false,
            }
        );
    }

    const onLoraSubmit = () => {
        setFlags({
            ...flags,
            submitLora: true,
        });

        if (!toolsUtils.isNullOrEmpty(organization, "organizationID") && !toolsUtils.isEmptyString(organization.organizationID) && organization.organizationID !== 0) {
            deleteLoraOrganization();
            return
        }
        addLoraOrganization();
    }

    const onChangeInput = (event) => {
        setOrganization({
            ...organization,
            [event.target.name]: event.target.value,
        });
    };

    const onChangeSwitch = (event) => {
        const obj = organization.canHaveGateways;
        setOrganization({
            ...organization,
            [event.target.name]: !obj
        });
    };

    const clearMessage = () => {
        setMessage("");
    }

    const responseUpdateOrganization = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submit: false,
        });

        if (response.data !== null) {
            setMessage("Organização atulizada com sucesso");
        } else {
            setMessage("Ocorreu um erro ao atualizar a organização");
        }
    }

    const responseAddOrganization = (response) => {
        tokenList.remove(response.id);
        setFlags({
            ...flags,
            submit: false,
        });
        if (response !== null) {
            history.push("/admin/organizations/" + response.data.objectid)
        }
    }

    const responseAddLoraOrganization = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false
        });
        if (!toolsUtils.isNullOrEmpty(response.data, "organizationID")) {
            setOrganization({
                ...organization,
                organizationID: response.data.organizationID
            });
            setMessage("Organização associada com sucesso");
        } else {
            setMessage("Ocorreu um erro ao associar a organização");
        }
    }

    const responseDelLoraOrganization = (response) => {
        tokenList.remove(response.id);

        setFlags({
            ...flags,
            submitLora: false,
        });
        if (response.data !== null) {
            setOrganization({
                ...organization,
                organizationID: null
            });
            setMessage("Organização desassociada com sucesso");
        } else {
            setMessage("Ocorreu um erro ao desassociar a organização");
        }
    }

    const back = () => {
        history.push("/admin/organizations/")
    }

    const updateOrganization = () => {

        setFlags({
            ...flags,
            submit: true,
        });

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        OrganizationStore.updateOrganization(organization, cancelToken, responseUpdateOrganization);
    }

    const getLoraButton = () => {
        if (!toolsUtils.isNullOrEmpty(organization, "organizationID") && !toolsUtils.isEmptyString(organization.organizationID) && organization.organizationID !== 0) {
            return (
                <Button disabled={flags.submitLora} onClick={onLoraSubmit} color="primary"> Despublicar </Button>
            );
        }
        return (
            <Button disabled={flags.submitLora} onClick={onLoraSubmit} color="primary"> Publicar </Button>
        );
    }

    const addOrganization = () => {
        if (organization.organizationID === 0) {
            setOrganization({
                ...organization,
                organizationID: null,
            });
        }

        setFlags({
            ...flags,
            submit: true,
        });

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        OrganizationStore.addOrganization(organization, cancelToken, responseAddOrganization);
    }

    const addLoraOrganization = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        LoraStore.addLoraOrganization(organization, cancelToken, responseAddLoraOrganization);
    }

    const deleteLoraOrganization = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        LoraStore.deleteLoraOrganization(organization.objectid, cancelToken, responseDelLoraOrganization);
    }

    return (
        <Grid container style={{ paddingLeft: '65px' }}>
            <Grid item xs={12} >
                <TextField
                    id="name"
                    label="Nome"
                    name="name"
                    margin="normal"
                    value={organization.name || ""}
                    onChange={onChangeInput}
                    fullWidth
                    required
                    disabled={organization.objectid === null}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="description"
                    label="Descrição"
                    name="description"
                    margin="normal"
                    value={organization.description || ""}
                    onChange={onChangeInput}
                    fullWidth
                    required
                    disabled={props.method === "GET"} />

            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="organizationID"
                    label="Organization ID"
                    margin="normal"
                    name="organizationID"
                    value={organization.organizationID || ""}
                    onChange={onChangeInput}
                    fullWidth
                    required
                    disabled
                />
            </Grid>
            <Grid item xs={12}>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={organization.canHaveGateways || false}
                                onChange={onChangeSwitch}
                                value="canHaveGateways"
                                name="canHaveGateways"
                                color="primary"
                                disabled={props.method === "GET"}
                            />
                        }
                        label="Gateways"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={back} color="primary">Voltar</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justifyContent="center">
                            {props.method === "PUT" && getLoraButton()}
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-end">
                            {!(toolsUtils.isNullOrEmpty(organization, "objectid") || toolsUtils.isEmptyString(organization.objectid)) && <Button disabled={flags.submit} onClick={updateOrganization} color="primary">Salvar</Button>}
                            {(toolsUtils.isNullOrEmpty(organization, "objectid") || toolsUtils.isEmptyString(organization.objectid)) && <Button disabled={flags.submit} onClick={addOrganization} color="primary">Adicionar</Button>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );
})


