import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core"

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import SessionStore from "../../stores/SessionStore";
import AccountStore from "../../stores/AccountStore";
import NoteEdit from "./NoteCropEditPage";
import NoteAdd from "./NoteCropAddPage";
import toolsUtils from "../../utils/toolsUtils";
import NoteOwner from "./NoteOwner";
import NoteTec from "./NoteTechnical";
import NoteList from "./NoteCropList";
import NoteEnv from "./NoteEnvironmentForm";
import PredizaTabs from "../Common/PredizaTabs";
import tokens from "../../stores/CancelTokenList";
import history from "../../history";

const style = {
    tab: {
        left: "64.33px",
        zIndex: 1200
    }
}

export default withStyles(style)(function NoteEditPage(props) {
    const [usr, setUsr] = useState(null);
    const tokenList = new tokens();

    const { classes } = props;

    useEffect(() => {
        bind();
        getUsers();

        return clear;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        SessionStore.removeListener("environment.change", redirect);
        tokenList.clear();
    };

    const bind = () => {
        SessionStore.on("environment.change", redirect);
    }

    const redirect = (val) => {
        if (val !== "preference") {
            history.push("/note/" + SessionStore.getEnvironment())
        }

    }

    const getComponent = () => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <Button color="primary" onClick={() => { history.push("/note/"+props.id+"/crop/new") }}>Novo Cultivo</Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <NoteList/>
                </Grid>
            </Grid>

        )
    }

    const responseGetUsers = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data === null) {
            return
        };

        setUsr(resp.data)

    };

    const getOwners = () => {
        return usr.filter((user) => { return user.isowner });
    }

    const getResponsibles = () => {
        return usr.filter((user) => { return user.istechnical })
    }

    const getUsers = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        AccountStore.getEnvironmentUsers_WT(cancelToken, responseGetUsers);
    };

    const changeTab = (tab) => {
        if (tab === 0) {
            history.push("/note/" + props.id + "/environment")
        }

        if (tab === 1) {
            history.push("/note/" + props.id + "/owner")
        }

        if (tab === 2) {
            history.push("/note/" + props.id + "/responsible")
        }

        if (tab === 3 && !toolsUtils.isNullOrEmpty(props,"crop")) {
            history.push("/note/" + props.id + "/crop/" + props.crop)
        }

        if (tab === 3 && toolsUtils.isNullOrEmpty(props,"crop") && !props.new) {
            history.push("/note/" + props.id + "/crop")
        }
    }
    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs className={classes.tab} disabled={true} data={[{ label: "Caderno", component: <Grid /> }]} />
            </Grid>
            <Grid item xs={12}>
                {props.tab === 0 && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente", component: <NoteEnv /> }, { label: "Donos" }, { label: "Responsáveis" }, { label: "Cultivo" }]} />}
                {props.tab === 1 && usr !== null && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente" }, { label: "Donos", component: <NoteOwner user={usr} owner={getOwners()} /> }, { label: "Responsáveis" }, { label: "Cultivo" }]} />}
                {props.tab === 2 && usr !== null && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente" }, { label: "Donos" }, { label: "Responsáveis", component: <NoteTec user={usr} technical={getResponsibles} /> }, { label: "Cultivo" }]} />}
                {props.tab === 3 &&  toolsUtils.isNullOrEmpty(props,"crop") && !props.new && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente" }, { label: "Donos" }, { label: "Responsáveis" }, { label: "Cultivo", component: getComponent()}]} />}
                {props.tab === 3 &&  toolsUtils.isNullOrEmpty(props,"crop") && props.new && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente" }, { label: "Donos" }, { label: "Responsáveis" }, { label: "Cultivo", component: <NoteAdd id={props.id}/>}]} />}
                {props.tab === 3 &&  !toolsUtils.isNullOrEmpty(props,"crop") && <PredizaTabs onChange={changeTab} tab={props.tab || 0} className={classes.tab} data={[{ label: "Ambiente" }, { label: "Donos" }, { label: "Responsáveis" }, { label: "Cultivo", component: <NoteEdit id={props.crop} env={props.id}/>}]} />}
            </Grid>
        </Grid>
    );

})