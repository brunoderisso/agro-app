import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler, errorHandlerIgnoreNotFound, errorHandlerIgnoreErrorWithCallback, errorHandlerIgnoreUnauthorizedWithCallback } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";
import errorHandlerWithCallback from '../helpers/errorHandler'
import tokens from "./CancelTokenList";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class EnvironmentStore extends EventEmitter {
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

    updateEnvironment(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/environment/" + environment.objectid, environment, {
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

    deleteEnvironment(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/environment/" + environment, {
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
                    this.emit("del_environment");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    addEnvironment(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/environment/", environment, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack(response.data, "inserted");
                    this.emit("add_environment");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    };

    getEnvironment(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/environment/" + environment, {
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

    getAccountEnvironment(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment, {
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

    getEnvironments(callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/environment/", {
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

    getEnvironmentDevices(axiosToken, environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let env = environment || SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/environment/" + env + '/device/', {
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
                    callBack({ id: axiosToken.id, data: [] });
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentUsers(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/environment/" + environment + '/user/', {
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
            .catch(errorHandlerIgnoreNotFound);
    };

    associateDevice(environment, device, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/environment/" + environment + '/device/', { deveui: device }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("associate_device")
                    callBack("inserted")
                } else {
                    callBack({});
                }
            })
            .catch(errorHandlerIgnoreErrorWithCallback(callBack));
    }

    desassociateDevice(environment, deveui) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/environment/" + environment + '/device/' + deveui, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("desassociate_device");
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentZoning(axiosToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (environment === null || environment === undefined) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/zoning", {

            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
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
            .catch(errorHandlerIgnoreUnauthorizedWithCallback({ id: axiosToken.id, data: null }));
    };

    getEnvironmentAltitude(elevator, location, callBack) {
        if (elevator === null || location === null) {
            return
        }

        elevator.getElevationForLocations({
            locations: [location],
        })
            .then(({ results }) => {
                // Retrieve the first result
                if (results[0]) {
                    callBack(results[0].elevation);
                } else {
                    callBack(null);
                }
            })
            .catch((e) =>
                console.log("Erro: " + e)
            );
    }

    getEnvironmentPreferences(cancelToken, callbackFunc) {
        const env = SessionStore.getEnvironment();
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (env === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/preference", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
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

    setEnvironmentPreferences(preferences, method = "put", callBack) {
        const env = SessionStore.getEnvironment();
        const token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        if (env === null) {
            return;
        }

        this.axios = method === "put"
            ? axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/preference", preferences, {
                cancelToken: this.getNewToken().token.token.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            })
                .then(checkStatus)
                .then(response => {
                    if (typeof response.data !== undefined) {
                        callBack("OK");
                    } else {
                        callBack("ERRO");
                    }
                })
                .catch(errorHandler)
            : axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/preference", preferences, {
                cancelToken: this.getNewToken().token.token.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            })
                .then(checkStatus)
                .then(response => {
                    if (typeof response.data !== undefined) {
                        callBack("OK");
                    } else {
                        callBack("ERRO");
                    }
                })
                .catch(errorHandler);
    };

    postEnvironmentPreferences(callBack) {

        let env = SessionStore.getEnvironment();
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (env === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/preference", {}, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack(response.data);
                } else {
                    callBack("ERRO");
                }
            })
            .catch(errorHandler);
    };

    getEnvironmentAccount(environment, callBack) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack(response.data)
                } else {
                    callBack({});
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentDatas(cancelToken, callbackFunc) {
        const token = SessionStore.getToken();
        const environment = SessionStore.getEnvironment();
        const promises = [];

        if (token === null) {
            return
        }

        if (environment === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/preference", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        });
        promises.push(this.axios);

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        });
        promises.push(this.axios);

        Promise.all(promises).then((responseData) => {
            if (responseData.length > 0) {
                callbackFunc(responseData);
            } else {
                callbackFunc([]);
            }
        }).catch(errorHandlerWithCallback(callbackFunc));
    }
};

const environmentStore = new EnvironmentStore();

export default environmentStore;