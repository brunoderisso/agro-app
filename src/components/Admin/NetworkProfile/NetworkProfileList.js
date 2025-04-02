import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

//Prediza
import ListRow from "../../Common/ListRow";
import GroupButton from "../../Common/GroupButton";
import PredizaAlertDialog from "../../PredizaAlertDialog";

import NetworServerStore from "../../../stores/NetworProfileStore";
import toolsUtils from "../../../utils/toolsUtils";

import style from "../../../styles/Admin/NetworkServer/NetworkServerList";
import tokens from "../../../stores/CancelTokenList";
import history from "../../../history";


export default withStyles(style)(function TresholdList(props) {
    const { classes } = props;
    const [list, setList] = useState([]);
    const [network, setNetwork] = useState("");
    const [message, setMessage] = useState("");

    const tokenList = new tokens();
    const labelColunms = ["name"];
    useEffect(() => {
        getTresholds();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const goToEditPage = (id) => {
        history.push("/admin/networkserver/" + id);
    };

    const tresholdToArray = (network) => {
        let cols = labelColunms.map((val) => {

            if (toolsUtils.isNullOrEmpty(network, val)) {
                return "";
            };

            return network[val];

        });

        cols.push(<GroupButton buttons={[
            { value: <CreateIcon className={classes.icon} />, func: () => { goToEditPage(network.ObjectID) } },
            { value: <DeleteIcon className={classes.icon} />, func: () => { toggleDialog(network.ObjectID) } }

        ]} />);

        return cols;

    };

    const responseGetNetorkServers = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    const responseDeleteNetworkServer = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            let lst = list.filter((val) => {
                return val.ObjectID !== response.data
            });
            setMessage("Servidor deletado com sucesso");
            setList(lst);
            return
        };
        setMessage("Ocorreu um erro ao deletar o servidor");
    };

    const toggleDialog = (id) => {
        let flag = network;
        if (flag.length > 0) {
            setNetwork("");
            return
        }
        setNetwork(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    //Store
    const getTresholds = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworServerStore.getNetworkServers(cancelToken, responseGetNetorkServers);
    };

    const deleteNetworkServer = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NetworServerStore.deleteNetwork(id, cancelToken, responseDeleteNetworkServer);
    };


    return (
        <Grid container>
            <Grid item xs={12}>
                <List>
                    <Grid container className={classes.header}>
                        <Grid item xs={12}>
                            <ListRow key={"header"} header={true} edit={true} values={["Servidor", ""]} />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.space}></Grid>
                    <Divider className={classes.divider}/>
                    <Grid container>
                        {list.map((val, id) => {
                            return (<Grid key={id} item xs={12}><ListRow key={id} edit={true} values={tresholdToArray(val)} /><Divider /></Grid>)
                        })}
                    </Grid>
                </List>
            </Grid>
            <PredizaAlertDialog title="Você deseja deletar o servidor?" open={network.length > 0} close={toggleDialog} submit={() => { deleteNetworkServer(network) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    );
});