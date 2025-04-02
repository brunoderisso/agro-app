import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { Divider, Grid, IconButton, Link, Typography } from '@material-ui/core';

import ServiceExpandPanel from './ServiceExpandPanel';
import GoogleMapStore from '../../../stores/GoogleMapsStore';
import CustomInputText from '../../Common/CustomInputText';
import useStyles from '../../../styles/GoogleMaps/AdvancedSettings/SettingsMenuSection';
import CustomSwitch from '../../Common/CustomSwitch';
import { ReactComponent as AddIcon } from "../../../img/AdvancedMapIcons/AddIcon.svg";
import stringsUtils from '../../../utils/stringsUtils';
import history from '../../../history';
import CustomOutlineSelect from '../../Common/CustomOutlineSelect';
import sessionStore from '../../../stores/SessionStore';
import CustomTooltip from '../../Common/CustomTooltip';


function SettingsMenuSection() {
    const classes = useStyles();
    const { t } = useTranslation();

    const [services, setServices] = useState(null);
    const [flagExpandAll, setFlagExpandAll] = useState(false);
    const [flagRecallAll, setFlagRecallAll] = useState(false);
    // Flag para controlar se coloca tooltip no item do accordión
    const [flagAccordion, setFlagAccordion] = useState(false);
    const [searchFeature, setSearchFeature] = useState('');
    const [togglesState, setTogglesState] = useState({});
    const [functionMeasure, setFunctionMeasure] = useState(sessionStore.getFunction());
    const [functionDescription, setFunctionDescription] = useState('');

    const containsText = (text, searchText) => {
        return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    }

    const displayedServices = useMemo(() => {
        if (!searchFeature) {
            return services;
        }

        const filteredServices = {};

        for (const service in services) {
            const filteredFeatures = services[service].features.filter(feature =>
                containsText(feature.name, searchFeature)
            );

            if (filteredFeatures.length > 0) {
                filteredServices[service] = {};
                filteredServices[service].features = filteredFeatures;
                filteredServices[service].show_map = services[service].show_map;
            }
        }

        return filteredServices;
    }, [services, searchFeature]);

    useEffect(() => {
        bind();
        setServices(GoogleMapStore.getServicesAdvancedMap());

        return clear;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sessionStore.getOptionsFunction().forEach(func => {
            if (func.value === functionMeasure) {
                setFunctionDescription(t(func.description));
            }
        });
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [functionMeasure]);

    useEffect(() => {
        if (services) {
            const newToggleServices = {};

            for (const service in services) {
                if (services.hasOwnProperty(service)) {
                    newToggleServices[service] = {};
                    services[service].features.forEach(feature => {
                        newToggleServices[service] = { ...newToggleServices[service], [feature.name]: feature.enable }
                    });
                }
            }

            setTogglesState(newToggleServices);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [services]);

    const bind = () => {
        GoogleMapStore.addListener("googleMapsServices_store", loadItemsDrawer);
        GoogleMapStore.addListener("advancedPanel_close", resetFlags);
        GoogleMapStore.addListener("accordionPanel_change", setFlagAccordion);
    }

    const clear = () => {
        GoogleMapStore.removeListener("googleMapsServices_store", loadItemsDrawer);
        GoogleMapStore.removeListener("advancedPanel_close", resetFlags);
        GoogleMapStore.removeListener("accordionPanel_change", setFlagAccordion);
    }

    const loadItemsDrawer = () => {
        setServices(GoogleMapStore.getServicesAdvancedMap());
    }

    const resetFlags = () => {
        setFlagExpandAll(false);
        setFlagRecallAll(false);
    }

    const redirectToCart = () => {
        history.push("/subscription/resume");
    }

    const handleChangeToggle = (event, title) => {
        const newToggleState = {
            ...togglesState, [title]: {
                ...togglesState[title],
                [event.target.name]: event.target.checked
            }
        };
        setTogglesState(newToggleState);
        GoogleMapStore.emit("featuresMenu_update", { [event.target.name]: event.target.checked, name: title });
    }

    const getHandleItems = (item, index, title) => {
        const toggle = togglesState[title];

        return (
            <Grid key={index} item xs={12} style={{ padding: '4px 0 4px 12px', zIndex: 1 }}>
                <Grid container>
                    <Grid item xs={1}>
                        <i className={clsx(classes.sprite, classes[`${item.icon}P30`], classes.featureIcon)}></i>
                    </Grid>
                    <Grid container item xs={item.purchased ? 9 : 10} className={classes.containerTxt} id={title + '-' + index}>
                        {flagAccordion &&
                            stringsUtils.isStringWiderThanDiv(
                                stringsUtils.toCapitalize(['inmet', 'coletor'].includes(title)
                                    ? t(`measures.${item.measure}`)
                                    : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                ),
                                title + '-' + index
                            )
                            ? <CustomTooltip title={
                                <React.Fragment>
                                    <Typography variant='caption' className={classes.whiteText}>
                                        {stringsUtils.toCapitalize(['inmet', 'coletor'].includes(title)
                                            ? t(`measures.${item.measure}`)
                                            : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                        )}
                                    </Typography>
                                </React.Fragment>
                            }>
                                <Typography
                                    variant='caption'
                                    className={clsx(classes.itemTitle, {
                                        [classes.commonText]: item.purchased,
                                        [classes.outlineText]: !item.purchased
                                    })}
                                >
                                    {stringsUtils.toCapitalize(['inmet', 'coletor'].includes(title)
                                        ? t(`measures.${item.measure}`)
                                        : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                    )}
                                </Typography>
                            </CustomTooltip>
                            : <Typography
                                variant='caption'
                                className={clsx(classes.itemTitle, {
                                    [classes.commonText]: item.purchased,
                                    [classes.outlineText]: !item.purchased
                                })}
                            >
                                {stringsUtils.toCapitalize(['inmet', 'coletor'].includes(title)
                                    ? t(`measures.${item.measure}`)
                                    : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                )}
                            </Typography>
                        }
                    </Grid>
                    <Grid item xs={item.purchased ? 2 : 1} container justifyContent='flex-end'>
                        {item.purchased && toggle &&
                            <CustomSwitch
                                size='small'
                                checked={toggle[['inmet', 'coletor'].includes(title)
                                    ? t(`measures.${item.measure}`)
                                    : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                ]}
                                name={['inmet', 'coletor'].includes(title)
                                    ? t(`measures.${item.measure}`)
                                    : t(`features.${title}_${item.name.replaceAll(" ", "_")}`)
                                }
                                onChange={(event) => handleChangeToggle(event, title)}
                            />
                        }
                        {!item.purchased &&
                            <IconButton size='small' onClick={redirectToCart}>
                                <AddIcon />
                            </IconButton>
                        }
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const mountItemsSection = () => {
        const panels = [];

        for (const service in displayedServices) {
            if (displayedServices.hasOwnProperty(service) && displayedServices[service].show_map) {
                const panel =
                    <ServiceExpandPanel
                        key={service}
                        title={t(`services.${service}`)}
                        expand={flagExpandAll}
                        recall={flagRecallAll}
                        handleExpand={setFlagExpandAll}
                        handleRecall={setFlagRecallAll}
                    >
                        {displayedServices[service].features.map((item, index) => {
                            return (
                                item.show_map && getHandleItems(item, index, service)
                            )
                        })}
                    </ServiceExpandPanel>

                panels.push(panel);
            }
        }

        return panels;
    }

    const expandAccordions = () => {
        setFlagExpandAll(true);
        setFlagRecallAll(false);
    }

    const recallAccordions = () => {
        setFlagRecallAll(true);
        setFlagExpandAll(false);
    }

    const handleChangeSearch = (text) => {
        setSearchFeature(text);
    }

    const handleChangeFunction = (e) => {
        setFunctionMeasure(e.target.value);
        sessionStore.setFunction(e.target.value);
    }

    return (
        <Grid container>
            <Grid item xs={12} className={classes.wrapperItems}>
                <CustomOutlineSelect
                    value={functionMeasure}
                    handleValue={handleChangeFunction}
                    name={t('common.function')}
                    label={t('common.function')}
                    menuItems={sessionStore.getOptionsFunction()}
                    iconLabel={true}
                    hasTooltip={true}
                    textTooltip={functionDescription}
                />
            </Grid>
            <Grid item className={classes.wrapperItems}>
                <CustomInputText label={t('advancedmap.advanced_searchLayer')} hasIcon={true} handleChange={handleChangeSearch} />
            </Grid>
            <Grid item container className={classes.wrapperItems}>
                <Link onClick={expandAccordions} underline='none' className={classes.customLink}>
                    <Typography variant='caption' className={clsx(classes.linkText, {
                        [classes.darkText]: flagExpandAll
                    })}>{t('advancedmap.advanced_expandPanel')}</Typography>
                </Link>
                <Divider orientation="vertical" flexItem className={classes.divider} />
                <Link onClick={recallAccordions} underline='none' className={classes.customLink}>
                    <Typography variant='caption' className={clsx(classes.linkText, {
                        [classes.darkText]: flagRecallAll
                    })}>{t('advancedmap.advanced_retractPanel')}</Typography>
                </Link>
            </Grid>
            <Grid item container>
                {mountItemsSection()}
            </Grid>
        </Grid>
    );
}

export default SettingsMenuSection;