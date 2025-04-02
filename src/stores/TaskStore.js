import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class TaskStore extends EventEmitter {
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

    getTasks(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/note/task/", {
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

    getTask(id, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/note/task/" + id, {
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

    putTask(task, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.put(LocalConfig.apiURL + "/api/note/task/" + task.id, task, {
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

    addTask(task) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/note/task/", task, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("add_task");
                }
            })
            .catch(errorHandler);
    }

}

const taskStore = new TaskStore();

export default taskStore;