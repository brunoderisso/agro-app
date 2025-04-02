import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DescriptionIcon from '@material-ui/icons/Description';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AppsIcon from '@material-ui/icons/Apps';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Grid } from '@material-ui/core';

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(6) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    openButton: {
        position: "relative",
        top: "65px",
        marginBottom: "50px",
        width: "fit-content",
        alignSelf: "center",
        paddingLeft: "15px"
    },
    closeButton: {
        position: "relative",
        top: "65px",
        marginBottom: "50px",
        width: "fit-content",
        alignSelf: "self-end"
    },
    title: {
        top: "75px",
        left: "20px",
        position: "fixed",
        fontWeight: 500,
        fontSize: "15px"
    }
}));

export default function MiniDrawer() {

    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(!open);
    };


    const clickButton = (id) => {
        alert(id)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >

                {open &&
                    <Grid className={classes.title}>
                        Billing
                    </Grid>
                }

                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.openButton, {
                        [classes.closeButton]: open
                    })}
                >
                    {!open ? <MenuIcon /> : <ChevronLeftIcon />}
                </IconButton>
                <List>
                    <ListItem button onClick={()=>{clickButton("all")}} key={"All"}>
                        <ListItemIcon><AppsIcon /></ListItemIcon>
                        <ListItemText primary={"Geral"} />
                    </ListItem>
                    <ListItem button key={"Plan"}>
                        <ListItemIcon><AssessmentIcon /></ListItemIcon>
                        <ListItemText primary={"Planos"} />
                    </ListItem>
                    <ListItem button key={"Cus"}>
                        <ListItemIcon><PeopleAltIcon /></ListItemIcon>
                        <ListItemText primary={"Customers"} />
                    </ListItem>
                    <ListItem button key={"Ass"}>
                        <ListItemIcon><DescriptionIcon /></ListItemIcon>
                        <ListItemText primary={"Assinaturas"} />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}