import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import Button from "@material-ui/core/Button"

//Prediza 
import EnvironmentStore from "../stores/EnvironmentStore";

const styles = () => ({

});

class AssociateEnvironmentUser extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            environmentDevice :{
                selected:""
            }
        };
    }

    //Component default methods

    //Event methods
    onChangeSelect = (value) => {
        this.changeState("environmentDevice", "selected", value)
    };

    onClickSubmit = () =>{
       
        this.setUserEnvironments();
    }
    //Component methods

    changeState = (object, propriety, value) => {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseSetDeviceEnvironment = () =>{
        this.changeState("environmentDevice", "selected", "")
    }

    //Store methods
    
    setUserEnvironments = () => {
        EnvironmentStore.associateDevice(this.props.environment.objectid, this.state.environmentDevice.selected.value, this.responseSetDeviceEnvironment);
    };

    render() {
        return (
            <Grid container>
                <Grid item xs={8}>
                    <Select 
                        options={this.props.options} 
                        value={this.state.environmentDevice.selected}
                        onChange = {this.onChangeSelect}/>
                </Grid>
                <Grid item xs={4}>
                    <Grid container justifyContent="flex-end">
                    <Button onClick={this.onClickSubmit}>Adicionar</Button>
                    </Grid>
                </Grid>
            </Grid>);
    }

}

export default withStyles(styles)(AssociateEnvironmentUser);