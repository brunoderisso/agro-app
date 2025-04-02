import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import SessionStore from "../../stores/SessionStore";
import toolsUtils from "../../utils/toolsUtils";
import useStyles from "../../styles/ViewComponents/MenuBar"
import PreferenceDrawer from './UserPreference/PreferenceDrawer';
import AppMenu from "./AppMenu";
import EnvironmentSelect from "./EnvironmentSelect";
import history from "../../history";
import { ReactComponent as Logout } from '../../img/LogoutIcon.svg';
import { ReactComponent as SettingsLightIcon } from '../../img/SettingsLightIcon.svg';
import { ReactComponent as AlertIcon } from '../../img/AlertIcon.svg';
import { AnalitycsEvent } from "../../LocalConfig";
import AlertDrawer from "./Alerts/AlertDrawer";

import { getLogoByDomain } from "../../styles/Utils/logos";
import UserInviteDrawer from "./UserInvite/UserInviteDrawer";


function MenuBar() {
    const { t } = useTranslation();
    const classes = useStyles();

    const [preference, setPreference] = useState(null);
    const [anchors, setAnchors] = useState(null);
    const [flags, setFlags] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [environment, setEnvironment] = useState(null);

    const logo = getLogoByDomain();

    useEffect(() => {
        init();
    }, [])

    const init = () => {
        setPreference(SessionStore.getPreference())
        setAnchors({
            anchorEl: null,
            mobileMoreAnchorEl: null
        })
        setFlags({
            showInviteDrawer: false,
            showEnvironmentMenu: false,
            showPreferenceMenu: false,
            showPredizaPreference: false,
        })
    }

    const handleProfileMenuOpen = event => {
        setAnchors({ ...anchors, anchorEl: event.currentTarget });
    };

    const handleMenuClose = () => {
        setAnchors({ ...anchors, anchorEl: null, mobileMoreAnchorEl: null });
    };

    const toggleInviteDrawer = (open) => {
        if (open) {
            AnalitycsEvent('navigation', '/click/menu/invite');
        }

        setFlags({ ...flags, showInviteDrawer: open });
        handleMenuClose();
    };

    const handleLogout = () => {
        AnalitycsEvent('navigation', '/click/menu/exit');

        SessionStore.logout(() => {
            document.cookie.split(";").forEach((cookie) => {
                const [name] = cookie.split("=");
    
                document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;domain=.${window.location.hostname}`;
            });
            history.push("/login");
        });
    };

    const togglePredizaPreference = (open) => () => {
        if (open) {
            AnalitycsEvent('navigation', '/click/menu/preference');
        }

        setFlags({ ...flags, showPredizaPreference: open });
        handleMenuClose();
    };

    const onCloseAlertDrawer = () => {
        setAlertOpen(false);
    }

    const handleOpenAlertDrawer = () => {
        setAlertOpen(true);
    }

    if (preference !== null && anchors !== null && flags !== null) {
        const { anchorEl } = anchors;
        const isMenuOpen = Boolean(anchorEl);

        return (
            <div className={classes.root} style={{ zIndex: "1201" }} id="menu-bar">
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Grid container alignItems="center">
                            <Grid item xs={3} sm={4}>
                                <a href="/app/#/dashboard">
                                    <img alt="Logo Prediza" src={logo} className={classes.logo} />
                                </a>
                            </Grid>
                            <Grid item xs={9} sm={8}>
                                <Grid container justifyContent="flex-end" alignItems="center">
                                    <EnvironmentSelect handleOpenInvite={toggleInviteDrawer} handleEnvironment={setEnvironment} />

                                    <IconButton
                                        onClick={handleOpenAlertDrawer}
                                    >
                                        <AlertIcon />
                                    </IconButton>

                                    <AppMenu />

                                    <IconButton
                                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                        className={classes.avatarButtonColor}
                                    >
                                        {preference?.picture
                                            ? <Avatar className={classes.avatar} src={preference.picture} alt={`${preference.name} ${preference.surname}`} />
                                            : <Avatar className={classes.avatar}>{toolsUtils.getAvatar(preference)}</Avatar>
                                        }
                                    </IconButton>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    className={classes.Menus}
                >
                    <MenuItem onClick={togglePredizaPreference(true)}>
                        <SettingsLightIcon className={classes.icon} />
                        <Typography variant="body2" className={classes.textMenu}>
                            {t('common.preferences')}
                        </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Logout className={classes.icon} />
                        <Typography variant="body2" className={classes.textMenu}>
                            {t('common.signOut')}
                        </Typography>
                    </MenuItem>
                </Menu>
                <PreferenceDrawer open={flags.showPredizaPreference} onClose={togglePredizaPreference(false)} />
                {environment &&
                    <UserInviteDrawer
                        open={flags.showInviteDrawer}
                        onClose={() => toggleInviteDrawer(false)}
                        environment={environment}
                    />
                }
                <AlertDrawer open={alertOpen} onClose={onCloseAlertDrawer} />
            </div>
        );
    }

    return <Grid></Grid>
}

export default MenuBar;