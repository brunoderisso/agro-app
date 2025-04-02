import React from 'react';
import { useTranslation } from 'react-i18next';

import classNames from "classnames";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Battery from "@material-ui/icons/BatteryChargingFull";
import SurroundSound from '@material-ui/icons/SurroundSound';

import DeviceStore from "../../stores/DeviceStore";
import MeasureStore from "../../stores/MeasureStore";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Measure/MeasureInfo";


function MeasureInfo(props) {
    const { classes } = props;
    const { t } = useTranslation();

    //variables
    const func = SessionStore.functions.filter((val) => { return val.value === SessionStore.function })[0];

    //functions
    const getEnvironmentName = () => {
        if (props.environment && props.station !== null && props.station !== undefined) {
            let title = props.environment + " - " + props.station.DC_NOME + "/" + props.station.SG_ESTADO;
            return (
                <Grid style={(title.length > 24 && { fontSize: "13px" }) || {}}>
                    {title}
                </Grid>
            )
        }

        if (props.environment) {
            let title = props.environment;
            return (
                <Grid style={(title.length > 24 && { fontSize: "13px" }) || {}}>
                    {props.environment}
                </Grid>
            )
        }

        const env = SessionStore.getEnvironmentDetail();
        if (!toolsUtils.isNullOrEmpty(props, "device")) {
            return toolsUtils.getDeviceName(DeviceStore.getDeviceDetail(props.device))
        }
        if (toolsUtils.isNullOrEmpty(env, "name") || toolsUtils.isEmptyString(env.name)) {
            return t('common.myEnvironment');
        };

        return (
            <Grid style={(env.name.length > 24 && { fontSize: "13px" }) || {}}>
                {env.name.toUpperCase()}
            </Grid>
        )

    }

    const getMax = () => {
        if (!props.stats) {
            return "NaN";
        }
        if (toolsUtils.isNullOrEmpty(props, "stats.max")) {
            return `${t('common.maximum')}: NaN`;
        };
        let meta = MeasureStore.getMeasureDetail(props.measure);
        meta = meta.meta || null;

        if (meta !== null && meta.precision) {
            return `${t('common.maximum')}: ` + parseFloat(props.stats.max).toFixed(meta.precision) + getYlLegend();
        }

        return `${t('common.maximum')}: ` + parseFloat(props.stats.max).toFixed(1) + getYlLegend();
    }

    const getMin = () => {
        if (!props.stats) {
            return "NaN";
        }
        if (toolsUtils.isNullOrEmpty(props, "stats.min")) {
            return `${t('common.minimum')}: NaN`;
        };
        let meta = MeasureStore.getMeasureDetail(props.measure);
        meta = meta.meta || null;

        if (meta !== null && meta.precision) {
            return `${t('common.minimum')}: ` + parseFloat(props.stats.min).toFixed(meta.precision) + getYlLegend();
        }

        return `${t('common.minimum')}: ` + parseFloat(props.stats.min).toFixed(1) + getYlLegend();
    }

    const getMeasureIcon = () => {
        const { classes } = props;
        if (props.popup) {
            return "";
        }
        switch (props.measure) {
            case "Frost":
                return (<div className={classes.widgetIcon}><i className="wi wi-snowflake-cold"></i></div>)
            case "BatteryLevel":
                return (<Battery className={classes.widgetIcon} />)
            case "AirHumidity":
                return (<div className={classes.widgetIcon}><i className="wi wi-humidity"></i></div>)
            case "Noise":
                return (<SurroundSound className={classes.widgetIcon} />)

            case "AtmosphericPressure":
                return (<div className={classes.widgetIcon}><i className="wi wi-barometer"></i></div>)
            case "SoilMoisture":
                return (
                    <div className={classes.widgetIcon}>
                        <i className="wi wi-humidity"></i>
                    </div>)
            case "AirTemperature":
                return (
                    <div className={classes.widgetIcon}>
                        <i className="wi wi-thermometer"></i>
                    </div>)
            case "laeq":
                return (<SurroundSound className={classes.widgetIcon} />)
            default:
                return (<div className={classes.ico} ></div>)
        };
    }

    const getTitle = () => {
        return props.measure;
    }

    const getVal = () => {
        if (!props.stats) {
            return "NaN";
        }
        if (props.measure === "WindDirection") {
            if (!props.stats) {
                return "NaN";
            }
            let val = props.stats.value;

            if (val >= 330 || val < 30) {
                return "N"
            }
            if (val >= 30 && val < 60) {
                return "NE"
            }
            if (val >= 60 && val < 120) {
                return "E"
            }
            if (val >= 120 && val < 150) {
                return "SE"
            }
            if (val >= 150 && val < 210) {
                return "S"
            }
            if (val >= 210 && val < 240) {
                return "SO"
            }
            if (val >= 240 && val < 300) {
                return "O"
            }
            if (val >= 300 && val < 330) {
                return "NO"
            }
            return;
        }
        if (toolsUtils.isNullOrEmpty(props, "stats.value") && toolsUtils.isNullOrEmpty(func, "value") && toolsUtils.isNullOrEmpty(props, "stats." + func.value.toLowerCase())) {
            return "NaN";
        };

        if (!toolsUtils.isNullOrEmpty(func, "value") && !toolsUtils.isNullOrEmpty(props, "stats." + func.value.toLowerCase())) {
            if (!toolsUtils.isNullOrEmpty(props, "stats.stddev") && func.value === "MEAN") {
                return parseFloat(props.stats[func.value.toLowerCase()]).toFixed(1) + getYlLegend() + " ± " + props.stats.stddev;
            };

            return parseFloat(props.stats[func.value.toLowerCase()]).toFixed(1) + getYlLegend();
        };

        if (!toolsUtils.isNullOrEmpty(func, "value") && !toolsUtils.isNullOrEmpty(props, "stats.stddev") && func.value === "MEAN") {
            return parseFloat(props.stats.value).toFixed(1) + " ± " + props.stats.stddev + getYlLegend();
        };

        let meta = MeasureStore.getMeasureDetail(props.measure);
        meta = meta.meta || null;

        if (meta !== null && meta.precision) {
            return parseFloat(props.stats.value).toFixed(meta.precision) + " " + getYlLegend();
        } else {
            return parseFloat(props.stats.value).toFixed(1) + " " + getYlLegend();
        }
    }

    const getYlLegend = () => {
        return toolsUtils.getMeasureLegend(MeasureStore.getMeasureDetail(props.measure)) === "Index"
            ? t("common." + toolsUtils.getMeasureLegend(MeasureStore.getMeasureDetail(props.measure)))
            : toolsUtils.getMeasureLegend(MeasureStore.getMeasureDetail(props.measure));
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-start">
                    <Typography className={classNames(classes.widgetTitle, props.popup && classes.popmargin)} color="textSecondary" gutterBottom>
                        {getEnvironmentName()}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    {getMeasureIcon()}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center">
                    <Typography variant="h5" component="h2" className={classNames(
                        classes.center,
                        props.popup && classes.centerpop,
                        getTitle() === 'SoilEC' && classes.centerOpcional
                    )}>
                        {getVal()}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center" alignContent="center" alignItems="center">
                    <Typography className={classNames(classes.widgetPos, props.popup && classes.widgetpopPos)}>
                        {t("measures." + getTitle())}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-start">
                    <Grid item xs={12}>
                        <Typography component="p" className={classNames(
                            !props.popup && classes.data,
                            props.popup && classes.popmargin,
                            props.popup && classes.popdata,
                            getTitle() === 'SoilEC' && classes.dataOpcional
                        )}>
                            {getMax()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="p" className={classNames(
                            !props.popup && classes.data,
                            props.popup && classes.popmargin,
                            props.popup && classes.popdata,
                            getTitle() === 'SoilEC' && classes.dataOpcional
                        )}>
                            {getMin()}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default withStyles(styles)(MeasureInfo);