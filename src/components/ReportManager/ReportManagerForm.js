import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import moment from 'moment';
/* import locale from "date-fns/locale/pt-BR"; */

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../styles/Report/ReportForm";
import Modal from '@material-ui/core/Modal';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import PredizaAlertDialog from '../PredizaAlertDialog';
import sessionStore from '../../stores/SessionStore';
import reportStore from '../../stores/ReportStore';
import CancelTokenList from '../../stores/CancelTokenList';

export default withStyles(styles)(function ReportForm(props) {
    const { classes } = props;
    const { t } = useTranslation();
    const tokenList = new CancelTokenList();

    const [open, setOpen] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [dialogDel, setDialogDel] = useState(false);
    const [message, setMessage] = useState("");
    const [report, setReport] = useState({});

    const [measures, setMeasures] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getMeasures();
        getFunctions();
        getPeriods();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMessage(props.message);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.message]);

    useEffect(() => {
        setOpen(props.open);
        setErrors({
            measure: false,
            function: false,
            interval: false,
            secret: false,
        })
        if (props.selected && props.selected.objectid === '') {
            setReport({
                measure: "",
                function: "MEAN",
                interval: 2592000,
                enable: false,
                secret: "",
                objectid: null,
            })
        } else {
            setReport(props.selected);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.open]);

    const clearMessage = () => {
        setMessage("");
    }

    const getMeasures = () => {
        let m = sessionStore.getEnvironmentMeasurements();
        setMeasures(m);
    }
    const getFunctions = () => {
        let functions = sessionStore.functions;
        setFunctions(functions);
    }
    const getPeriods = () => {
        let p = [24, 36, 168, 360, 720];
        let periods = [];

        for (let i = 0; i < p.length; i++) {
            if (p[i] <= 36) {
                periods.push({ label: t('common.hours'), hour: p[i], value: p[i] * 3600 });
            } else {
                periods.push({ label: t('common.days'), hour: p[i] / 24, value: p[i] * 3600 });
            }
        }

        setPeriods(periods);
    }

    const handleChange = (name) => (event) => {
        if (name === "enable") {
            setReport({
                ...report,
                [name]: event.target.checked,
            })
        } else {
            setReport({
                ...report,
                [name]: event.target.value,
            })
        }
    }

    const handleDateChange = (type) => (date) => {
        if (type === 'startedat') {
            setReport({
                ...report,
                startedat: date,
            })
        }
        if (type === 'endedat') {
            setReport({
                ...report,
                endedat: date,
            })
        }
    }

    const apply = () => {
        if (report.measure === "") {
            setErrors({
                ...errors,
                measure: true
            })
            return
        } else {
            setErrors({
                ...errors,
                measure: false
            })
        }

        if (report.function === "") {
            setErrors({
                ...errors,
                function: true
            })
            return
        } else {
            setErrors({
                ...errors,
                function: false
            })
        }

        if (report.interval === 0) {
            setErrors({
                ...errors,
                interval: true,
            })
            return
        } else {
            setErrors({
                ...errors,
                interval: false,
            })
        }

        if (report.secret === "") {
            setErrors({
                ...errors,
                secret: true
            })
            return
        } else {
            setErrors({
                ...errors,
                secret: false
            })
        }

        setErrors({
            measure: false,
            function: false,
            interval: false,
            secret: false,
        })

        let r = {
            ...report,
            startedat: moment(report.startedat).toISOString(true),
            endedat: moment(report.endedat).toISOString(true),
        }

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        if (r.objectid) {
            reportStore.updateReport(r, cancelToken, responseUpReport);
        } else {
            reportStore.addReport(r, cancelToken, responseAddReport);
        }
    }

    const responseAddReport = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null && response.data !== undefined) {
            setDialog(true);
        }

    }

    const responseUpReport = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null && response.data !== undefined) {
            setMessage(t('alert.successfullyUpdated'));
            props.att();
            props.close();
        }
    }

    const responseDelReport = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null && response.data !== undefined) {
            setMessage(t('alert.successfullyDeleted'));
            props.att();
            onCloseDel();
            props.close();
        }
    }

    const onDelete = () => {
        setDialogDel(true);
    }

    const onCloseDel = () => {
        setDialogDel(false);
    }

    const onConfirmDel = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        reportStore.deleteReport(report, cancelToken, responseDelReport)
    }

    const onClose = () => {
        setDialog(false);
        props.att();
        props.close();
    }

    const body = (
        <div className={classes.paper}>
            <Grid container>
                <PredizaAlertDialog method={"alert"} title={t('alert.reportSuccessfullyCreated')} open={dialog} close={onClose} />
                <PredizaAlertDialog title={t('alert.confirmDeleteReport')} open={dialogDel} close={onCloseDel} submit={onConfirmDel} />
                <Grid item xs={12} className={classes.modalTitle} >
                    <Grid container>
                        <Grid item xs={10}>
                            {t('report.form_createReport')}
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton aria-label="delete" className={classes.closeButton} onClick={() => { props.close() }}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={classes.formContainer}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {t('common.mean')}:
                                </Grid>
                                <FormControl className={classes.formControl} error={errors.measure}>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={report.measure}
                                        onChange={handleChange('measure')}
                                    >
                                        {measures.length > 0 && measures.map((m, i) => {
                                            return (
                                                <MenuItem key={m.name + i} value={m.name}>
                                                    {(m.meta && m.meta.title) || m.name}
                                                </MenuItem>
                                            )
                                        })}

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {t('common.function')}:
                                </Grid>
                                <FormControl className={classes.formControl} error={errors.function}>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={report.function}
                                        onChange={handleChange('function')}
                                    >
                                        {functions.length > 0 && functions.map((m, i) => {
                                            return (
                                                <MenuItem key={m.value + i} value={m.value}>
                                                    {t(sessionStore.getOptionsFunction().find(
                                                        func => func.value === m.value
                                                    )?.label || "")}
                                                </MenuItem>
                                            )
                                        })}

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {t('common.interval')}:
                                </Grid>
                                <FormControl className={classes.formControl} error={errors.interval}>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={report.interval}
                                        onChange={handleChange('interval')}
                                    >
                                        {periods.length > 0 && periods.map((m, i) => {
                                            return (
                                                <MenuItem key={m.value + i} value={m.value}>
                                                    {`${t('common.every')} ` + m.hour + " " + m.label}
                                                </MenuItem>
                                            )
                                        })}

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            disableToolbar
                                            variant="start"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-start"
                                            label={t('report.form_scheduleStart')}
                                            value={report.startedat}
                                            onChange={handleDateChange('startedat')}
                                            KeyboardButtonProps={{
                                                'aria-label': t('report.form_scheduleStart'),
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <KeyboardDatePicker
                                            fullWidth
                                            disableToolbar
                                            variant="end"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-end"
                                            label={t('report.form_scheduleEnd')}
                                            value={report.endedat}
                                            onChange={handleDateChange('endedat')}
                                            KeyboardButtonProps={{
                                                'aria-label': t('report.form_scheduleEnd'),
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid>
                                {t('common.password')}:
                            </Grid>
                            <TextField
                                fullWidth
                                error={errors.secret}
                                value={report.secret}
                                onChange={handleChange('secret')}
                                id="standard-password-input"
                                label={t('report.form_pdfPassword')}
                                type="password"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={report.enable}
                                        onChange={handleChange('enable')}
                                        name={t('report.form_activateReportDelivery')}
                                        color="primary"
                                    />
                                }
                                label={t('common.enableDisable')}
                            />
                        </Grid>
                        {(report.objectid === undefined || report.objectid === null) &&
                            <Grid item xs={12} className={classes.center}>
                                <Button variant="contained" color="primary" onClick={apply} className={classes.addButton}>
                                    {t('common.addButton')}
                                </Button>
                            </Grid>
                        }
                        {report.objectid !== null && report.objectid !== undefined &&
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={6} spacing={2} className={classes.center}>
                                        <Button variant="contained" color="primary" onClick={apply} className={classes.addButton}>
                                            {t('common.saveButton')}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={6} spacing={2} className={classes.center}>
                                        <Button variant="contained" classes={{ root: classes.deleteButton }} onClick={onDelete} className={classes.addButton}>
                                            {t('common.deleteButton')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <div>
            <PredizaAlertDialog method={"alert"} title={message} open={message.length > 0} close={clearMessage} />

            <Modal
                open={open}
                onClose={props.close}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Zoom in={open} timeout={700}>
                    {body}
                </Zoom>
            </Modal>

        </div>

    );
})