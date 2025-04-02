import React, { useState } from 'react';

import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import EnvironmentStore from "../../../stores/EnvironmentStore";
import PredizaAlertDialog from "../../PredizaAlertDialog";


export default function EnvironmentDeviceListRow(props){
    const [flags, setFlags] = useState({ dialogIsOpen: false });

    const onClickDelete = () => {
        toggleDialog();
    }

    const toggleDialog = () => {
        let dialog = flags.dialogIsOpen;
        setFlags({...flags, dialogIsOpen: !dialog});
    };

    const deleteDeviceEnvironments = () => {
        EnvironmentStore.desassociateDevice(props.environment.objectid, props.device.deveui);
    };

    return (
        <div>
            <ListItem>
                <Grid container >
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText>{props.device.name || props.device.deveui}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <ListItemSecondaryAction>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={12}>
                                    {!props.disabled ?
                                        <IconButton aria-label="Delete" onClick={onClickDelete}>
                                            <DeleteIcon />
                                        </IconButton> : ""}
                                </Grid>
                            </Grid>
                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <PredizaAlertDialog
                title="Você deseja desassociar o dispositivo?"
                open={flags.dialogIsOpen}
                close={toggleDialog}
                submit={deleteDeviceEnvironments}
            />
        </div>
    );
}
