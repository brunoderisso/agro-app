import axios from "axios";
import { EventEmitter } from "events";

import { LocalConfig } from "../LocalConfig"
import SessionStore from "./SessionStore";
import toolsUtils from "../utils/toolsUtils";
import tokens from "./CancelTokenList";
import { checkStatus, errorHandler } from "../helpers/helpers";
import errorHandlerWithCallback from '../helpers/errorHandler'

const tokenList = new tokens();

class ImageStore extends EventEmitter {
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

    getImage(objectid, callbackFunc) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/media/image/" + objectid, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc({});
            }
        })
        .catch(errorHandler);
    }

    putImage(image, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/media/image/" + image.objectid, image, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc(null);
            }
        })
        .catch(errorHandler);
    }

    getEnvironmentImages(callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/media/image/environment/" + environment, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc({});
            }
        })
        .catch(errorHandler);
    }

    getPolygonImages(objectid, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/media/image/polygon/" + objectid, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc(null);
            }
        })
        .catch(errorHandler);
    }

    addEnvironmentImage(image, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let img = {
            environmentobjectid: environment,
            data: image
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/media/image/", img, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc({});
            }
        })
        .catch(errorHandlerWithCallback(callbackFunc));
    }

    addPolygonImage(image, objectid, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        let img = {
            environmentobjectid: environment,
            polygonobjectid: objectid,
            data: image
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/media/image/", img, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
        .then(checkStatus)
        .then((responseData) => {
            if (responseData.data !== null) {
                callbackFunc(responseData.data);
            } else {
                callbackFunc(null);
            }
        })
        .catch(errorHandlerWithCallback(callbackFunc));
    }

    async addtoClassify(image, callback) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let img = {
            objectid: image
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/media/classify/", img, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
        .then(checkStatus)
        .then((response) => {
            callback(response.data)
        })
        .catch(errorHandler);
    }

    deleteImage(image, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/media/image/" + image, {
            cancelToken: this.getNewToken().token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
        .then(checkStatus)
        .then(response => {
            if (typeof response.data !== "undefined") {
                callbackFunc("sent", image);
            } else {
                callbackFunc("fail");
            };
        })
        .catch(errorHandler);
    };
};

const imageStore = new ImageStore();

export default imageStore;