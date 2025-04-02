import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus } from "../helpers/helpers";
import errorHandlerWithCallback from "../helpers/errorHandler";
import axios from "axios";
import SessionStore from '../stores/SessionStore';

EventEmitter.EventEmitter.defaultMaxListeners = 0;

class AStore extends EventEmitter {
  constructor(props) {
    super(props);

    this.props = props;

  };

  getAlert(cancelToken, objectid, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + objectid, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  getAlerts(cancelToken, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/", {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  updateAlert(cancelToken, alert, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + alert.objectid, alert, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  addAlert(cancelToken, alert, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/", alert, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  addAlertCondition(cancelToken, alert_objectid, condition, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.post(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + alert_objectid + "/condition/", condition, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data, condition });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  updateAlertCondition(cancelToken, alert_objectid, condition, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.put(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + alert_objectid + "/condition/"+condition.objectid, condition, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data, condition });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  removeAlert(cancelToken, objectid, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + objectid, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  removeAlertCondition(cancelToken, alert_objectid, condition_objectid, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.delete(LocalConfig.apiURL + "/api/account/environment/" + environment + "/alert/" + alert_objectid + "/condition/" + condition_objectid, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      }
    })
      .then(checkStatus)
      .then((responseData) => {

        if (responseData?.data !== null) {
          callbackFunc({ id: cancelToken.id, data: responseData.data });
        } else {
          callbackFunc({ id: cancelToken.id, data: null });
        }

      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }


};

const AlertStore = new AStore();

export default AlertStore;