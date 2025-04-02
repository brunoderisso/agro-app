import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandlerIgnoreErrorsWithCallback } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import measureStore from "./MeasureStore";
import errorHandlerWithCallback from "../helpers/errorHandler";
import toolsUtils from "../utils/toolsUtils";

EventEmitter.EventEmitter.defaultMaxListeners = 0;


class GoogleMapsStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

        this.polygonReferences = [];
        this.areaReferences = [];
        this.deviceReferences = [];
        this.gatewayReferences = [];
        this.implementsReference = [];
        this.heatmapReference = null;
        this.interpolationReference = null;
        this.satelliteReference = null;
        this.satelliteObject = null;
        this.flagSatelliteGetOneDay = false;
        this.gatewayRadiusKm = 20;
        this.inmetReferences = { radiusReference: null, stations: [] };
        this.servicesAdvancedMap = null;
        this.selectedMenuItem = null;
        this.devicesProps = [];
        this.inmetStationsProps = [];
        this.cropPolygonsProps = [];
        this.layer = "heatmap";
        this.enableCards = false;
        this.timelineActiveStep = 0;

        this.map = null;
        this.maps = null;
    };

    setMapsReferences(map, maps){
        this.map = map;
        this.maps = maps;
    }

    storeEnableCards(status) {
        this.enableCards = status;
    }

    getEnableCards() {
        return this.enableCards;
    }

    storeDevicesProps(devices) {
        this.devicesProps = devices;
    }

    getDevicesProps() {
        return this.devicesProps;
    }

    storeCropPolygonsProps(polygons) {
        this.cropPolygonsProps = polygons;
    }

    getCropPolygonsProps() {
        return this.cropPolygonsProps;
    }

    storeInmetStationsProps(stations) {
        this.inmetStationsProps = stations;
    }

    getInmetStationsProps() {
        return this.inmetStationsProps;
    }

    storeServicesAdvancedMap(services, start) {
        this.servicesAdvancedMap = services;
        this.emit("googleMapsServices_store", start);
    }

    storeGatewayReference(obj, pin, radius) {
        this.gatewayReferences.push({ object: obj, reference: { pin, radius } });
    }

    storeGatewayRadiusKm(radius) {
        this.gatewayRadiusKm = radius;
    }

    storeInmetReferences(radius, object, reference) {
        if (radius) {
            this.inmetReferences.radiusReference = radius;
        }

        this.inmetReferences.stations.push({ object, reference });
    }

    storeHeatmapReference(heatmap) {
        this.heatmapReference = heatmap;
    }

    storeInterpolationReference(interpolation) {
        this.interpolationReference = interpolation;
    }

    storeSatelliteReference(satellite) {
        this.satelliteReference = satellite;
    }

    storeSatelliteObject(satellite) {
        this.satelliteObject = satellite;
    }

    storeFlagSatelliteGetOneDay(flag) {
        this.flagSatelliteGetOneDay = flag;
    }

    storeTimelineActiveStep(step) {
        this.timelineActiveStep = step;
    }

    storePolygonReference(obj, reference) {
        this.polygonReferences.push({ object: obj, reference });
    }

    storeAreaReference(obj, reference) {
        this.areaReferences.push({ object: obj, reference });
    }

    storeDeviceReference(obj, reference) {
        this.deviceReferences.push({ object: obj, reference });
    }

    storeImplementReference(obj, path, icon) {
        this.implementsReference.push({ object: obj, reference: { path, icon } });
    }

    storeSelectedMenuItem(item) {
        this.selectedMenuItem = item;
    }

    getServicesAdvancedMap() {
        return this.servicesAdvancedMap;
    }

    getPolygonReferences() {
        return this.polygonReferences;
    }

    getLayer() {
        return this.layer;
    }

    setLayer(layer) {
        this.layer = layer;
        this.emit("googleMapsLayer_change");
    }

    getAreaReferences() {
        return this.areaReferences;
    }

    getHeatmapReference() {
        return this.heatmapReference;
    }

    getInterpolationReference() {
        return this.interpolationReference;
    }

    getSatelliteReference() {
        return this.satelliteReference;
    }

    getSatelliteObject() {
        return this.satelliteObject;
    }

    getFlagSatelliteGetOneDay() {
        return this.flagSatelliteGetOneDay;
    }

    getTimelineActiveStep() {
        return this.timelineActiveStep;
    }

    getDeviceReferences() {
        return this.deviceReferences;
    }

    getImplementsReferences() {
        return this.implementsReference;
    }

    getGatewayReference() {
        return this.gatewayReferences;
    }

    getGatewayRadiusKm() {
        return this.gatewayRadiusKm;
    }

    getInmetReferences() {
        return this.inmetReferences;
    }

    getSelectedMenuItem() {
        return this.selectedMenuItem;
    }

    resetPolygonReferences() {
        const environmentPol = this.polygonReferences.filter(polRef => polRef.object.isEnvironment);

        this.polygonReferences.forEach(polygon => {
            if (!polygon.object.isEnvironment) {
                polygon.reference.setMap(null);
            }
        });

        this.polygonReferences = environmentPol;
    }

    hiddenPolygonReferences() {
        this.polygonReferences.forEach(polygon => {
            if (!polygon.object.isEnvironment) {
                polygon.reference.setMap(null);
            }
        });
    }

    showPolygonReferences() {
        this.polygonReferences.forEach(polygon => {
            if (!polygon.object.isEnvironment) {
                polygon.reference.setMap(this.map);
            }
        });
    }

    resetEnvPolygonReferences() {
        const polygons = this.polygonReferences.filter(polRef => !polRef.object.isEnvironment);

        this.polygonReferences.forEach(polygon => {
            if (polygon.object.isEnvironment) {
                polygon.reference.setMap(null);
            }
        });

        this.polygonReferences = polygons;
    }

    resetInmetReferences() {
        this.inmetReferences.stations.forEach(station => {
            station.reference.setMap(null);
        });
        this.inmetReferences.stations = [];
    }

    resetHeatmapReference() {
        if (this.heatmapReference)
            this.heatmapReference.setMap(null);

        this.heatmapReference = null;
    }

    resetInterpolationReference() {
        if (this.interpolationReference)
            this.interpolationReference.setMap(null);

        this.interpolationReference = null;
    }

    resetSatelliteReference() {
        if (this.satelliteReference)
            this.satelliteReference.setMap(null);

        this.satelliteReference = null;
    }

    isFullscreen(element) {
        return (
            (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) === element
        );
    }

    requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullScreen) {
            element.msRequestFullScreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    //Calcula o centro de um polygono composto por 2 pontos (Circulo)
    getCenterCircle(points) {
        let lat = (points[0].lat + points[1].lat) / 2;
        let lng = (points[0].lng + points[1].lng) / 2;

        return { lat, lng };
    }

    getBiggerLatitude(points) {
        const biggerLat = points.reduce((acc, curr) => curr[1] > acc[1] ? curr : acc)[1];

        return points.find(point => point[1] === biggerLat);
    }

    updateDeviceMeasures(device, newPropsDevice) {
        const measures = [];

        if (device?.measures) {
            device.measures.forEach(measure => {
                measures.push({
                    ...measure,
                    meta: measureStore.getMeasuresStore().find(measureStore => measureStore.name === measure.name)?.meta?.ylegend || ""
                })
            })
        }

        const newDevice = {
            ...device,
            deveui: newPropsDevice.deveui,
            latitude: newPropsDevice.coord.lat(),
            longitude: newPropsDevice.coord.lng(),
            show: true,
            measure: {
                value: newPropsDevice.data.median,
                max: newPropsDevice.data.max,
                min: newPropsDevice.data.min,
                stddev: newPropsDevice.data.stddev
            },
            measures

        }

        return newDevice;
    }

    // Mostra ou Esconde os objetos selecionados
    showOnMap(value, show) {
        const polygonReferences = this.getPolygonReferences();

        switch (value) {
            case "devices":
                const deviceReferences = this.getDeviceReferences();
                deviceReferences.forEach(element => {
                    if (element?.object && element?.reference) {
                        const object = element.object;

                        if (object.hasOwnProperty("deveui")) {
                            const reference = element.reference;

                            if (show) {
                                reference.setVisible(true);
                            } else {
                                reference.setVisible(false);
                            }
                        }
                    }
                });
                break;

            case "polygons":
                polygonReferences.forEach(element => {
                    if (element?.object && element?.reference) {
                        const object = element.object;

                        if (object.hasOwnProperty("centroid")) {
                            const reference = element.reference;

                            if (show) {
                                reference.setVisible(true);
                            } else {
                                reference.setVisible(false);
                            }
                        }
                    }
                });
                break;

            case "areas":
                const areaReferences = this.getAreaReferences();
                areaReferences.forEach(element => {
                    if (element?.object && element?.reference) {
                        const object = element.object;

                        if (object.hasOwnProperty("placemarks")) {
                            const reference = element.reference;

                            if (show) {
                                reference.setVisible(true);
                            } else {
                                reference.setVisible(false);
                            }
                        }
                    }
                });
                break;

            case "environmentBounds":
                polygonReferences.forEach(element => {
                    if (element?.object && element?.reference) {
                        const object = element.object;

                        if (object.isEnvironment) {
                            const reference = element.reference;

                            if (show) {
                                reference.setVisible(true);
                            } else {
                                reference.setVisible(false);
                            }
                        }
                    }
                });
                break;

            case "gateways":
                const gatewayReferences = this.getGatewayReference();
                gatewayReferences.forEach(element => {
                    if (element?.object && element?.reference) {
                        const object = element.object;

                        if (object.hasOwnProperty("mac")) {
                            const pin = element.reference.pin;
                            const radius = element.reference.radius;

                            if (show) {
                                pin.setVisible(true);
                                radius.setVisible(true);
                            } else {
                                pin.setVisible(false);
                                radius.setVisible(false);
                            }

                        }
                    }
                });
                break;
            case "implements":
                const implementsReference = this.getImplementsReferences();
                implementsReference.forEach(element => {
                    if (element?.object && element?.reference) {

                        const icon = element.reference.icon;
                        const path = element.reference.path;

                        if (show) {
                            icon.setVisible(true);
                            path.setVisible(true);
                        } else {
                            icon.setVisible(false);
                            path.setVisible(false);
                        }
                    }
                });
                break;

            case "inmet":
                const inmetReferences = this.getInmetReferences();
                const radius = inmetReferences.radiusReference;

                radius.setVisible(!radius.getVisible());
                inmetReferences.stations.forEach(station => {
                    const reference = station.reference;

                    if (show) {
                        reference.setVisible(true);
                    } else {
                        reference.setVisible(false);
                    }
                });

                break;

            default:
                break;
        }
    }

    handleClickableOnMap(value, clickable) {
        switch (value) {
            case "devices":
                this.getDeviceReferences().forEach(devRef => {
                    if (devRef.reference) {
                        devRef.reference.setOptions({ clickable });
                    }
                });

                break;
            case "polygons":
                this.getPolygonReferences().forEach(polRef => {
                    if (polRef.reference) {
                        polRef.reference.setOptions({ clickable });
                    }
                });

                break;
            default:
                break;
        }
    }

    convertMeterToDegree(meters) {
        if (!meters) {
            return;
        }

        return +meters / 111110;
    }

    getURLInterpolation(cancelToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let measure = measureStore.getMeasure();

        if (measure === null || measure === undefined || measure === "all") {
            return
        }

        let environment = SessionStore.getEnvironment();
        if (environment === null || environment === undefined) {
            return
        }

        let time = SessionStore.getTime();
        if (time.start === null && time.end === null) {
            return
        }

        let func = SessionStore.function;
        if (func === null) {
            return
        }

        let params = {
            measurement: measure,
            start: time.start.toString(),
            end: time.end.toString(),
            function: func,
            fill: 'none',
            environment: environment
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/plot/interpolation/", params, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ data: response.data, id: cancelToken.id })
                } else {
                    callBack({ data: null, id: cancelToken.id });
                }
            })
            .catch(errorHandlerIgnoreErrorsWithCallback(() => { callBack({ data: null, id: cancelToken.id }); }));
    }

    getETO_URLInterpolation(pol, cancelToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();
        if (environment === null || environment === undefined) {
            return
        }

        let time = SessionStore.getTime();
        if (time.start === null && time.end === null) {
            return
        }

        let func = SessionStore.function;
        if (func === null) {
            return
        }

        let params = {
            measurement: "_ETO",
            start: time.start.toString(),
            end: time.end.toString(),
            function: func,
            fill: 'none',
            objectid: pol.objectid
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/plot/interpolation/", params, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ data: response.data, id: cancelToken.id, pol: pol })
                } else {
                    callBack({ data: null, id: cancelToken.id });
                }
            })
            .catch(errorHandlerIgnoreErrorsWithCallback(() => { callBack({ data: null, id: cancelToken.id }); }));
    }

    getFeaturesByEnvironment(cancelToken, id, callbackFunc) {
        const token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + '/api/account/environment/' + id + '/feature/', {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getWidgetForecast(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const time = SessionStore.getTimeShort();

        this.axios = axios.get(LocalConfig.apiURL + '/api/widget/forecast/' + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getWidgetEvapo(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + '/api/widget/eto/' + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end,
                function: "LAST"
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getWidgetChillHour(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + '/api/widget/chillhour/' + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getWidgetChillHour10(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + '/api/widget/chillhour/10/' + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getWidgetColdUnits(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + '/api/widget/coldunit/' + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ data: null, id: cancelToken.id });
                } else {
                    callbackFunc({ data: responseData.data, id: cancelToken.id });
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getHeatmapData(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        const time = SessionStore.getTime();
        const environment = SessionStore.getEnvironment();
        const measure = SessionStore.getPreference().measure;

        if (toolsUtils.isEmptyString(environment)) {
            return;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/geo/" + measure, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                start: time.start,
                end: time.end,
                function: SessionStore.function || "mean",
                group: "device",
                fill: SessionStore.fill || "none"
            }
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getServicesFeatures(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        const environment = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/feature/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    updateServicesFeatures(cancelToken, feature, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        const environment = SessionStore.getEnvironment();

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/feature/" + feature.objectid, feature, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    extractNewPolygons(polygons) {
        const extractedPolygons = [];
        polygons.forEach((polygon) => {
            const coordinates = this.getCoordinatesPolygon(polygon);

            coordinates.push(coordinates[0]);
            extractedPolygons.push({ name: polygon.name, polygon: coordinates });
        });

        return extractedPolygons;
    }

    getCoordinatesPolygon(polygon) {
        const path = polygon.ref ? polygon.ref.getPath() : polygon.reference.getPath();
        const coordinates = [];

        for (let i = 0; i < path.getLength(); i++) {
            const point = path.getAt(i);
            coordinates.push([point.lng(), point.lat()]);
        }

        return coordinates;
    }

    geocodeAddress(address, map, maps) {
        var geocoder = new maps.Geocoder();
        let addressComponents = {
            address: '',
            district: '',
            city: '',
        }
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                if (results[0].geometry.viewport) {
                    map.fitBounds(results[0].geometry.viewport);
                } else {
                    // Caso não tenha viewport, ajustamos o zoom manualmente
                    map.setZoom(15);
                }

                if (results[0].address_components) {
                    results[0].address_components.forEach(component => {
                        if (component.types.includes('route')) {
                            addressComponents.address = component.long_name;
                        }
                        if (component.types.includes('administrative_area_level_1')) {
                            addressComponents.district = component.short_name;
                        }
                        if (component.types.includes("administrative_area_level_2")) {
                            addressComponents.city = component.long_name;
                        }
                    });
                }

            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });

        return addressComponents;
    }

    getSatelliteList(cancelToken, params, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        const environment = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/satellite/" + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    // TODO: requisição para a segunda entrega do satélite
    // getSatelliteStats(cancelToken, imageId, callbackFunc) {
    //     const token = SessionStore.getToken();

    //     if (token === null) {
    //         return;
    //     }

    //     const environment = SessionStore.getEnvironment();

    //     this.axios = axios.get(LocalConfig.apiURL + "/api/account/satellite/" + environment + "/stats/" + imageId,
    //          {
    //         cancelToken: cancelToken.token.token.token,
    //         headers: {
    //             "Content-Type": "text/plain",
    //             "Authorization": "Bearer " + token,
    //         }
    //     })
    //         .then((responseData) => {
    //             if (!responseData) {
    //                 callbackFunc(null);
    //             } else {
    //                 if (responseData.data !== null) {
    //                     callbackFunc({ id: cancelToken.id, data: responseData.data });
    //                 } else {
    //                     callbackFunc(null);
    //                 }
    //             }
    //         })
    //         .catch(errorHandlerWithCallback(callbackFunc));
    // }
};

const GoogleMapStore = new GoogleMapsStore();

export default GoogleMapStore;