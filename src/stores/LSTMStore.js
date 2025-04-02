import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import SessionStore from "./SessionStore";
import axios from "axios";

EventEmitter.EventEmitter.defaultMaxListeners = 0;


class WidgetStore extends EventEmitter {
  constructor(props) {
    super(props);

    this.props = props;

  };

  convertGroupToTimestamp(group) {
    const unit = group.slice(-1);
    const value = parseInt(group.slice(0, -1), 10);

    switch (unit) {
      case 'm':
        return value * 60 * 1000; // minutos para milissegundos
      case 'h':
        return value * 60 * 60 * 1000; // horas para milissegundos
      default:
        throw new Error("Unidade de tempo não suportada. Use 'm' para minutos ou 'h' para horas.");
    }
  }

  convertToTimeserieArray(time, group, data) {
    const increment = this.convertGroupToTimestamp(group);
    let currentTime = time;

    return data.map(item => {
      currentTime += increment;
      const newItem = {
        time: currentTime,
        value: item[0],
        predict: true
      };
      return newItem;
    });
  }

  convertToLSTMArray(data) {
    return data.map(item => [item.value]);
  }

  getLSTMForecast(cancelToken, data, callBack) {
    const token = SessionStore.getToken();
    if (token === null) {
      return
    }

    this.axios = axios.post(LocalConfig.apiURL + "/api/lstm/ondemand", { serie: data }, {
      cancelToken: cancelToken.token.token.token,
      headers: {
        "Content-Type": "text/plain",
        "Authorization": "Bearer " + token,
      },
    })
      .then(checkStatus)
      .then(response => {
        if (typeof response.data !== "undefined") {
          callBack({ id: cancelToken.id, data: response.data || [] })
        } else {
          callBack({ id: cancelToken.id, data: null });
        }
      })
      .catch(errorHandler);
  }
};

const widgetStore = new WidgetStore();

export default widgetStore;