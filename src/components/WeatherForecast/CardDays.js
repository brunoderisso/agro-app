import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import classNames from "classnames";
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

// Material UI
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

//Prediza
import styles from "../../styles/WeatherForecast/CardDays";
import WeatherForecastStore from "../../stores/WeatherForecastStore"
import toolsUtils from "../../utils/toolsUtils"
import WeatherIcons from "../../styles/WeatherForecast/WeatherIcons"

let allStyles = Object.assign({}, styles, WeatherIcons);

export default withStyles(allStyles)(function CardDays(props) {
    const { classes } = props
    const { i18n: { language } } = useTranslation();

    const [dia, setDia] = useState({});

    useEffect(() => {
        setDia(props.proximoDia);
        moment.locale(language.toLowerCase())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Grid item xs={2} className={classes.cardsDia}>
            <Grid container>
                {!toolsUtils.isNullOrEmpty(dia, "time") &&
                    <Grid item xs={12} className={classes.cardFullDate}>
                        <Typography variant="h6" className={classes.dayWeek}>
                            {moment(dia.time).format("ddd")}
                        </Typography>
                        <Grid container className={classes.cardDate}>
                            {moment(dia.time).format("DD/MM")}
                        </Grid>
                    </Grid>
                }
                <Grid item xs={12} className={classes.iconDays}>
                    {!toolsUtils.isNullOrEmpty(dia, "symbol_id") &&
                        <i className={classNames(
                            classes.sprite,
                            classes[WeatherForecastStore.getIconID(dia.symbol_id) + "fundobranco"],
                            classes.iconWeather
                        )}></i>
                    }
                </Grid>
                {!toolsUtils.isNullOrEmpty(dia, "precipitation_amount") &&
                    <Grid item xs={12} className={classes.prec}>
                        {parseFloat(dia.precipitation_amount).toFixed(1)} mm
                    </Grid>
                }
                <Grid item xs={12}>
                    {!toolsUtils.isNullOrEmpty(dia, "air_temperature_max") && !toolsUtils.isNullOrEmpty(dia, "air_temperature_min") &&
                        <Grid container className={classes.temps}>
                            <Grid item xs={6}>
                                {parseFloat(dia.air_temperature_max).toFixed(1)}º
                            </Grid>
                            <Grid item xs={6} className={classes.min}>
                                {parseFloat(dia.air_temperature_min).toFixed(1)}º
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
})