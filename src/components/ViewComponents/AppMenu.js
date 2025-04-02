import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AdminIcon from "@material-ui/icons/SettingsApplications";
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import MenuBookIcon from '@material-ui/icons/ImportContacts';
import WavesIcon from '@material-ui/icons/Waves';
import Dashboard from '@material-ui/icons/Dashboard';
import Apps from '@material-ui/icons/Apps';

import Wallpaper from '@material-ui/icons/Wallpaper';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MemoryIcon from "@material-ui/icons/Memory";
// import AccessAlarm from "@material-ui/icons/Notifications";
import Assignment from "@material-ui/icons/Assignment";
import Schedule from '@material-ui/icons/Schedule';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import SessionStore from "../../stores/SessionStore"
import History from "../../history";
import { ReactComponent as InmetIcon } from '../../img/InmetIcon.svg';
import { ReactComponent as BillingIcon } from '../../img/BillingIcon.svg';
import styles from "../../styles/AppMenu";
import { useTranslation } from 'react-i18next';
import PredizaScrollBar from '../Common/PredizaScrollBar';
import useSize from '../../Hook/useSize';


export default withStyles(styles)(function AppMenu(props) {
    const [globaladmin, setGlobalAdmin] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [size] = useSize();

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        let p = SessionStore.getPreference();
        setGlobalAdmin(p.globaladmin);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleProfileMenuOpen = (event) => {
        setAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchor(null);
    };

    const onClickItem = (value) => {
        if (value === "note") {
            History.push("/" + value + "/" + SessionStore.getEnvironment() + "/disorder");
        } else if (value === "inmet") {
            History.push("/" + value + "/dashboard")
        } else if (value === "report") {
            History.push("/" + value + "/" + SessionStore.getEnvironment());
        } else {
            History.push("/" + value)
        }
    };

    return (
        <div>
            <IconButton
                aria-label="More"
                aria-owns={Boolean(anchor) ? 'long-menu' : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}

            >
                <Apps className={classes.WidgetIcon} />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={handleMenuClose}
                className={classes.menu}
            >
                <Grid container className={classes.paper}>
                    <PredizaScrollBar customHeight={size === "xs" ? "60vh" : "42vh"}>
                        <Grid container>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"dashboard"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("dashboard")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <Dashboard className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.dashboard')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"gallery"} onClick={() => onClickItem("gallery")} className={classes.LineItem}>
                                    <IconButton className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <Wallpaper className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="button" className={classes.label}>{t('menu.gallery')}</Typography>
                                            </Grid>
                                        </Grid>


                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"dashboard"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("device")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <MemoryIcon className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.devices')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            {/* <Grid item xs={12} md={6} >
                                <MenuItem key={"alert"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("alert")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <AccessAlarm className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.alert')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid> */}
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"chillhour"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("chillhour")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <Schedule className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.chillHours')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"weather"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("forecast")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <WbSunnyIcon className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.forecast')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"inmet"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("inmet")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <InmetIcon className={classes.ItemIconExternal} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.inmet')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"report"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("report")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <PictureAsPdfIcon className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.report')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"evapo"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("evapo")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12} className={classes.rotate}>
                                                <WavesIcon className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.evapo')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"notebook"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("note")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <MenuBookIcon className={classes.ItemIcon} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.notebook')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MenuItem key={"notebook"} className={classes.LineItem}>
                                    <IconButton onClick={() => onClickItem("management/plan")} className={classes.iconButton}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12}>
                                                <BillingIcon style={{ marginBottom: "-15px", position: "relative", bottom: "5px" }} className={classes.ItemIconBilling} />
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant="button" className={classes.label}>{t('menu.billing')}</Typography>
                                            </Grid>
                                        </Grid>
                                    </IconButton>
                                </MenuItem>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {globaladmin && (
                                    <MenuItem key={"admin"} className={classes.LineItem}>
                                        <IconButton onClick={() => onClickItem("admin/environments")} className={classes.iconButton}>
                                            <Grid container alignItems="center" justifyContent="center">
                                                <Grid item xs={12}>
                                                    <AdminIcon className={classes.ItemIcon} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="button" className={classes.label}>{t('menu.admin')}</Typography>
                                                </Grid>
                                            </Grid>
                                        </IconButton>
                                    </MenuItem>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {globaladmin && (
                                    <MenuItem key={"article"} className={classes.LineItem}>
                                        <IconButton onClick={() => onClickItem("article")} className={classes.iconButton}>
                                            <Grid container alignItems="center" justifyContent="center">
                                                <Grid item xs={12}>
                                                    <Assignment className={classes.ItemIcon} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="button" className={classes.label}>{t('menu.article')}</Typography>
                                                </Grid>
                                            </Grid>
                                        </IconButton>
                                    </MenuItem>
                                )}
                            </Grid>
                        </Grid>
                    </PredizaScrollBar>
                </Grid>
            </Menu>
        </div>);
})



