import React, { useState, useEffect } from "react";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import styles from "../../styles/WeatherForecast/BoxWeather";
import mapstyles from "../../styles/WeatherForecast/MapStyle";
import cardstyles from "../../styles/WeatherForecast/CardDays";

import MeasureCard from "./MeasureCard"
import GMap from "../Common/GoogleMaps/GoogleMaps"
import CardDays from './CardDays';
import toolsUtils from "../../utils/toolsUtils";
import { useTranslation } from "react-i18next";

let allStyles = Object.assign({}, styles, mapstyles, cardstyles);

export default withStyles(allStyles)(function DayFilter(props) {
    const { classes } = props

    const [prevision, setPrevision] = useState({});
    const [today, setToday] = useState({});
    const [mapHour, setMapHour] = useState([]);
    const [correct, setCorrect] = useState(0);

    const { t } = useTranslation();

    useEffect(() => {
        setToday(null);
        let obj = {}
        obj = props.hour;
        setToday(obj);
    }, [props]);

    useEffect(() => {
        setMapHour([props.hour]);
        setPrevision(props.previsaoW);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.hour])

    useEffect(() => {
        setPrevision(props.previsaoW);
        setToday(props.hour);
        setMapHour([props.hour]);
        setCorrect(0.001);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const CardsSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        swipeToSlide: true,
        slidesToScroll: 1,
        focusOnSelect: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={4}>
                {today && Object.keys(today).length !== 0 &&
                    <Grid container className={classes.containerMeasures}>
                        <MeasureCard measure={today && today.wind_speed} direction={today && today.wind_from_direction} title={t('weatherforecast.wind')} />
                        <MeasureCard measure={today && today.relative_humidity} title={t('weatherforecast.humidity')} />
                        <MeasureCard measure={today && today.precipitation_amount + correct} title={t('weatherforecast.rain')} />
                        <MeasureCard measure={today && today.cloud_area_fraction + correct} title={t('weatherforecast.cloudiness')} />
                        <MeasureCard measure={today && today.ultraviolet_index_clear_sky + correct} title={t('weatherforecast.uvIndex')} />
                    </Grid>
                }
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
                <Grid className={classes.MapContainer}>
                    {mapHour.length > 0 && !toolsUtils.isNullOrEmpty(prevision.details, "lat") &&
                        <Grid>
                            <GMap pins={mapHour} details={{ details: prevision.details, name: prevision.ambiente }} config={{
                                center: {
                                    lat: prevision.details.lat,
                                    lng: prevision.details.lng,
                                },
                                zoom: 15,
                            }} />
                        </Grid>
                    }
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.containerDays}>
                    <Grid item xs={12} className={classes.titleDays}>
                        <Typography variant="h5">
                            {t('common.nextDays')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid className={classes.containerS}>
                            {!toolsUtils.isNullOrEmpty(prevision, "dias") &&
                                <Slider {...CardsSettings}>
                                    {
                                        prevision.dias.map(function (dia, index) {
                                            return (
                                                <div key={index}>
                                                    <CardDays proximoDia={dia} />
                                                </div>
                                            );
                                        })
                                    }
                                </Slider>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
})