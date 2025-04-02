import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "./SessionStore";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class ArticleStore extends EventEmitter {

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    getArticles(axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/article/", {
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
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    getArticle(article, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/article/" + article, {
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
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - object - novo artigo
    addArticle(article, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/article/", article, {
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
                    this.emit("add_article");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - object - alarme alterado
    updateArticle(article, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/article/" + article.objectid, article, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: article })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    deleteArticle(article, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/article/" + article, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: article })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    getArticlesImages(article, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/article/" + article + "/image/", {
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
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - string - objectid da imagem
    getArticleImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/article/" + article + "/image/" + image, {
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
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - object - nova imagem
    addArticleImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/article/" + article + "/image/", image, {
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
                    this.emit("add_article_image");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - object - imagem alterada
    updateArticleImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/article/" + article + "/image/", image, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: image })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - string - objectid da imagem
    deleteArticleImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/article/" + article + "/image/" + image, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: image })
                    this.emit("del_article_image", image);
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - object - nova imagem
    addArticleMediaImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/media/article/" + article + "/image/", image, {
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
    };

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    //article - string - objectid do artigo
    //image - string - objectid da imagem
    deleteArticleMediaImage(article, image, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/media/article/" + article + "/image/" + image, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: image })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

}


const articleStore = new ArticleStore();

export default articleStore;