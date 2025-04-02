import { EventEmitter } from "events";
import { LocalConfig } from "../LocalConfig"
import { checkStatus, errorHandler } from "../helpers/helpers";
import axios from "axios";
import SessionStore from '../stores/SessionStore';
import toolsUtils from '../utils/toolsUtils';
import tokens from "./CancelTokenList";
import moment from "moment";
import WeatherIcons from "../styles/WeatherForecast/WeatherIcons";

EventEmitter.EventEmitter.defaultMaxListeners = 0;

const tokenList = new tokens();

class WeatherForecastStore extends EventEmitter {
    constructor(props) {
        super(props);

        this.props = props;
    }

    getNewToken = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        return cancelToken
    }

    restart() {
        tokenList.clear();
    }

    getWeatherForecast(cancelToken, callbackFunc) {
        let token = SessionStore.getToken();

        if (token === null) {
            return
        }

        let environment = SessionStore.getEnvironment();

        if (toolsUtils.isEmptyString(environment)) {
            return
        }

        this.axios = axios.get(LocalConfig.apiURL + "/api/weather/forecast/local/" + environment, {
            cancelToken: cancelToken.token.token.token,
            headers: {
                "Content-Type": "text/plain",
                "Authorization": "Bearer " + token,
            }
        })
        .then(checkStatus)
        .then((responseData) => {
            if (typeof (responseData) === "undefined") {
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

    getIconID = (id) => {
        let code = "day";

        switch (id) {
            case 1:
                code = code + "clearsky";
                break;
            case 2:
                code = code + "fair";
                break;
            case 3:
                code = code + "partlycloudy";
                break;
            case 4:
                code = "cloudy";
                break;
            case 5:
                code = code + "rainshowers";
                break;
            case 6:
                code = code + "rainshowersandthunder"; break;
            case 7:
                code = code + "sleetshowers"; break;
            case 8:
                code = code + "snowshowers"; break;
            case 9:
                code = "rain"; break;
            case 10:
                code = "heavyrain"; break;
            case 11:
                code = "heavyrainandthunder"; break;
            case 12:
                code = "sleet"; break;
            case 13:
                code = "snow"; break;
            case 14:
                code = "snowandthunder"; break;
            case 15:
                code = "fog"; break;
            case 20:
                code = code + "sleetshowersandthunder"; break;
            case 21:
                code = code + "snowshowersandthunder"; break;
            case 22:
                code = "rainandthunder";
                break;
            case 23:
                code = "sleetandthunder"; break;
            case 24:
                code = code + "lightrainshowersandthunder"; break;
            case 25:
                code = code + "heavyrainshowersandthunder"; break;
            case 26:
                code = code + "lightssleetshowersandthunder"; break;
            case 27:
                code = code + "heavysleetshowersandthunder"; break;
            case 28:
                code = code + "lightssnowshowersandthunder"; break;
            case 29:
                code = code + "heavysnowshowersandthunder"; break;
            case 30:
                code = "lightrainandthunder"; break;
            case 31:
                code = "lightsleetandthunder"; break;
            case 32:
                code = "heavysleetandthunder"; break;
            case 33:
                code = "lightsnowandthunder"; break;
            case 34:
                code = "heavysnowandthunder"; break;
            case 40:
                code = code + "lightrainshowers"; break;
            case 41:
                code = code + "heavyrainshowers"; break;
            case 42:
                code = code + "lightsleetshowers"; break;
            case 43:
                code = code + "heavysleetshowers"; break;
            case 44:
                code = code + "lightsnowshowers"; break;
            case 45:
                code = code + "heavysnowshowers"; break;
            case 46:
                code = "lightrain"; break;
            case 47:
                code = "lightsleet"; break;
            case 48:
                code = "heavysleet"; break;
            case 49:
                code = "lightsnow"; break;
            case 50:
                code = "heavysnow"; break;

            default: code = "clearsky"; break;

        }

        return code;
    }

    getIcon = (icon, name) => {
        let hour = moment(icon.time).hour();
        let turn = "";

        if (hour > 6 && hour < 18) {
            turn = "day";
        } else {
            turn = "noite";
        }

        if (toolsUtils.isNullOrEmpty(icon, name) || typeof icon[name] !== "string") {
            return
        }

        const iconStrings = icon[name].split("_");

        let flag = false;

        Object.keys(WeatherIcons).forEach(element => {
            if (element === turn + iconStrings[0] + "fundoazul") {
                flag = true;
            }
        });

        if (flag === true)
            return turn + iconStrings[0];
        else
            return iconStrings[0];
    }

}

const WForecastStore = new WeatherForecastStore();

export default WForecastStore;