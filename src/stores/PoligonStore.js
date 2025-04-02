import axios from "axios";
import { EventEmitter } from "events";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class PoligonStore extends EventEmitter {
    constructor() {
        super();
        this.poligons = [];
        this.allPoligons = null;
        this.selectedPolygon = null;
    }

    setSelectedPolygon(polygon) {
        this.selectedPolygon = polygon;
        this.emit("import_polygon_sucess");
    }

    getSelectedPolygon() {
        return this.selectedPolygon;
    }

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    clear() {
        tokenList.clear();
    }

    clearEvent = () => {
        this.emit("clear")
    }

    getPoligons = () => {
        var r = this.allPoligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })

            }
        })

        this.emit("view_polygon", r)
        return this.allPoligons
    }

    setPoligons = (val) => {
        this.poligons = val;
        this.allPoligons = val;
    }

    addPoint = (point) => {
        this.poligons[0].Points.push(point);
        this.allPoligons = this.allPoligons.filter((val) => { return val.objectid !== this.poligons[0].objectid });
        this.allPoligons.push(this.poligons[0])
        var r = this.poligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })
            }
        })
        this.emit("edit_polygon", r);
    }

    deletePoint = (id) => {
        let poligon = this.poligons[0];
        let points = poligon.Points.filter((val) => { return val.objectid !== id });
        poligon.Points = points;
        this.poligons = [poligon]
        var r = this.poligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })
            }
        })
        this.emit("edit_polygon", r);
    }

    deletePoligon = (id) => {
        this.allPoligons = this.allPoligons.filter((val) => { return val.objectid !== id });
        var r = this.poligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })
            }
        })
        this.emit("view_polygon", r)
    }

    toDataPolygon = (poligon) => {
        return poligon.Points.map((val) => {
            return [val.latitude, val.longitude]
        })
    }

    viewPoligon(val) {
        this.poligons.push(val);
        var r = this.poligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })
            }
        })
        this.emit("view_polygon", r)
    }

    editPoligon(val) {
        this.poligons = [val];
        var r = this.poligons.map((v) => {
            return {
                color: v.color, points: v.Points.map((p) => {
                    return [p.latitude, p.longitude]
                })
            }
        })
        this.emit("edit_polygon", r);
    }

    //FUNÇÃO QUE CALCULA A ÁREA "APROXIMADA" DE UM POLÍGONO NA SUPERFICIE DA TERRA PELO MÉTODO GAUSSIANO
    computeAreaGauss(points) {
        const EarthRadius = 6371000; //Raio médio da Terra em metros

        let totalArea = 0;

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];

            const lat1 = (p1[1] * Math.PI) / 180;
            const lon1 = (p1[0] * Math.PI) / 180;
            const lat2 = (p2[1] * Math.PI) / 180;
            const lon2 = (p2[0] * Math.PI) / 180;

            const deltaLon = lon2 - lon1;

            const x = deltaLon * Math.cos((lat1 + lat2) / 2);
            const y = lat2 - lat1;

            const partialArea = x * y;

            totalArea += partialArea;
        }

        // A área obtida fica em "radianos ao quadrado"
        // Conversão para M²
        const areaSquareMeters = Math.abs(totalArea) * (EarthRadius ** 2);

        return areaSquareMeters;
    }

    // Converte área de metros para hectares
    convertAreaToHa(area) {
        let finalArea = '';

        if (area) {
            finalArea = (area / 10000).toFixed(2);
        } else {
            finalArea = "0";
        }

        return finalArea;
    }

    addPoligonPoint(point, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + this.poligons[0].objectid + "/point/", point, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.addPoint({ objectid: response.data.objectid, ...point });
                    callBack(response.data)
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    deletePoligonPoint(axiosToken, point, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + this.poligons[0].objectid + "/point/" + point.objectid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.deletePoint(point.objectid)
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    updatePoligonColor(axiosToken, color, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        let pol = this.poligons[0];

        if (toolsUtils.isNullOrEmpty(pol, "objectid")) {
            return
        }

        pol.color = color;

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + pol.objectid, pol, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.updateColor(pol);
                    callBack({ id: axiosToken.id, data: response, color: pol.color })
                } else {
                    callBack({ id: axiosToken.id, data: null, color: "#FFF" })
                }
            })
            .catch(errorHandler);
    }

    updateColor(pol) {
        this.allPoligons = this.allPoligons.filter((val) => { return val.objectid !== this.poligons[0].objectid });
        this.allPoligons.push(pol)
    }

    updatePoligonPoint(axiosToken, point, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + this.poligons[0].objectid + "/point/" + point.objectid, point, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                    this.emit("add_point", { objectid: response.data, ...point });
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    getPolygons(cancelToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    if (response.data?.length > 0) {
                        this.setPoligons(response.data)
                        callBack({ id: cancelToken.id, data: response.data });
                        return
                    }

                    this.setPoligons([])
                    callBack({ id: cancelToken.id, data: [] });
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentPolygons(cancelToken, env, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.setPoligons(response.data)
                    callBack(response.data);
                }
            })
            .catch(errorHandler);
    }

    getPolygon(id, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + id, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    let polygon = response.data;
                    if (polygon.bounds) {
                        polygon = { ...polygon, Points: this.stringToArray(polygon.bounds) }
                    }
                    callBack(polygon);
                }
            })
            .catch(errorHandler);
    }

    getAreas(cancelToken, callBack) {
        let token = SessionStore.getToken();
        let id = SessionStore.getEnvironment();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + id + "/area/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: cancelToken.id, data: response.data });
                }
            })
            .catch(errorHandler);
    }


    postPoligon(axiosToken, poligon, callBack) {
        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/", poligon, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + SessionStore.getToken(),
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    this.allPoligons.push({ name: poligon.name, objectid: response.data.objectid, Points: [] })
                    this.editPoligon({ name: poligon.name, objectid: response.data.objectid, Points: [] })
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    delPoligon(poligon) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + poligon, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("delete_poligon", poligon);
                }
            })
            .catch(errorHandler);
    }

    deleteEnvPolygon(axiosToken, polygonId, callBackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + polygonId, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBackFunc({ id: axiosToken.id, data: response.data })
                } else {
                    callBackFunc({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerWithCallback(callBackFunc));
    }

    boundsToArray(pols) {
        let polygons = [];

        for (let object of pols) {
            if (object.bounds) {
                const pts = this.stringToArray(object.bounds, true);
                polygons.push({ ...object, Points: pts });
            } else {
                polygons.push({ ...object });
            }
        }

        return polygons;
    }

    // Usar pro PUT do polígono
    arrayToString(array) {
        let stringCoords = [];

        if (array?.length > 0 && array[0].latitude && array[0].longitude) {
            stringCoords = array.map(coord => `(${coord.latitude}, ${coord.longitude})`);
        } else if (array?.length > 0 && array[0].lat && array[0].lng) {
            stringCoords = array.map(coord => `(${coord.lat}, ${coord.lng})`);
        }
        return `(${stringCoords.join(', ')})`;
    }

    // Usar pro GET de polígono
    stringToArray(string, oldPattern = false) {
        if (typeof string !== 'string') {
            return string
        }

        let coordinates = string.match(/\((-?\d+\.\d+),(-?\d+\.\d+)\)/g);
        if (!coordinates) {
            coordinates = string.match(/\((-?\d+\.\d+), (-?\d+\.\d+)\)/g);
            if (!coordinates) {
                return [];
            }
        }

        const coordArray = coordinates.map(coord => {
            // Remendo temporário para evitar bugs
            if (oldPattern) {
                const [latitude, longitude] = coord
                    .substring(1, coord.length - 1)
                    .split(',')
                    .map(parseFloat);
                return { latitude, longitude };
            }

            const [lat, lng] = coord
                .substring(1, coord.length - 1)
                .split(',')
                .map(parseFloat);
            return { lat, lng };
        });
        return coordArray;
    }

    mapCoordinatesPoints(points) {
        if (!points) {
            return [];
        }

        return points.map(point => {
            return {
                latitude: point.lat,
                longitude: point.lng
            }
        });
    }

    addPolygon(axiosToken, poligon, callBack) {
        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/", poligon, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + SessionStore.getToken(),
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data, pol: poligon })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    attPolygon(axiosToken, poligon, callBack) {
        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + poligon.objectid, poligon, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + SessionStore.getToken(),
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    updateEnvironmentPolygon(axiosToken, poligon, callBack) {
        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env, poligon, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + SessionStore.getToken(),
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    deleteEnvironmentPolygon(axiosToken, poligon, callBack) {
        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.patch(LocalConfig.apiURL + "/api/admin/environment/" + env, poligon, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + SessionStore.getToken(),
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    savePoint(id, point, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + id + "/point/", point, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack(response.data)
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    savePolygonsConfiguration(polygons, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/configure", { polygons }, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof (response) === "undefined") {
                    callbackFunc(null);
                } else if (response.data !== null) {
                    callbackFunc({ data: response.data, id: cancelToken.id });
                } else {
                    callbackFunc({ data: null, id: cancelToken.id });
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    updateCropPolygonConfiguration(cancelToken, polygon, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return;
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + polygon.objectid + "/configure",
            polygon,
            {
                cancelToken: cancelToken.token.token.token,
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": "Bearer " + token,
                },
            })
            .then(checkStatus)
            .then(response => {
                if (typeof (response) === "undefined") {
                    callbackFunc(null);
                } else if (response.data !== null) {
                    callbackFunc({ data: response.data, id: cancelToken.id });
                } else {
                    callbackFunc({ data: null, id: cancelToken.id });
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    // Requisição pra atualizar os Pontos
    // TODO: Função será descontinuada e os lugares que chamam ela passarão a chamar a updatePointsPolygon()
    savePoints(cancelToken, polygonId, points, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/polygon/" + polygonId + "/point/", { Points: points }, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack(response.data)
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    clickPoligonMap(pol) {
        this.emit("clickmap_polygon", pol);
    }

    sucessPolygon() {
        this.emit("sucess_polygon")
    }

    editablePolygon(pol) {
        this.emit("editable_polygon", pol)
    }

    getGateways(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();

        this.axios = axios.get(LocalConfig.apiURL + '/api/admin/gateway/', {
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
}

const poligonStore = new PoligonStore();

export default poligonStore;