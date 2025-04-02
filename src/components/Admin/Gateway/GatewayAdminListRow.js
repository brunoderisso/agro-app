import React, { useState, useEffect } from 'react';
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
import GatewayAdminModal from "./GatewayAdminModal";
import GatewayStore from "../../../stores/GatewayStore";
import PredizaAlertDialog from "../../PredizaAlertDialog";
import history from '../../../history';

//Others

const styles = {

};
export default withStyles(styles)(function GatewayAdminListRow(props) {

    const [flags, setFlags] = useState({});
    const [method, setMethod] = useState("");

    useEffect(() => {
        setFlags(
            {
                modalIsOpen: false,
                isDeleted: false,
                dialogIsOpen: false
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.open) {
            setMethod("PUT");
            toggleModal("modalIsOpen");
        } else {
            setFlags({
                ...flags,
                modalIsOpen: false
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    //Event methods
    const onClickDelete = () => {
        toggleDialog();
    };

    const onClickView = () => {
        setMethod("GET");
        toggleModal("modalIsOpen");
    };

    const onClickChange = () => {
        history.push("/admin/gateway/" + props.gateway.mac);
    };

    const onClickClose = () => {
        history.push("/admin/gateways");
    }


    //Component methods
    const toggleModal = (modalname) => {
        let modal = flags[modalname];
        setFlags((prev) => ({
            ...prev,
            [modalname]: !modal
        }))
    };

    const toggleDialog = () => {
        setFlags({
            ...flags,
            dialogIsOpen: !flags.dialogIsOpen
        })
    };

    const responseDeleteGateway = (response) => {
        if (response === "deleted") {
            setFlags({ ...flags, isDeleted: true })
            toggleDialog();
        };
    };

    //Store methods
    const deleteGateway = () => {
        GatewayStore.deleteGateway(props.gateway.mac, responseDeleteGateway);
    }


    //
    return (
        <div>
            <ListItem>
                <Grid container >
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={4}>
                                <ListItemText>{props.gateway.name}</ListItemText>
                            </Grid>
                            <Grid item xs={4}>
                                <ListItemText>{props.gateway.mac}</ListItemText>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemText>{props.gateway.enable ? "Ativo" : "Inativo"}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <ListItemSecondaryAction>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={4}>
                                    <IconButton aria-label="Visualizar" onClick={onClickView}>
                                        <EyeIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <IconButton aria-label="Alterar" onClick={onClickChange}>
                                        <CreateIcon />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={4}>
                                    <IconButton aria-label="Delete" onClick={onClickDelete}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <GatewayAdminModal gateway={props.gateway} open={flags.modalIsOpen} close={onClickClose} method={method} />
            <PredizaAlertDialog title="Você deseja deletar o gateway?" open={flags.dialogIsOpen} close={toggleDialog} submit={deleteGateway} />
        </div>
    );

})

