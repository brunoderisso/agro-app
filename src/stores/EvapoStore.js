import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import axios from "axios";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class EvapoStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

    };

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    cancel() {
        //tokenList.clear();
    }

    restart() {
        tokenList.clear();
    }

    centerMap(pol) {
        this.emit("polygon.click", pol);
    }

    showStats(pol) {
        this.emit("polygon.stats", pol);
    }

    polygonETC(pol) {
        this.emit("polygon.ETC", pol);
    }

    polygonRemoveETC(pol) {
        this.emit("polygon.removeETC", pol);
    }

    getEto(data, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let start = null;
        let end = null;
        let group = "time(1d)";
        let func = "LAST";
        let fill = "0";
        let cumulative = null;

        if (data.start !== null && data.start !== undefined) {
            start = data.start;
        }

        if (data.end !== null && data.end !== undefined) {
            end = data.end;
        }

        if (data.cumulative) {
            cumulative = true
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/measure/eto/timeserie", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: start,
                end: end,
                group: group,
                function: func,
                fill: fill,
                environment: environment,
                cumulative: cumulative
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc(responseData.data);
                    } else {
                        callbackFunc(null);
                    }
                };
            })
            .catch(errorHandler);
    }

    getWeatherRainfall(data, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }
        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let start = null;
        let end = null;

        if (data.start !== null && data.start !== undefined) {
            start = data.start.toString();
            start = start.slice(0, 10);
        }

        if (data.end !== null && data.end !== undefined) {
            end = data.end.toString();
            end = end.slice(0, 10);
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/weather/preciptation/" + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: start,
                end: end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc(responseData.data);
                    } else {
                        callbackFunc(null);
                    }
                };
            })
            .catch(errorHandler);
    }

    getRainfall(data, env, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isNullOrEmpty(env, "objectid")) {
            return
        }

        let start = null;
        let end = null;
        let group = "time(1d)";
        let func = "SUM";
        let geohashp = 4;
        let fill = 0;

        if (data.start !== null && data.start !== undefined) {
            start = data.start;
        }

        if (data.end !== null && data.end !== undefined) {
            end = data.end;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/timeserie/Rainfall", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: start,
                end: end,
                group: group,
                function: func,
                fill: fill,
                geohash: env.geohash,
                geohashprecision: geohashp
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc(responseData.data);
                    } else {
                        callbackFunc(null);
                    }
                };
            })
            .catch(errorHandler);
    }

    getEvapo(cancelToken, parameters, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();
        let start = time.start;
        let end = time.end;

        if (parameters !== undefined && parameters !== null) {
            start = parameters.start || time.start;
            end = parameters.end || time.end;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/evapo/environment/" + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: start,
                end: end,
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

    getEvapoETO(cancelToken, parameters, callbackFunc) {
        const token = SessionStore.getToken();
        const envId = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        const params = {
            environment: envId,
            start: parameters.start || time.start,
            end: parameters.end || time.end,
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/eto", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    getEvapoCropETC(cancelToken, parameters, callbackFunc) {
        const token = SessionStore.getToken();
        const envId = SessionStore.getEnvironment();
        const time = SessionStore.getTime();

        const params = {
            environment: envId,
            start: parameters.start || time.start,
            end: parameters.end || time.end,
            objectid: parameters.cropId
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/etc", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ data: responseData.data, id: cancelToken.id });
                    } else {
                        callbackFunc({ data: null, id: cancelToken.id });
                    }
                };
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }
}

const EStore = new EvapoStore();
export default EStore;
