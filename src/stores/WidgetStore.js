import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import axios from "axios";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";
import errorHandlerWithCallback from "../helpers/errorHandler";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class WidgetStore extends EventEmitter {
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

  getMeasure(parameters, callbackFunc) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };

    let time = SessionStore.getTime();
    let environment = SessionStore.getEnvironment();
    this.axios = axios.get(LocalConfig.apiURL + "/api/data/stats/" + parameters.measure, {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
      params: {
        environment: environment,
        start: time.start,
        end: time.end,
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (typeof (responseData) !== "undefined" && responseData.data !== null) {
          callbackFunc(responseData.data);
          return
        }
        callbackFunc({});
      })
      .catch(errorHandler);
  };

  getChillingHours(chillingToken, callbackFunc) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };
    let time = SessionStore.getTime();
    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    this.axios = axios.get(LocalConfig.apiURL + "/api/weather/chill", {
      cancelToken: chillingToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
      params: {
        environment: environment,
        start: time.start,
        end: time.end,
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (responseData.data !== null) {
          callbackFunc({ id: chillingToken.id, data: responseData.data });
        } else {
          callbackFunc([], {});
        }
      })
      .catch(errorHandler);
  };
  getAstronomical(astroToken, callbackFunc) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };
    let environment = SessionStore.getEnvironmentDetail();
    if (environment !== undefined && environment.longitude !== undefined && environment.longitude !== undefined) {
      this.axios = axios.get(LocalConfig.apiURL + "/api/util/astronomical", {
        cancelToken: astroToken.token.token.token,
        headers: {
          "Content-Type": "text/plain",
          "Authorization": "Bearer " + token,
        },
        params: {
          latitude: environment.latitude,
          longitude: environment.longitude,
        }
      })
        .then(checkStatus)
        .then((responseData) => {
          if (responseData.data !== null) {
            callbackFunc({ id: astroToken.id, data: responseData.data.sun });
          } else {
            callbackFunc([], {});
          }
        })
        .catch(errorHandler);
    };
  };
  getNoise(callbackFunc) {
    let token = SessionStore.getToken();
    if (token === null) {
      return
    };
    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    let time = SessionStore.getTime();

    this.axios = axios.get(LocalConfig.apiURL + "/api/data/noise/", {
      cancelToken: this.getNewToken().token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
      params: {
        environment: environment,
        start: time.start,
        end: time.end,
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (responseData.data !== null) {
          callbackFunc(responseData.data);
        } else {
          callbackFunc([], {});
        }
      })
      .catch(errorHandler);
  };

  getWeatherForecast(weatherToken, callbackFunc) {
    let environment = SessionStore.getEnvironment();
    if (toolsUtils.isEmptyString(environment)) {
      return
    }
    let token = SessionStore.getToken();

    this.axios = axios.get(LocalConfig.apiURL + "/api/weather/forecast/" + environment, {
      cancelToken: weatherToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then((responseData) => {
        if (responseData.data !== null) {
          callbackFunc({ id: weatherToken.id, data: responseData.data });
        } else {
          callbackFunc([], {});
        }
      })
      .catch(errorHandler);
  };

  getWidgetList(cancelToken, callbackFunc) {
    const token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    const environment = SessionStore.getEnvironment();

    this.axios = axios.get(LocalConfig.apiURL + "/api/account/environment/" + environment + "/widget/", {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then((responseData) => {
        if (!responseData) {
          callbackFunc(null);
        } else {
          if (responseData.data !== null) {
            callbackFunc({ id: cancelToken.id, data: responseData.data });
          } else {
            callbackFunc(null);
          }
        }
      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }
};

const widgetStore = new WidgetStore();

export default widgetStore;