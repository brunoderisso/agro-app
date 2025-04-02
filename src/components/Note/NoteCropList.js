import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
//Prediza
import ListRow from "../Common/ListRow";
import GroupButton from "../Common/GroupButton";
import PredizaAlertDialog from "../PredizaAlertDialog";

import NoteStore from "../../stores/NoteStore";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";

import style from "../../styles/Note/NoteCropList";
import tokens from "../../stores/CancelTokenList";
import history from "../../history"

export default withStyles(style)(function TresholdList(props) {
    const { classes } = props;
    const [list, setList] = useState([]);
    const [alert, setAlert] = useState("");
    const [message, setMessage] = useState("");
    const [crops, setCrops] = useState(null);

    const tokenList = new tokens();
    const labelColunms = ["cropobjectid"];

    useEffect(() => {
        bind();
        getEnvCrops();
        GetCrops();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getEnvCrops);
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getEnvCrops);
        tokenList.clear();
    };

    const goToEditPage = (id) => {
        history.push("/note/"+SessionStore.getEnvironment() + "/crop/" + id);
    };

    const cropToArray = (crop) => {
        let cols = labelColunms.map((val) => {
            if (val === "cropobjectid") {
                if (!toolsUtils.isNullOrEmpty(crop, "cropname") && !toolsUtils.isNullOrEmpty(crop, "cropvariety") && !toolsUtils.isEmptyString(crop.cropname) && !toolsUtils.isEmptyString(crop.cropvariety)) {
                    return (crop.cropname + " " + crop.cropvariety).toUpperCase();
                }

                if (!toolsUtils.isNullOrEmpty(crop, "cropname")  && !toolsUtils.isEmptyString(crop.cropname)) {
                    return crop.cropname.toUpperCase();
                }

                return "";
            }

            if (toolsUtils.isNullOrEmpty(crop, val)) {
                return "";
            };

            return crop[val];

        });

        cols.push(<GroupButton buttons={[
            { value: <CreateIcon className={classes.icon} />, func: () => { goToEditPage(crop.objectid) } },
            { value: <DeleteIcon className={classes.icon} />, func: () => { toggleDialog(crop.objectid) } }

        ]} />);

        return cols;

    };

    const responseGetEnvCrops = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    const responseDeleteEnvCrop = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            let lst = list.filter((val) => {
                return val.objectid !== response.data
            });
            setMessage("Cultivo deletado com sucesso");
            setList(lst);
            return
        };
        setMessage("Ocorreu um erro ao deletar o cultivo");
    };

    const toggleDialog = (id) => {
        let flag = alert;
        if (flag.length > 0) {
            setAlert("");
            return
        }
        setAlert(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    //Store
    const getEnvCrops = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getEnvCrops(cancelToken, responseGetEnvCrops);
    };

    const deleteEnvCrop = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.deleteNoteCrop(id, cancelToken, responseDeleteEnvCrop);
    };

    const responseGetCrops = (resp) => {
        tokenList.remove(resp.id);
        if (resp.data !== null) {
            const crops = resp.data.map((val) => { return { label: val.name + " " + val.variety, value: val.objectid } })
            setCrops(crops);
        }
    }
    const GetCrops = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getCrops(cancelToken, responseGetCrops);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <List>
                    <Grid container className={classes.header}>
                        <Grid item xs={12}>
                            <ListRow key={"header"} header={true} edit={true} values={["Cultivo", ""]} />
                        </Grid>
                    </Grid>
                    {crops !== null && list.length > 0 && <Divider className={classes.divider} /> }
                    <Grid container>
                        {crops !== null && list.map((val, id) => {
                            return (<Grid key={id} item xs={12}><ListRow key={id} edit={true} values={cropToArray(val)} /><Divider /></Grid>)
                        })}
                    </Grid>
                </List>
            </Grid>
            <Grid item xs={12}>
            <Grid container justifyContent="flex-start">
                <Grid item xs={12}>
                    <Button color="primary" onClick={()=>{history.push("/note")}}>Voltar</Button>
                </Grid>
            </Grid>
            </Grid>
            <PredizaAlertDialog title="Você deseja deletar o cultivo?" open={alert.length > 0} close={toggleDialog} submit={() => { deleteEnvCrop(alert) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    );
});