import axios from "axios";
import { EventEmitter } from "events";

import { LocalConfig } from "../LocalConfig";
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "../stores/SessionStore";




EventEmitter.EventEmitter.defaultMaxListeners = 0;

class DeviceProfileStore extends EventEmitter {

    constructor(props) {
        super(props);

        this.props = props;

        this.selected = 0;
    };

    setSelected(index){
        this.selected = index;
    }

    getSelected(){
        return this.selected;

    }

    getService(profileService, deviceToken, callBack) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/" + profileService.organizationID + "/profile/service/" + profileService.ObjectID, {
            cancelToken: deviceToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: deviceToken.id, data: response.data })
                } else {
                    callBack({ id: deviceToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    updateServiceProfile(serviceProfile, devicesToken, callBack){
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/organization/"+ serviceProfile.organizationObjectID +"/profile/service/" + serviceProfile.ObjectID , serviceProfile, {
            cancelToken: devicesToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: devicesToken.id, data: serviceProfile })
                } else {
                    callBack({ id: devicesToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    addServiceProfile(serviceProfile, servicesToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/organization/" + serviceProfile.organizationObjectID + "/profile/service/", serviceProfile, {
            cancelToken: servicesToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: servicesToken.id, data: response.data })
                } else {
                    callBack({ id: servicesToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };


    deleteDeviceProfile(deviceProfile, deviceProfileToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.delete(LocalConfig.apiURL + "/api/admin/organization/"+deviceProfile.organizationObjectID +"/profile/device/"+ deviceProfile.ObjectID , {
            cancelToken: deviceProfileToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    delete deviceProfile['organizationObjectID']
                    callBack({ id: deviceProfileToken.id, data: deviceProfile })
                } else {
                    callBack({ id: deviceProfileToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    getServices(organizationid, devicesToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/" + organizationid + "/profile/service/", {
            cancelToken: devicesToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: devicesToken.id, data: response.data })
                } else {
                    callBack({ id: devicesToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

    addLoraServiceProfile(serviceProfile, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }

        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/profile/service/" + serviceProfile.ObjectID, serviceProfile, {
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
                    this.emit("add_service");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    };

    deleteLoraServiceProfile(service, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        }
        this.axios = axios.delete(LocalConfig.apiURL + "/api/lora/profile/service/" + service.objectID, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: service })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

}

const deviceProfileStore = new DeviceProfileStore();

export default deviceProfileStore;