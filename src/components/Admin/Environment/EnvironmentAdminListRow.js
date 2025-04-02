import React, { useState } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import DeleteIcon from "@material-ui/icons/Delete"
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import CreateIcon from "@material-ui/icons/Create";
import Divider from "@material-ui/core/Divider";

//Prediza 
import history from "../../../history";
import EnvironmentStore from "../../../stores/EnvironmentStore";
import PredizaAlertDialog from "../../PredizaAlertDialog";

const styles = {

};

export default withStyles(styles)(function EnvironmentAdminListRow(props) {

    const [flags, setFlags] = useState({
        modalIsOpen: false,
        isDeleted: false,
        dialogIsOpen: false
    });

    //Event methods
    const onClickDelete = () => {
        toggleDialog();
    };

    const onClickChange = () => {
        history.push("/admin/environments/"+ props.environment.objectid);
    };

   

    const toggleDialog = () => {

        const dialog = flags.dialogIsOpen;
        setFlags({ ...flags, dialogIsOpen: !dialog });
    };

    const responseDeleteEnvironment = (response) => {
        if ("deleted") {
            setFlags({ ...flags, isDeleted: true })
        };
    };

    //Store methods
    const deleteEnvironment = () => {
        EnvironmentStore.deleteEnvironment(props.environment.objectid, responseDeleteEnvironment);
    }

    return (
        <div>
            <ListItem>
                <Grid container >
                    <Grid item xs={9}>
                        <Grid container>
                            <Grid item xs={4}>
                                <ListItemText>{props.environment.objectid}</ListItemText>
                            </Grid>
                            <Grid item xs={3}>
                                <ListItemText>{props.environment.name}</ListItemText>
                            </Grid>
                            <Grid item xs={5}>
                                <ListItemText>{props.environment.description}</ListItemText>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <ListItemSecondaryAction>
                            <Grid container justifyContent="flex-end">
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
            <PredizaAlertDialog title="Você deseja deletar o ambiente?" open={flags.dialogIsOpen} close={toggleDialog} submit={deleteEnvironment} />
        </div>
    );
})

