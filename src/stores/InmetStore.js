import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandlerIgnoreErrorsWithCallback } from "../helpers/helpers";
import SessionStore from "./SessionStore";
import toolsUtils from "../utils/toolsUtils";
import errorHandlerWithCallback from "../helpers/errorHandler";
import sessionStore from "./SessionStore";

EventEmitter.EventEmitter.defaultMaxListeners = 0;


class inmetStore extends EventEmitter {
    getTimeSerie(axiosToken, parameters, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        const time = SessionStore.getTime();

        let params = {
            device: parameters.device,
            start: parameters.start || time.start,
            end: parameters.end || time.end,
        }
        if (parameters.timezone) {
            params.timezone = parameters.timezone
        }

        params.group = "time(" + ((!toolsUtils.isNullOrEmpty(parameters, "group") && !toolsUtils.isEmptyString(parameters.group) && parameters.group) || "1d") + ")";
        params.function = (!toolsUtils.isNullOrEmpty(parameters, "function") && !toolsUtils.isEmptyString(parameters.function) && parameters.function) || "mean";
        params.fill = (!toolsUtils.isNullOrEmpty(parameters, "fill") && !toolsUtils.isEmptyString(parameters.fill) && parameters.fill) || "null";
        params.cumulative = (!toolsUtils.isNullOrEmpty(parameters, "cumulative") && !toolsUtils.isEmptyString(parameters.cumulative) && parameters.cumulative) || null

        this.axios = axios.get(LocalConfig.apiURL + "/api/inmet/data/" + parameters.measure, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: params
        })
            .then(checkStatus)
            .then((response) => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerIgnoreErrorsWithCallback(callBack));
    };

    getStations(cancelToken, parameters, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/inmet/geolocation", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                latitude: parameters.latitude,
                longitude: parameters.longitude,
                limit: parameters.limit / 1000,
                function: sessionStore.getFunction()
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: cancelToken.id, data: response.data });
                } else {
                    callBack({ id: cancelToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    getStationData(cancelToken, params, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/inmet/dashboard/" + params.id, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: params.start,
                end: params.end,
                function: sessionStore.getFunction()
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: cancelToken.id, data: response.data });
                } else {
                    callBack({ id: cancelToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    getListStationData(cancelToken, stations, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        const promises = [];
        const params = {
            start: sessionStore.getTime().start,
            end: sessionStore.getTime().end,
            function: sessionStore.getFunction()
        }

        stations.forEach(station => {
            this.axios = axios.get(LocalConfig.apiURL + "/api/inmet/dashboard/" + station.code, {
                cancelToken: cancelToken.token.token.token,
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": "Bearer " + token,
                },
                params
            });
            promises.push(this.axios);
        });

        Promise.all(promises).then((responseData) => {
            if (responseData.length > 0) {
                callbackFunc(responseData);
            } else {
                callbackFunc([]);
            }
        }).catch(errorHandlerWithCallback(callbackFunc));
    }
}

const InmetStore = new inmetStore();

export default InmetStore;