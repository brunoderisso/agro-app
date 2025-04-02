import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Grid from "@material-ui/core/Grid";
import {
    Box, Drawer, IconButton,/*, InputAdornment, TextField*/
    Typography
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
// import DoneIcon from '@material-ui/icons/Done';

// import { ReactComponent as SearchIcon } from '../../img/AdvancedMapIcons/SearchIcon.svg';
import styles from "../../../styles/GoogleMaps/AdvancedSettings/ServicesDrawer"
import CustomOutlineSelect from '../../Common/CustomOutlineSelect';
import PredizaScrollBar from '../../Common/PredizaScrollBar';
import SettingsTabPanel from './SettingsTabPanel';
import sessionStore from '../../../stores/SessionStore';


export default function ServicesDrawer(props) {
    const classes = styles();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    // const [disableSelect, setDisableSelect] = useState(false);
    const [optionUpdate, setOptionUpdate] = useState(0);

    // const [radiusGateway, setRadiusGateway] = useState(GoogleMapStore.getGatewayRadiusKm());
    // const [flagGatewayRadiusError, setFlagGatewayRadiusError] = useState(false);
    // const [textGatewayRadiusError, setTextGatewayRadiusError] = useState('');
    // const [flagFocused, setFlagFocused] = useState(false);

    // const menuItemsSelect = [
    //     { value: "interpolation", label: "Interpolação" },
    //     { value: "heatmap", label: "Intensidade" },
    // ]

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    // useEffect(() => {
    //     if (open) {
    //         if (['inmet', 'devices'].includes(GoogleMapStore.getSelectedMenuItem())) {
    //             setDisableSelect(false);
    //         } else {
    //             setDisableSelect(true);
    //         }
    //     }
    // }, [open]);

    // useEffect(() => {
    //     if (radiusGateway.length > 0) {
    //         setFlagGatewayRadiusError(false);
    //         setTextGatewayRadiusError('');
    //     }
    //     //eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [radiusGateway]);

    const handleChangeUpdate = (e) => {
        setOptionUpdate(e.target.value);
        sessionStore.setTimeRefresh(e.target.value);
    }

    const refreshService = () => {
        sessionStore.clickTimeRefresh();
    }

    // const handleClickSearch = () => {

    // }

    // const handleChangeRadius = (event) => {
    //     setRadiusGateway(event.target.value)
    // }

    // const handleFocus = () => {
    //     setFlagFocused(true);
    // };

    // const handleBlur = () => {
    //     setFlagFocused(false);
    // };

    // const saveRadiusGateway = () => {
    //     if (radiusGateway.length > 0) {
    //         GoogleMapStore.storeGatewayRadiusKm(+radiusGateway)
    //         GoogleMapStore.emit("gatewaysRadius_refresh")
    //     } else {
    //         setFlagGatewayRadiusError(true)
    //         setTextGatewayRadiusError(t('alert.requiredToFillIn'))
    //     }
    // }

    const getTimeOptions = () => {
        const timeOptions = sessionStore.timeOptions.map(option => {
            return {
                ...option,
                label: option.label
            }
        })

        return timeOptions
    }

    const getBody = () => {
        return (
            <Box role="presentation">
                <PredizaScrollBar customHeight={"calc(100vh - 75px)"}>
                    <Grid container className={classes.container}>
                        <Grid item xs={11}>
                            <Typography variant='subtitle1' className={classes.textColor}>
                                {t('advancedmap.advanced_title')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton size="small" onClick={props.onClose}>
                                <CloseIcon className={classes.iconBtPrimary} />
                            </IconButton>
                        </Grid>

                        <Grid item container style={{ marginTop: "16px" }}>
                            <Grid item xs={10}>
                                <CustomOutlineSelect
                                    value={optionUpdate}
                                    handleValue={handleChangeUpdate}
                                    name={t('settings.automaticUpdate')}
                                    label={t('settings.automaticUpdate')}
                                    menuItems={getTimeOptions()}
                                />
                            </Grid>
                            <Grid item xs={2} alignContent='center'>
                                <IconButton size="small" style={{ left: "18px" }} onClick={refreshService}>
                                    <RefreshIcon className={classes.iconBtSecondary} />
                                </IconButton>
                            </Grid>
                        </Grid>

                        {/* TODO: descomentar quando ativar os gateways */}
                        {/* <Grid item xs={12} style={{ marginTop: "16px" }}>
                            <Grid container spacing={1} alignItems='center'>
                                <Grid item xs={10}>
                                    <TextField
                                        id="gatewaysKm"
                                        name="gatewaysKm"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className={classes.inputs}
                                        value={radiusGateway}
                                        onChange={handleChangeRadius}
                                        label="Raio dos gateways"
                                        variant="outlined"
                                        size='small'
                                        type='number'
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">Km</InputAdornment>
                                            )
                                        }}
                                        error={flagGatewayRadiusError}
                                        helperText={textGatewayRadiusError}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton size="small" onClick={saveRadiusGateway}>
                                        <DoneIcon className={classes.iconBt} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid> */}

                        <Grid item container style={{ marginTop: "16px" }}>
                            <SettingsTabPanel />
                        </Grid>
                    </Grid>
                </PredizaScrollBar>
            </Box>
        )
    }

    return (
        <Grid>
            <Drawer
                anchor={"right"}
                open={open}
                elevation={4}
                className={classes.drawer}
                onClose={props.onClose}
                ref={props.reference}
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant='persistent'
            >
                {getBody()}
            </Drawer>
        </Grid>
    );
}