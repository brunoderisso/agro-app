import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class MetaStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

        this.functionsHelpersText = {
            count: {
                title: "count",
                content: "returnCountOfNonNullValues"
            },
            mean: {
                title: "average",
                content: "returnArithmeticMean"
            },
            median: {
                title: "median",
                content: "returnMiddleValueOfSortedList"
            },
            mode: {
                title: "mode",
                content: "returnMostFrequentValue"
            },
            sum: {
                title: "sum",
                content: "returnSumOfValues"
            },
            max: {
                title: "maximum",
                content: "returnMaximumValue"
            },
            min: {
                title: "minimum",
                content: "returnMinimumValue"
            },
            last: {
                title: "last",
                content: "returnLastFromList"
            }
        };

        this.fillsHelpersText = {
            linear: {
                title: "linear",
                content: "fillLinearInterpolation"
            },
            null: {
                title: "null",
                content: "showNullDataAsNull"
            },
            previous: {
                title: "previous",
                content: "fillNullDataWithLastNonNullValue"
            },
            zero: {
                title: "zero",
                content: "fillNullDataWithZero"
            },
        }

        this.scalesHelpersText = {
            auto: {
                title: "automatic",
                content: "setXAxisMin"
            },
            default: {
                title: "default",
                content: "setXAxisZero"
            }
        }

        this.devicesHelpersText = {
            devices: {
                title: "devices",
                content: "listOfAllRegisteredDevices"
            }
        }

        this.measuresHelpersText = {
            measures: {
                title: "measurements",
                content: "listOfAllAvailableMeasurements"
            }
        }
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

    updateMeta(meta, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/meta/" + meta.objectid, meta, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("changed")
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    deleteMeta(meta, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/meta/" + meta, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("deleted");
                    this.emit("del_meta");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    addMeta(meta, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/meta/", meta, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("inserted");
                    this.emit("add_meta");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    getMeta(meta, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/meta/" + meta, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack(response.data)
                } else {
                    callBack({});
                }
            })
            .catch(errorHandler);
    }

    getMetas(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/meta/", {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack(response.data)
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }
}

const metaStore = new MetaStore();

export default metaStore;