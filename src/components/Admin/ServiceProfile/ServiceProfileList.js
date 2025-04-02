import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";

import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

//Prediza
import ListRow from "../../Common/ListRow";
import GroupButton from "../../Common/GroupButton";
import PredizaAlertDialog from "../../PredizaAlertDialog";

import ServiceProfileStore from "../../../stores/ServiceProfileStore"
import toolsUtils from "../../../utils/toolsUtils";

import style from "../../../styles/Admin/Profiles/ServiceProfileList";
import tokens from "../../../stores/CancelTokenList";
import history from "../../../history";


export default withStyles(style)(function ServiceProfileList(props) {

    const { classes } = props;
    const [list, setList] = useState([]);
    const [serviceProfile, setServiceProfile] = useState("");
    const [message, setMessage] = useState("");

    const tokenList = new tokens();
    const labelColunms = ["name"];

    useEffect(() => {
        getServiceProfile();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const goToEditPage = (id) => {
        history.push("/admin/organizations/" + props.organization.objectid + "/profile/service/" + id);
    };

    const goToAddPage = () => {
        history.push("/admin/organizations/" + props.organization.objectid + "/profile/service/new");
    };

    const profilesToArray = (profile) => {

        let cols = labelColunms.map((val) => {

            if (toolsUtils.isNullOrEmpty(profile, val)) {
                return "";
            };

            return profile[val];

        });

        cols.push(<GroupButton buttons={[
            { value: <CreateIcon className={classes.icon} />, func: () => { goToEditPage(profile.ObjectID) } },
            { value: <DeleteIcon className={classes.icon} />, func: () => { toggleDialog(profile.ObjectID) } }

        ]} />);

        return cols;

    };

    const responseGetServiceProfile = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    const responseDeleteServiceProfile = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            let lst = list.filter((val) => {
                return val.ObjectID !== response.data.ObjectID
            });
            setMessage("Perfil deletado com sucesso");
            setList(lst);
            return
        };
        setMessage("Ocorreu um erro ao deletar o Perfil");
    };

    const toggleDialog = (id) => {
        let flag = serviceProfile;
        if (flag.length > 0) {
            setServiceProfile("");
            return
        }
        setServiceProfile(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    //Store
    const getServiceProfile = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ServiceProfileStore.getServices(props.organization.objectid, cancelToken, responseGetServiceProfile);
    };

    const deleteDeviceProfile = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        let dev = {
            organizationObjectID: props.organization.objectid,
            ObjectID: id,
        }
        ServiceProfileStore.deleteDeviceProfile(dev, cancelToken, responseDeleteServiceProfile);
    };


    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid item xs={12} >
                    <Grid container justifyContent="flex-end" >
                        <Button onClick={goToAddPage} color="primary">Adicionar Perfil</Button>
                    </Grid>
                </Grid>
                <List>
                    <Grid container className={classes.header}>
                        <Grid item xs={12}>
                            <ListRow key={"header"} header={true} edit={true} values={["Serviços", ""]} />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.space}></Grid>
                    <Divider className={classes.divider} />
                    <Grid container>
                        {list.map((val, id) => {
                            return (<Grid key={id} item xs={12}><ListRow key={id} edit={true} values={profilesToArray(val)} /><Divider /></Grid>)
                        })}
                    </Grid>
                </List>
            </Grid>
            <PredizaAlertDialog title="Você deseja deletar este perfil?" open={serviceProfile.length > 0} close={toggleDialog} submit={() => { deleteDeviceProfile(serviceProfile) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    );
});