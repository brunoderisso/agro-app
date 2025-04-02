import React, { useState } from "react";
import QrReader from 'react-qr-reader';

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

import AccountStore from "../../stores/AccountStore";
import PredizaAlertDialog from "../../components/PredizaAlertDialog"
import style from "../../styles/Device/DevicePage";
import { useTranslation } from "react-i18next";


export default withStyles(style)(function CardScan(props) {
    const { classes } = props;

    const [qr, setqr] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false)

    const { t } = useTranslation();

    const handleInputChange = (e) => setqr(e.currentTarget.value);

    const handleQrChange = (data) => {
        if(data !== null){
            setqr(data)
            setOpen(true)
        }
    }
    const closeDialog = () => {
        setqr("");
    }

    const clearMessage = () => {
        setMessage("")
    }

    const resultAssociateDevice = (value) => {

        if (value === null) {
            setMessage(t('device.scan_errorDevice'));
            return
        }

        setMessage(t('device.scan_successDevice'));
    };

    const associateDevice = () => {
        closeDialog();
        setOpen(false)
        AccountStore.associateDevice({ tag: qr }, resultAssociateDevice);
    };

    return (<Grid container >
        <Grid item xs={12} >
            <Grid container className={classes.paper}>
                <Grid item xs={12}>{t('device.scan_scanDevice')}:</Grid>
                <Grid item xs={12}>
                    <QrReader
                        delay={200}
                        onError={(err) => { console.log(err) }}
                        onScan={handleQrChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="tag"
                        label="Tag"
                        margin="normal"
                        value={qr}
                        onChange={handleInputChange}
                        className={classes.Input}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent={"flex-end"}>
                                <Button color={"primary"} onClick={() => {setOpen(true) }}>{t('common.associte')}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <PredizaAlertDialog title={t('device.scan_alertDialog') + " " + qr + "?"} open={qr.length > 0 && open} close={closeDialog} submit={associateDevice} />
                    <PredizaAlertDialog open={message.length > 0} title={message} labelSubmit={t('device.scan_newDevice')} submit={clearMessage} close={()=>{clearMessage(); props.change(0)}}/>
                </Grid>
            </Grid>
        </Grid>
    </Grid>)
})