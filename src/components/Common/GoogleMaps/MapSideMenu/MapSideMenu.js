import React, { useState, useEffect, useRef } from 'react';

import classNames from "classnames";

import { ButtonGroup, Collapse } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import useStyles from '../../../../styles/GoogleMaps/MapSideMenu';
import GoogleMapsStore from '../../../../stores/GoogleMapsStore';
import ItemMapSideMenu from './ItemMapSideMenu';
import sessionStore from '../../../../stores/SessionStore';
import TokenList from '../../../../stores/CancelTokenList';
import measureStore from '../../../../stores/MeasureStore';
import AdvancedMapIcons from './AdvancedMapIcons';



function MapSideMenu(props) {
    const allStyles = Object.assign({}, useStyles(), AdvancedMapIcons());

    const classes = allStyles;
    const tokenList = new TokenList();

    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [selectedMenuFeature, setSelectedMenuFeature] = useState(null);
    const [servicesAdvanced, setServicesAdvanced] = useState(null);

    const satelliteScenesRef = useRef(null);
    const satelliteIndexesRef = useRef(null);

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedMenuItem) {
            GoogleMapsStore.storeSelectedMenuItem(selectedMenuItem);
            GoogleMapsStore.emit('activeStep_update', 3);

            if (GoogleMapsStore.getTimelineActiveStep() === 3) {
                sessionStore.emit('time.change');
            }

            switch (selectedMenuItem) {
                case 'inmet':
                    sessionStore.emit('radius.change');
                    setSelectedMenuFeature(sessionStore.getPreference().measure);

                    break;
                case 'coletor':
                    setSelectedMenuFeature(sessionStore.getPreference().measure);

                    break;
                case 'maquinas':
                    GoogleMapsStore.emit('implements_click');
                    GoogleMapsStore.showOnMap('implements', true);

                    break;

                case 'irrigação':
                    GoogleMapsStore.emit('evapoSoil_get');
                    break;
                default:
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMenuItem])

    useEffect(() => {
        if (selectedMenuItem === 'satelite' && selectedMenuFeature) {
            if (satelliteScenesRef.current) {
                const sceneSelected = satelliteScenesRef.current.find(scene => scene.index === selectedMenuFeature);

                if (sceneSelected) {
                    GoogleMapsStore.emit('satelliteImage_draw', sceneSelected.objectid);
                } else {
                    GoogleMapsStore.emit('googleMapsError_set', '404');
                    GoogleMapsStore.emit('satelliteImage_draw');
                }
            }

            if (satelliteIndexesRef.current) {
                const indexSelected = satelliteIndexesRef.current.find(index => index.name === selectedMenuFeature);

                if (indexSelected) {
                    GoogleMapsStore.emit('satelliteGradient_set', indexSelected);
                } else {
                    GoogleMapsStore.emit('satelliteGradient_set', '404');
                }
            }
        }
    }, [selectedMenuItem, selectedMenuFeature])

    const bind = () => {
        GoogleMapsStore.addListener('featuresMenu_update', updateFeatures);
        GoogleMapsStore.addListener('googleMapsServices_store', loadMenuItems);
        GoogleMapsStore.addListener('satelliteScenesRef_set', handleSatelliteScenesRef);
        GoogleMapsStore.addListener('satelliteIndexesRef_set', handleSatelliteIndexesRef);
        GoogleMapsStore.addListener('selectedMenuFeature_update', setSelectedMenuFeature);
        sessionStore.addListener('environments.update', resetSatelliteObject);
    }

    const clear = () => {
        GoogleMapsStore.removeListener('featuresMenu_update', updateFeatures);
        GoogleMapsStore.removeListener('googleMapsServices_store', loadMenuItems);
        GoogleMapsStore.removeListener('satelliteScenesRef_set', handleSatelliteScenesRef);
        GoogleMapsStore.removeListener('satelliteIndexesRef_set', handleSatelliteIndexesRef);
        GoogleMapsStore.removeListener('selectedMenuFeature_update', setSelectedMenuFeature);
        sessionStore.removeListener('environments.update', resetSatelliteObject);
    }

    const handleSatelliteScenesRef = (scenes) => {
        satelliteScenesRef.current = scenes;
    }

    const handleSatelliteIndexesRef = (indexs) => {
        satelliteIndexesRef.current = indexs;
    }

    const resetSatelliteObject = () => {
        GoogleMapsStore.storeSatelliteObject(null);
    }

    const loadMenuItems = (start) => {
        setServicesAdvanced(GoogleMapsStore.getServicesAdvancedMap());

        if (start) {
            if (GoogleMapsStore.getServicesAdvancedMap()['coletor']) {
                // Opção default
                setSelectedMenuItem('coletor');
            } else {
                setSelectedMenuItem(Object.keys(GoogleMapsStore.getServicesAdvancedMap())[0]);
            }
        }
    }

    const updateFeatures = (toggles) => {
        const newFeatures = GoogleMapsStore.getServicesAdvancedMap();
        const foundFeature = newFeatures[toggles.name].features.find(feature => feature.name === Object.keys(toggles)[0]);

        if (foundFeature) {
            const body = {
                objectid: foundFeature.objectid,
                enable: Object.values(toggles)[0],
                purchased: foundFeature.purchased
            }

            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            GoogleMapsStore.updateServicesFeatures(cancelToken, body, responseUpdateFeatures);
        }
    }

    const responseUpdateFeatures = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            GoogleMapsStore.emit('servicesFeatures_refresh');
            GoogleMapsStore.emit("googleMapsError_set", '200');
        }

        if (response.status) {
            GoogleMapsStore.emit("googleMapsError_set", response.status.toString());
        }
    }

    const onChangeItem = (e) => {
        const name = e.currentTarget.name;
        const inmet = GoogleMapsStore.getInmetReferences();

        if (name === 'advanced') {
            GoogleMapsStore.emit('advancedDrawer_click');
            GoogleMapsStore.emit('featuresAdvanced_get', servicesAdvanced);
        } else {
            setSelectedMenuFeature(null);
        }

        if (name === 'irrigação') {
            GoogleMapsStore.emit('evapoSoil_get');
        } else if (!['pielManager', 'advanced', 'irrigação'].includes(name)) {
            GoogleMapsStore.emit('evapoSoil_clean');
            measureStore.emit('gradient_reset', null);
        } else {
            measureStore.emit('gradient_reset', null);
        }

        if (name === 'inmet' && !inmet.radiusReference?.getVisible()) {
            sessionStore.emit('radius.change');
        } else if (!['pielManager', 'advanced', 'inmet'].includes(name) && inmet.radiusReference?.getVisible()) {
            GoogleMapsStore.showOnMap('inmet', false)
            GoogleMapsStore.emit('cards.close');
        }

        if (name === 'coletor') {
            GoogleMapsStore.showOnMap('devices', true);
            measureStore.emit('change.measure');
        } else if (!['pielManager', 'advanced', 'coletor'].includes(name)) {
            GoogleMapsStore.showOnMap('devices', false);
            GoogleMapsStore.resetHeatmapReference();
            GoogleMapsStore.emit('cards.close');
            GoogleMapsStore.resetInterpolationReference();
            measureStore.emit('gradient_reset', null);
        }

        if (name === 'maquinas') {
            GoogleMapsStore.emit('implements_click');
            GoogleMapsStore.showOnMap('implements', true);

        } else if (!['pielManager', 'advanced', 'maquinas'].includes(name)) {
            GoogleMapsStore.showOnMap('implements', false);
        }

        if (name === 'satelite') {
            GoogleMapsStore.storeFlagSatelliteGetOneDay(false);
        } else {
            GoogleMapsStore.emit("satelliteImage_draw");
        }

        if (name !== 'advanced') {
            setSelectedMenuItem(name);
        }

        if (typeof props.onChange === 'function') {
            props.onChange(name);
        }
    }

    const onChangeFeature = (e, serviceName, measure) => {
        setSelectedMenuFeature(e.currentTarget.name);

        if (['inmet', 'coletor'].includes(serviceName) && measure) {
            const preference = { ...sessionStore.getPreference(), measure };

            sessionStore.pushPreference(preference, () => {
                sessionStore.setPreference(preference);
                measureStore.setDefaultMeasure();
            });
        }
    }

    const bodySubitemIconMenu = (name, object) => {
        const activeFeatures = object?.features?.filter(item => item.show_map) || [];

        return (
            <Grid>
                <Collapse className={classes.collapse} in={selectedMenuItem === name} unmountOnExit>
                    <Grid container>
                        <ButtonGroup
                            className={classes.menuContainer}
                            orientation='vertical'
                            variant='contained'
                            size='medium'
                        >
                            {activeFeatures.map((feature, index) => {
                                return (
                                    <ItemMapSideMenu
                                        key={index}
                                        icon={<i className={classNames(classes.sprite, classes[`${feature.icon}P90`], classes.featureIcon)}></i>}
                                        name={feature.name}
                                        onChangeItem={onChangeFeature}
                                        menuItemSelected={selectedMenuFeature}
                                        menuItemRootSelected={selectedMenuItem}
                                        rootName={name}
                                        index={index}
                                        measure={feature.measure}
                                    />
                                )
                            })}
                        </ButtonGroup>
                    </Grid>
                </Collapse>
            </Grid>
        )
    }

    const mountMenuServices = () => {
        const services = [];

        for (const service in servicesAdvanced) {
            if (servicesAdvanced.hasOwnProperty(service) && servicesAdvanced[service].show_map) {
                const item =
                    <ItemMapSideMenu
                        key={service}
                        icon={<i className={classNames(classes.sprite, classes[`${servicesAdvanced[service].icon}P90`], classes.serviceIcon)}></i>}
                        name={service}
                        onChangeItem={onChangeItem}
                        menuItemSelected={selectedMenuItem}
                    >
                        {bodySubitemIconMenu(service, servicesAdvanced[service])}
                    </ItemMapSideMenu>

                services.push(item);
            }
        }

        const advanced =
            <ItemMapSideMenu
                icon={<i className={classNames(classes.sprite, classes.advmapAdvancedP90, classes.serviceIcon)}></i>}
                name={'advanced'}
                onChangeItem={onChangeItem}
                menuItemSelected={selectedMenuItem}
            />

        services.push(advanced);

        return services;
    }

    return (
        <Grid container className={classes.container} spacing={2}>
            <Grid item style={{ maxWidth: 'fit-content' }}>
                <ButtonGroup
                    className={classes.menuContainer}
                    orientation='vertical'
                    variant='contained'
                    size='medium'
                >
                    {servicesAdvanced && mountMenuServices()}
                </ButtonGroup>
            </Grid>
        </Grid>
    )
}

export default MapSideMenu;