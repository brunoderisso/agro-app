import axios from "axios";
import { EventEmitter } from "events";

import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler, errorHandlerIgnoreNotFoundWithCallback } from "../helpers/helpers";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";
import sessionStore from "../stores/SessionStore";


EventEmitter.EventEmitter.defaultMaxListeners = 10;

const gradient = [
    { "indice": 0.00, "hex": "#0000CD", "r": 0, "g": 128, "b": 0, "a": 1 },
    { "indice": 0.05, "hex": "#0000FF", "r": 0, "g": 0, "b": 255, "a": 1 },
    { "indice": 0.10, "hex": "#1E90FF", "r": 30, "g": 144, "b": 255, "a": 1 },
    { "indice": 0.20, "hex": "#00BFFF", "r": 0, "g": 191, "b": 255, "a": 1 },
    { "indice": 0.30, "hex": "#32CD32", "r": 50, "g": 205, "b": 50, "a": 1 },
    { "indice": 0.40, "hex": "#00FF00", "r": 0, "g": 255, "b": 0, "a": 1 },
    { "indice": 0.50, "hex": "#7FFF00", "r": 127, "g": 255, "b": 0, "a": 1 },
    { "indice": 0.60, "hex": "#ADFF2F", "r": 173, "g": 255, "b": 47, "a": 1 },
    { "indice": 0.70, "hex": "#FFFF00", "r": 255, "g": 255, "b": 0, "a": 1 },
    { "indice": 0.80, "hex": "#FFA500", "r": 255, "g": 165, "b": 0, "a": 1 },
    { "indice": 0.90, "hex": "#FF8C00", "r": 255, "g": 140, "b": 0, "a": 1 },
    { "indice": 0.95, "hex": "#FF4500", "r": 255, "g": 69, "b": 0, "a": 1 },
    { "indice": 1.00, "hex": "#FF0000", "r": 255, "g": 0, "b": 0, "a": 1 }
];

const blur = 0.6;
const radius = 125;

const tokenList = new tokens();

class MeasureStore extends EventEmitter {

    constructor() {
        super();

        this.requestCont = 0;
        this.measure = null;
        this.measuresList = [];
        this.measures = ["all"];
    }

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    increment() {
        this.requestCont++;
    }
    initIncrement() {
        this.requestCont = 0;
    }

    init(view) {
        //Se dashboard ver o ambiente
        if (view === "dashboard" || view === "chart") {
            this.measures = ["all"];
            this.emit("measure_init");
            return;
        }

        //Se chart ver todos
        if (view === "heatmap" || view === "report") {
            const preference = SessionStore.getPreference();
            const envMeasures = SessionStore.getEnvironmentMeasures();

            let f = undefined;

            if (envMeasures) {
                f = envMeasures.find((e) => {
                    return e.name === preference.measure
                })
            }

            if (f === undefined) {
                if (!envMeasures || envMeasures?.length === 0) {
                    return;
                }
                preference.measure = envMeasures[0].name;
            }

            if (!toolsUtils.isNullOrEmpty(preference, "measure")) {
                this.measures = [preference.measure];
                this.emit("measure_init");
                return;
            }

            const measurements = this.getMeasures();
            if (measurements.length > 0) {
                this.measures = [measurements[0].name];
                this.emit("measure_init");
                return;
            }

            this.measures = [];
            this.emit("measure_init");
        }

    }

    initEnvironmentMeasures() {
        this.measuresList = this.getMeasuresStore();
    }

    clear() {
        tokenList.clear();
    }

    getGradientColor(measure, data) {
        if (data?.indice) {
            let gradient = this.getGradient(measure);

            if (gradient) {
                let keys = Object.keys(gradient).map((v) => { return parseFloat(v) })
                let values = Object.values(gradient);
                let indice = parseFloat(data.indice);
                var afterBefore = [];
                let push = true;
                keys.forEach((_, index) => {

                    if (indice >= keys[index] && indice <= keys[index + 1]) {
                        if (push) {
                            let percent = (indice * 100 / keys[index + 1]).toFixed(0);
                            afterBefore.push({ index: keys[index], color: values[index], percent: 100 - percent });
                            afterBefore.push({ index: keys[index + 1], color: values[index + 1], percent: percent });
                            push = false;
                        }

                    }
                })

                if (afterBefore.length > 0) {
                    return afterBefore;
                }
            }
        }
        return [];
    }

    //Não pode ser no index 0, tem que ser do ambiente atual.
    getMeasuresStore() {
        const measuresStore = JSON.parse(localStorage.getItem("measures"));
        const environment = SessionStore.getEnvironment();
        let measures = null;
        measuresStore.forEach(element => {
            if (element.environment === environment) {
                measures = element.measures;
            }
        });

        return measures;
    }

    getMeasureUnity(measure) {
        const envId = localStorage.getItem("environment");
        const measuresData = JSON.parse(localStorage.getItem("measures") || "[]");

        // Encontra o ambiente correto
        const environment = measuresData.find(env => env.environment === envId);
        if (!environment) return null;

        // Busca a medida especificada dentro do ambiente
        const legend = environment.measures.find(m => m.name === measure);
        return legend ? legend.meta.ylegend : null;
    }


    // TODO: remover e usar o getMeasuresStore() no lugar
    getMeasures() {
        let env = localStorage.getItem("environment");
        let environments = JSON.parse(localStorage.getItem("environments"));

        if (env !== null && env !== "") {
            environments = environments.find(environment => environment.objectid === env);

            if (
                environments !== null && environments !== undefined && environments.Measurements !== null &&
                environments.Measurements !== undefined
            ) {
                environments = environments.Measurements;

                if (environments !== null && environments !== undefined) {
                    environments.sort((a, b) => {
                        if (a.meta?.title < b.meta?.title) {
                            return -1;
                        }
                        if (a.meta?.title > b.meta?.title) {
                            return 1;
                        }
                        return 0;
                    })

                    const uniqueItems = new Set();
                    const outputItems = [];

                    environments.forEach(item => {
                        if (!uniqueItems.has(item.name)) {
                            uniqueItems.add(item.name);
                            outputItems.push(item);
                        }
                    });

                    return outputItems;
                }
            }
        }
        return [];
    }

    alphabeticalSortMeasures(data, measuresBase) {
        if (!data.environment?.measure) {
            return data;
        }

        const originalMeasures = [...data.environment.measure];
        const positions = [];

        data.environment.measure.forEach(item => {
            positions.push(measuresBase.findIndex(measure => measure.name === item.measure));
        });

        positions.forEach((pos, index) => {
            data.environment.measure.splice(pos, 1, originalMeasures[index]);
        })

        return data;
    }

    getGradient(measure) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);
            if (m !== null && m !== undefined && m.Measurements !== null && m.Measurements !== undefined) {
                m = m.Measurements.find(x => x.name === measure);
                if (m !== null && m !== undefined) {
                    let g = m.meta;
                    if (g !== null && g !== undefined) {
                        if (g.gradient !== "") {
                            return JSON.parse(g.gradient);
                        }
                    }
                }
            }
        }
        return gradient;
    }

    getNewGradient(measure) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);
            if (m !== null && m !== undefined && m.Measurements !== null && m.Measurements !== undefined) {
                m = m.Measurements.find(x => x.name === measure);
                if (m !== null && m !== undefined) {
                    let g = m.gradient;
                    if (g !== null && g !== undefined) {
                        if (g.gradient !== null && g.gradient.length > 0) {
                            return g.gradient;
                        }
                    }
                }
            }
        }
        return gradient;
    }

    removeListeners() {
        this.removeAllListeners();
    }

    getMeasureDetail(measure) {
        let env = localStorage.getItem("environment");
        let environments = JSON.parse(localStorage.getItem("environments"));

        if (env !== null && env !== "") {
            environments = environments.find(environment => environment.objectid === env);

            if (
                environments !== null && environments !== undefined && environments.Measurements !== null &&
                environments.Measurements !== undefined
            ) {
                environments = environments.Measurements.find(measu => measu.name === measure);

                if (environments !== null && environments !== undefined) {

                    return environments;
                }
            }
        }
        return null;
    }

    getBlur(measure) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);
            if (m !== null && m !== undefined && m.Measurements !== null && m.Measurements !== undefined) {
                m = m.Measurements.find(x => x.name === measure);
                if (m !== null && m !== undefined) {
                    let b = m.meta;
                    if (b !== null && b !== undefined) {
                        if (b.blur !== "") {
                            return Number(b.blur);
                        }
                    }
                }
            }
        }
        return blur;
    }

    getRadius(measure) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);
            if (m !== null && m !== undefined && m.Measurements !== null && m.Measurements !== undefined) {
                m = m.Measurements.find(x => x.name === measure);
                if (m !== null && m !== undefined) {
                    let r = m.meta;
                    if (r !== null && r !== undefined) {
                        if (r.radius !== "") {
                            return Number(r.radius);
                        }
                    }
                }
            }
        }
        return radius;
    }

    getNewRadius(measure) {
        let env = localStorage.getItem("environment");
        let m = JSON.parse(localStorage.getItem("environments"));
        if (env !== null && env !== "") {
            m = m.find(x => x.objectid === env);
            if (m !== null && m !== undefined && m.Measurements !== null && m.Measurements !== undefined) {
                m = m.Measurements.find(x => x.name === measure);
                if (m !== null && m !== undefined && m.gradient !== null) {
                    return m.gradient.radius || radius;
                }
            }
        }
        return radius;
    }

    setDefaultMeasure() {
        let p = SessionStore.getPreference();

        if (!toolsUtils.isNullOrEmpty(p, "measure") && !toolsUtils.isEmptyString(p.measure)) {
            this.measure = p.measure;
            this.measures = [p.measure]
            this.emit("change.measure");

            return p.measure;
        }

        let envMeasures = this.getEnvironmentMeasurements();

        if (envMeasures !== null && envMeasures !== undefined && envMeasures.length > 0) {
            this.measure = envMeasures[0].name;
            this.measures = [envMeasures[0].name]
            this.emit("change.measure");

            return envMeasures[0].name;
        }
    }

    getMeasure() {
        if (this.measure === null) {
            return "all"
        }
        return this.measure;
    }


    checkMeasure(measure) {
        // Extrai os nomes das medidas da lista de objetos measuresList
        const measureNames = this.measuresList.map((m) => m.name);

        if (measure === "all") {
            if (this.measures.includes("all")) {
                // Se "all" já está selecionado, desmarca todas as medidas
                this.measures = [];
            } else {
                // Marca "all" e todas as medidas individuais
                this.measures = ["all", ...measureNames];
            }
            this.emit("change_measure");
            return;
        }

        // Comportamento ao clicar em uma medida específica
        if (this.measures.includes("all")) {
            // Remove "all" e a medida específica, mantendo o restante marcado
            this.measures = measureNames.filter((m) => m !== measure);
        } else {
            if (this.measures.includes(measure)) {
                // Remove a medida se já estiver marcada
                this.measures = this.measures.filter((m) => m !== measure);
            } else {
                // Adiciona a medida ao array
                this.measures.push(measure);

                // Se todas as medidas forem marcadas individualmente, adiciona "all"
                if (this.measures.length === measureNames.length) {
                    this.measures = ["all", ...measureNames];
                }
            }
        }

        this.emit("change_measure");
    }

    setMeasure(measure) {
        if (SessionStore.view === "heatmap" || SessionStore.view === "report") {
            this.measures = [measure]
            this.emit("change.measure");

            return;
        }

        if (this.measures.includes(measure)) {

            if (measure === "all") {
                this.measures = [];
                this.emit("change.measure");

                return;
            }

            this.measures = this.measures.filter((m) => { return m !== measure })
            this.emit("change.measure");

            return;
        }

        if (this.measures.includes("all")) {
            this.measures = this.measures.filter((m) => { return m !== "all" });
        }

        this.measures.push(measure);
        this.emit("change.measure");
    }

    checkSelectedMeasure() {
        const environment = SessionStore.getEnvironmentDetail();
        const checkedMeasure = environment.Measurements?.find(measure => measure.name === sessionStore.getPreference()?.measure);

        if (checkedMeasure) {
            return true;
        } else {
            return false;
        }
    }

    /*
      Retorna um array com as medidas de um determinado dispositivo.
    */
    getDeviceMeasure(axiosToken, device, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return;
        }

        let env = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(env)) {
            return;
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/measure/device/" + device, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: env
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (responseData.data?.length > 0) {
                    let result = [];
                    responseData.data.forEach((value) => {
                        if (!value.name.includes("_")) {
                            result.push(value);
                        }
                    })

                    callbackFunc({ id: axiosToken.id, data: result });
                } else {
                    callbackFunc({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(callbackFunc));
    }

    /*
      env - objectid do ambiente
      Retorna um array com as medidas de um determinado ambiente.
    */
    getDeviceBatteryLevel(device, deviceToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        let env = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/_BatteryLevel", {
            cancelToken: deviceToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                device: device,
                environment: env
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (responseData.data !== null) {
                    callbackFunc({ id: deviceToken.id, data: responseData.data });
                } else {
                    callbackFunc({});
                }
            })
            .catch(errorHandler);
    }

    getMeasureValue(measure, cancelToken, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        let env = SessionStore.getEnvironment();
        if (toolsUtils.isEmptyString(env)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + measure, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: env
            }
        })
            .then(checkStatus)
            .then((responseData) => {
                if (responseData.data !== null) {
                    callbackFunc({ id: cancelToken.id, data: responseData.data });
                } else {
                    callbackFunc({});
                }
            })
            .catch(errorHandler);
    }

    getEnvironmentMeasurements(env, callbackFunc) {
        if (typeof env !== 'function') {
            let environment = env;
            if (environment === "" || environment === null || environment === undefined) {
                environment = SessionStore.getEnvironment();
            }
            if (toolsUtils.isEmptyString(environment)) {
                return
            }

            if (environment !== null && environment !== "" && environment !== undefined) {
                let token = SessionStore.getToken();
                if (token === null) {
                    return
                }
                this.axios = axios.get(LocalConfig.apiURL + "/api/measure/environment/" + environment, {
                    cancelToken: this.getNewToken().token.token.token,
                    headers: {
                        "Content-Type": "text/plain",
                        "Authorization": "Bearer " + token,
                    },
                })
                    .then(checkStatus)
                    .then((responseData) => {
                        if (responseData.data !== null) {
                            let result = [];
                            responseData.data.forEach((value) => {
                                if (!value.name.includes("_")) {
                                    result.push(value);
                                }
                            })
                            callbackFunc(result);
                        } else {
                            callbackFunc([]);
                        }
                    })
                    .catch(errorHandler);
            }
        }
    }
}

const measureStore = new MeasureStore();
export default measureStore;
