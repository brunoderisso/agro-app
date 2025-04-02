import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatusGeoData, errorHandlerIgnoreNotFoundWithCallback } from "../helpers/helpers";
import axios from "axios";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class GeoStore extends EventEmitter {
    constructor() {
        super();

        this.addressPoints = [];
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

    setAddressPoints(adresses) {
        this.addressPoints = adresses;
    }

    getAdressPoints() {
        return this.addressPoints;
    }

    getGeodata(measure, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        let time = SessionStore.getTime();
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
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
            .then(checkStatusGeoData)
            .then((responseData) => {
                if (typeof (responseData) === "undefined" || responseData.data?.length === 0) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                        let data = [];
                        responseData.data.forEach(function (obj) {
                            data.push([Number.parseFloat(obj.latitude), Number.parseFloat(obj.longitude), obj.value.toFixed(2).toString(), obj.device]);
                        });
                        this.addressPoints = data;
                        this.emit("change.points");
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { return callbackFunc([]) }));
    }

    getGeoStates(cancelToken, iso2, callbackFunc) {
        const token = SessionStore.getToken();

        if (!token) {
            return;
        }

        const environment = SessionStore.getEnvironment();

        if (!environment) {
            return;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/geo/country/" + iso2 + "/state/", {
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
                    if (responseData.data) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getGeoCities(cancelToken, countryIso2, stateIso2, callbackFunc) {
        const token = SessionStore.getToken();

        if (!token) {
            return;
        }

        const environment = SessionStore.getEnvironment();

        if (!environment) {
            return;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/geo/country/" + countryIso2 + "/state/" + stateIso2 + "/city/", {
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
                    if (responseData.data) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }
}

const geoStore = new GeoStore();

export default geoStore;
