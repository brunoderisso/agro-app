import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler, errorHandlerIgnoreNotFoundWithCallback } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import MeasureStore from "../stores/MeasureStore";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class DeviceStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;
        this.devices = ["environment"];

    };

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    //Reinicia na troca de views
    init(view) {
        //Se dashboard ver o ambiente
        if (view === "dashboard" || view === "chillhour") {
            if (this.devices.length > 0 || !this.devices.includes("environment")) {
                this.devices = ["environment"];
                this.emit("device_init");
            }
            return
        };

        //Se chart ver todos
        if (view === "chart") {
            if (!this.devices.includes("all")) {
                this.devices.push("all");
            }
            this.emit("device_init");
            return
        };

    };

    clear() {
        tokenList.clear();
    }

    removeListeners() {
        this.removeAllListeners();
    }

    getDeviceDetail(device) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);

            if (m !== null && m !== undefined && m.devices !== null && m.devices !== undefined) {
                m = m.devices.find(x => x.deveui === device);
                if (m !== null && m !== undefined) {
                    return m;
                };
            };
        };
        return null;
    };

    getAllDevices() {
        const environment = localStorage.getItem("environment");
        let environments = JSON.parse(localStorage.getItem("environments"));
        if (environment !== null && environment !== "") {
            environments = environments.find(x => x.objectid === environment);

            if (environments?.devices) {
                return environments.devices;
            };
        };
        return [];
    };

    clearEnvironment() {
        if (this.devices.includes("environment")) {
            this.devices = ["all"]
            this.emit("change.device");
        }
    }

    setDevice(device) {
        //Se for setado o método environment
        if (device === "environment") {
            this.devices = ["environment"];
            this.emit("change.device");
            return
        }

        //Exclusão de device da seleção
        if (this.devices.includes(device)) {

            if (device === "all") {
                this.devices = [];
                this.emit("change.device");
                return
            };

            this.devices = this.devices.filter((d) => { return d !== device })
            this.emit("change.device");
            return
        }

        //Exclusão dos valores environment e all
        if (this.devices.includes("environment") || this.devices.includes("all")) {
            this.devices = this.devices.filter((d) => { return d !== "environment" && d !== "all" })
        }

        //Adição de device na seleção
        if (SessionStore.view === "chillhour") {
            this.devices = [device];
            this.emit("change.device");
            return
        }

        this.devices.push(device);
        this.emit("change.device");
    };

    updateDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/device/" + device.deveui, device, {
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

    deleteDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/device/" + device, {
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
                    this.emit("del_device");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    }

    addDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/device/", device, {
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
                    this.emit("add_device");
                } else {
                    callBack([]);
                }
            })
            .catch(errorHandler);
    };

    getDevice(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/device/" + device, {
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

    getDevices(axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/device/", {
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
    };

    getMachinesData(axiosToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        const environment = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/machine", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params:{
                environment: environment
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callbackFunc({ id: axiosToken.id, data: response.data })
                } else {
                    callbackFunc({ id: axiosToken.id, data: [] });
                }
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    };

    getMachines(axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        const environment = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/machine/", {
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
    };

    getLoraInformation(device, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

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
    };

    getDeviceMeasure(device, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();
        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + MeasureStore.measures[0], {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                function: SessionStore.function,
                fill: SessionStore.fill,
                device: device,
                start: time.start,
                end: time.end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) !== "undefined" && responseData.data !== null) {
                    callbackFunc({ device: device, data: responseData.data });
                    return
                }
                callbackFunc({ device: device, data: null });
            })
            .catch(errorHandler);
    };

    getLimitControl(device, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/daynight/" + MeasureStore.measures[0], {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                function: "MODE",
                fill: SessionStore.fill,
                group: SessionStore.group,
                device: device,
                start: time.start,
                end: time.end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) !== "undefined" && responseData.data !== null) {
                    callbackFunc({ id: cancelToken.id, data: responseData.data });
                    return
                }
                callbackFunc({ id: cancelToken.id, data: null });
            })
            .catch(errorHandler);
    }

    sortFunction = (a, b) => {
        if (toolsUtils.getDeviceName(a) > toolsUtils.getDeviceName(b)) {
            return 1;
        }
        if (toolsUtils.getDeviceName(a) < toolsUtils.getDeviceName(b)) {
            return -1;
        }
        return 0;
    }

    getDeviceMeasureStats(deveui, latLng, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();
        const measure = SessionStore.getPreference()?.measure || ''

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + measure, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                function: SessionStore.getFunction(),
                fill: SessionStore.fill,
                device: deveui,
                start: time.start,
                end: time.end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) !== "undefined" && responseData.data !== null) {
                    callbackFunc({ deveui: deveui, data: responseData.data, coord: latLng });
                    return
                }
                callbackFunc({ deveui: deveui, data: null });
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    };

    getMeasureStats(deveui, measure, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + measure, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                function: SessionStore.function,
                fill: SessionStore.fill,
                device: deveui,
                start: time.start,
                end: time.end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) !== "undefined" && responseData.data !== null) {
                    callbackFunc({ deveui: deveui, data: responseData.data, measure: measure });
                    return
                }
                callbackFunc({ deveui: deveui, data: null });
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(callbackFunc));
    };

    getDeviceMeasurel(device, latLng, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        let environment = SessionStore.getEnvironment()
        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let time = SessionStore.getTime();
        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + MeasureStore.measures[0], {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment,
                function: SessionStore.function,
                fill: SessionStore.fill,
                device: device,
                start: time.start,
                end: time.end,
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) !== "undefined" && responseData.data !== null) {
                    callbackFunc({ device: device, data: responseData.data, coord: latLng });
                    return
                }
                callbackFunc({ device: device, data: null });
            })
            .catch(errorHandlerWithCallback(callbackFunc));
    };

};

const deviceStore = new DeviceStore();

export default deviceStore;