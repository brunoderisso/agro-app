import { EventEmitter } from "events";
import SessionStore from '../stores/SessionStore';
import { LocalConfig } from "../LocalConfig"
import { checkStatus } from "../helpers/helpers";
import errorHandlerWithCallback from '../helpers/errorHandler'
import axios from "axios";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class ChillHourStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.chill = "_ChillHours"
        this.date = {}
    }

    setChill = (chill) => {
        this.chill = chill
        this.emit("change_chill");
    }

    polygonChillHour(pol) {
        this.emit("polygon.chillhour", pol);
    }

    setDate = (date) => {
        this.date = date
        this.emit("time.change");
    }

    polygonRemoveChillHour(pol) {
        this.emit("polygon.removechillhour", pol);
    }

    changeGdd(pol) {
        this.emit("polygon.gdd", pol);
    }

    getColdUnitPolygon(data, cancelToken, callBack) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        const time = SessionStore.getTime();

        const params = {
            start: data.start || time.start,
            end: data.end || time.end,
            environment: SessionStore.getEnvironment(),
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/coldunit", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: params
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: cancelToken.id, data: response.data })
                } else {
                    callBack({ id: cancelToken.id, data: null })
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    getGDDCrop(cancelToken, data, crops, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        const time = SessionStore.getTime();
        const promises = [];

        const params = {
            start: data.start || time.start,
            end: data.end || time.end,
            environment: SessionStore.getEnvironment(),
        }

        crops.forEach(crop => {
            this.axios = axios.get(LocalConfig.apiURL + "/api/data/gdd", {
                cancelToken: cancelToken.token.token.token,
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": "Bearer " + token,
                },
                params: {
                    ...params,
                    objectid: crop.objectid
                }
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

    getListCropsEnvironment(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const envId = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + envId + "/crop/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
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

const CStore = new ChillHourStore();
export default CStore;