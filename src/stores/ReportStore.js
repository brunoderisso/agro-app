import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class ReportStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

    }

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    cancel() {
        tokenList.clear();
    }

    restart() {
        tokenList.clear();
    }

    getReportSerie(axiosToken, parameters, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();

        let group = "5m";
        let func = "mean";
        let fill = "null";
        let measure = "AirDewpoint"

        if (parameters.function !== undefined && parameters.function !== null) {
            func = parameters.function;
        }

        if (parameters.measure !== undefined && parameters.measure !== null) {
            measure = parameters.measure;
        }

        if (parameters.fill !== undefined && parameters.fill !== null) {
            fill = parameters.fill;
        }

        if (parameters.group !== undefined && parameters.group !== null) {
            group = parameters.group;
        } else {
            group = this.getGroup(parameters.hours);
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/report/" + measure, {

            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: time.start,
                end: time.end,
                group: "time(" + group + ")",
                function: func,
                fill: fill,
                environment: environment
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callbackFunc({ id: axiosToken.id, data: null })
                    }
                };
            })
            .catch(errorHandler);
    }

    downloadSerie(axiosToken, parameters, callBack) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        const time = SessionStore.getTime();

        let params = {
            device: parameters.device,
            start: parameters.start || time.start,
            end: parameters.end || time.end,
            environment: environment
        }

        params.group = "time(" + ((!toolsUtils.isNullOrEmpty(parameters, "group") && !toolsUtils.isEmptyString(parameters.group) && parameters.group) || "5m") + ")";
        params.function = (!toolsUtils.isNullOrEmpty(parameters, "function") && !toolsUtils.isEmptyString(parameters.function) && parameters.function) || "mean";
        params.fill = (!toolsUtils.isNullOrEmpty(parameters, "fill") && !toolsUtils.isEmptyString(parameters.fill) && parameters.fill) || "null";
        params.cumulative = (!toolsUtils.isNullOrEmpty(parameters, "cumulative") && !toolsUtils.isEmptyString(parameters.cumulative) && parameters.cumulative) || null

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/export/" + parameters.measure, {
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
                    callBack({ id: axiosToken.id, data: response.data, headers: response.headers })
                } else {
                    callBack({ id: axiosToken.id, data: null, headers: null })
                }
            })
            .catch(errorHandler);
    }

    // TODO: testar -> tem outra função dessa no TimeSerieStore
    getGroup(h) {
        if (h === 48) {
            return "10m"
        } else if (h === 168) {
            return "15m"
        } else if (h === 720) {
            return "30m"
        } else if (h === 1440 || h === 2880) {
            return "60m"
        } else {
            return "5m"
        }
    }

    getReports(axiosToken, callbackFunc) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }


        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/report/", {

            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callbackFunc({ id: axiosToken.id, data: null })
                    }
                };
            })
            .catch(errorHandler);


    }

    addReport(report, axiosToken, callbackFunc) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + "/report/", report, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callbackFunc({ id: axiosToken.id, data: null })
                    }
                };
            })
            .catch(errorHandler);
    }

    deleteReport(report, axiosToken, callbackFunc) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + environment + "/report/"+report.objectid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callbackFunc({ id: axiosToken.id, data: null })
                    }
                };
            })
            .catch(errorHandler);
    }

    updateReport(report, axiosToken, callbackFunc) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/report/"+report.objectid, report, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callbackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callbackFunc({ id: axiosToken.id, data: null })
                    }
                };
            })
            .catch(errorHandler);
    }
}

const reportStore = new ReportStore();
export default reportStore;