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

import DeviceProfileStore from "../../../stores/DeviceProfileStore"
import toolsUtils from "../../../utils/toolsUtils";

import style from "../../../styles/Admin/Profiles/DeviceProfileList";
import tokens from "../../../stores/CancelTokenList";
import history from "../../../history";


export default withStyles(style)(function DeviceProfileList(props) {
    const { classes } = props;
    const [list, setList] = useState([]);
    const [deviceProfile, setDeviceProfile] = useState("");
    const [message, setMessage] = useState("");

    const tokenList = new tokens();
    const labelColunms = ["name"];

    useEffect(() => {
        getDeviceProfile();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const goToEditPage = (id) => {
        history.push("/admin/organizations/" + props.organization.objectid + "/profile/device/" + id);
    };

    const goToAddPage = () => {
        history.push("/admin/organizations/" + props.organization.objectid + "/profile/device/new");
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

    const responseGetDeviceProfile = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    const responseDeleteDeviceProfile = (response) => {
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
        let flag = deviceProfile;
        if (flag.length > 0) {
            setDeviceProfile("");
            return
        }
        setDeviceProfile(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    //Store
    const getDeviceProfile = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceProfileStore.getDevices(props.organization.objectid, cancelToken, responseGetDeviceProfile);
    };

    const deleteDeviceProfile = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        let dev = {
            organizationObjectID: props.organization.objectid,
            ObjectID: id,
        }
        DeviceProfileStore.deleteDeviceProfile(dev, cancelToken, responseDeleteDeviceProfile);
    };


    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid item xs={12} >
                    <Grid container className={classes.Button} justifyContent="flex-end" >
                        <Button onClick={goToAddPage} color="primary">Adicionar Perfil</Button>
                    </Grid>
                </Grid>
                <List>
                    <Grid container className={classes.header}>
                        <Grid item xs={12}>
                            <ListRow key={"header"} header={true} edit={true} values={["Dispositivos", ""]} />
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
            <PredizaAlertDialog title="Você deseja deletar este perfil?" open={deviceProfile.length > 0} close={toggleDialog} submit={() => { deleteDeviceProfile(deviceProfile) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    );
});