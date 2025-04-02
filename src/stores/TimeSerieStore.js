import axios from 'axios';
import { EventEmitter } from 'events';

import { LocalConfig } from '../LocalConfig'
import { checkStatus, errorHandler } from '../helpers/helpers';
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from './CancelTokenList';
import errorHandlerWithCallback from '../helpers/errorHandler'

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class TimeSerieStore extends EventEmitter {
  constructor(props) {
    super(props);

    this.parameters = {};
    this.props = props;
  }

  getNewToken = () => {
    let cancelToken = {};

    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    return cancelToken
  }

  cancel() {
    tokenList.clear();
  }

  restart() {
    tokenList.clear();
  }

  getTimeSerie(axiosToken, parameters, callbackFunc) {
    let token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    let environment = SessionStore.getEnvironment();

    if (toolsUtils.isEmptyString(environment)) {
      return;
    }

    let time = SessionStore.getTime();
    let group = '5m';
    let func = 'mean';
    let fill = 'null';
    let cumulative = null;

    if (parameters.function !== undefined && parameters.function !== null) {
      func = parameters.function;
    }

    if (parameters.fill !== undefined && parameters.fill !== null) {
      fill = parameters.fill;
    }

    if (parameters.group !== undefined && parameters.group !== null) {
      group = parameters.group;
    } else {
      group = this.getGroup(parameters.hours);
    }

    if (parameters.cumulative !== undefined && parameters.cumulative !== null) {
      cumulative = parameters.cumulative;
    }

    this.axios = axios.get(LocalConfig.apiURL + '/api/data/timeserie/' + parameters.measure, {
      cancelToken: axiosToken.token.token.token,
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        device: parameters.device,
        start: parameters.start || time.start,
        end: parameters.end || time.end,
        group: 'time(' + group + ')',
        function: func,
        fill: fill,
        environment: environment,
        cumulative: cumulative,
        objectid: parameters.objectid || ''
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (typeof (responseData) === 'undefined') {
          callbackFunc(null);
        } else {
          if (responseData.data !== null) {
            callbackFunc({ id: axiosToken.id, data: responseData.data });
          } else {
            callbackFunc({ id: axiosToken.id, data: null });
          }
        }
      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  getTimeSerieChillHour(axiosToken, parameters, callbackFunc) {
    let token = SessionStore.getToken();

    if (token === null) {
      return;
    }

    let environment = SessionStore.getEnvironment();

    if (toolsUtils.isEmptyString(environment)) {
      return;
    }

    let time = SessionStore.getTime();

    this.axios = axios.get(LocalConfig.apiURL + '/api/data/chillhour/' + parameters.measure, {
      cancelToken: axiosToken.token.token.token,
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        start: parameters.start || time.start,
        end: parameters.end || time.end,
        environment: environment,
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (typeof (responseData) === 'undefined') {
          callbackFunc(null);
        } else {
          if (responseData.data !== null) {
            callbackFunc({ id: axiosToken.id, data: responseData.data });
          } else {
            callbackFunc({ id: axiosToken.id, data: null });
          }
        }
      })
      .catch(errorHandlerWithCallback(callbackFunc));
  }

  getTimeSerie_WT(axiosToken, parameters, callBack) {
    let token = SessionStore.getToken();

    if (token === null) {
      return
    }

    let environment = SessionStore.getEnvironment();

    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    const time = SessionStore.getTime();
    let functionType = '';

    if (SessionStore.getIsSelectedFunction()) {
      functionType = SessionStore.getFunction();
    } else if (
      !toolsUtils.isNullOrEmpty(parameters, 'function') &&
      !toolsUtils.isEmptyString(parameters.function) &&
      parameters.function
    ) {
      functionType = parameters.function;
    } else {
      functionType = 'mean';
    }

    let params = {
      device: parameters.device,
      start: parameters.start || time.start,
      end: parameters.end || time.end,
      environment: environment,
      function: functionType
    }

    if (parameters.timezone) {
      params.timezone = parameters.timezone
    }

    params.group = 'time(' + ((!toolsUtils.isNullOrEmpty(parameters, 'group') && !toolsUtils.isEmptyString(parameters.group) && parameters.group) || '5m') + ')';
    params.fill = (!toolsUtils.isNullOrEmpty(parameters, 'fill') && !toolsUtils.isEmptyString(parameters.fill) && parameters.fill) || 'null';
    params.cumulative = (!toolsUtils.isNullOrEmpty(parameters, 'cumulative') && !toolsUtils.isEmptyString(parameters.cumulative) && parameters.cumulative) || null

    this.axios = axios.get(LocalConfig.apiURL + '/api/data/timeserie/' + parameters.measure, {
      cancelToken: axiosToken.token.token.token,
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + token,
      },
      params: params
    })
      .then(checkStatus)
      .then((response) => {
        if (typeof response.data !== 'undefined') {
          callBack({ id: axiosToken.id, data: response.data })
        } else {
          callBack({ id: axiosToken.id, data: null })
        }
      })
      .catch(errorHandlerWithCallback(callBack));
  }

  getHistogram(parameters, callbackFunc) {
    let token = SessionStore.getToken();

    if (token === null) {
      return
    }

    let environment = SessionStore.getEnvironment();

    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    let time = SessionStore.getTime();
    let group = '5m';
    let func = 'mean';
    let fill = 'null';


    if (parameters.function !== undefined && parameters.function !== null) {
      func = parameters.function;
    }

    if (parameters.fill !== undefined && parameters.fill !== null) {
      fill = parameters.fill;
    }

    if (parameters.group !== undefined && parameters.group !== null) {
      group = parameters.group;
    } else {
      group = this.getGroup(parameters.hours);
    }

    let sizes = {
      height: 0,
      width: 0
    };

    if (parameters.height !== null && parameters.width !== null) {
      sizes = this.getSizes({ height: parameters.height, width: parameters.width });
    } else {
      return
    }

    this.axios = axios.get(LocalConfig.apiURL + '/api/plot/histogram/' + parameters.measure, {
      cancelToken: this.getNewToken().token.token.token,
      responseType: 'blob',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        device: parameters.device,
        start: parameters.start || time.start,
        end: parameters.end || time.end,
        group: 'time(' + group + ')',
        function: func,
        fill: fill,
        environment: environment,
        height: sizes.height,
        width: sizes.width
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (typeof (responseData) === 'undefined') {
          callbackFunc(null);
        } else {
          if (responseData.data !== null) {
            callbackFunc(responseData.data);
          } else {
            callbackFunc(null);
          }
        }
      })
      .catch(errorHandler);
  }

  getSizes(sizes) {
    let response;

    if (sizes.width > 800) {
      response = {
        height: Math.floor(sizes.height / 2.3),
        width: Math.floor(sizes.width / 4.4)
      }
    } else {
      response = {
        height: Math.floor(sizes.height / 2.3),
        width: Math.floor(sizes.width / 2)
      }
    }

    return response;
  }

  getBoxPlot(parameters, callbackFunc) {
    let token = SessionStore.getToken();

    if (token === null) {
      return
    }

    let environment = SessionStore.getEnvironment();

    if (toolsUtils.isEmptyString(environment)) {
      return
    }

    let time = SessionStore.getTime();
    let group = '5m';
    let func = 'mean';
    let fill = 'null';

    if (parameters.function !== undefined && parameters.function !== null) {
      func = parameters.function;
    }

    if (parameters.fill !== undefined && parameters.fill !== null) {
      fill = parameters.fill;
    }

    if (parameters.group !== undefined && parameters.group !== null) {
      group = parameters.group;
    } else {
      group = this.getGroup(parameters.hours);
    }

    let sizes = {
      height: 0,
      width: 0
    };

    if (parameters.height !== null && parameters.width !== null) {
      sizes = this.getSizes({ height: parameters.height, width: parameters.width });
    } else {
      sizes = {
        height: 800,
        width: 600
      };
    }

    this.axios = axios.get(LocalConfig.apiURL + '/api/plot/boxplot/' + parameters.measure, {
      cancelToken: this.getNewToken().token.token.token,
      responseType: 'blob',
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': 'Bearer ' + token,
      },
      params: {
        device: parameters.device,
        start: parameters.start || time.start,
        end: parameters.end || time.end,
        group: 'time(' + group + ')',
        function: func,
        fill: fill,
        environment: environment,
        height: sizes.height,
        width: sizes.width
      }
    })
      .then(checkStatus)
      .then((responseData) => {
        if (typeof (responseData) === 'undefined') {
          callbackFunc(null);
        } else {
          if (responseData.data !== null) {
            callbackFunc(responseData.data);
          } else {
            callbackFunc(null);
          }
        };
      })
      .catch(errorHandler);
  }

  getGroup(hour) {
    if (hour <= 36) {
      return '5m';
    } else if (hour <= 720) {
      return '30m';
    } else if (hour <= 1440) {
      return '1h';
    } else if (hour <= 2160) {
      return '2h';
    } else {
      return '3h';
    }
  }
}

const timeserieStore = new TimeSerieStore();

export default timeserieStore;