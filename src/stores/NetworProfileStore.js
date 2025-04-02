import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "./SessionStore";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class NetworkProfileStore extends EventEmitter {

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    getNetworkServers(axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/networkserver/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - string - objectid do perfil da rede
    getNetworkServer(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/networkserver/" + network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - object - novo alarme
    addNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/networkserver/", network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                    this.emit("add_network");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - object - novo alarme
    updateNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/networkserver/" + network.ObjectID, network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: network })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - string - objectid do alarme
    deleteNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/networkserver/" + network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: network })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }


    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    getLoraNetworkServers(axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/lora/networkserver/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - string - objectid do perfil da rede
    getLoraNetworkServer(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/lora/networkserver/" + network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - object - novo alarme
    addLoraNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/networkserver/" + network.ObjectID, network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                    this.emit("add_network");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - object - novo alarme
    updateLoraNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/lora/networkserver/" + network.ObjectID, network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: network })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //network - string - objectid do alarme
    deleteLoraNetwork(network, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/lora/networkserver/" + network, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: network })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

}


const networkServerStore = new NetworkProfileStore();

export default networkServerStore;