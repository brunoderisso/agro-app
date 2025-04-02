import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import {
    checkStatus,
    errorHandler,
    errorHandlerIgnoreNotFoundWithCallback,
    errorHandlerIgnoreNotFoundAndUnauthorizedWithCallback,
    errorHandlerIgnoreNotFound
} from "../helpers/helpers";
import SessionStore from "./SessionStore";
import errorHandlerWithCallback from '../helpers/errorHandler'

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class NoteStore extends EventEmitter {
    constructor(props) {
        super(props)
        this.varieties = [
            { label: "Uva Isabel", value: "Uva Isabel" },
            { label: "Uva Merlot", value: "Uva Merlot" }
        ]
        this.envcrop = "";
        this.cropsList = null;
    }

    storeCropsList(crops) {
        this.cropsList = crops;
    }

    getCropsList() {
        return this.cropsList;
    }

    //axiosToken - token - token para cancelar a requisição
    //callBack - function - função de retorno
    getNoteEnvironment(axiosToken, environment, callBack) {

        const token = SessionStore.getToken();

        if (token === null) {
            return
        }

        const env = environment || SessionStore.getEnvironment()

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/environment/" + env, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: undefined });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }

    getLabel(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/label/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: undefined });
                }
            })
            .catch(errorHandler);
    }

    addNoteEnvironment(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.post(LocalConfig.apiURL + "/api/note/environment/", { objectid: env }, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("add_note")
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getNoteFarming(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }
        const env = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/environment/farming/" + env, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getEnvCrops(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }
        const env = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getEnvCrop(cropid, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }
        const env = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/" + cropid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFound);
    }

    getCrops(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/crop", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getCropStages(cropid, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/crop/" + cropid + "/stage/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    addNoteCrop(crop, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/", crop, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("add_note")
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerWithCallback(callBack));
    }

    addTag(tag, env, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }
        if (env === null) {
            return
        }


        this.axios = axios.post(LocalConfig.apiURL + "/api/note/" + env + "/traceability/", tag, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }


    updateTag(tag, env, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }
        if (env === null) {
            return
        }


        this.axios = axios.put(LocalConfig.apiURL + "/api/note/" + env + "/traceability/"+ tag.objectid, tag, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    deleteTag(env, tag, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/note/" + env + "/traceability/" + tag, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: "OK" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }


    getTag(tag, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment();

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/" + env + "/traceability/" + tag, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data || null })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getTags(env, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/" + env + "/traceability/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    getAccountNoteCrops(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/crop/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    this.emit("add_note")
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    }

    editNoteCrop(crop, index, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/" + crop.objectid, crop, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== undefined) {
                    this.emit("add_note")
                    callBack({ id: axiosToken.id, index: index, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundAndUnauthorizedWithCallback((error) => { callBack({ id: axiosToken.id, data: error }) }));
    }

    deleteNoteCrop(crop, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/" + crop, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: crop })
                    this.emit("del_environmentcrop")
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }

    getEnvNoteCrop(crop, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/" + crop, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }

    getCropImage(crop, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/crop/" + crop + "/image", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }


    getEnvNoteCrops(axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const env = SessionStore.getEnvironment()

        this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + env + "/crop/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: undefined }) }));
    }

    getPhenologicalState(crop, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/crop/" + crop + "/stage/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));
    }

    listEnvironmentBoards(axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        const environment = SessionStore.getEnvironment();

        if (environment === null || environment === "") {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/board/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
            params: {
                environment: environment
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));
    }

    getBoard(id, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/board/" + id, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || [] })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));
    }

    addNewBoard(board, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/note/board/", board, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    addNewList(list, boardObjectid, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/list/", list, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    updateList(list, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/list/" + list.objectid, list, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    deleteList(list, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/list/" + list.objectid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    getBoardCard(id, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/card/" + id, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    getCategories(axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/category/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    addNewCard(card, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/card/", card, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    updateCard(card, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/card/" + card.objectid, card, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    deleteCard(card, boardObjectid, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/note/board/" + boardObjectid + "/card/" + card.objectid, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    getComments(boardId, cardId, axiosToken, callBack) {

        const token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.get(LocalConfig.apiURL + "/api/note/board/" + boardId + "/card/" + cardId + "/comment/", {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    addComment(comment, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/note/board/" + comment.boardObjectid + "/card/" + comment.cardObjectid + "/comment/", comment, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));

    }

    uploadImage(image, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/media/image/", image, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));


    }

    addCropStage(stage, axiosToken, callBack) {
        const token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/crop/"+stage.cropid+"/stage/", stage, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: response.data || "" })
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandlerIgnoreNotFoundWithCallback(() => { callBack({ id: axiosToken.id, data: null }) }));


    }

    emitAddTag() {
        this.emit("add_notebooktag");
    }
}

const noteStore = new NoteStore();

export default noteStore;