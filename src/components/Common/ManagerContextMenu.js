import React, { useState, useEffect } from "react";

import Styles from "../../styles/Notebook/NotebookDashboardPage";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Menu from "@material-ui/core/Menu";
import { Collapse } from "@material-ui/core";

import MeasureStore from "../../stores/MeasureStore";
import SessionStore from "../../stores/SessionStore";
import DeviceStore from "../../stores/DeviceStore";
import toolsUtils from "../../utils/toolsUtils";

import { useTranslation } from "react-i18next";
import { AnalitycsEvent } from "../../LocalConfig";

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default withStyles(Styles)(function ManagerContextMenu(props) {
  const [state, setState] = useState(initialState);
  const [measures, setMeasures] = useState([]);
  const [radius, setRadius] = useState([]);
  const [devices, setDevices] = useState([]);
  const [fills, setFills] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [hours, setHours] = useState([]);
  const [newActions, setNewActions] = useState([]);
  const [openD, setOpenD] = useState(false);
  const [openM, setOpenM] = useState(false);
  const [openR, setOpenR] = useState(false);
  const [openF, setOpenF] = useState(false);
  const [openFnc, setOpenFnc] = useState(false);
  const [openH, setOpenH] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const { t } = useTranslation();

  const { classes } = props;

  useEffect(() => {
    setDevices(SessionStore.getDevices());
    setMeasures(SessionStore.getEnvironmentMeasurements());
    setRadius(SessionStore.getListRadius());
    setFills(SessionStore.fills);
    setFunctions(SessionStore.functions);
    setHours(SessionStore.hours);
    setNewActions(["Polígono", "Asset"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickDevices = () => {
    setOpenD(!openD);
  };

  const handleClickHours = () => {
    setOpenH(!openH);
  };

  const handleClickFill = () => {
    setOpenF(!openF);
  };

  const handleClickNew = () => {
    setOpenNew(!openNew);
  };

  const handleClickFunction = () => {
    setOpenFnc(!openFnc);
  };

  const handleClickMeasures = () => {
    setOpenM(!openM);
  };

  const handleClickRadius = () => {
    setOpenR(!openR);
  };

  const handleClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  const onChangeMeasure = (m) => {
    if (m !== "all") {
      AnalitycsEvent('Context Menu', 'click/measure/' + m, 'Change Measure');

      const p = { ...SessionStore.getPreference(), measure: m };
      SessionStore.pushPreference(p, () => {
        SessionStore.setPreference(p);
      });

      MeasureStore.setMeasure(m);
      setOpenM(false);
      handleClose();
      return;
    }

    AnalitycsEvent('Context Menu', 'click/measure/all', 'Change Measure');

    MeasureStore.setMeasure("all");
    setOpenM(false);
    handleClose();
  };

  const onChangeDevice = (d) => {
    AnalitycsEvent('Context Menu', 'click/device/' + toolsUtils.getDeviceName(d), 'Change Device');

    DeviceStore.setDevice(d.deveui);

    setOpenD(false);
    handleClose();
  };

  const getListDevices = () => {
    return (
      <Collapse in={openD} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            component="div"
            button
            className={classes.nested}
            onClick={() => {
              onChangeDevice({ deveui: "all", description: "Todos" });
            }}
          >
            {t("common.allText")}
          </ListItem>
          {devices.map((d) => {
            return (
              <ListItem
                component="div"
                key={d.deveui}
                style={
                  ((DeviceStore.devices.includes(d.deveui) ||
                    DeviceStore.devices.includes("all")) && {
                    backgroundColor: "rgba(33, 150, 243, 0.11)",
                  }) ||
                  {}
                }
                button
                className={classes.nested}
                onClick={() => {
                  onChangeDevice(d);
                }}
              >
                {toolsUtils.getDeviceName(d)}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const onChangeRadius = (r) => {
    AnalitycsEvent('Context Menu', 'click/inmet/radius-' + r, 'Change Radius');

    SessionStore.setRadius(r);
    setOpenR(false);
    handleClose();
  };

  const onChangeHours = (h) => {
    AnalitycsEvent('Context Menu', 'click/inmet/hour-' + h, 'Change Hour');

    SessionStore.setTime(h);
    setOpenH(false);
    handleClose();
  };

  const onChangeFill = (f) => {
    AnalitycsEvent('Context Menu', 'click/inmet/fill/' + f.label, 'Change Fill');

    SessionStore.setFill(f);
    setOpenF(false);
    handleClose();
  };

  const onChangeFunction = (f) => {
    AnalitycsEvent('Context Menu', 'click/inmet/function/' + f.value, 'Change Function');

    SessionStore.setFunction(f);
    setOpenFnc(false);
    handleClose();
  };

  const getHourLabel = (h) => {
    let label = h === 1 ? ` ${t('common.hour')}` : ` ${t('common.hours')}`;

    if (h <= 36) {
      return t("common.lastFeminine") + h + label;
    } else {
      return t("common.lastMasculine") + h / 24 + t("common.days");
    }
  };

  const getListRadius = () => {
    return (
      <Collapse in={openR} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {radius.map((r, i) => {
            return (
              <ListItem
                component="div"
                key={r.value + i}
                button
                className={classes.nested}
                onClick={() => {
                  onChangeRadius(r.value);
                }}
              >
                <Grid container>
                  <Grid
                    item
                    className={classes.radiusItem}
                    style={
                      (r.value === SessionStore.getRadius() && {
                        backgroundColor: "#2196f3",
                      }) ||
                      {}
                    }
                  >
                    {r.label}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const getListHours = () => {
    return (
      <Collapse in={openH} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {hours.map((h, i) => {
            return (
              <ListItem
                component="div"
                key={h + i}
                button
                className={classes.nested}
                onClick={() => {
                  onChangeHours(h);
                }}
              >
                <Grid container>
                  <Grid
                    item
                    className={classes.radiusItem}
                    style={
                      (h === SessionStore.getHour() && {
                        backgroundColor: "#2196f3",
                      }) ||
                      {}
                    }
                  >
                    {getHourLabel(h)}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const getListFills = () => {
    return (
      <Collapse in={openF} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {fills.map((f, i) => {
            return (
              <ListItem
                component="div"
                key={f.value + i}
                button
                className={classes.nested}
                onClick={() => {
                  onChangeFill(f);
                }}
              >
                <Grid container>
                  <Grid
                    item
                    style={
                      (f.label === SessionStore.fill.label && {
                        backgroundColor: "#2196f3",
                      }) || {}
                    }
                  >
                    {t("common." + f.value)}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const getListFunctions = () => {
    return (
      <Collapse in={openFnc} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {functions.map((f, i) => {
            return (
              <ListItem
                component="div"
                key={f.value + i}
                button
                className={classes.nested}
                onClick={() => {
                  onChangeFunction(f);
                }}
              >
                <Grid container>
                  <Grid
                    item
                    style={
                      (f.label === SessionStore.fill.label && {
                        backgroundColor: "#2196f3",
                      }) ||
                      {}
                    }
                  >
                    {t(f.label)}
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const getListMeasures = () => {
    return (
      <Collapse in={openM} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {!(props.context === "map") && (
            <ListItem
              component="div"
              button
              className={classes.nested}
              onClick={() => {
                onChangeMeasure("all");
              }}
            >
              {t('common.allText')}
            </ListItem>
          )}
          {measures && measures.map((m, i) => {
            return (
              <ListItem
                component="div"
                key={m.name + i}
                button
                className={classes.nested}
                onClick={() => {
                  onChangeMeasure(m.name);
                }}
              >
                {t("measures." + m.name)}
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const onClickNewAction = (action) => {
    if (action === newActions[0]) {
      if (typeof props.action === "function") {
        props.action(action);
      }
    }
    handleClose();
    return;
  };

  const handleClickRefresh = () => {
    let diff = SessionStore.getTimeDiff() / 3600000;
    SessionStore.setTime(diff);

    handleClose();
  };

  const getListNewActions = () => {
    return (
      <Collapse in={openNew} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {newActions.map((a, i) => {
            return (
              <ListItem
                component="div"
                key={a + i}
                button
                className={classes.nested}
                onClick={() => {
                  onClickNewAction(a);
                }}
              >
                <Grid container>
                  <Grid item>{a.toUpperCase()}</Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const getActions = () => {
    if (props.context === "ManagementPolygons") {
      return (
        <List>
          <Grid>
            <ListItem button onClick={handleClickNew}>
              <ListItemText primary={t("common.new")} />
              {openNew ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListNewActions()}
          </Grid>
        </List>
      );
    }

    return (
      <List>
        {props.context === "inmet" && (
          <Grid>
            <ListItem button onClick={handleClickRadius}>
              <ListItemText primary={t("common.distance")} />
              {openR ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListRadius()}
          </Grid>
        )}

        {!(props.inmetTab === 2) && (
          <Grid>
            <ListItem button onClick={handleClickMeasures}>
              <ListItemText primary={t("common.measurements")} />
              {openM ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListMeasures()}
          </Grid>
        )}
        {!(props.context === "map") && !(props.context === "inmet") && (
          <Grid>
            <ListItem button onClick={handleClickDevices}>
              <ListItemText primary={t("common.devices")} />
              {openD ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListDevices()}
          </Grid>
        )}

        {!(props.context === "map") && (
          <Grid>
            <ListItem button onClick={handleClickHours}>
              <ListItemText primary={t("common.period")} />
              {openH ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListHours()}
          </Grid>
        )}

        {!(props.context === "map") && (
          <Grid>
            <ListItem button onClick={handleClickFill}>
              <ListItemText primary={t("common.filling")} />
              {openF ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListFills()}
          </Grid>
        )}

        {!(props.context === "map") && (
          <Grid>
            <ListItem button onClick={handleClickFunction}>
              <ListItemText primary={t("common.functions")} />
              {openFnc ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {getListFunctions()}
          </Grid>
        )}
        {!(props.context === "map") && (
          <Grid>
            <ListItem button onClick={handleClickRefresh}>
              <ListItemText primary={t("common.update")} />
            </ListItem>
          </Grid>
        )}
      </List>
    );
  };

  return (
    <Grid>
      <Grid
        container
        onContextMenu={handleClick}
        style={{ cursor: "context-menu" }}
      >
        {props.children}
      </Grid>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
        PaperProps={{
          style: {
            maxHeight: 400,
            width: "25ch",
          },
        }}
      >
        {getActions()}
      </Menu>
    </Grid>
  );
});
