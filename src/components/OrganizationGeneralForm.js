import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import history from "../history";
import PredizaAlertDialog from "../components/PredizaAlertDialog";
import OrganizationStore from "../stores/OrganizationStore"
import toolsUtils from "../utils/toolsUtils";
import LoraStore from "../stores/LoraStore";

const styles = () => ({

});

class OrganizationGeneralForm extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            organization: this.props.organization,
            id: this.props.organization.organizationID,
            message: "",
            submitLora: false,
            submit:false
        };


    }

    //Component default methods

    //Event methods
    onSubmit = () => {
        this.setState({submit:true})
        if (this.props.method === "POST") {
            this.addOrganization();
        } else if (this.props.method === "PUT") {
            this.updateOrganization();
        }
    }

    onLoraSubmit = () => {
        this.setState({submitLora:true})
        if (toolsUtils.isNullOrEmpty(this.state, "id") || toolsUtils.isEmptyString(this.state.id)) {
            this.addLoraOrganization();
        } else {
            this.deleteLoraOrganization();
        }
    }

    onChangeInput = propriety => event => {
        this.changeState("organization", propriety, event.target.value);
    };

    onChangeSwitch = propriety => event => {
        this.changeState("organization", propriety, !this.state.organization[propriety]);
    };


    //Component methods
    clearMessage = () =>{
        this.setState({message:""})
    }
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseUpdateOrganization = (response) => {
        this.setState({submit:false})
        if(response !== null){
            this.setState({message: "Organização atulizada com sucesso"})
        }else{
            this.setState({message: "Ocorreu um erro ao atualizar a organização"})
        }
    }

    responseAddOrganization = (response) => {
        this.setState({submit:false})
        if (response !== null) {
            history.push("/admin/organizations/" + response.objectid)
        }
    }

    responseAddLoraOrganization = (response) => {
        this.setState({submitLora:false})
        if (!toolsUtils.isNullOrEmpty(response, "organizationID")) {
            this.setState({ id: response.organizationID })
            this.setState({message: "Organização associada com sucesso"})
        }else{
            this.setState({message: "Ocorreu um erro ao associar a organização"})
        }
    }

    responseDelLoraOrganization = (response) => {
        this.setState({submitLora:false})
        if (response !== null) {
            this.setState({ id: null })
            this.setState({message: "Organização desassociada com sucesso"})
        }else{
            this.setState({message: "Ocorreu um erro ao desassociar a organização"})
        }
    }

    back = () => {
        history.push("/admin/organizations/")
    }
    //Store methods
    updateOrganization = () => {
        OrganizationStore.updateOrganization(this.state.organization, this.responseUpdateOrganization);
    }

    addOrganization = () => {
        OrganizationStore.addOrganization(this.state.organization, this.responseAddOrganization);
    }

    addLoraOrganization = () => {
        LoraStore.addLoraOrganization(this.state.organization, this.responseAddLoraOrganization);
    }

    deleteLoraOrganization = () => {
        LoraStore.deleteLoraOrganization(this.state.organization.objectid, this.responseDelLoraOrganization);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={12}>
                <Grid container>

                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            label="Nome"
                            margin="normal"
                            value={this.state.organization.name || ""}
                            onChange={this.onChangeInput("name")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            label="Descrição"
                            margin="normal"
                            value={this.state.organization.description || ""}
                            onChange={this.onChangeInput("description")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="organizationID"
                            label="Organization ID"
                            margin="normal"
                            value={this.state.id || ""}
                            onChange={this.onChangeInput("organizationID")}
                            className={classes.Input}
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
                                        checked={this.state.organization.canHaveGateways}
                                        onChange={this.onChangeSwitch('canHaveGateways')}
                                        value="canHaveGateways"
                                        color="primary"
                                        disabled={this.props.method === "GET"}
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
                                    <Button onClick={this.back} className={classes.Button} color="primary">Voltar</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justifyContent="center">
                                    {this.props.method === "PUT" && <Button disabled={this.state.submitLora} onClick={this.onLoraSubmit} className={classes.Button} color="primary">{toolsUtils.isNullOrEmpty(this.state, "id") || toolsUtils.isEmptyString(this.state.id) ? "Publicar" : "Remover"}</Button>}
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justifyContent="flex-end">
                                    {this.props.method !== "GET" && <Button disabled={this.state.submit} onClick={this.onSubmit} className={classes.Button} color="primary">Salvar</Button>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <PredizaAlertDialog title={this.state.message} open={this.state.message.length>0} close={this.clearMessage} method="alert" />
                </Grid>
            </Grid>
        );
    }

}

export default withStyles(styles)(OrganizationGeneralForm);