import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandlerIgnoreNotFound, errorHandler } from "../helpers/helpers";
import axios from "axios";
import jwt from "jsonwebtoken";
import moment from "moment";
import history from "../history";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import poligonStore from "./PoligonStore";
import errorHandlerWithCallback from "../helpers/errorHandler";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();
class SessionStore extends EventEmitter {
    constructor(props) {
        super(props);
        this.time = {
            start: moment().subtract(24, 'hours').valueOf(),
            end: moment().valueOf(),
        };
        this.hour = 24;
        this.hours = [
            1, 6, 12, 24, 36, 168, 360, 720, 1440, 1920, 2880
        ];
        this.refresh = false;
        // TODO: remover quando tiver o novo Dashboard
        this.times = [
            { value: 0, label: "Off" },
            { value: 30000, label: "30s" },
            { value: 60000, label: "1m" },
            { value: 180000, label: "3m" }
        ]

        this.timeOptions = [
            { value: 0, label: "settings.off" },
            { value: 3000, label: "common.30seconds" },
            { value: 6000, label: "common.1minute" },
            { value: 180000, label: "common.3minutes" },
        ]

        this.timeRefresh = 0
        this.timeIntervalRef = null;

        if (this.getToken() !== null) {
            this.fetchEnvironments(() => { });
        }

        this.device = "default";
        this.verticalBar = {}
        this.view = "";
        this.forecast = false;
        this.function = "MEAN";
        this.isSelectedFunction = false;
        this.functions = [
            { value: "MEAN", label: "common.mean", description: "settings.functionDescriptionMEAN" },
            { value: "COUNT", label: "settings.functionLabelCOUNT", description: "settings.functionDescriptionCOUNT" },
            { value: "MEDIAN", label: "settings.functionLabelMEDIAN", description: "settings.functionDescriptionMEDIAN" },
            { value: "MODE", label: "settings.functionLabelMODE", description: "settings.functionDescriptionMODE" },
            { value: "SUM", label: "settings.functionLabelSUM", description: "settings.functionDescriptionSUM" },
            { value: "MAX", label: "common.maximum", description: "settings.functionDescriptionMAX" },
            { value: "MIN", label: "common.minimum", description: "settings.functionDescriptionMIN" },
            { value: "LAST", label: "common.last", description: "settings.functionDescriptionLAST" }
        ];
        this.scales = [
            { value: "default", label: "Padrão" },
            { value: "auto", label: "Auto" }
        ];
        this.scale = "default"
        this.fills = [
            { value: "none", label: "----" },
            { value: "linear", label: "Linear" },
            { value: "null", label: "Nulo" },
            { value: "previous", label: "Anterior" },
            { value: "zero", label: "Zero" }
        ];
        this.fill = "none"
        this.radiusList = [
            { value: 40000, label: '40 KM' },
            { value: 80000, label: '80 KM' },
            { value: 120000, label: '120 KM' },
            { value: 160000, label: '160 KM' },
        ]
        this.radius = this.radiusList[0].value;

        this.envDevices = this.getDevices();
    }

    setTimeRefresh(time) {
        this.timeRefresh = time;

        if (time === 0 && this.timeIntervalRef) {
            clearInterval(this.timeIntervalRef);
            this.timeIntervalRef = null;
        } else {
            if (this.timeIntervalRef) {
                clearInterval(this.timeIntervalRef);
            }

            let interval = setInterval(() => {
                this.emit('time_refresh');

            }, time);
            this.timeIntervalRef = interval;
        }
    }

    clickTimeRefresh() {
        if (this.timeIntervalRef) {
            clearInterval(this.timeIntervalRef);
        }

        if (this.timeRefresh !== 0) {
            let interval = setInterval(() => {
                this.emit('time_refresh');

            }, this.timeRefresh);

            this.timeIntervalRef = interval;
        } else {
            this.emit('time_refresh');
        }
    }

    getNewToken = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    setView(view) {
        this.view = view;
        this.emit("change_view")
    }

    setForecast(flag) {
        this.forecast = flag;
    }

    clear() {
        tokenList.clear();
    }

    setVerticalBar(prop, val) {
        this.closeAll()
        this.verticalBar[prop] = val;
        this.emit("vertical_drawer", val)
    }

    closeAll() {
        Object.keys(this.verticalBar).forEach((key) => {
            this.verticalBar[key] = false;
        })
    }

    getScales() {
        return this.scales;
    }

    getTimeDiff() {
        return this.time.end - this.time.start;
    }

    setEnvDevice() {
        this.envDevices = this.getDevices();
        this.emit("session_set_env_device");
    }

    setDevice(dev) {
        this.device = dev;
        this.emit("device.change");
    }

    setFunction(func) {
        this.function = func;
        this.emit("function.change");
    }

    setIsSelectedFunction(isSelected) {
        this.isSelectedFunction = isSelected;
        this.emit("function.selected");
    }

    setScale(scale) {
        this.scale = scale;
        this.emit("scale.change");
    }

    setFill(fill) {
        this.fill = fill;
        this.emit("fill.change");
    }

    setRadius(radius, callEvent = true) {
        this.radius = radius;

        if (callEvent) {
            this.emit("radius.change", true);
        }
    }

    getRadius() {
        return this.radius;
    }

    getHour() {
        return this.hour;
    }

    getFunction() {
        return this.function;
    }

    getOptionsFunction() {
        return this.functions;
    }

    getIsSelectedFunction() {
        return this.isSelectedFunction;
    }

    getListRadius() {
        return this.radiusList;
    }

    setWithMeta(measure) {
        const meta = measure?.meta || {}

        if (!toolsUtils.isNullOrEmpty(meta, "function") && !toolsUtils.isEmptyString(meta.function) && meta.function.toUpperCase() !== this.function.toUpperCase()) {
            this.function = meta.function.toUpperCase()
        }
        if (!toolsUtils.isNullOrEmpty(meta, "fill") && !toolsUtils.isEmptyString(meta.fill) && meta.fill.toUpperCase() !== this.fill.toUpperCase()) {
            this.fill = meta.fill
        }
        if (!toolsUtils.isNullOrEmpty(meta, "scale") && !toolsUtils.isEmptyString(meta.scale) && meta.scale.toLowerCase() !== this.scale.toLowerCase()) {
            this.scale = meta.scale.toLowerCase()
        }

        this.emit("change.meta", measure);
    }

    getDevice() {
        return this.device;
    }

    setToken(token) {
        if (token !== "") {
            localStorage.setItem("token", token);
            return true;
        }

        return false;
    }

    getToken() {
        const token = localStorage.getItem("token");

        if (token !== null) {
            const decodedToken = jwt.decode(token);

            if (decodedToken !== null) {
                const dateNow = new Date();
                if (decodedToken.Expire * 1000 < dateNow.getTime()) {
                    this.logout(() => {
                        history.push("/login");
                    });
                }
                return token;
            }
        }

        this.logout(() => {
            if (!window.location.hash.includes("active") && !window.location.hash.includes("forgot")) {
                history.push("/login");
            }
        });
        return null
    }

    getDecodedToken() {
        const token = localStorage.getItem("token");

        if (token !== null) {
            let decodedToken = jwt.decode(token);
            return decodedToken;
        }
        return null;
    }

    setTime(hours) {
        this.hour = hours;
        this.time.start = moment().subtract(hours, 'hours').valueOf();
        this.time.end = moment().valueOf();

        this.emit("time.change", hours);
    }

    setCustomTime(start, end) {
        this.time.start = moment(start).valueOf();
        this.time.end = moment(end).valueOf();

        this.emit("time.change");
    }

    forceCustomTime(start, end) {
        this.emit("time.force");
        this.time.start = moment(start).valueOf();
        this.time.end = moment(end).valueOf();
    }

    getTime() {
        return this.time;
    }

    getTimeShort() {
        return (
            {
                start: Math.floor(this.time.start / 1000),
                end: Math.floor(this.time.end / 1000)
            }
        )
    }

    setPreference(preference) {
        if (JSON.stringify(this.getPreference()) !== JSON.stringify(preference)) {
            localStorage.setItem("preference", JSON.stringify(preference));

            if (this.getEnvironment() === null || toolsUtils.isEmptyString(this.getEnvironment())) {
                this.setEnvironment(preference.environment || "");
            }

            toolsUtils.resetAllRequests();

            this.emit("environment.change", "preference");
        }
    }

    getPreference() {
        const preference = JSON.parse(localStorage.getItem("preference"));

        if (preference !== "" && preference) {
            return preference;
        }

        return null;
    }

    getEnvironment(id) {
        if (!id) {
            const environment = localStorage.getItem("environment");

            if (environment !== null && environment !== undefined) {
                return environment;
            }
        } else {
            const environments = JSON.parse(localStorage.getItem("environments"));

            if (environments !== null && environments.length > 0) {
                const env = environments.find((e) => { return e.objectid === id });
                if (env !== undefined) {
                    return env;
                }
            }
        }
        return "";
    }

    startEnvironment(environment) {
        const measures = JSON.parse(localStorage.getItem("measures")) || [];

        if (measures.filter((val) => { return val.environment === environment }).length === 0) {
            this.setEnvironmentMeasure(environment);
        } else {
            return;
        }
    }

    getEnvironmentFeatures(environment, callBackFunc) {

        const token = this.getToken();

        if (token === null) {
            return
        }

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/feature/", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (response.data) {
                    callBackFunc(response.data);
                } else {
                    callBackFunc(null);
                }
            })
            .catch(errorHandler);
    }

    setEnvironment(environment) {
        const env = this.getEnvironment()
        if (environment !== null && environment !== undefined && environment !== env) {
            localStorage.setItem("environment", environment);
            this.setDevice("default");
            this.setEnvDevice();
            this.startEnvironment(environment);
            toolsUtils.resetAllRequests();
            this.emit("environment.change", environment);
            this.storePolygons(true);
            this.storeUsers(true);
        } else {
            const envs = localStorage.getItem("environments");

            if (envs !== null && envs.length > 0) {
                const environment = localStorage.getItem("environment");
                if (environment === null && environment === undefined) {
                    localStorage.setItem("environment", JSON.parse(envs)[0].objectid)
                    this.setEnvDevice();
                    toolsUtils.resetAllRequests()
                    this.emit("environment.change", environment);
                }
            }
        }
    }

    getEnvironmentMeasures = () => {
        const environmentId = this.getEnvironment();
        const allMeasures = localStorage.getItem("measures") ? JSON.parse(localStorage.getItem("measures")) : [];
        const envMeasures = allMeasures.find(measure => measure.environment === environmentId);

        if (envMeasures) {
            return envMeasures.measures;
        }

        return [];
    }

    getDevices() {
        const environments = JSON.parse(localStorage.getItem("environments") || '[]');

        if (environments.length > 0) {
            const objectid = localStorage.getItem("environment");

            if (objectid !== '') {
                const environment = environments.find(environment => environment.objectid === objectid);

                if (environment !== null && environment !== undefined) {
                    const devices = environment.devices;

                    if (devices !== null || devices !== undefined) {
                        return devices
                    }
                }
            }
        }
        return [];
    }

    getEnvironmentMeta(measure) {
        const environments = JSON.parse(localStorage.getItem("environments") || '[]');

        if (environments.length > 0) {
            const objectid = localStorage.getItem("environment");

            if (objectid !== '') {
                const environment = environments.find(environment => environment.objectid === objectid);

                if (environment !== null) {
                    const measurements = environment.Measurements;

                    if (measurements.length > 0) {
                        const m = measurements.find(mm => mm.name === measure);

                        if (m !== null) {
                            if (m.meta !== null) {
                                return m.meta;
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    getEnvironmentDetail() {
        const environments = JSON.parse(localStorage.getItem("environments") || '[]');

        if (environments.length > 0) {
            const objectid = localStorage.getItem("environment");

            if (objectid !== '') {
                const environment = environments.find(environment => environment.objectid === objectid);
                if (environment !== null) {
                    return environment;
                }
            }
        }
        return null;
    }

    getEnvironments() {
        return JSON.parse(localStorage.getItem("environments") || '[]');
    }

    setEnvironments(environments) {
        const envs = [];

        environments.forEach(e => {
            const measurements = e.Measurements;
            const devs = [];

            if (e.devices !== null && e.devices !== undefined && measurements !== undefined) {
                e.devices.forEach(d => {
                    const device = d;
                    const deviceMeasurements = d.measurements;

                    if (deviceMeasurements !== null && deviceMeasurements !== undefined) {
                        deviceMeasurements.forEach((dm, i) => {
                            deviceMeasurements[i] = measurements.find((m) => { return m.name === dm.name });
                        });
                        device["measurements"] = deviceMeasurements;
                    }
                    devs.push(device);
                });
            }
            envs.push({ ...e, devices: devs });
        });

        localStorage.setItem("environments", JSON.stringify(envs));
        this.emit("environments.update");
    }

    updateStoredEnvironments(env) {
        let obj = localStorage.getItem("environments");

        obj = JSON.parse(obj);

        const index = obj.findIndex((e) => { return e.objectid === env.objectid });

        obj[index] = env;
        localStorage.setItem("environments", JSON.stringify(obj));
    }

    getMeasure(measure) {
        const environment = this.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        const measures = JSON.parse(localStorage.getItem("measures"));

        let medida = {};

        if (measures !== null && measures !== undefined) {
            measures.forEach((value) => {
                if (value !== null && value !== undefined && value.environment === environment) {
                    value.measures.forEach((m) => {
                        if (m.name === measure) {
                            medida = m;
                        }
                    })
                }
            });
        }

        return medida;
    }

    setMeasuresToEnvironment(measures) {
        const environment = localStorage.getItem("environment");
        const environments = JSON.parse(localStorage.getItem("environments"));
        const selectedEnvIndex = environments.findIndex(env => env.objectid === environment);

        if (selectedEnvIndex > -1) {
            environments[selectedEnvIndex].Measurements = measures;
            localStorage.setItem("environments", JSON.stringify(environments));
            this.emit("measures_get");
        }
    }

    setDevicesToEnvironment(devices) {
        const environment = localStorage.getItem("environment");
        const environments = JSON.parse(localStorage.getItem("environments"));
        const selectedEnvIndex = environments.findIndex(env => env.objectid === environment);

        if (selectedEnvIndex > -1) {
            environments[selectedEnvIndex].devices = devices;
            localStorage.setItem("environments", JSON.stringify(environments));
            this.emit("devices_get");
        }
    }

    getLanguageStore() {
        return localStorage.getItem("i18nextLng") || "";
    }

    login(login, tokenLogin, callBackFunc) {
        this.axios = axios.post(LocalConfig.apiURL + "/api/login", login, {
            cancelToken: tokenLogin.token.token.token,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof (response.data.token) !== "undefined") {
                    if (this.setToken(response.data.token)) {
                        this.fetchEnvironments(callBackFunc);
                        this.emit("change");
                        callBackFunc({ id: tokenLogin.id, data: response.data });
                    };
                };
            })
            .catch((error) => {
                callBackFunc({ id: tokenLogin.id, data: error });
            });
    }

    socialLogin(tokenLogin, callBackFunc) {
        if (this.setToken(tokenLogin)) {
            this.fetchEnvironments(callBackFunc);
            this.emit("change");
            callBackFunc({ data: "OK" });
        } else {
            this.logout(() => {
                history.push("/login");
            });
        }
    }
    
    logout(callBackFunc) {
        localStorage.clear();
        sessionStorage.clear();
        window.localStorage.clear();

        this.emit("change");

        if (typeof callBackFunc === "function") {
            callBackFunc();
        }
    }


    fetchPreference(callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/preference", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.setPreference(response.data);
                } else {
                    this.setPreference({});
                }
                this.emit("change");
            })
            .catch((error) => {
                errorHandlerIgnoreNotFound(error)
            });
    }

    fetchservices(callBackFunc) {
        const token = this.getToken();
        const environment = this.getEnvironment();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "services", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.setPreference(response.data);
                } else {
                    this.setPreference({});
                }
                this.emit("change");
            })
            .catch((error) => {
                errorHandlerIgnoreNotFound(error)
            });
    }

    fetchEnvironments(callBackFunc) {
        const token = this.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.setEnvironments(response.data);
                    this.fetchPreference(callBackFunc)
                } else {
                    this.environments = [];
                }
            })
            .catch((error) => { errorHandlerIgnoreNotFound(error) });
    }

    forgot(email, tokenForgot, callBackFunc) {
        this.axios = axios.post(LocalConfig.apiURL + "/api/forgot", email, {
            cancelToken: tokenForgot.token.token.token,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc({ id: tokenForgot.id, data: response.data });
                } else {
                    callBackFunc({ id: tokenForgot.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    updatePassword(token, password, callBackFunc) {
        if (this.setToken(token)) {
            this.axios = axios.post(LocalConfig.apiURL + "/api/account/password", password, {
                cancelToken: this.getNewToken().token.token.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            })
                .then(checkStatus)
                .then(response => {
                    if (typeof response.data !== "undefined") {
                        this.fetchEnvironments(() => { callBackFunc("sent"); })
                    } else {
                        callBackFunc("fail");
                    }
                })
                .catch(errorHandler);
        }
    }

    password(token, password, callBackFunc) {
        const tk = this.getToken();

        if (tk === null) {
            return
        }

        if (this.setToken(token)) {
            this.axios = axios.post(LocalConfig.apiURL + "/api/account/password", password, {
                cancelToken: this.getNewToken().token.token.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + tk,
                },
            })
                .then(checkStatus)
                .then(response => {
                    if (typeof response.data !== "undefined") {
                        this.fetchEnvironments(() => { callBackFunc("sent"); })
                    } else {
                        callBackFunc("fail");
                    }
                })
                .catch(errorHandler);
        }
    }

    pushPreference(preference, callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/preference", preference, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc("sent");
                } else {
                    callBackFunc("fail");
                }
            })
            .catch(errorHandler);
    }

    pushPreference_WT(axiosToken, preference, callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/preference", preference, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callBackFunc({ id: axiosToken.id, data: null });
                } else {
                    if (responseData.data !== null) {
                        if (JSON.stringify(this.getPreference()) !== JSON.stringify(preference)) {
                            localStorage.setItem("preference", JSON.stringify(Object.assign(this.getPreference(), preference)));
                            this.emit("push.preference");
                        }
                        callBackFunc({ id: axiosToken.id, data: responseData.data });
                    } else {
                        callBackFunc({ id: axiosToken.id, data: null });
                    }
                }
            })
            .catch(errorHandlerWithCallback(callBackFunc));
    }

    addPreference(axiosToken, preference, callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/preference", preference, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then((responseData) => {
                if (typeof (responseData) === "undefined") {
                    callBackFunc({ id: axiosToken.id, data: null })
                } else {
                    if (responseData.data !== null) {
                        callBackFunc({ id: axiosToken.id, data: responseData.data })
                    } else {
                        callBackFunc({ id: axiosToken.id, data: null })
                    }
                }
            })
            .catch(errorHandler);
    }

    signin(email, tokenLogin, callBackFunc) {
        this.axios = axios.post(LocalConfig.apiURL + "/api/signin", email, {
            cancelToken: tokenLogin.token.token.token,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc({ id: tokenLogin.id, data: response.data });
                } else {
                    callBackFunc({ id: tokenLogin.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    activeUser(axiosToken, token, user, callBack) {
        this.axios = axios.put(LocalConfig.apiURL + "/api/account/active", user, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: true })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getMessages(callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/message/", {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc(response.data)
                } else {
                    callBackFunc([]);
                }
            })
            .catch(errorHandler);
    }

    putMessage(message, callBackFunc) {
        const token = this.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.put(LocalConfig.apiURL + "/api/account/message/" + message.objectid, message, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc("sent");
                } else {
                    callBackFunc("fail");
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentDevices() {
        const devices = JSON.parse(localStorage.getItem("devices"));
        const environment = localStorage.getItem("environment");

        const envDevices = devices.find(dev => dev.environment === environment)?.devices;
        return envDevices || [];
    }

    deleteMessage(message, callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/message/" + message, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBackFunc("sent");
                } else {
                    callBackFunc("fail");
                }
            })
            .catch(errorHandler);
    }

    putOption(option, callBackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/optin", { optin: option }, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.fetchPreference(() => { });
                    callBackFunc("sent");
                } else {
                    callBackFunc("fail");
                }
            })
            .catch(errorHandler);
    }

    getZonings(axiosToken, callbackFunc) {
        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/zoning/", {

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
                }
            })
            .catch(errorHandler);
    }

    setEnvironmentMeasure(environment) {
        const measures = JSON.parse(localStorage.getItem("measures")) || [];
        const objMeasures = {};
        const env = this.getEnvironmentDetail(environment);

        if (env?.Measurements) {
            objMeasures.environment = environment;
            objMeasures.measures = env.Measurements;
            measures.push(objMeasures);

            localStorage.setItem("measures", JSON.stringify(measures));
            this.emit("set_measure", measures)
            return;
        }

        const token = this.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment, {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (response.data) {
                    objMeasures.environment = environment;

                    if (response.data.measures) {
                        objMeasures.measures = response.data.measures;
                        this.setMeasuresToEnvironment(response.data.measures);
                    }

                    if (response.data.devices) {
                        const devices = JSON.parse(localStorage.getItem("devices")) || [];
                        const objDevices = { environment, devices: response.data.devices };

                        devices.push(objDevices);
                        localStorage.setItem("devices", JSON.stringify(devices));
                        this.setDevicesToEnvironment(response.data.devices);
                    }

                    measures.push(objMeasures);
                    localStorage.setItem("measures", JSON.stringify(measures));
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentMeasurements(environment) {
        let env = environment;

        if (env === null || env === undefined) {
            env = this.getEnvironment()
        }

        let measures = JSON.parse(localStorage.getItem("measures"));

        if (measures !== undefined && measures !== null) {
            let m = measures.find(x => x !== null && x.environment !== null && x.environment === env);
            if (m !== undefined && m !== null) {
                return (m.measures);
            }
        }

        return ([]);
    }

    //Isso aqui remove o poligono com o respectivo ID, e atualiza a STORE
    deleteStoredPolygon(id) {
        let obj = this.getStoredPolygons();

        obj = obj.filter((p) => { return p.objectid !== id });
        localStorage.setItem("polygons", JSON.stringify(obj));

        poligonStore.emit("polygons_refresh");
    }

    updateStoredPolygon(pol) {
        const obj = this.getStoredPolygons();
        const index = obj.findIndex((p) => { return p.objectid === pol.objectid });

        obj[index] = pol;
        localStorage.setItem("polygons", JSON.stringify(obj));
    }

    getStoredPolygons() {
        return JSON.parse(localStorage.getItem("polygons"));
    }

    updateEnvironmentPolygon(pol) {
        let obj = localStorage.getItem("environments");
        obj = JSON.parse(obj);
        const id = this.getEnvironment();
        const index = obj.findIndex((e) => { return e.objectid === id });

        let env = {
            ...obj[index]
        }

        if (pol.Points) {
            env.bounds = poligonStore.arrayToString(pol.Points);
        } else {
            env.bounds = pol.bounds;
        }

        obj[index] = env;
        localStorage.setItem("environments", JSON.stringify(obj));
    }

    storePolygons(force) {
        const token = this.getToken();
        let obj = localStorage.getItem("polygons");

        if (obj !== null && obj.length > 0 && !force) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + this.getEnvironment() + "/polygon/", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    obj = response.data || [];
                    let polygons = [];
                    polygons = poligonStore.boundsToArray(obj);
                    localStorage.setItem("polygons", JSON.stringify(polygons));
                    this.emit("polygons_stored");
                }
            })
            .catch(errorHandler);
    }

    storeEnvironments() {
        const token = this.getToken();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    localStorage.setItem("environments", JSON.stringify(response.data));
                    this.emit("environments_stored");
                }
            })
            .catch(errorHandler);
    }

    getDataLocalStorage(param) {
        return JSON.parse(localStorage.getItem(param));
    }

    getEnvironmentPolygon() {
        let env = this.getEnvironmentDetail();

        if (env.bounds) {
            const pol = {
                name: env.name,
                Points: poligonStore.stringToArray(env.bounds),
                isenvironment: true,
                objectid: "environmentPolygon"
            }

            return pol;
        }
        const pols = this.getStoredPolygons();
        const pol = pols.find((p) => { return p.isenvironment === true });

        return pol;
    }

    getSelectedEnvironment() {
        const storedEnvironments = localStorage.getItem('environments');
        const storedEnvironment = localStorage.getItem('environment');
        const preference = localStorage.getItem('preference');

        if (storedEnvironments) {
            const env = JSON.parse(storedEnvironments)
            const envPref = JSON.parse(preference)

            const outputEnv = env.filter(e => e.objectid === storedEnvironment)

            const outputPref = env.filter(e => e.objectid === envPref.environment)

            if (outputEnv.length > 0) {
                return outputEnv[0]
            } else if (outputPref.length > 0) {
                return outputPref[0]
            }
        }
    }

    storeUsers(force) {
        const token = this.getToken();
        let obj = localStorage.getItem("users");

        if (obj !== null && obj.length > 0 && !force) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + this.getEnvironment() + "/user/", {
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    obj = response.data || [];
                    localStorage.setItem("users", JSON.stringify(obj));
                }
            })
            .catch(errorHandler);
    }

    emitTimer(timer) {
        this.emit("time.reload", timer);
    }
}

const sessionStore = new SessionStore();
export default sessionStore;