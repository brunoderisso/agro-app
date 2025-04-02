import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class DatasetTableStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

        this.selectedType = "";

    };

    getNewToken = () =>{
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    clear() {
        tokenList.clear();
    }

    updateTableRow(row, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/dataset/" + row.objectid, row, {
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
    };

    deleteTableRow(row, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.delete(LocalConfig.apiURL + "/api/dataset/" + row, {
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
                    this.emit("del_table_line");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    addTableRow(type, row, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/dataset/?type=" + type, row, {
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
                    this.emit("add_table_line");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    };

    getRow(type, row, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/dataset/?type=" + type + "/" + row, {
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

    getRows(type, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/dataset/?type=" + type, {
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
    };

    train(type, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        
        this.axios = axios.post(LocalConfig.apiURL + "/api/datasets", type, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("trained");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

};

const datasetTableStore = new DatasetTableStore();

export default datasetTableStore;