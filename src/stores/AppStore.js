import { EventEmitter } from "events";

//Prediza 
import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler, errorHandlerIgnoreErrorWithCallback } from "./helpers";
import SessionStore from "../stores/SessionStore";

//Other
import axios from "axios";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class AppStore extends EventEmitter {

}
const appStore = new AppStore();
export default appStore;