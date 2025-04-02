import React, { useState, useEffect } from 'react';
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import PoligonList from "./PoligonList"
import PoligonStore from "../../stores/PoligonStore"
import SessionStore from "../../stores/SessionStore"
import toolsUtils from "../../utils/toolsUtils"
import styles from "../../styles/Poligon/PoligonDrawer"


export default withStyles(styles)(function PoligonDrawer(props) {
    const [component, setComponent] = useState("list");

    const { classes } = props;

    useEffect(() => {
        bind();
        setComponent("list");

        if (props.scroll === true) {
            let interval = setInterval(() => {
                let e = document.getElementById("externScroll");
                if (e !== undefined) {
                    e.scrollTop = 9999;
                    clearInterval(interval);
                    PoligonStore.emit("createEnvPoligon");
                }
            }, 1000);
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        PoligonStore.addListener("edit_polygon", () => {
            setComponent("edit");
        })
        PoligonStore.addListener("delete_poligon", () => {
            setComponent("list");
            props.onClose();
        })
        PoligonStore.addListener("sucess_polygon", () => {
            props.onClose();
        })
        SessionStore.addListener("environment.change", () => {
            setComponent("list");
        })
    }

    const clear = () => {
        PoligonStore.removeListener("edit_polygon", () => {
            setComponent("edit");
        })
        PoligonStore.removeListener("delete_poligon", () => {
            setComponent("list");
            props.onClose();
        })
        PoligonStore.removeListener("sucess_polygon", () => {
            props.onClose();
        })
        SessionStore.removeListener("environment.change", () => {
            setComponent("list");
        })
    }

    const onClickBack = () => {
        setComponent("list");
    }

    const onClose = (flag) => {
        if (component === "list") {
            return
        }
        if (component === "edit" && !flag) {
            return
        }

        onClickBack();
    }

    const clickAway = (e) => {
        //Se esse drawer não está aberto
        if (!SessionStore.verticalBar[props.name]) {
            return
        }

        //Quando outro drawer for aberto
        if ((!toolsUtils.isNullOrEmpty(e.target, "dataset.drawer") && !toolsUtils.isEmptyString(e.target.dataset.drawer)) ||
            (typeof e === "object" && !toolsUtils.isNullOrEmpty(e.target, "parentElement.dataset.drawer") && !toolsUtils.isEmptyString(e.target.parentElement.dataset.drawer))) {
            return
        }

        onClose();
    }

    const editComponent = () => {
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={9}>
                        <Grid container justifyContent="center">
                            {PoligonStore.poligons[0].name.toUpperCase()}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={deletePoligon}>
                                <DeleteIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const deletePoligon = () => {
        PoligonStore.delPoligon(PoligonStore.poligons[0].objectid);
        onClose(true);
    }

    return (
        <ClickAwayListener onClickAway={clickAway}>
            <Grid container>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    classes={{
                        paper: classNames(classes.drawerPaper, classes.drawerWidth),
                    }}
                    anchor="left"
                    open={props.open}
                    ModalProps={{ onBackdropClick: props.onClose }}
                >
                    <Grid id="externScroll" style={{ overflow: 'auto' }}>
                        <div className={classes.toolbar} />
                        <Grid container style={{ backgroundColor: "#f1f1f1" }}>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" className={classes.title}>
                                    {component === "add" && "Adicionar"}
                                    {component === "list" && "Polígonos"}
                                    {component === "edit" && editComponent()}
                                </Grid>
                            </Grid>
                            {component === "list" && (<Grid item xs={12}><PoligonList openL={props.openL} create={props.create} open={props.open} /></Grid>)}
                        </Grid>
                    </Grid>
                </Drawer>
            </Grid>
        </ClickAwayListener>
    );
})