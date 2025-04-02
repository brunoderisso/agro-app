import Drawer from '@material-ui/core/Drawer';
import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import FilterPicker from "./FilterPicker"
import theme from '../styles/Utils/theme';
import Grid from "@material-ui/core/Grid";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import toolsUtils from "../utils/toolsUtils"
import SessionStore from "../stores/SessionStore"
import classNames from "classnames";
import drawerStyle from "../styles/Drawer"

const drawerWidth = 300;
const styles = {

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
    ...drawerStyle
};
class PredizaFilter extends Component {
    constructor(props) {
        super(props);

        this.props = props

    }

    clickAway = (e) => {
        //Se esse drawer não está aberto
        if (!SessionStore.verticalBar[this.props.name]) {
            return
        }

        //Quando outro drawer for aberto
        if ((!toolsUtils.isNullOrEmpty(e.target, "dataset.drawer") && !toolsUtils.isEmptyString(e.target.dataset.drawer)) ||
            (typeof e === "object" && !toolsUtils.isNullOrEmpty(e.target, "parentElement.dataset.drawer") && !toolsUtils.isEmptyString(e.target.parentElement.dataset.drawer))) {
            return
        }

        this.props.onClose()
    }


    render() {
        const { classes } = this.props;
        return (
            <ClickAwayListener onClickAway={this.clickAway}>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    classes={{
                        paper: classNames(classes.drawerPaper, classes.drawerWidth),
                    }}
                    anchor="left"
                    open={this.props.open}
                    ModalProps={{ onBackdropClick: this.props.onClose }}>
                    <Grid container className={classes.Drawer}>
                        <FilterPicker onClose={this.props.onClose} />
                    </Grid>
                </Drawer>
            </ClickAwayListener>
        );
    }
}

export default withStyles(styles)(PredizaFilter);