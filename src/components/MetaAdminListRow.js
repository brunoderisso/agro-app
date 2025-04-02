import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import DeleteIcon from "@material-ui/icons/Delete"
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import Divider from "@material-ui/core/Divider";

//Prediza 
import MetaAdminModal from "../components/MetaAdminModal";
import MetaStore from "../stores/MetaStore";
import PredizaAlertDialog from "../components/PredizaAlertDialog";

//Others

const styles = {

};

class MetaAdminListRow extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                modalIsOpen: false,
                isDeleted: false,
                dialogIsOpen: false,
            },
            row: {
                method: ""
            }
        };

        this.changeState = this.changeState.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.deleteMeta = this.deleteMeta.bind(this);
        this.responseDeleteMeta = this.responseDeleteMeta.bind(this);
        this.onClickView = this.onClickView.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickChange = this.onClickChange.bind(this);

    };

    //Component default methods

    //Event methods
    onClickDelete() {
        this.toggleDialog();
    };

    onClickView() {
        this.changeState("row", "method", "GET");
        this.toggleModal("modalIsOpen");
    };

    onClickChange() {
        this.changeState("row", "method", "PUT");
        this.toggleModal("modalIsOpen");
    };


    //Component methods
    toggleModal = (modalname) => {

        let modal = this.state.flags[modalname];
        this.changeState("flags", modalname, !modal);
    };

    toggleDialog = () => {

        let dialog = this.state.flags.dialogIsOpen;
        this.changeState("flags", "dialogIsOpen", !dialog);
    };

    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseDeleteMeta(response) {
        if ("deleted") {
            this.changeState("flags", "isDeleted", true);
        };
    };

    //Store methods
    deleteMeta() {
        MetaStore.deleteMetaPreference(this.props.meta.objectid, this.responseDeleteMeta);
    }

    render() {
        //
        return (
            <div>
                <ListItem>
                    <Grid container >
                        <Grid item xs={9}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <ListItemText>{this.props.meta.measure}</ListItemText>
                                </Grid>
                                <Grid item xs={3}>
                                    <ListItemText>{this.props.meta.title}</ListItemText>
                                </Grid>
                                <Grid item xs={2}>
                                    <ListItemText>{this.props.meta.xlegend}</ListItemText>
                                </Grid>
                                <Grid item xs={2}>
                                    <ListItemText>{this.props.meta.ylegend}</ListItemText>
                                </Grid>
                                <Grid item xs={1}>
                                    <ListItemText>{this.props.meta.blur}</ListItemText>
                                </Grid>
                                <Grid item xs={1}>
                                    <ListItemText>{this.props.meta.radius}</ListItemText>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <ListItemSecondaryAction>
                                <Grid container justifyContent="flex-end">
                                    <Grid item xs={3}>
                                        <IconButton aria-label="Visualizar" onClick={this.onClickView}>
                                            <EyeIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <IconButton aria-label="Alterar" onClick={this.onClickChange}>
                                            <CreateIcon />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <IconButton aria-label="Delete" onClick={this.onClickDelete}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </ListItemSecondaryAction>
                        </Grid>
                    </Grid>
                </ListItem>
                <Divider />
                <MetaAdminModal meta={this.props.meta} open={this.state.flags.modalIsOpen} close={() => { this.toggleModal("modalIsOpen") }} method={this.state.row.method} />
                <PredizaAlertDialog title="Você deseja deletar o meta?" open={this.state.flags.dialogIsOpen} close={this.toggleDialog} submit={this.deleteMeta} />
            </div>
        );
    }

}

export default withStyles(styles)(MetaAdminListRow);