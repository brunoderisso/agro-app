import React, { useState, useEffect } from 'react';

import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import UserStore from "../../../stores/UserStore";
import SessionStore from "../../../stores/SessionStore";
import tokens from "../../../stores/CancelTokenList";
import toolsUtils from "../../../utils/toolsUtils";
import PredizaAlertDialog from "../../PredizaAlertDialog";


export default function EnvironmentUserListRow (props) {
    const [flags, setFlags] = useState({ dialogIsOpen: false });

    const tokenList = new tokens();

    useEffect(() => {
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const onClickDelete = () => {
        toggleDialog();
    };

    const responseDeleteUserEnvironment = (response) => {
        tokenList.remove(response.id);
        toggleDialog();
    };

    const toggleDialog = () => {
        const dialog = flags.dialogIsOpen;

        setFlags({...flags, dialogIsOpen: !dialog});
    };

    const deleteUserEnvironments = () => {
        let environment = SessionStore.getEnvironment(SessionStore.getEnvironment());
        let cancelToken = {};

        if(!toolsUtils.isNullOrEmpty(props,"environment.objectid")){
            environment = props.environment
        }

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        UserStore.deleteUserEnvironment(cancelToken, environment.objectid, props.user.value, responseDeleteUserEnvironment);
    };

    return (
        <div>
            <ListItem>
                <Grid container >
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={12}>
                                <ListItemText>{props.user?.label}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <ListItemSecondaryAction>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={12}>
                                    {!props.disabled &&
                                        <IconButton aria-label="Delete" onClick={onClickDelete}>
                                            <DeleteIcon />
                                        </IconButton>}
                                </Grid>
                            </Grid>

                        </ListItemSecondaryAction>
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <PredizaAlertDialog
                title="Você deseja desassociar o usuário?"
                open={flags.dialogIsOpen}
                close={toggleDialog}
                submit={deleteUserEnvironments}
            />
        </div>
    );
}