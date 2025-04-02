import { EventEmitter } from "events";
import axios from "axios";

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

    getDevice(profiledevice, deviceToken, callBack) {

        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/" + profiledevice.organizationID + "/profile/device/" + profiledevice.ObjectID, {
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

    updateDeviceProfile(deviceProfile, devicesToken, callBack){
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.put(LocalConfig.apiURL + "/api/admin/organization/"+ deviceProfile.organizationObjectID +"/profile/device/" + deviceProfile.ObjectID ,deviceProfile, {
            cancelToken: devicesToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: devicesToken.id, data: deviceProfile })
                } else {
                    callBack({ id: devicesToken.id, data: null })
                }
            })
            .catch(errorHandler);
    }

    addDeviceProfile(deviceProfile, devicesToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.post(LocalConfig.apiURL + "/api/admin/organization/" + deviceProfile.organizationObjectID + "/profile/device/", deviceProfile, {
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


    deleteDeviceProfile(deviceProfile, deviceProfileToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

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

    getDevices(organizationid, devicesToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.get(LocalConfig.apiURL + "/api/admin/organization/" + organizationid + "/profile/device/", {
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

    addLoraDeviceProfile(deviceProfile, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };

        this.axios = axios.post(LocalConfig.apiURL + "/api/lora/profile/device/" + deviceProfile.ObjectID, deviceProfile, {
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
                    this.emit("add_network");
                } else {
                    callBack({ id: axiosToken.id, data: null });
                }
            })
            .catch(errorHandler);
    };

    deleteLoraDeviceProfile(device, axiosToken, callBack) {
        let token = SessionStore.getToken();
        if (token === null) {
            return
        };
        this.axios = axios.delete(LocalConfig.apiURL + "/api/lora/profile/device/" + device.objectID, {
            cancelToken: axiosToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            },
        })
            .then(checkStatus)
            .then(response => {
                if (typeof response.data !== "undefined") {
                    callBack({ id: axiosToken.id, data: device })
                } else {
                    callBack({ id: axiosToken.id, data: null })
                }
            })
            .catch(errorHandler);
    };

}

const deviceProfileStore = new DeviceProfileStore();

export default deviceProfileStore;