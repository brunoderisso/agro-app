import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import AdvancedConfigurationStore from "./AdvancedConfigurationStore";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class DashboardStore extends EventEmitter {
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

    getDashboardDataOld(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let params = {
            function: SessionStore.function || "MEAN",
            fill: SessionStore.fill || "none"
        }

        if (!toolsUtils.isEmptyString(environment)) {
            this.axios = axios.get(LocalConfig.apiURL + "/api/data/dashboard/" + environment, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer " + token,
                },
                params
            })
                .then(checkStatus)
                .then(response => {
                    axios.isCancel(response)
                    if (typeof response.data !== "undefined") {
                        callBack(response.data)
                    } else {
                        callBack({});
                    }
                })
                .catch(errorHandler);
        }
    };

    getDashboardData(environmentId, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = environmentId;
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let func = AdvancedConfigurationStore.function;


        let params = {
            environment,
            function: func
        }

        if (!toolsUtils.isEmptyString(environment)) {
            this.axios = axios.get(LocalConfig.apiURL + "/api/data/dashboard", {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Bearer " + token,
                },
                params
            })
                .then(checkStatus)
                .then(response => {
                    axios.isCancel(response)
                    if (typeof response.data !== "undefined") {
                        callBack(response.data)
                    } else {
                        callBack({});
                    }
                })
                .catch(errorHandler);
        }
    };

    getDashboardDevice(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        if (!toolsUtils.isEmptyString(environment)) {
            this.axios = axios.get(LocalConfig.apiURL + "/api/data/dashboard/" + environment + "/device", {
                cancelToken: this.getNewToken().token.token.token,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
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
    }
};

const dashboardStore = new DashboardStore();

export default dashboardStore;