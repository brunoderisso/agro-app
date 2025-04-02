import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import LoraStore from "../stores/LoraStore";
import tokens from "./CancelTokenList";
import toolsUtils from "../utils/toolsUtils"


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class OrganizationStore extends EventEmitter {
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

    getOrganization(id, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/" + id, {
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
                    callBack(null);
                }
            })
            .catch(errorHandler);
    }

    getOrganizations(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/", {
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

    addOrganization(organization, tokenOrganization, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/organization/", organization, {
            cancelToken: tokenOrganization.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: tokenOrganization.id, data: response.data });
                } else {
                    callBack({ id: tokenOrganization.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    updateOrganization(organization, updateToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/organization/" + organization.objectid, organization, {
            cancelToken: updateToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    if (!toolsUtils.isNullOrEmpty(organization, "organizationID")) {
                        LoraStore.updateLoraOrganization(organization, () => {
                            callBack({ id: updateToken.id, data: "updated" })
                        })
                    }
                    callBack({ id: updateToken.id, data: "updated" })
                } else {
                    callBack({ id: updateToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    deleteOrganization(organization, deleteToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/organization/" + organization, {
            cancelToken: deleteToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: deleteToken.id, data: "deleted" });
                } else {
                    callBack({ id: deleteToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

}
const organizationStore = new OrganizationStore();
export default organizationStore;