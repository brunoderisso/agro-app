import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler, errorHandlerIgnoreNotFoundWithCallback } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class UserStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

        this.setUserEnvironment = this.setUserEnvironment.bind(this);
        this.deleteUserEnvironment = this.deleteUserEnvironment.bind(this);
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

    updateUser(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/user/" + user.uuid, user, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("update_user");
                    callBack({ id: axiosToken.id, data: user })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    deleteUser(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/user/" + user, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: user })
                    this.emit("del_user");
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    addUser(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/user/", user, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data })
                    this.emit("add_user");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getUser(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/user/" + user, {
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

    getUsers(axiosToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/user/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callbackFunc({ id: axiosToken.id, data: response.data })
                } else {
                    callbackFunc({ id: axiosToken.id, data: null });
                }
            })

            .catch(errorHandlerWithCallback(callbackFunc));
    }

    setUserEnvironment(environment, uuid, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/environment/" + environment + "/user/", { uuid: uuid }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("associate_user");
                    callBack("inserted");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    updateUserEnvironment(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        const env = SessionStore.getEnvironment()

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/environment/" + env + "/user/" + user.uuid, user, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: user })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentUsers(cancelToken, environment, callbackFunc) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/", {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    setUserEmailEnvironment(cancelToken, environment, email, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/", { to: email }, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((responseData) => {
                if (!responseData) {
                    callbackFunc(null);
                } else {
                    if (responseData.data !== null) {
                        callbackFunc({ id: cancelToken.id, data: responseData.data });
                    } else {
                        callbackFunc(null);
                    }
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    }

    deleteUserPreference(user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/preference/" + user, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                this.deleteUserEnvironment(user, callBack);
            })
            .catch(() => { this.deleteUserEnvironment(user, callBack) });
    }

    deleteUserEnvironment(axiosToken, environment, uuid, callBack) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/environment/" + environment + "/user/" + uuid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("desassociate_user");
                    callBack({ id: axiosToken.id, data: response.data });
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    deleteUserEnvironmentAccount(axiosToken, environment, uuid, callBack) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/" + uuid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data });
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    updateUserEnvironmentAccount(axiosToken, environment, uuid, body, callBack) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/" + uuid, body, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data });
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    getUserPreference(axiosToken, user, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/preference/" + user, {
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
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { }))
    }


    addUserPreference(axiosToken, user, preference, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/preference/" + user, preference, {
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
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { }))
    }


    updateUserPreference(axiosToken, user, preference, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/preference/" + user, preference, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: preference })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack("notfound") }))
    }

    setNewPassword(axiosToken, password, callBackFunc) {
        let tk = this.getToken();
        if (tk === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/password", password, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + tk,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc({ id: axiosToken.id, data: password })
                } else {
                    callBackFunc({ id: axiosToken.id, data: null })
                };
            })
            .catch(errorHandler);
    }

    setShareLink(cancelToken, environment, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + "/share", null, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then(response => {
            if (typeof response.data !== "undefined") {
                callbackFunc({ id: cancelToken.id, data: response.data });
            } else {
                callbackFunc({ id: cancelToken.id, data: null });
            }
        })
        .catch(errorHandlerWithCallback(callbackFunc));
    }

    setShareAccount(cancelToken, hash, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/share/" + hash, null, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then(response => {
            if (typeof response.data !== "undefined") {
                callbackFunc({ id: cancelToken.id, data: response.data });
            } else {
                callbackFunc({ id: cancelToken.id, data: null });
            }
        })
        .catch(errorHandlerWithCallback(callbackFunc));
    }

    inviteUser(cancelToken, email, callbackFunc) {
        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/invite", { to: email }, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then(response => {
            if (typeof response.data !== "undefined") {
                callbackFunc({ id: cancelToken.id, data: response.data });
            } else {
                callbackFunc({ id: cancelToken.id, data: null });
            }
        })
        .catch(errorHandlerWithCallback(callbackFunc));
    }
}

const userStore = new UserStore();

export default userStore;
