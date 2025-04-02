import React, { useState, useEffect } from "react";
import { Drawer, Grid, IconButton, Tabs, TextField, Typography, MenuItem, Button, Tooltip, Switch } from "@material-ui/core";

import useStyles from "../../styles/Dashboardv2/AdvancedSettingsDrawer";
import { CloseOutlined } from "@material-ui/icons";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';

import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import PredizaSelector from "../Common/PredizaSelector/PredizaSelector";
import sessionStore from "../../stores/SessionStore";

import { ReactComponent as DevicesIcon } from "../../img/AdvancedMapIcons/DevicesIcon.svg";
import { ReactComponent as InfoIcon } from "../../img/InfoIcon.svg";
import MeasureSelector from "./PredizaMeasureSelector";
import AdvancedConfigurationStore from "../../stores/AdvancedConfigurationStore";
import { useTranslation } from "react-i18next";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{ width: "100%" }}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const refreshTimes = [10, 60, 300, 600];

function AdvancedSettingsDrawer(props) {
  const [open, setOpen] = useState(false);
  const [refreshTime, setRefreshTime] = useState(60);
  const [value, setValue] = useState(0);
  const [features, setFeatures] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const classes = useStyles();

  const [functionsList] = useState(AdvancedConfigurationStore.functionList);
  const [func, setFunc] = useState(AdvancedConfigurationStore.function);

  const { t } = useTranslation();

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(props.open);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if (open && devices.length === 0) {
      getDevices();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const bind = () => {
    AdvancedConfigurationStore.addListener("change_features", setFeatures);
  }

  const clear = () => {
    AdvancedConfigurationStore.removeListener("change_features", setFeatures);
  }

  const getDevices = () => {
    const devices = sessionStore.getEnvironmentDevices();
    AdvancedConfigurationStore.setDevices(devices);
    const itens = devices.map((device) => {
      return ({ label: device.name, alternativeLabel: device.description, objectid: device.deveui, item: device })
    })
    setDevices(itens);
    const selectedItens = devices.map((device) => {
      return (device.deveui)
    })
    setSelectedDevices(selectedItens);
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = () => {
    setOpen(!open);
    props.setOpen(!open);
  };

  const handleChangeTime = (e) => {
    setRefreshTime(e.target.value);
    AdvancedConfigurationStore.setTimeRefresh(e.target.value);
  }

  const handleChangeFunction = (e) => {
    setFunc(e.target.value);
    AdvancedConfigurationStore.setFunction(e.target.value);
  }

  const onChangeSelectedDevices = (itens) => {
    const selectedItens = itens.map((device) => {
      return (device.deveui)
    })
    AdvancedConfigurationStore.checkDevices(selectedItens);
  }

  const convertToMinutes = (valueInSeconds) => {
    if (valueInSeconds >= 60) {
      return (valueInSeconds / 60).toFixed(0) + " minutos";
    } else {
      return (valueInSeconds).toFixed(0) + " segundos"
    }
  }

  const onClickRefresh = () => {
    AdvancedConfigurationStore.refresh();
  }

  const getFeaturesManagementPanel = () => {

    return (
      <Grid container spacing={2} style={{ paddingTop: "8px" }}>
        <Grid item xs={12}>
          <Typography variant="caption" className={classes.visualizationInfo}>{t("dashboard.advancedConfigurationDrawer_info")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            {Object.keys(features).map((key) => {
              let feature = features[key];
              return (
                <Grid item xs={12}>
                  <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                      <Typography className={classes.serviceName} variant="caption">{t("services."+key)}</Typography>
                    </Grid>
                    <Grid item>
                      <Switch
                        classes={{
                          root: classes.root,
                          switchBase: classes.switchBase,
                          checked: classes.checked,
                          track: classes.track,
                        }}
                        size="small"
                        checked={feature.show_dashboard}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const getConfigurationPanel = () => {

    return (
      <Grid container className={classes.settingsContainer} spacing={3}>
        <Grid item xs={12}>
          <Grid container alignItems="flex-end" justifyContent="space-between">
            <Grid item xs={7}>
              <TextField
                fullWidth
                label={t("dashboard.autoRefresh")}
                select
                classes={{ root: classes.textFieldRoot }}
                onChange={handleChangeTime}
                SelectProps={{
                  classes: {
                    select: classes.selectRoot,
                    icon: classes.icon, // Muda a cor do ícone
                  },
                  IconComponent: ExpandMoreIcon, // Ícone customizado
                }}
                value={refreshTime || ""}
              >
                {refreshTimes.map((time) => {

                  return (
                    <MenuItem key={time} value={time}>
                      {convertToMinutes(time)}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item>
              <Button
                onClick={onClickRefresh}
                className={classes.button}
                startIcon={<RefreshIcon />}
              >
                {t("common.update")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <DevicesIcon />
                </Grid>
                <Grid item>
                  <Typography variant="overline">{t("common.collectors")}</Typography>
                </Grid>
                <Grid item style={{ marginTop: "3px" }}>
                  <Tooltip placement="top-start" title="Sobre quais coletores você deseja ver os dados">
                    <InfoIcon />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <PredizaSelector itens={devices} selectedItens={selectedDevices} buttonLabel={t("common.select")} onChangeSelectedItens={onChangeSelectedDevices} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <DevicesIcon />
                </Grid>
                <Grid item>
                  <Typography variant="overline">{t("common.measures")}</Typography>
                </Grid>
                <Grid item style={{ marginTop: "3px" }}>
                  <Tooltip placement="top-start" title="Sobre quais dados você quer ver(Temperatura, humidade, etc...).">
                    <InfoIcon />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {open &&
                <MeasureSelector />
              }
            </Grid>
            <Grid item xs={12} style={{ marginTop: "8px" }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Typography variant="overline">{t("common.function")}</Typography>
                        </Grid>
                        <Grid item style={{ marginTop: "3px" }}>
                          <Tooltip placement="top-start" title="A função aplicada sobre o valor da medida (Média do dia, Ultima medição do dia, ...).">
                            <InfoIcon />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    }
                    select
                    classes={{ root: classes.textFieldRoot }}
                    onChange={handleChangeFunction}
                    SelectProps={{
                      classes: {
                        select: classes.selectRoot,
                        icon: classes.icon, // Muda a cor do ícone
                      },
                      IconComponent: ExpandMoreIcon, // Ícone customizado
                    }}
                    value={func || ""}
                  >
                    {functionsList.map((func) => {

                      return (
                        <MenuItem key={func.value} value={func.value}>
                          {t(func.label)}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Drawer
      className={classes.drawer}
      anchor="right"
      keepMounted
      open={open}
      onClose={toggleDrawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Typography className={classes.textColor} variant="h6">{t("advancedMap.advanced_title")}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={toggleDrawer} size="small" className={classes.textColor}>
                <CloseOutlined fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Tabs
              value={value}
              classes={{ root: classes.tabs }}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab classes={{ root: classes.tab }} label={t("dashboard.adjustments_tab")} {...a11yProps(0)} />
              <Tab classes={{ root: classes.tab }} label={t("dashboard.visualization_tab")} {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              {getConfigurationPanel()}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {getFeaturesManagementPanel()}
            </TabPanel>
          </Grid>
        </Grid>
      </Grid>
    </Drawer >
  );
}

export default AdvancedSettingsDrawer;
