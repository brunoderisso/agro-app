import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

// Material UI
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

//Prediza
import EnvironmentDrawerList from "./EnvironmentDrawerList"
import toolsUtils from "../../utils/toolsUtils"
import SessionStore from "../../stores/SessionStore"

import drawerStyle from "../../styles/Drawer"
import theme from "../../styles/Utils/theme"

const drawerWidth = 300;


const style = () => ({
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        overflowY: "auto",
        [theme.breakpoints.between('xs', 'sm')]: {
            height: "calc(100% - 50px)",

        },
        [theme.breakpoints.between('sm', 'xl')]: {
            height: "calc(100% - 71px)",

        },
        marginLeft: 50
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    container: {
        minHeight: "100%",
        maxHeight: "100%"
    },
    footer: {
        position: "fixed",
        bottom: 90,
        width: 300,
        marginLeft: 115
    },
    title: {
        marginTop: 10,
        fontSize: 30,
        marginBottom: 10
    },
    newButton: {
        paddingRight: 7
    },
    ...drawerStyle
});

export default withStyles(style)(function EnvironmentDrawer(props) {
    const onClose = () => {
        props.onClose();
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
    //Component methods


    //Store methods

    const { classes } = props;
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
                    ModalProps={{ onBackdropClick: onClose }}
                    id="drawer"
                >
                    <div className={classes.toolbar} />
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" className={classes.title}>
                                Ambientes
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" className={classes.title}>
                                <EnvironmentDrawerList onClose={onClose} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>

            </Grid>
        </ClickAwayListener>
    );

})
