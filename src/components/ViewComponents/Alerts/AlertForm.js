import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Skeleton } from "@material-ui/lab";

import PredizaSelector from "../../Common/PredizaSelector/PredizaSelector";
import sessionStore from "../../../stores/SessionStore";
import AlertConditions from "./AlertConditions";
import PredizaScrollBar from "../../Common/PredizaScrollBar";
import tokens from "../../../stores/CancelTokenList";
import AlertStore from "../../../stores/AlertStore";
import styles from "../../../styles/ViewComponents/AlertForm";


function AlertForm(props) {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [alert, setAlert] = useState(null);
  const [check_interval_unity, set_check_interval_unity] = useState("minutes");
  const [retry_interval_unity, set_retry_interval_unity] = useState("minutes");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState(null);
  const [conditions, setConditions] = useState(null);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const devices = sessionStore.getEnvironmentDevices();
    const itens = devices.map((device) => {
      return ({ label: device.name, alternativeLabel: device.description, objectid: device.deveui, item: device })
    })
    setDevices(itens);

    if (props.objectid) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      AlertStore.getAlert(cancelToken, props.objectid, responseGetAlert);
    } else {
      setAlert({
        retry_interval: 3,
        check_interval: 5,
        notify: true
      })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const TimeSelector = ({ label, value, unit, onValueChange, onUnitChange, classes }) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className={classes.timeLabel} variant="outline">{label}</Typography>
        </Grid>
        <Grid item xs={2} className={classes.alignInputs}>
          <TextField
            className={classes.noSpinner}
            type="number"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            size="small"
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item>
          <Select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            size="small"
          >
            <MenuItem value="seconds">{t("common.seconds")}</MenuItem>
            <MenuItem value="minutes">{t("common.minutes")}</MenuItem>
            <MenuItem value="hours">{t("common.hoursText")}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    );
  }

  const responseGetAlert = (response) => {
    tokenList.remove(response.id);
    if (response.data) {
      let check_interval = convertToUnit(response.data.check_interval);
      let retry_interval = convertToUnit(response.data.retry_interval);
      set_check_interval_unity(check_interval.unit);
      set_retry_interval_unity(retry_interval.unit);
      setAlert({
        ...response.data,
        check_interval: check_interval.value,
        retry_interval: retry_interval.value
      });
      setSelectedDevices(response.data.devices);
      setConditions(response.data.conditions);
    }
  }

  const onChangeSelectedDevices = (itens) => {
    setAlert((prev) => (
      {
        ...prev,
        devices: itens
      }
    ))
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setAlert((prev) => ({ ...prev, [name]: value }));
  }

  const onChangeCondition = (conditions) => {
    setAlert((prev) => (
      {
        ...prev,
        conditions: conditions
      }
    ))
  }

  const handleChangeNotify = (e) => {
    setAlert((prev) => ({ ...prev, notify: e.target.checked }))
  }

  const setIntervalUnit = (value) => {
    set_check_interval_unity(value);
  }

  const setIntervalValue = (value) => {
    setAlert((prev) => ({ ...prev, check_interval: value }));
  }

  const setRetryValue = (value) => {
    setAlert((prev) => ({ ...prev, retry_interval: parseFloat(value) }));
  }

  const convertToSeconds = (seconds, unit) => {
    const value = parseFloat(seconds);
    switch (unit) {
      case 'seconds':
        return value;
      case 'minutes':
        return value * 60;
      case 'hours':
        return value * 3600;
      default:
        return value;
    }
  }

  const convertToUnit = (valueInSeconds) => {
    if (valueInSeconds >= 3600) {
      return {
        value: (valueInSeconds / 3600).toFixed(0),
        unit: 'hours'
      };
    } else if (valueInSeconds >= 60) {
      return {
        value: (valueInSeconds / 60).toFixed(0),
        unit: 'minutes'
      };
    } else {
      return {
        value: valueInSeconds.toFixed(0),
        unit: 'seconds'
      };
    }
  }

  const saveAlert = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setDisabled(true);

    const alertModel = {
      ...alert,
      enable: alert.enable || true,
      devices: alert.devices.map((a) => { return a.deveui }),
      check_interval: convertToSeconds(alert.check_interval, check_interval_unity),
      retry_interval: convertToSeconds(alert.retry_interval, retry_interval_unity)
    }

    if (alertModel.objectid) {
      AlertStore.updateAlert(cancelToken, alertModel, responseAddAlert);
    } else {
      AlertStore.addAlert(cancelToken, alertModel, responseAddAlert);
    }
  }

  const responseAddAlert = (response) => {
    tokenList.remove(response.id);
    if (response.data) {
      AlertStore.emit("alerts_change");
      props.onClickBack();
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <IconButton
              size="small"
              disabled={disabled}
              className={classes.textColor}
              onClick={props.onClickBack}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h5" className={classes.title}>
              {t("alertPage.configureAlert")}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              className={classes.confirmButton}
              disabled={disabled}
              onClick={saveAlert}
            >
              <CheckIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      {!alert &&
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Skeleton variant="rect" width={"100%"} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" width={"100%"} height={150} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" width={"100%"} height={150} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rect" width={"100%"} height={150} />
            </Grid>
          </Grid>
        </Grid>
      }
      {alert &&
        <Grid item xs={12}>
          <PredizaScrollBar customHeight={"calc(100vh - 150px)"}>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  className={classes.textFieldSearch}
                  size="small"
                  autoFocus
                  name="name"
                  placeholder={t("alertPage.nameAlert")}
                  fullWidth
                  value={alert.name || ""}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Accordion elevation={0} className={classes.accordion} defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="conditions"
                      >
                        <Typography className={classes.accordionLabel} variant="overline">{t("common.conditions")}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography variant="caption" className={classes.textCaption}>
                              {t("alertPage.text_createAlert")}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <AlertConditions alert={alert} conditions={conditions} onChange={onChangeCondition} />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Accordion elevation={0} className={classes.accordion} defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="devices_selector"
                      >
                        <Typography className={classes.accordionLabel} variant="overline">{t("common.devices")}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <PredizaSelector itens={devices} selectedItens={selectedDevices} buttonLabel={t("alertPage.selectDevices")} onChangeSelectedItens={onChangeSelectedDevices} />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    <Accordion elevation={0} className={classes.accordion}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        id="devices_selector"
                      >
                        <Typography className={classes.accordionLabel} variant="overline">{t("advancedmap.advanced_title")}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={<Switch
                                classes={{
                                  root: classes.root,
                                  switchBase: classes.switchBase,
                                  checked: classes.checked,
                                  track: classes.track,
                                }}
                                size="small"
                                checked={alert.notify}
                                onChange={handleChangeNotify}
                                name="notify" />}
                              label={t("common.notifications")}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <TimeSelector
                                  label={t("alertPage.checkingTime")}
                                  value={alert.check_interval}
                                  unit={check_interval_unity}
                                  classes={classes}
                                  onValueChange={setIntervalValue}
                                  onUnitChange={setIntervalUnit}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <Grid container spacing={1}>
                                  <Grid item xs={12}>
                                    <Typography className={classes.timeLabel} variant="outline">{t("alertPage.newTries")}</Typography>
                                  </Grid>
                                  <Grid item xs={2} className={classes.alignInputs}>
                                    <TextField
                                      className={classes.noSpinner}
                                      type="number"
                                      value={alert.retry_interval}
                                      onChange={(e) => setRetryValue(e.target.value)}
                                      size="small"
                                      inputProps={{ min: 0 }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </PredizaScrollBar>
        </Grid>
      }
    </Grid>
  )
}

export default AlertForm;