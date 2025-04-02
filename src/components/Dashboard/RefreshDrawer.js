import React from 'react';
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import RefreshDrawerList from './RefreshDrawerList';
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import styles from '../../styles/Dashboard/RefreshDrawer';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function RefreshDrawer(props) {
    const { classes } = props;

    const { t } = useTranslation();

    const onClose = () => {
        props.onClose();
    };

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
    };

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
                    <div className={classes.toolbar} />
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" className={classes.title}>
                                {t("settings.automaticUpdate")}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center" className={classes.title}>
                                <RefreshDrawerList close={onClose} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Drawer>
            </Grid>
        </ClickAwayListener>
    );
})