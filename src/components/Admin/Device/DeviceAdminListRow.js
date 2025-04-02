import React, { useState } from 'react';

import moment from "moment";

import DeleteIcon from "@material-ui/icons/Delete"
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import Divider from "@material-ui/core/Divider";
import LoopIcon from "@material-ui/icons/Loop";

import DeviceStore from "../../../stores/DeviceStore";
import PredizaAlertDialog from "../../../components/PredizaAlertDialog";
import LoraStore from "../../../stores/LoraStore";
import history from "../../../history";
import { useTranslation } from 'react-i18next';


export default function DeviceAdminListRow(props) {
    const [flags, setFlags] = useState({
        modalIsOpen: false,
        isDeleted: false,
        dialogIsOpen: false
    });

    const { t } = useTranslation();

    const onClickDelete = () => {
        toggleDialog();
    };

    const onClickChange = () => {
        history.push("/admin/devices/"+props.device.deveui);
    };

    const onClickSync = () => {
        updateLoraDevice();
    };

    const toggleDialog = () => {

        let dialog = flags.dialogIsOpen;
        setFlags({
            ...flags,
            dialogIsOpen: !dialog,
        });
    };

    const responseDeleteDevice = (response) => {

        if (response === "deleted") {
            setFlags({
                ...flags,
                isDeleted: true,
            });
        };
    };

    const responseUpdateLoraDevice = (response) => {

    }

    const deleteDevice = () => {
        LoraStore.deleteLoraDevice(props.device.deveui, () => {
            DeviceStore.deleteDevice(props.device.deveui, responseDeleteDevice);
        })
    }

    const updateLoraDevice = () => {
        LoraStore.updateLoraDevice(props.device.deveui, responseUpdateLoraDevice);
    }

    return (
        <div>
            <ListItem>
                <Grid container >
                    <Grid item xs={10}>
                        <Grid container>
                            <Grid item xs={4}>
                                <ListItemText>{props.device.name}</ListItemText>
                            </Grid>
                            <Grid item xs={2}>
                                <ListItemText>{props.device.devaddr}</ListItemText>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemText>{props.device.deveui}</ListItemText>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemText>{moment(new Date(props.device.lastSeenAt)).format("DD/MM/YYYY hh:mm")}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <ListItemSecondaryAction>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={3}>
                                    <IconButton aria-label={t('common.change')} onClick={onClickChange}>
                                        <CreateIcon />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={3}>
                                    <IconButton aria-label={t('common.deleteButton')} onClick={onClickDelete}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={3}>
                                    <IconButton aria-label={t('common.synchronize')} onClick={onClickSync}>
                                        <LoopIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <PredizaAlertDialog title={t('alert.confirmDeviceDeletion')} open={flags.dialogIsOpen} close={toggleDialog} submit={deleteDevice} />
        </div>
    );
}