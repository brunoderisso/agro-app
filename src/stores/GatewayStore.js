import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class GatewayStore extends EventEmitter {
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

    clear() {
        tokenList.clear();
    }

    updateGateway(gateway, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/gateway/" + gateway.mac, gateway, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("changed");
                    this.emit("update_gateway");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    };

    deleteGateway(gateway, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/gateway/" + gateway, {
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
                    this.emit("del_gateway");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    };

    addGateway(gateway, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/gateway/", gateway, {
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
                    this.emit("add_gateway");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    };

    getGateway(gateway, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/gateway/" + gateway, {
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
    };

    getGateways(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/gateway/", {
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
};

const gatewayStore = new GatewayStore();

export default gatewayStore;