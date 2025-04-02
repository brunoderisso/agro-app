import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

//Prediza 
import MetaStore from "../stores/MetaStore";
import MetaAdminList from "../components/MetaAdminList";
import MetaAdminModal from "../components/MetaAdminModal";

const styles = {};

class PredizaAdminMeta extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isRecived: false,
                modalIsOpen: false
            },
            admin: { metas: [] }
        };

        this.responseGetMetas = this.responseGetMetas.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.responseAddMeta = this.responseAddMeta.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.changeState = this.changeState.bind(this);
        this.getMetas = this.getMetas.bind(this);
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount(){
        this.open = true
    }
    componentWillMount(){
        MetaStore.on("add_meta",()=>{
            if(!this.open){
                return 
            }
            this.getMetas();
        });
        MetaStore.on("del_meta",()=>{
            if(!this.open){
                return 
            }
            this.getMetas();
        });
        this.getMetas();
    };

    //Event methods
    onClickAdd() {
        this.toggleModal();
    }

    //Component methods
    responseGetMetas(response) {
        this.changeState("admin", "metas", response);
        this.changeState("flags", "isRecived", true);
    };

    responseAddMeta(response) {
        if (response === "inserted") {
        }
    };

    toggleModal = () => {
        let modal = this.state.flags.modalIsOpen;
        this.changeState("flags", "modalIsOpen", !modal);
    };

    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };


    //Store methods
    getMetas() {
        this.changeState("flags", "isRecived", false);
        MetaStore.getMetas(this.responseGetMetas);
    };



    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <Button onClick={this.onClickAdd} color="primary">Adicionar Meta</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {this.state.flags.isRecived ? <MetaAdminList metas={this.state.admin.metas}/>:"" }
                </Grid>
                <MetaAdminModal open={this.state.flags.modalIsOpen} close={this.toggleModal} method="POST"/>
            </Grid>
        );
    }

}

export default withStyles(styles)(PredizaAdminMeta);