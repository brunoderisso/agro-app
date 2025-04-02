import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";

import AdminMenu from "./AdminMenu";
import PredizaAdminEnvironment from "./Environment/EnvironmentAdmin";
import PredizaAdminDevice from './Device/DeviceAdmin';
import PredizaAdminGateway from './Gateway/PredizaAdminGateway';
import PredizaAdminMeta from '../PredizaAdminMeta';
import PredizaAdminDataset from '../PredizaAdminDataset';
import history from '../../history';


const styles = {};

class PredizaAdmin extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            components: {
                itemSelected: "environments",
            }
        };

        this.changeSelected = this.changeSelected.bind(this);
        this.changeState = this.changeState.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
    }

    changeSelected(value) {
        if (value === "organizations") {
            history.push("/admin/organizations")
            return
        }
        if (value === "networkprofile") {
            history.push("/admin/networkserver")
            return
        }
        if (value === "users") {
            history.push("/admin/users")
            return
        }
        if (value === "gateways") {
            history.push("/admin/gateways")
            return
        }

        this.changeState("components", "itemSelected", value);
    };

    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    renderComponent() {
        switch (this.state.components.itemSelected) {
            case "environments":
                return (<PredizaAdminEnvironment />)
            case "devices":
                return (<PredizaAdminDevice />);
            case "gateways":
                return (<PredizaAdminGateway />);
            case "metas":
                return (<PredizaAdminMeta />);
            case "dataset":
                return (<PredizaAdminDataset />)
            default:
                return (<PredizaAdminEnvironment />)
        }
    }

    render() {
        return (
            <Grid container>
                <AdminMenu change={this.changeSelected} selected={this.state.components.itemSelected} />
                <Grid item xs={12}>
                    {this.renderComponent()}
                </Grid>
            </Grid>);
    }

}

export default withStyles(styles)(PredizaAdmin);