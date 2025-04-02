import React, { useState, useEffect } from 'react';
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Tooltip from '@material-ui/core/Tooltip';
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import DescriptionIcon from '@material-ui/icons/Description';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLess from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";
import Collapse from "@material-ui/core/Collapse";
import IconBattery100 from "@material-ui/icons/BatteryFull";
import IconBattery90 from "@material-ui/icons/Battery90";
import IconBattery80 from "@material-ui/icons/Battery80";
import IconBattery60 from "@material-ui/icons/Battery60";
import IconBattery50 from "@material-ui/icons/Battery50";
import IconBattery30 from "@material-ui/icons/Battery30";
import IconBattery20 from "@material-ui/icons/Battery20";
import IconBattery15 from "@material-ui/icons/BatteryAlert";
import IconBatteryUnknown from "@material-ui/icons/BatteryUnknown";
import Wifi0 from "@material-ui/icons/SignalWifi0Bar";
import Wifi1 from "@material-ui/icons/SignalWifi1Bar";
import Wifi2 from "@material-ui/icons/SignalWifi2Bar";
import Wifi3 from "@material-ui/icons/SignalWifi3Bar";
import Wifi4 from "@material-ui/icons/SignalWifi4Bar";
import WifiNaN from "@material-ui/icons/PermScanWifi";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/CheckCircle";
import LocationOn from "@material-ui/icons/LocationOn";
import LocationOff from "@material-ui/icons/LocationOff";
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import LineChart from "../Common/LineChart"
import MeasureStore from '../../stores/MeasureStore';
import SessionStore from '../../stores/SessionStore';
import PredizaAlertDialog from "../PredizaAlertDialog";
import PredizaFormDialog from "../PredizaFormDialog";
import GoogleMaps from "../Common/GoogleMaps/GoogleMaps";
import AccountStore from "../../stores/AccountStore";
import toolsUtils from "../../utils/toolsUtils";
import TimeSerieStore from "../../stores/TimeSerieStore"
import TokenList from "../../stores/CancelTokenList"
import Styles from "../../styles/Device/DeviceCard"
import { useTranslation } from 'react-i18next';


const tokenList = new TokenList();

export default withStyles(Styles)(function DeviceCard(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const [flags, setFlags] = useState({
        isOpen: false,
        dialogIsOpen: false,
        isRecived: false,
        dialogFormIsOpen: false
    });

    const [card, setCard] = useState({
        display: "",
        environment: null,
        device: props.device,
        mesurements: null,
    });

    const [timeSerie, setTimeSerie] = useState(null);
    const [message, setMessage] = useState("");
    const [environment, setEnvironment] = useState({});

    useEffect(() => {
        setCard({
            display: "",
            environment: null,
            device: props.device,
            mesurements: null,
        })

        setEnvironment(SessionStore.getEnvironmentDetail());

        checkDevice(card.device);

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    }

    const checkDevice = (device) => {
        let dev = {};

        if (!toolsUtils.isNullOrEmpty(device, "description")) {
            dev = {
                ...dev,
                description: device.description,
            }
        }

        if (!toolsUtils.isNullOrEmpty(device, "latitude")) {
            dev = {
                ...dev,
                latitude: device.latitude,
            }
        }

        if (!toolsUtils.isNullOrEmpty(device, "longitude")) {
            dev = {
                ...dev,
                longitude: device.longitude,
            }
        }

        if (!toolsUtils.isNullOrEmpty(device, "rssi")) {
            dev = {
                ...dev,
                rssi: device.rssi,
            }
        }

        if (!toolsUtils.isNullOrEmpty(device, "updateGPSPosition")) {
            dev = {
                ...dev,
                updateGPSPosition: device.updateGPSPosition,
            }
        }

        if (!toolsUtils.isNullOrEmpty(device, "name")) {
            dev = {
                ...dev,
                name: device.name,
            }
        }
        if (!toolsUtils.isNullOrEmpty(device, "tag")) {
            dev = {
                ...dev,
                tag: device.tag,
            }
        }
        if (!toolsUtils.isNullOrEmpty(device, "deveui")) {
            dev = {
                ...dev,
                deveui: device.deveui,
            }
        }
        let battery = null;

        if (!toolsUtils.isNullOrEmpty(device, "batterylevel")) {
            battery = device.batterylevel;
        }

        setCard({
            ...card,
            device: dev,
            stats: battery
        })

    }

    const onClickExpand = () => {
        getDeviceMesure();
    };

    const onClickDelete = () => {
        toogleDialog("dialogIsOpen");
    };

    const getSignalStatus = () => {
        if (props.device.rssi === undefined) {
            return (<Tooltip title={t('common.noSignal')} aria-label="Signal">
                <WifiNaN />
            </Tooltip>
            )
        } else if (props.device.rssi <= 0 && props.device.rssi >= -30) {
            return (
                <Tooltip title={`${t('common.signal')}: 100%`} aria-label="Signal">
                    <Wifi4 />
                </Tooltip >
            )
        } else if (props.device.rssi < -30 && props.device.rssi >= -60) {
            return (
                <Tooltip title={`${t('common.signal')}: 60%`} aria-label="Signal">
                    <Wifi3 />
                </Tooltip >
            )
        } else if (props.device.rssi < -60 && props.device.rssi >= -90) {
            return (
                <Tooltip title={`${t('common.signal')}: 40%`} aria-label="Signal">
                    <Wifi2 />
                </Tooltip >
            )
        } else if (props.device.rssi < -90 && props.device.rssi >= -120) {
            return (
                <Tooltip title={`${t('common.signal')}: 20%`} aria-label="Signal">
                    <Wifi1 />
                </Tooltip >
            )
        } else if (props.device.rssi < -120) {
            return (
                <Tooltip title={`${t('common.signal')}: 0%`} aria-label="Signal">
                    <Wifi0 />
                </Tooltip >
            )
        }
    };

    const getBatteryLevel = () => {
        const { classes } = props;

        if (!toolsUtils.isNullOrEmpty(card, "stats")) {

            let percent = card.stats * 100 / 256;
            const str = "Bateria: " + percent.toFixed(0) + "%";
            if (percent >= 97) {
                return (
                    <Tooltip title={str} aria-label="Battery">
                        <IconBattery100 className={classes.batteryIcon} />
                    </Tooltip>);
            } else if (percent >= 87 && percent < 97) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery90 className={classes.batteryIcon} />
                </Tooltip>);
            } else if (percent >= 70 && percent < 87) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery80 className={classes.batteryIcon} />
                </Tooltip>);
            } else if (percent >= 57 && percent < 70) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery60 className={classes.batteryIcon} />
                </Tooltip>);
            } else if (percent >= 45 && percent < 57) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery50 className={classes.batteryIcon} />
                </Tooltip>);
            } else if (percent >= 27 && percent < 45) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery30 className={classes.batteryIcon} />
                </Tooltip>);
            } else if (percent >= 15 && percent < 27) {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery20 className={classes.batteryIcon} />
                </Tooltip>);
            } else {
                return (<Tooltip title={str} aria-label="Battery">
                    <IconBattery15 className={classes.batteryIcon} />
                </Tooltip>);
            }
        } else {
            return (<Tooltip title="!" aria-label="Battery">
                <IconBatteryUnknown className={classes.batteryIcon} />
            </Tooltip>);
        }
    };

    const getStatus = () => {
        const { classes } = props;
        var duration = moment.duration(moment(new Date()).diff(moment(new Date(props.device.lastseenat))))
        if (isNaN(duration.asMinutes()) || duration.asMinutes() >= 15) {
            return <ErrorIcon className={classes.error} />
        } else if (duration.asMinutes() < 15 && duration.asMinutes() >= 5) {
            return <WarningIcon className={classes.warning} />
        } else {
            return <CheckIcon className={classes.success} />
        }

    };

    const resultDeleteDevice = (val) => {
        if (val === "401") {
            setMessage(t('alert.noPermission'))
        }

        if (val === "sent") {
            setCard({
                ...card,
                display: "none",
            })
        }

        toogleDialog("dialogIsOpen");
    };

    const resultGetDeviceMesurements = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setCard({
                ...card,
                mesurements: response.data,
            })
        }

        getTimeSerieBattery();
    };

    const updateDeviceDescription = (description) => {
        let dev = card.device;
        dev.description = description;

        updateDevice(dev, "description");
    }

    const updateGPSFlag = () => {
        let dev = card.device;

        if (dev.updateGPSPosition === null) {
            dev.updateGPSPosition = true
        } else {
            dev.updateGPSPosition = !dev.updateGPSPosition
        }

        updateDevice(dev, null);
    }

    const responseUpdateDevice = (response, dev, method) => {
        if (response !== null) {
            if (response === "401") {
                setMessage(t('alert.noPermission'));
                return
            }

            setCard({
                ...card,
                device: dev,
            })

            if (method !== null) {
                toogleDialog("dialogFormIsOpen");
            }
        } else {
            setMessage(t('device.card_errorChangingDevice'));
        }
    }

    const clearMessage = () => {
        setMessage("")
    }

    const toogleDialog = (flag) => {
        let toogle = flags[flag];

        setFlags({
            ...flags,
            [flag]: !toogle,
        })
    };

    const responsegetTimeSerieBattery = (response) => {
        tokenList.remove(response.id);

        if (response.data?.serie) {
            const series = response.data.serie.map(serie => {
                return {
                    time: serie.time,
                    [t("common.valueText")]: serie.value
                }
            })
            setTimeSerie(series);
        }

        let expand = flags.isOpen;
        setFlags({
            ...flags,
            isOpen: !expand,
        })
    }

    const updateDevice = (device, method) => {
        AccountStore.updateDevice(device, (response) => { responseUpdateDevice(response, device, method) });
    }

    const deleteDevice = () => {
        AccountStore.desassociateDevice(props.device.tag, resultDeleteDevice);
    };

    const getDeviceMesure = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        MeasureStore.getDeviceMeasure(cancelToken, props.device.deveui, resultGetDeviceMesurements);
    };

    const getTimeSerieBattery = () => {
        const params = {
            device: props.device.deveui,
            start: moment().subtract(36, 'hours').valueOf(),
            end: moment().valueOf(),
            group: "1h",
            function: "last",
            measure: "_BatteryLevel"
        }

        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        TimeSerieStore.getTimeSerie(cancelToken, params, responsegetTimeSerieBattery);
    }

    const getControlDeviceFlag = () => {
        let envDev = SessionStore.getEnvironmentDetail().device;

        if (envDev === null) {
            return false;
        }
        if (props.device.deveui === envDev) {
            return false;
        }

        return true;
    }

    const onClickSetControlDevice = () => {
        let envDev = SessionStore.getEnvironmentDetail();

        if (envDev.device === null) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            let env = {
                ...envDev,
                device: props.device.deveui
            }

            AccountStore.updateEnvironment(cancelToken, env, null, responseUpdateControlDevice);
        } else {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            let env = {
                ...envDev,
                device: null
            }

            AccountStore.updateEnvironment(cancelToken, env, null, responseUpdateControlDevice);
        }
    }

    const responseUpdateControlDevice = (response) => {
        tokenList.remove(response.id);
        let data = response.data;

        if (data !== null) {
            let envs = SessionStore.getEnvironments();

            for (let i = 0; i < envs.length; i++) {
                if (envs[i].objectid === data.objectid) {
                    envs[i] = data;
                }
            }

            SessionStore.setEnvironments(envs);

            if (data.device !== null) {
                setMessage(t('device.card_deviceSetAsControlPoint'));
            } else {
                setMessage(t('device.card_deviceNotControlPointAnymore'))
            }

            props.reload();
        }
    }

    return (
        <Grid item xs={12} md={3} style={{ display: card.display }}>
            <Card className={classes.card}>

                <CardContent>
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={4} >
                            <Grid container justifyContent="flex-start">
                                <Typography className={classes.device} color="textSecondary" gutterBottom>
                                    {(environment.name) ? environment.name : t('common.myEnvironmentLowercase')}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container justifyContent="flex-end">
                                <Typography className={classes.device} key={"device" + props.device.tag}>{props.device.tag}</Typography>
                                {getStatus()}
                            </Grid>
                        </Grid>
                    </Grid>
                    {!toolsUtils.isNullOrEmpty(card, "device.latitude") &&
                        <Grid container justifyContent="center">
                            <Grid item xs={12}>
                                {/* Gera o qrcode*/}
                                {/* <QR value="deveuiteste" style={{width:250,height:250,marginBottom:100,marginTop:100}}></QR> */}
                            </Grid>
                            <Grid className={classes.map}>
                                <GoogleMaps noControl device={card.device} classMap={classes.GMap} config={{
                                    center: {
                                        lat: card.device.latitude,
                                        lng: card.device.longitude,
                                    },
                                    zoom: 17,
                                }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" alignItems="center">
                                    <Typography className={classes.device} key={"device" + props.device.deveui}>{t('common.device')}: {props.device.deveui}</Typography>
                                </Grid>

                                {!toolsUtils.isNullOrEmpty(card, "device.description") &&
                                    <Grid container justifyContent="center" alignItems="center">
                                        <Typography className={classes.device} key={"desc" + props.device.deveui}>{t('common.description')}: {card.device.description}</Typography>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    }
                </CardContent>
                <CardActions className={classes.actions}>
                    <Tooltip title={t('device.card_updateGPS')} aria-label="GPS">
                        <IconButton classes={{ root: classes.iconButton }} aria-label="Share" onClick={updateGPSFlag} disabled={toolsUtils.isNullOrEmpty(card, "device.tag") || toolsUtils.isEmptyString(card.device.tag)}>
                            {(!toolsUtils.isNullOrEmpty(card, "device.updateGPSPosition") && card.device.updateGPSPosition) ? <LocationOn className={classes.onIcon} /> : <LocationOff />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={t('device.card_deviceDescription')} aria-label="Description">
                        <IconButton classes={{ root: classes.iconButton }} onClick={() => { toogleDialog("dialogFormIsOpen") }} aria-label="Add to favorites" disabled={toolsUtils.isNullOrEmpty(card, "device.tag") || toolsUtils.isEmptyString(card.device.tag)}>
                            <DescriptionIcon />
                        </IconButton>
                    </Tooltip>
                    {card.device !== null && card.device !== undefined &&
                        <Tooltip title={t('device.card_makeDeviceControlPoint')} aria-label="Control">
                            <IconButton classes={{ root: classes.iconButton }} onClick={() => { onClickSetControlDevice() }} aria-label="Add to Control" disabled={getControlDeviceFlag()}>
                                {SessionStore.getEnvironmentDetail().device === props.device.deveui &&
                                    <StarIcon />
                                }
                                {!(SessionStore.getEnvironmentDetail().device === props.device.deveui) &&
                                    <StarBorderIcon />
                                }
                            </IconButton>
                        </Tooltip>
                    }
                    <Tooltip title={t('common.remove')} aria-label="Delete">
                        <IconButton
                            classes={{ root: classes.iconButton }}
                            onClick={onClickDelete}
                            disabled={toolsUtils.isNullOrEmpty(card, "device.tag") || toolsUtils.isEmptyString(card.device.tag)}
                        >
                            <DeleteIcon />

                        </IconButton>
                    </Tooltip>
                    {getBatteryLevel()}
                    {getSignalStatus()}
                    <Grid container justifyContent="flex-end">
                        <IconButton
                            onClick={onClickExpand}
                        >
                            {flags.isOpen ? <ExpandLess /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Grid>
                </CardActions>
                <Collapse in={flags.isOpen} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center">
                                    {t('common.measurements')}
                                </Grid>
                            </Grid>
                            {card && !toolsUtils.isNullOrEmpty(card, "mesurements") &&
                                card.mesurements.map((measure) => {
                                    let m = SessionStore.getMeasure(measure.name);
                                    return (
                                        <Grid item xs={12} key={m.name}>
                                            {t(`measures.${m.name}`)}
                                        </Grid>
                                    );
                                })
                            }
                            {toolsUtils.isNullOrEmpty(card, "mesurements") &&
                                <Grid item xs={12}>
                                    <Grid container justifyContent="center">{t('device.card_deviceWithoutMeasurements')}</Grid>
                                </Grid>
                            }
                            {timeSerie &&
                                <Grid item xs={12}>
                                    <Grid container justifyContent="center">{t('device.card_battery')}</Grid>
                                    <LineChart data={timeSerie} />
                                </Grid>
                            }
                            {!timeSerie &&
                                <Grid item xs={12}>
                                    <Grid container justifyContent="center">{t('device.card_noBatteryData')}</Grid>
                                </Grid>
                            }
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
            <PredizaAlertDialog open={flags.dialogIsOpen} submit={deleteDevice} title={t('device.card_confirmUnlinkDevice')} close={() => { toogleDialog("dialogIsOpen") }} />
            <PredizaFormDialog open={flags.dialogFormIsOpen} submit={updateDeviceDescription} title={t('common.information')} description={t('device.card_addDescriptionToDevice')} default={props.device.description || ""} close={() => { toogleDialog("dialogFormIsOpen") }} />
        </Grid >
    )
})