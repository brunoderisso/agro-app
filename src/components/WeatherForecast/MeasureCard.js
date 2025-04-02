import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";


// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import MeasureIcons from "../../styles/WeatherForecast/MeasureIcons"

//Prediza
import styles from "../../styles/WeatherForecast/MeasureCard";
import toolsUtils from "../../utils/toolsUtils";
import { useTranslation } from 'react-i18next';

let allStyles = Object.assign({}, styles, MeasureIcons);

export default withStyles(allStyles)(function MeasureCard(props) {
    const { classes } = props

    const [measure, setMeasure] = useState(-1);
    const [title, setTitle] = useState("");
    const [direction, setDirection] = useState(0);

    const { t } = useTranslation();

    useEffect(() => {
        setMeasure(props.measure || -1);
        setTitle(props.title || "");
        setDirection(props.direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        setMeasure(props.measure || -1);
        setTitle(props.title || "");
        setDirection(props.direction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props])

    const getWindDirection = (unity, val) => {
        if (val >= 330 || val < 30) {
            return unity + t('common.north') // "N"
        }
        if (val >= 30 && val < 60) {
            return unity + t('common.northEast')  // "NE"
        }
        if (val >= 60 && val < 120) {
            return unity + t('common.east') // "E"
        }
        if (val >= 120 && val < 150) {
            return unity + t('common.southEast') // "SE"
        }
        if (val >= 150 && val < 210) {
            return unity + t('common.south') // "S"
        }
        if (val >= 210 && val < 240) {
            return unity + t('common.southWest') // "SO" SW
        }
        if (val >= 240 && val < 300) {
            return unity + t('common.west') // "W"
        }
        if (val >= 300 && val < 330) {
            return unity + t('common.northWest') // "NO" "NW"
        }
    }

    const getunity = () => {
        switch (title) {
            case t('weatherforecast.humidity'):
                return parseFloat(measure).toFixed(1) + " %";
            case t('weatherforecast.wind'):
                const val = direction;
                let unity = parseFloat(measure).toFixed(1) + " m/s "
                unity = getWindDirection(unity, val);
                return unity;
            case t('weatherforecast.rain'):
                return parseFloat(measure).toFixed(1) + " mm";
            case t('weatherforecast.cloudiness'):
                return parseFloat(measure).toFixed(1) + " %";
            case t('weatherforecast.uvIndex'):
                if (measure < 3) {
                    return `${t('common.low')}(` + parseFloat(measure).toFixed(1) + `)`;
                } else if (measure < 6) {
                    return `${t('common.moderate')}(` + parseFloat(measure).toFixed(1) + `)`;
                } else if (measure < 8) {
                    return `${t('common.high')}(` + parseFloat(measure).toFixed(1) + `)`;
                } else if (measure >= 8) {
                    return `${t('common.veryHigh')}(` + parseFloat(measure).toFixed(1) + `)`;
                }
                return;

            default:
                return "NaN"

        }
    }

    const getWindIntensity = (classe) => {
        if (measure < 0.3) {
            return classe + "0";
        }
        if (measure < 1.5) {
            return classe + "1";
        }
        if (measure < 3.3) {
            return classe + "2";
        }
        if (measure < 5.4) {
            return classe + "3";
        }
        if (measure < 7.9) {
            return classe + "4";
        }
        if (measure < 10.7) {
            return classe + "5";
        }
        if (measure < 13.8) {
            return classe + "6";
        }
        if (measure < 17.1) {
            return classe + "7";
        }
        if (measure < 20.7) {
            return classe + "8";
        }
        if (measure < 24.4) {
            return classe + "9";
        }
        if (measure < 28.4) {
            return classe + "10";
        }
        if (measure < 32.6) {
            return classe + "11";
        }
        if (measure >= 32.7) {
            return classe + "12";
        }
    }

    const getIconClass = (txt) => {
        switch (txt) {
            case t('weatherforecast.humidity'):
                return "Humidity";
            case t('weatherforecast.wind'):
                let classe = "Wind";
                classe = getWindIntensity(classe);
                return classe;

            case t('weatherforecast.rain'):
                return "Rain";
            case t('weatherforecast.cloudiness'):
                return "Cloudiness";
            case t('weatherforecast.uvIndex'):
                return "indiceuv";

            default:
                return "NaN";

        }
    }

    return (
        <Grid item xs={12} className={classes.MeasureContainer}>
            <Paper elevation={0} className={classes.PaperContainer}>
                <Grid container>
                    <Grid item xs={2} className={classes.boxMeasureIcon}>
                        {!toolsUtils.isEmptyString(title) &&
                            <i className={classNames(classes.spriteMeasure, classes[getIconClass(title)])}>
                            </i>
                        }
                    </Grid>
                    {!toolsUtils.isEmptyString(title) &&
                        <Grid item xs={4} sm={3}>
                            {
                                title
                            }
                        </Grid>
                    }
                    <Grid item xs={6} sm={7} className={classes.Measure}>
                        {!toolsUtils.isEmptyString(measure) &&
                            <Typography variant="h6">
                                {(measure === undefined || measure < 0) &&
                                    "NaN"
                                }
                                {measure !== undefined && measure >= 0 &&
                                    getunity()
                                }
                            </Typography>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
})