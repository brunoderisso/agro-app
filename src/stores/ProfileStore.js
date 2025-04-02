import { EventEmitter } from "events";

//Prediza 
import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler, errorHandlerIgnoreErrorWithCallback } from "./helpers";
import SessionStore from "../stores/SessionStore";

//Other
import axios from "axios";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class ProfileStore extends EventEmitter {

}
const profileStore = new ProfileStore();
export default profileStore;