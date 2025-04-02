import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";
import tokens from "./CancelTokenList";


EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class DatasetStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;

    };

    getNewToken = () =>{
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
      }

    cancel() {
       tokenList.clear();
    }

    restart() {
        tokenList.clear();
    }

    getDatasets(callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/datasets", {
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



};

const datasetStore = new DatasetStore();

export default datasetStore;