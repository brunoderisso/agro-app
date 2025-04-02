import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class LoraStore extends EventEmitter {
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

    clear() {
        tokenList.clear();
    }

    updateLoraDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.put(LocalConfig.apiURL + "/api/lora/device/" + device, { deveui: device }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.activeDeviceLora(device, () => {
                        callBack("changed")
                    })

                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    deleteLoraDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/lora/device/" + device, {
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
                    this.emit("del_lora_device");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    addLoraDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/device/" + device, { deveui: device }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.activeDeviceLora(device, () => {
                        callBack("inserted");
                    })
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    getLoraDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/lora/device/" + device, {
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

    activeDeviceLora(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/device/" + device + "/active", { deveui: device }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack("actived");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    updateLoraOrganization(organization, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.put(LocalConfig.apiURL + "/api/lora/organization/" + organization.objectid, organization, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack(response.data)
                } else {
                    callBack(null);
                }
            })
            .catch(errorHandler);
    }

    addLoraOrganization(organization, addLoraToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/organization/" + organization.objectid, organization, {
            cancelToken: addLoraToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: addLoraToken.id, data: response.data })
                } else {
                    callBack({ id: addLoraToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    deleteLoraOrganization(organization, delLoraToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/lora/organization/" + organization, {
            cancelToken: delLoraToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: delLoraToken.id, data: "deleted" });
                } else {
                    callBack({ id: delLoraToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

}

const loraStore = new LoraStore();

export default loraStore;