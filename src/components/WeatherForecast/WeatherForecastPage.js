import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";

import Grid from "@material-ui/core/Grid";
import BeatLoader from "react-spinners/BeatLoader"

import styles from "../../styles/WeatherForecast/BoxWeather";
import history from '../../history';
import CardWeatherForecast from "./CardWeatherForecast";
import WeatherForecastStore from "../../stores/WeatherForecastStore"
import tokens from "../../stores/CancelTokenList";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import DayFilter from "./DayFilter"
import theme from '../../styles/Utils/theme';


export default withStyles(styles)(function WeatherForecastPage(props) {
    const [previsionDay, setPrevisionDay] = useState({});
    const [previsionWeek, setPrevisionWeek] = useState({});
    const [hour, setHour] = useState([]);
    const [flag, setFlag] = useState(SessionStore.forecast);
    const tokenList = new tokens();

    let timeID = null;

    useEffect(() => {
        getWeatherForecast();

        SessionStore.setView("forecast");
        SessionStore.on("environment.change", () => {
            if (SessionStore.view === "forecast") {
                environmentUpdate();
                return
            }
            environmentUpdate();
        });
        // eslint-disable-next-line
        timeID = timer();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFlag(SessionStore.forecast);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previsionWeek]);

    const clear = () => {
        tokenList.clear();
    }

    const environmentUpdate = () => {
        getWeatherForecast();
    }

    const timer = () => setTimeout(() => { // return the timeoutID
        history.push('/');
    }, 15000);

    const getWeatherForecast = () => {
        let cancelToken = {};

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        WeatherForecastStore.getWeatherForecast(cancelToken, responseWeatherForecast);
    }

    const reloadMeasures = (hour) => {
        setHour(hour);
    }

    const editHourIcon = (response) => {
        const sunrise = moment(response.astronomical.sun.sunrise, 'HH:mm A').subtract(3, 'hours');
        const sunset = moment(response.astronomical.sun.sunset, 'HH:mm A').subtract(3, 'hours');
        const nextSunrise = moment(response.astronomical.sun.nextsunrise, 'HH:mm A').subtract(3, 'hours').add(1, 'days');
        const nextSunset = moment(response.astronomical.sun.sunset, 'HH:mm A').subtract(3, 'hours').add(1, 'days');

        let hours = response.nexthours;
        sunrise.set({ minutes: 0 });

        let cont;
        for (cont = 0; cont < hours.length; cont++) {
            let hour = hours[cont];
            let cardHour = moment(hour.time);

            if (cardHour < sunrise) {
                let icon = hour.symbol_code;
                let num = icon?.split("_");
                if (num?.length > 1) {
                    icon = num[0] + "_night";
                    hours[cont].symbol_code = icon;
                }
            }
            if (cardHour >= sunrise && cardHour < sunset) {
                let icon = hour.symbol_code;
                let num = icon?.split("_");
                if (num?.length > 1) {
                    icon = num[0] + "_day";
                    hours[cont].symbol_code = icon;
                }
            }
            if (cardHour >= sunset && cardHour < nextSunrise) {
                let icon = hour.symbol_code;
                let num = icon?.split("_");
                if (num?.length > 1) {
                    icon = num[0] + "_night";
                    hours[cont].symbol_code = icon;
                }
            }
            if (cardHour >= nextSunrise && cardHour < nextSunset) {
                let icon = hour.symbol_code;
                let num = icon?.split("_");
                if (num?.length > 1) {
                    icon = num[0] + "_day";
                    hours[cont].symbol_code = icon;
                }
            }
            if (cardHour >= nextSunset) {
                let icon = hour.symbol_code;
                let num = icon?.split("_");
                if (num?.length > 1) {
                    icon = num[0] + "_night";
                    hours[cont].symbol_code = icon;
                }
            }
        }
    }

    const responseWeatherForecast = (response) => {

        if (response === null || response === undefined) {
            timeID = timer();
            SessionStore.setForecast(false);
            setFlag(false);
            return
        }

        if (response.nexthours.length > 1) {
            editHourIcon(response);
        }

        clearTimeout(timeID);

        setHour(response.nexthours[0] || undefined);
        const prevDia = {
            ambiente: response.environment.name,
            hoje: response.nexthours[0] || {},
            lua: response.astronomical.moon,
            sol: response.astronomical.sun,
            icon: response.nexthours[0] !== undefined && (response.nexthours[0].symbol_code || null),
            horas: response.nexthours,
        };

        setPrevisionDay(prevDia);
        setPrevisionWeek(null);
        const prevWeek = {
            ambiente: response.environment.name,
            details: {
                lat: response.environment.latitude,
                lng: response.environment.longitude,
                description: response.environment.description,
            },
            icon: response.nexthours[0] !== undefined && (response.nexthours[0].symbol_code || null),
            hora: hour,
            dias: response.nextdays,
        };
        setPrevisionWeek(prevWeek);
        SessionStore.setForecast(true);
    }

    const { classes } = props;
    return (
        <Grid container>
            {previsionWeek !== null && flag &&
                <Grid container className={classes.containerInterno}>
                    {!toolsUtils.isNullOrEmpty(previsionDay, "hoje") &&
                        <Grid item xs={12} sm={12} md={3} className={classes.cardWeather}>
                            <CardWeatherForecast previsaoDoDia={previsionDay} reload={reloadMeasures} />
                        </Grid>
                    }
                    <Grid item xs={12} sm={12} md={9} className={classes.containerD}>
                        {!toolsUtils.isNullOrEmpty(previsionWeek, "dias") &&
                            <DayFilter previsaoW={previsionWeek} hour={hour} />
                        }
                    </Grid>
                </Grid>
            }
            {!flag &&
                <Grid className={classes.loader}>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={"px"} size={12} />
                </Grid>
            }
        </Grid>
    )
})