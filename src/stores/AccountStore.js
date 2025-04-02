import { EventEmitter } from "events";
import axios from "axios";

import { LocalConfig } from "../LocalConfig";
import tokens from "./CancelTokenList";
import {
  checkStatus,
  errorHandler,
  errorHandlerIgnoreErrorWithCallback,
  errorHandlerIgnoreUnauthorizedWithCallback
} from "../helpers/helpers";
import toolsUtils from "../utils/toolsUtils";
import SessionStore from "../stores/SessionStore";
import errorHandlerWithCallback from '../helpers/errorHandler';

EventEmitter.EventEmitter.defaultMaxListeners = 0;
const tokenList = new tokens();
class AccountStore extends EventEmitter {
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

  getEnvironmentDevices(callback) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/device/", {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callback(response.data);
        } else {
          callback([]);
        }
      })
      .catch(errorHandler);
  }

  getEnvironmentDevices_WT(cancelToken, callback) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/device/", {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callback({data: response.data, id: cancelToken.id});
        } else {
          callback([]);
        }
      })
      .catch(errorHandler);
  };

  getCrops(callback) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/crop", {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callback(response.data);
        } else {
          callback([]);
        }
      })
      .catch(errorHandler);
  };

  updateDevice(device, callBack) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment()
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + '/device/' + device.tag, device, {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callBack("updated")
        } else {
          callBack(null);
        }
      })
      .catch(errorHandlerIgnoreUnauthorizedWithCallback(callBack));
  }

  associateDevice(device, callBack) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment()
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + '/device/', device, {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          this.emit("associate_device")
          callBack("inserted")
        } else {
          callBack({});
        }
      })
      .catch(errorHandlerIgnoreErrorWithCallback(callBack));
  }

  desassociateDevice(deveui, callBack) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + environment + '/device/' + deveui, {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          this.emit("desassociate_device")
          callBack("inserted")
        } else {
          callBack({});
        }
      })
      .catch(errorHandlerIgnoreUnauthorizedWithCallback(callBack));
  }

  getEnvironmentUsers_WT(axiosToken, callBack) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment()
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/", {
      cancelToken: axiosToken.token.token.token,
      headers: {
        "Content-Type": "application/json",
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

  updateEnvironmentUser(axiosToken, user, callBack) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let environment = SessionStore.getEnvironment()
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/user/" + user.uuid, user ,{
      cancelToken: axiosToken.token.token.token,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callBack({ id: axiosToken.id, data: user || {} })
        } else {
          callBack({ id: axiosToken.id, data: null });
        }
      })
      .catch(errorHandler);
  }

  updateEnvironment(axiosToken, env, envId, callBack) {
    const token = SessionStore.getToken();
    if (token === null) {
      return;
    };

    const environment = envId || SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return;
    }

    this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment, env, {
      cancelToken: axiosToken.token.token.token,
      headers: {
        "Content-Type": "application/json",
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
      .catch(errorHandlerWithCallback(callBack));
  }

};

const accountStore = new AccountStore();
export default accountStore;