import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import axios from "axios";
import SessionStore from './SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class DiseaseStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

    };

    restart() {
        tokenList.clear();
    }

    getEnvironmentDisease(cancelToken, time, callbackFunc) {
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

        if(time !== null){
            start = time.start;
            end = time.end;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment +"/disease/", {
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
            if (typeof (responseData) === undefined) {
                callbackFunc(null);
            } else {
                if (responseData.data !== null) {
                    callbackFunc({ id: cancelToken.id, data: responseData.data });
                } else {
                    callbackFunc(null);
                }
            };
        })
        .catch(errorHandler);
    }

    getEnvironmentPest(cancelToken, time, callbackFunc) {
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

        if(time !== null){
            start = time.start;
            end = time.end;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment +"/pest/", {
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
            if (typeof (responseData) === undefined) {
                callbackFunc(null);
            } else {
                if (responseData.data !== null) {
                    callbackFunc({ id: cancelToken.id, data: responseData.data });
                } else {
                    callbackFunc(null);
                }
            };
        })
        .catch(errorHandler);
    }

    getPestData(cancelToken, id, time, callbackFunc) {
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

        if(time !== null){
            start = time.start;
            end = time.end;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/pest", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                start: start,
                end: end,
                environment: environment,
                objectid: id
            }
        })
        .then(checkStatus)
        .then((responseData) => {
            if (typeof (responseData) === undefined) {
                callbackFunc(null);
            } else {
                if (responseData.data !== null) {
                    callbackFunc({ id: cancelToken.id, data: responseData.data });
                } else {
                    callbackFunc(null);
                }
            };
        })
        .catch(errorHandler);
    }

    updatePest(cancelToken, pest, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
          return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + pest.environmentobjectid + "/pest/" + pest.objectid, pest, {
          cancelToken: cancelToken.token.token.token,
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        })
        .then(checkStatus)
        .then(response => {
            if (typeof response.data !== "undefined") {
                callBack({id: cancelToken.id, data: response.data})
            } else {
                callBack({id: cancelToken.id, data: null});
            }
        })
        .catch(errorHandler);
    }
}

const DStore = new DiseaseStore();
export default DStore;
