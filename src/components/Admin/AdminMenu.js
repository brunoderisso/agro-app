import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import AddLocation from '@material-ui/icons/AddLocation';
import Storage from '@material-ui/icons/Storage';
import People from '@material-ui/icons/People';
import Subtitles from '@material-ui/icons/Subtitles';
import Business from '@material-ui/icons/Business';
import Memory from '@material-ui/icons/Memory';
import MailIcon from '@material-ui/icons/Mail';
import Dataset from "@material-ui/icons/GridOn";
import Drawer from '@material-ui/core/Drawer';

import history from "../../history"
import styles from '../../styles/Admin/AdminMenu'


export default withStyles(styles)(function AdminMenu(props) {
    const { classes } = props;

    const onClick = (value) => {
        props.change(value);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"

        >
            <List className={classes.list}>
                <ListItem
                    button
                    key="users"
                    onClick={() => {onClick("users"); history.push("/admin/users")}}
                    className={props.selected === "users" ? classes.selected : ""}>
                    <ListItemIcon>
                        <People />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                </ListItem>
                <ListItem
                    button
                    key="environments"
                    onClick={() => {onClick("environments"); history.push("/admin/environments")}}
                    className={props.selected === "environments" ? classes.selected : ""}>
                    <ListItemIcon>
                        <AddLocation />
                    </ListItemIcon>
                    <ListItemText primary="Environments" />
                </ListItem>
                <ListItem
                    button
                    key="messages"
                    onClick={() => onClick("messages")}
                    className={props.selected === "messages" ? classes.selected : ""}>
                    <ListItemIcon>
                        <MailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Messages" />
                </ListItem>
                <ListItem
                    button
                    key="metas"
                    onClick={() => onClick("metas")}
                    className={props.selected === "metas" ? classes.selected : ""}
                >
                    <ListItemIcon>
                        <Subtitles />
                    </ListItemIcon>
                    <ListItemText primary="Metas" />
                </ListItem>
                <ListItem
                    button
                    key="dataset"
                    onClick={() => onClick("dataset")}
                    className={props.selected === "dataset" ? classes.selected : ""}>
                    <ListItemIcon>
                        <Dataset />
                    </ListItemIcon>
                    <ListItemText primary="Dataset" />
                </ListItem>
                <ListItem
                    button
                    key="devices"
                    onClick={() => {onClick("devices"); history.push("/admin/devices")}}
                    className={props.selected === "devices" ? classes.selected : ""}>
                    <ListItemIcon>
                        <Memory />
                    </ListItemIcon>
                    <ListItemText primary="Devices" />
                </ListItem>
                <ListItem
                    button
                    key="gateways"
                    onClick={() => {onClick("gateways"); history.push("/admin/gateways")}}
                    className={props.selected === "gateways" ? classes.selected : ""}>
                    <ListItemIcon>
                        <AntennaIcon />
                    </ListItemIcon>
                    <ListItemText primary="Gateways" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem
                    button
                    key="organizations"
                    onClick={() => {onClick("organizations"); history.push("/admin/organizations")}}
                    className={props.selected === "organizations" ? classes.selected : ""}>
                    <ListItemIcon>
                        <Business />
                    </ListItemIcon>
                    <ListItemText primary="Organizations" />
                </ListItem>
                <ListItem
                    button
                    key="network-profile"
                    onClick={() => { onClick("networkprofile"); history.push("/admin/networkserver/") }}
                    className={props.selected === "networkprofile" ? classes.selected : ""}>
                    <ListItemIcon>
                        <Storage />
                    </ListItemIcon>
                    <ListItemText primary="Network Server" />
                </ListItem>
            </List>
        </Drawer>
    );
})
