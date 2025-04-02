import { EventEmitter } from "events";

import SessionStore from "../stores/SessionStore";
import history from"../history";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class ValidationStore extends EventEmitter {
    validate(callback) {
        if (window.localStorage.token === undefined) {
            history.push("/login");
        } else if (window.localStorage.preference === undefined) {
            history.push("/preference");
        } else if (window.localStorage.environment === undefined || window.localStorage.environment === "" || window.localStorage.environment === null) {
            history.push("/environmentnotfound");
        } else {
            callback();
        }
    };

    isAdmin(){
        let p = SessionStore.getPreference()
        return p.globaladmin;
    }

};

const validationStore = new ValidationStore();

export default validationStore;