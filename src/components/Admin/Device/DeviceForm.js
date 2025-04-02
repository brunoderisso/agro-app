import React, { useState } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import history from "../../../history";


//Prediza 
import DeviceStore from "../../../stores/DeviceStore";
import LoraStore from "../../../stores/LoraStore";
import { useTranslation } from 'react-i18next';

//Others

const styles = () => ({
    Input: {
        margin: 5,
        width: "100%",
    },
    formControl: {
        paddingRight: 20
    }
});

export default withStyles(styles)(function EnvironmentForm(props) {

    const [flags, setFlags] = useState({
        isDisabled: false,
        isPublished: false
    });

    const [device, setDevice] = useState(props.device || {});

    const { t } = useTranslation();

    //Event methods
    const onChangeInput = propriety => event => {

        setDevice({
            ...device,
            [propriety]: event.target.value
        });
    };

    const togglePublish = () => {
        let flag = flags.isPublished;
        setFlags({
            ...flags,
            isPublished: !flag
        })
    };

    const onChangeSwitch = propriety => event => {
        setDevice({
            ...device,
            [propriety]: !device[propriety]
        })
    };

    const onSubmit = () => {
        if (flags.isPublished) {
            LoraStore.addLoraDevice(props.device.deveui || device.deveui, () => {

            })

        } else {
            if (props.method === "PUT") {
                LoraStore.deleteLoraDevice(props.device.deveui, () => {

                });
            }

        };

        if (props.method === "POST") {
            addDevice();
        } else if (props.method === "PUT") {
            updateDevice();
        }

    };

    const responseUpdateDevice = (response) => {
        setFlags({
            ...flags,
            isDisabled: false
        })
    };

    const responseAddDevice = (response) => {
        setFlags({
            ...flags,
            isDisabled: false
        })
        if (response !== null && response !== undefined) {
            history.push("/admin/devices");
        }
    };

    //Store methods
    const addDevice = () => {
        setFlags({
            ...flags,
            isDisabled: true
        });

        let dev = device;
        dev.latitude = parseFloat(device.latitude);
        dev.longitude = parseFloat(device.longitude);
        dev.applicationID = parseInt(device.applicationID);
        DeviceStore.addDevice(dev, responseAddDevice);
    };

    const onClickBack = () => {
        history.push("/admin/devices");
    }

    const updateDevice = () => {
        setFlags({
            ...flags,
            isDisabled: true
        })

        let dev = device;
        dev.latitude = parseFloat(device.latitude);
        dev.longitude = parseFloat(device.longitude);
        DeviceStore.updateDevice(dev, responseUpdateDevice);
    };
    const { classes } = props;

    return (
        <form className={classes.formControl} noValidate autoComplete="off">
            <Grid>
                <Grid item xs={12}>
                    <TextField
                        id="name"
                        label={t('common.name')}
                        margin="normal"
                        value={device.name || ""}
                        onChange={onChangeInput("name")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="description"
                        label={t('common.description')}
                        margin="normal"
                        value={device.description || ""}
                        onChange={onChangeInput("description")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="devaddr"
                        label={t('common.devAdress')}
                        margin="normal"
                        value={device.devaddr || ""}
                        onChange={onChangeInput("devaddr")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="deveui"
                        label={t('common.devEUI')}
                        margin="normal"
                        value={device.deveui || ""}
                        onChange={onChangeInput("deveui")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="appSKey"
                        label={t('admin.applicationSecretKey')}
                        margin="normal"
                        value={device.appSKey || ""}
                        onChange={onChangeInput("appSKey")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="nwkSKey"
                        label={t('admin.networkSecretKey')}
                        margin="normal"
                        value={device.nwkSKey || ""}
                        onChange={onChangeInput("nwkSKey")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="applicationID"
                        label={t('admin.appId')}
                        margin="normal"
                        value={device.applicationID || ""}
                        onChange={onChangeInput("applicationID")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="latitude"
                        label={t('common.latitude')}
                        margin="normal"
                        value={device.latitude || ""}
                        onChange={onChangeInput("latitude")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                        type="number"
                        step="0.01"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="longitude"
                        label={t('common.longitude')}
                        margin="normal"
                        value={device.longitude || ""}
                        onChange={onChangeInput("longitude")}
                        className={classes.Input}
                        fullWidth
                        required
                        disabled={props.method === "GET"}
                        type="number"
                        step="0.01"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={device.enable}
                                    onChange={onChangeSwitch('enable')}
                                    value="enable"
                                    color="primary"
                                    disabled={props.method === "GET"}
                                />
                            }
                            label={t('common.active')}
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={flags.isPublished}
                                    onChange={togglePublish}
                                    value="publish"
                                    color="primary"
                                    disabled={props.method === "GET"}
                                />
                            }
                            label={t('admin.putInProduction')}
                        />
                    </FormGroup>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <Button onClick={onClickBack} className={classes.Button} color="primary">{t('common.cancelButton')}</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                {props.method !== "GET" ?
                                    <Button onClick={onSubmit} className={classes.Button} disabled={flags.isDisabled} color="primary">{t('common.saveButton')}</Button>
                                    : ""}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form >);

})