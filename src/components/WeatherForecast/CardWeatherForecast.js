import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from 'moment';
import 'moment/locale/pt-br';
import 'moment/locale/es';

import styles from "../../styles/WeatherForecast/CardWeather";
import WeatherIcons from "../../styles/WeatherForecast/WeatherIcons"
import MeasureIcons from "../../styles/WeatherForecast/MeasureIcons"
import WeatherForecastStore from "../../stores/WeatherForecastStore"
import CardHour from "./CardHour"
import { ReactComponent as Arco } from '../../img/ArcoIcon.svg';
import toolsUtils from "../../utils/toolsUtils";
import { useTranslation } from "react-i18next";


let allStyles = Object.assign({}, styles, WeatherIcons, MeasureIcons);
export default withStyles(allStyles)(function CardWeatherForecast(props) {
    const [weatherForecast, setweatherForecast] = useState({ horas: [], });
    const [weatherSelected, setWeatherSelected] = useState({});
    const [prevSlide, setPrevSlide] = useState(0);
    const { classes } = props;

    const { t, i18n: {language} } = useTranslation();

    let slider1 = null;

    useEffect(() => {
        setweatherForecast(props.previsaoDoDia);
        moment.locale(language);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //DEBUGS
    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(weatherForecast, "horas") && weatherForecast.horas.length > 0) {
            setWeatherSelected(weatherForecast);
            setHour();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weatherForecast]);

    const setFocusSlider = (index) => {
        if (slider1 !== null) {
            slider1.slickGoTo(index);
        }
    }

    const setHour = () => {
        let now = moment().hour();
        let hour;
        var cont;
        for (cont = 0; cont < weatherForecast.horas.length; cont++) {
            hour = moment(weatherForecast.horas[cont].time).hour();

            if (now <= hour) {
                setWeatherSelected({
                    ...weatherSelected,
                    hoje: weatherForecast.horas[cont],
                    icon: weatherForecast.horas[cont].symbol_code,
                })
                onClickCardHour(weatherForecast.horas[cont], cont);
                return;
            }
        }

        if (cont >= weatherForecast.horas.length) {
            cont = 0;
        }

        setWeatherSelected({
            ...weatherSelected,
            hoje: weatherForecast.horas[cont],
            icon: weatherForecast.horas[cont].symbol_code,
        })
        onClickCardHour(weatherForecast.horas[cont], cont);

    }

    const onClickCardHour = (hour, index) => {
        let obj = document.getElementById("div-slide" + prevSlide);

        obj.style.color = "#ffffff";
        setPrevSlide(index);
        obj = document.getElementById("div-slide" + index);
        obj.style.color = "#00f3ff";
        setWeatherSelected({
            ...weatherSelected,
            hoje: hour,
            icon: hour.symbol_code,
        });
        props.reload(hour);

        if (index !== null && index !== undefined) {
            setFocusSlider(index);
        }
    }

    const settings = {
        dots: false,
        infinite: false,
        focusOnSelect: false,
        speed: 500,
        slidesToShow: 7,
        swipeToSlide: true,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 799,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 9,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1040,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1125,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    const getMoon = () => {
        if (weatherForecast.lua.phase === null || weatherForecast.lua.phase === undefined) {
            return
        }

        let phase = weatherForecast.lua.phase;
        let strings = phase.split(" ");

        return strings[0] + strings[1] + "";
    }

    return (
        <Grid container>
            <Grid container className={classes.cardTitle}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" className={classes.environmentName}>
                        {!toolsUtils.isNullOrEmpty(weatherForecast, "ambiente") &&
                            weatherForecast.ambiente + ","
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {!toolsUtils.isNullOrEmpty(weatherForecast, "hoje") &&
                        <Typography variant="overline">
                            {
                                moment.utc(weatherForecast.hoje.time).format('ddd, D MMM')
                            }
                        </Typography>
                    }
                </Grid>
            </Grid>
            <Grid container className={classes.cardTemperature}>
                {!toolsUtils.isNullOrEmpty(weatherForecast, "horas") &&
                    <Grid item xs={12} className={classes.temperatureTitle}>
                        {t('common.now')}
                    </Grid>
                }
                <Grid item xs={12} className={classes.temperature}>
                    {!toolsUtils.isNullOrEmpty(weatherForecast, "horas") && weatherForecast.horas.length > 0 &&
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12}>
                                <Grid className={classes.containerIcon}>
                                    {!toolsUtils.isNullOrEmpty(weatherSelected, "icon") &&
                                        <i className={classNames(classes.sprite, classes[WeatherForecastStore.getIcon(weatherSelected, "icon") + "fundoazul"], classes.iconWeather)}>
                                        </i>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                {!toolsUtils.isNullOrEmpty(weatherSelected, "hoje") &&
                                    <Grid container>
                                        <Grid item xs={12} className={classes.temperatureNumero}>
                                            {parseFloat(weatherSelected.hoje.air_temperature).toFixed(1) + "ºC"}
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    }
                    {weatherForecast.horas.length === 0 &&
                        <Grid container className={classes.NaN}>
                            <Grid item xs={12}>
                                NaN
                            </Grid>
                        </Grid>
                    }
                </Grid>

                <Grid item xs={12} className={classes.cardsSemana}>
                    <Grid container direction="row">
                        <Grid className={classes.test}>
                            {!toolsUtils.isNullOrEmpty(weatherForecast, "horas") && weatherForecast.horas.length > 0 &&

                                <Slider {...settings}
                                    ref={slider => (slider1 = slider)}
                                >
                                    {
                                        weatherForecast.horas.map(function (hora, index) {
                                            return (
                                                <div id={"div-slide" + index} key={index} onClick={() => onClickCardHour(hora, index)}>
                                                    <CardHour hour={hora} />
                                                </div>
                                            );
                                        })
                                    }
                                </Slider>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.arcoContainer}>
                        <Grid item xs={12}>
                            {!toolsUtils.isNullOrEmpty(weatherForecast, "sol") &&
                                <Grid container className={classes.horarioSun}>
                                    <Grid item xs={6} className={classes.nascer}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                {t('weatherforecast.sunrise')}
                                            </Grid>
                                            {!toolsUtils.isNullOrEmpty(weatherForecast.sol, "sunrise") &&
                                                <Grid item xs={12}>

                                                    {weatherForecast.sol.sunrise}

                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={6} className={classes.por}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                {t('weatherforecast.sunset')}
                                            </Grid>
                                            {!toolsUtils.isNullOrEmpty(weatherForecast.sol, "sunset") &&
                                                <Grid item xs={12}>
                                                    {weatherForecast.sol.sunset}
                                                </Grid>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                        {!toolsUtils.isNullOrEmpty(weatherForecast.sol, "sunset") &&
                            <Grid item xs={12}>
                                <Arco />
                            </Grid>
                        }

                        <Grid item xs={12} className={classes.MoonContainer}>
                            <Grid container>
                                {!toolsUtils.isNullOrEmpty(weatherForecast, "lua") &&
                                    <Grid item xs={12}>
                                        {
                                            <i className={classNames(classes.spriteMeasure, classes[getMoon()], classes.iconMoon)}> </i>
                                        }
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </Grid>
    )
})