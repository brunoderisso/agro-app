import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Modal from '@material-ui/core/Modal';

import styles from "../../styles/Evapo/Evapo";
import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils"
import EnvironmentStore from "../../stores/EnvironmentStore";
import PoligonStore from "../../stores/PoligonStore";
import FieldList from "./FieldList";
import tokens from "../../stores/CancelTokenList";
import PoligonForm from "../Common/GoogleMaps/PoligonForm";

export default withStyles(styles)(function Evapo(props) {
    const [list, setList] = useState([]);
    const [objectId, setObjectId] = useState(null);
    const [environmentList, setEnvironmentList] = useState({});
    const [environment, setEnvironment] = useState({});
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getEnvironments();
        getEvapo()
        EnvironmentStore.getAccountEnvironment(SessionStore.getEnvironment(), getEnvironment);
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", () => {
            environmentUpdate();
        });
    }

    const environmentUpdate = () => {
        EnvironmentStore.getAccountEnvironment(SessionStore.getEnvironment(), getEnvironment);
        getEvapo();
    }

    const getEnvironment = (data) => {
        setEnvironment({});
        setEnvironment(data);
    }

    const getEnvironments = () => {
        setEnvironmentList(SessionStore.getEnvironments());
    };

    const clear = () => {
        tokenList.clear();
    }

    const handleClick = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    const onEnvClick = (env) => {
        const p = { ...SessionStore.getPreference(), environment: env.objectid };
        SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
        SessionStore.setEnvironment(env.objectid)
        handleClose();
    }

    const menu = () => {
        return (
            <div>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <KeyboardArrowDownIcon />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={Boolean(anchor)}
                    onClose={handleClose}
                >
                    {
                        environmentList.map((env) => {
                            return (
                                <MenuItem key={env.objectid} onClick={() => onEnvClick(env)}>{env.name.toUpperCase()}</MenuItem>
                            );
                        })
                    }
                </Menu>
            </div>
        );
    }

    const modalClose = () => {
        setOpen(false);
    }

    const modalOpen = () => {
        setOpen(true);
    }

    const createPolygon = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const pol = { name: "Novo Poligono" };
        PoligonStore.addPolygon(cancelToken, pol, responseAddPoligon);
    }

    const responseAddPoligon = (data) => {
        setObjectId(data.data.objectid);
    }

    const getModalBody = () => {
        return (
            <div className={classes.modalBody}>
                <PoligonForm env={environment} objectId={objectId} />
            </div>
        )
    }

    const getModal = () => {
        return (
            <Modal
                open={open}
                onClose={modalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {getModalBody()}
            </Modal>
        )
    }

    const getEvapo = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        PoligonStore.getPolygons(cancelToken, responseEvapo)
    }

    const responseEvapo = (data) => {
        tokenList.remove(data.id);
        setList([]);
        setList(data.data);
    }

    const { classes } = props
    return (

        <Grid container className={classes.containerExterno} >
            <Grid item xs={12} sm={3}>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container className={classes.paper}>
                            {!toolsUtils.isNullOrEmpty(environment, "name") && environmentList.length > 0 &&
                                <Grid container>
                                    <Grid item xs={9} className={classes.environmentName}>
                                        {environment.name.toUpperCase()}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {menu()}
                                    </Grid>
                                </Grid>
                            }
                            <Grid item xs={12} className={classes.talhoesContainer}>
                                <FieldList add polygons={list} open={modalOpen} create={createPolygon} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {getModal()}
            </Grid>
        </Grid>
    )
})