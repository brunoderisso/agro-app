import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import classNames from "classnames";



// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza
import styles from "../../styles/WeatherForecast/CardWeather";
import WeatherForecastStore from "../../stores/WeatherForecastStore"
import toolsUtils from "../../utils/toolsUtils";
import WeatherIcons from "../../styles/WeatherForecast/WeatherIcons"


let allStyles = Object.assign({}, styles, WeatherIcons);

export default withStyles(allStyles)(function CardWeatherForecast(props) {
    const { classes } = props

    const [info, setInfo] = useState({});


    useEffect(() => {
        setInfo(props.hour);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Grid item xs={2} className={classes.cardsHora}>
            {!toolsUtils.isNullOrEmpty(info, "air_temperature") &&
                <Grid container>
                    <Grid item xs={12}>
                       {
                           moment(info.time).format("HH:mm")
                       }
                    </Grid>
                    <Grid item xs={12}>
                        {
                            <i className={classNames(classes.sprite, classes[WeatherForecastStore.getIcon(info, "symbol_code") + "fundoazul"], classes.iconHour)}>
                            </i>
                        }
                    </Grid>
                    <Grid item xs={8}>
                        {parseFloat(info.air_temperature).toFixed(1)}
                    </Grid>
                    <Grid item xs={4} style={{fontSize: "10px"}}>
                        ºC
                    </Grid>
                </Grid>
            }
        </Grid>
    )
})