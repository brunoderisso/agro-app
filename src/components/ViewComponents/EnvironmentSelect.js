import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Avatar, InputAdornment, TextField, Typography } from "@material-ui/core";

import SessionStore from "../../stores/SessionStore";
import { ReactComponent as SearchLightIcon } from '../../img/AdvancedMapIcons/SearchLightIcon.svg';
import { ReactComponent as ArrowBottomIcon } from '../../img/ArrowBottomIcon.svg';
import { ReactComponent as ShareIcon } from '../../img/ShareIcon.svg';
import EnvironmentButton from "../Common/EnvironmentButton";
import useStyles from "../../styles/Common/EnvironmentSelect";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import toolsUtils from "../../utils/toolsUtils";


function EnvironmentSelect(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState(null);
    const [environments, setEnvironments] = useState([]);
    const [visualization, setVisualization] = useState("");
    const [environment, setEnvironment] = useState(null);
    const [initials, setInitials] = useState("AA");
    const [image, setImage] = useState(null);

    useEffect(() => {
        bind();
        setEnvironments(SessionStore.getEnvironments());

        if (!environment) {
            setEnvironment(SessionStore.getSelectedEnvironment())
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (environment) {
            if (environment.name.length > 1) {
                setInitials(toolsUtils.getInitials(environment.name));
            }

            if (environment.logo) {
                setImage("data:image/png;base64,".concat(environment.logo));
            } else {
                setImage(null);
            }
        }
    }, [environment])

    const bind = () => {
        SessionStore.addListener("environmentName.update", setEnvironment);
    }

    const clear = () => {
        SessionStore.removeListener("environmentName.update", setEnvironment);
    }

    const containsText = (text, searchText) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

    const displayedOptions = useMemo(
        () => environments.filter((c) => containsText(c.name, visualization)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [visualization, environments]
    );

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSelectEnviroment = (env) => {
        setEnvironment(env)
        let envId = env.objectid;

        if (!envId) {
            const preference = localStorage.getItem('preference');
            const envPref = JSON.parse(preference)
            envId = envPref.environment
        }

        const p = { ...SessionStore.getPreference(), environment: envId };
        SessionStore.pushPreference(p, () => { SessionStore.setPreference(p) });
        SessionStore.setEnvironment(envId);
        GoogleMapStore.storeSelectedMenuItem(null);
        SessionStore.emit("environments.update");

        handleClose();
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSharingIcon = (event, environment) => {
        event.stopPropagation();
        handleClose();

        if (typeof props.handleOpenInvite === "function") {
            props.handleOpenInvite(true);
        }

        if (typeof props.handleEnvironment === "function") {
            props.handleEnvironment(environment);
        }
    }

    const handleChange = (e) => {
        setVisualization(e.target.value);
    }

    return (
        <Grid>
            {environment?.name?.length > 0
                ? <IconButton
                    aria-label="More"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-owns={Boolean(anchorEl) ? 'long-menu' : undefined}

                >
                    <Avatar src={image} className={classes.avatar}>
                        {!image && <Typography variant="subtitle2" className={classes.textAvatar}>{initials}</Typography>}
                    </Avatar>

                    <Typography className={classes.envNameTitle} variant="button">
                        {environment.name}
                    </Typography>
                    <Typography className={classes.envNameArrow} variant="button">
                        <ArrowBottomIcon />
                    </Typography>
                </IconButton>
                : <IconButton
                    aria-label="More"
                    aria-haspopup="true"
                    onClick={handleClick}
                    aria-owns={Boolean(anchorEl) ? 'long-menu' : undefined}
                >
                    <Avatar className={classes.avatar}>
                        <Typography variant="subtitle2" className={classes.textAvatar}>S</Typography>
                    </Avatar>

                    <Typography className={classes.envNameTitle} variant="button">
                        {t("common.select")}
                    </Typography>
                    <Typography className={classes.envNameArrow} variant="button">
                        <ArrowBottomIcon />
                    </Typography>
                </IconButton>
            }
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.menuItems}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <TextField
                    size="small"
                    classes={{ root: classes.searchLabel }}
                    onChange={handleChange}
                    placeholder={t("menu.searchProperty")}
                    autoFocus
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="end">
                                <SearchLightIcon className={classes.iconSearch} />
                            </InputAdornment>
                        )
                    }}
                />
                {displayedOptions.map((env) => (
                    <MenuItem
                        key={env.objectid}
                        style={(SessionStore.getEnvironment() === env.objectid && { backgroundColor: "rgba(0,100,255,0.3)" }) || {}}
                        onClick={() => { handleSelectEnviroment(env) }}
                    >
                        <Grid container className={classes.container}>
                            <EnvironmentButton environment={env} />
                            <Grid item className={classes.containerButton}>
                                <IconButton
                                    size="small"
                                    onClick={(event) => handleSharingIcon(event, env)}
                                >
                                    <ShareIcon />
                                </IconButton>
                            </Grid>
                        </Grid>

                    </MenuItem>

                ))}

                {(displayedOptions.length === 0 || displayedOptions === undefined || displayedOptions === null) &&
                    <Grid style={{ padding: "10px" }}>
                        {t("menu.noEnvironment")}
                    </Grid>
                }
            </Menu>
        </Grid>
    );

}

EnvironmentSelect.propTypes = {
    handleOpenInvite: PropTypes.func.isRequired,
    handleEnvironment: PropTypes.func.isRequired,
};

export default EnvironmentSelect;