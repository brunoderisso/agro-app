import React, { useEffect, useState } from 'react';
import Timer from 'react-interval';
import moment from "moment";

import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CategoryIcon from "@material-ui/icons/Category"
import ScatterIcon from "@material-ui/icons/ScatterPlot";
import FunctionIcon from "@material-ui/icons/Functions";
import ScaleIcon from '@material-ui/icons/Straighten';
import FilterIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import CalendarIcon from '@material-ui/icons/CalendarToday'
import TimerIcon from '@material-ui/icons/Timer';
import RouterIcon from '@material-ui/icons/Memory';
import WarningIcon from "@material-ui/icons/Warning";

import PredizaFilter from "../PredizaFilter"
import MeasureDrawer from "../Filter/MeasureDrawer"
import PoligonDrawer from "../Poligon/PoligonDrawer"
import EnvironmentDrawer from "../Filter/EnvironmentDrawer"
import FunctionDrawer from "../Filter/FunctionDrawer"
import ScaleDrawer from "../Filter/ScaleDrawer"
import FillDrawer from "../Filter/FillDrawer"
import RefreshDrawer from "./RefreshDrawer"
import DevicesDrawer from "../Filter/DeviceDrawer"

import toolsUtils from "../../utils/toolsUtils"
import SessionStore from "../../stores/SessionStore"
import DeviceStore from '../../stores/DeviceStore';
import poligonStore from '../../stores/PoligonStore';
import styles from '../../styles/Dashboard/VerticalBar';


export default withStyles(styles)(function VerticalBar(props) {
  const { classes } = props;

  const [menuState, setMenuState] = useState(SessionStore.verticalBar);
  const [diff, setDiff] = useState(0);
  const [selected, setSelected] = useState(null);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", _handleKeyDown);

    build();

    return () => {
      document.removeEventListener("keydown", _handleKeyDown);

      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const build = () => {
    SessionStore.on("time.change", defineDiff);
    poligonStore.addListener("add.environmentpol", addEnvPol);
  };

  const clear = () => {
    SessionStore.removeListener("time.change", defineDiff);
    poligonStore.removeListener("add.environmentpol", addEnvPol);
  };

  const addEnvPol = () =>{
    setScroll(true);

    let e = { target: { dataset: { drawer: "poligon" } } };
    toggleDrawer(e);
  };

  const toggleDrawer = (e) => {
    if (e === null){
      return;
    }
    if (typeof e.persist === "function") {
      e.persist();
    }

    let open = menuState;
    //Abrir o drawer

    if (!toolsUtils.isNullOrEmpty(e.target, "dataset.drawer") && !toolsUtils.isEmptyString(e.target.dataset.drawer)) {
      if (e.target.dataset.drawer === "devices") {
        DeviceStore.emit("devices_dashboard");
      }

      Object.keys(open).forEach((key) => {
        if (key !== e.target.dataset.drawer) {
          open[key] = false;
        }
      })
      open[e.target.dataset.drawer] = !menuState[e.target.dataset.drawer];

      if (toolsUtils.isNullOrEmpty(menuState, e.target.dataset.drawer)) {
        open[e.target.dataset.drawer] = true;
      }

      setSelected(e.target.dataset.drawer);
      setMenuState(open);
      SessionStore.setVerticalBar(e.target.dataset.drawer, open[e.target.dataset.drawer]);

      return;
    }

    if (
      typeof e === "object" &&
      !toolsUtils.isNullOrEmpty(e.target, "parentElement.dataset.drawer") &&
      !toolsUtils.isEmptyString(e.target.parentElement.dataset.drawer)
    ) {
      if (e.target.parentElement.dataset.drawer === "devices") {
        DeviceStore.emit("devices_dashboard");
      }
      Object.keys(open).forEach((key) => {
        if (key !== e.target.parentElement.dataset.drawer) {
          open[key] = false;
        }
      })
      open[e.target.parentElement.dataset.drawer] = !menuState[e.target.parentElement.dataset.drawer]

      if (toolsUtils.isNullOrEmpty(menuState, e.target.parentElement.dataset.drawer)) {
        open[e.target.parentElement.dataset.drawer] = true;
      }

      setSelected(e.target.parentElement.dataset.drawer);
      setMenuState(open);
      SessionStore.setVerticalBar(e.target.parentElement.dataset.drawer, open[e.target.parentElement.dataset.drawer]);

      return;
    }

    //Fechar o drawer
    if (!toolsUtils.isEmptyString(e) && typeof e === "string") {
      Object.keys(open).forEach((key) => {
        if (key !== e) {
          open[key] = false;
        }
      })

      setSelected(e);
      open[e] = true;

      if (!toolsUtils.isNullOrEmpty(menuState, e)) {
        open[e] = !menuState[e];
      }

      setMenuState(open);
      SessionStore.setVerticalBar(e, open[e]);
    }
  };

  const _handleKeyDown = (event) => {
    if (event.keyCode === 27) {
      toggleDrawer(selected);
    }
  };

  const onClickUpdate = () => {
    let diff = SessionStore.getTimeDiff() / 3600000;
    SessionStore.setTime(diff);
  };

  const defineDiff = () => {
    setDiff(moment.duration(moment(new Date()).diff(moment(new Date(SessionStore.time.end)))).asMinutes());
  };

  return (
    <Grid container>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} />
        <List>
          <Grid container alignItems="center">
            <Grid item xs={12} data-drawer="scale">
              <ListItem button onClick={toggleDrawer} data-drawer="scale" disabled={props.view === "chillhour"} >
                <ListItemIcon data-drawer="scale">
                  <ScaleIcon data-drawer="scale" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="fill">
              <ListItem button onClick={toggleDrawer} data-drawer="fill">
                <ListItemIcon data-drawer="fill">
                  <FilterIcon data-drawer="fill" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="function">
              <ListItem button onClick={toggleDrawer} data-drawer="function" disabled={props.view === "chillhour"}>
                <ListItemIcon data-drawer="function">
                  <FunctionIcon data-drawer="function" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="devices">
              <ListItem button onClick={toggleDrawer} data-drawer="devices">
                <ListItemIcon data-drawer="devices">
                  <RouterIcon data-drawer="devices" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="measure">
              <ListItem button onClick={toggleDrawer} data-drawer="measure" disabled={props.view === "chillhour"} >
                <ListItemIcon data-drawer="measure">
                  <ScatterIcon data-drawer="measure" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="poligon">
              <ListItem button onClick={toggleDrawer} data-drawer="poligon" disabled={props.view !== "heatmap"} >
                <ListItemIcon data-drawer="poligon">
                  <CategoryIcon data-drawer="poligon" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} data-drawer="datefilter">
              <ListItem button onClick={toggleDrawer} data-drawer="datefilter">
                <ListItemIcon data-drawer="datefilter">
                  <CalendarIcon data-drawer="datefilter" />
                </ListItemIcon>
              </ListItem>
            </Grid>

            <Grid item xs={12} data-drawer="refresh" >
              <ListItem button onClick={toggleDrawer} data-drawer="refresh" disabled={props.view === "chillhour"}>
                <ListItemIcon data-drawer="refresh">
                  <TimerIcon data-drawer="refresh" />
                </ListItemIcon>
              </ListItem>
            </Grid>
            <Grid item xs={12} >
              <ListItem button onClick={onClickUpdate} disabled={props.view === "chillhour"}>
                <ListItemIcon>
                  <Badge
                    badgeContent={<WarningIcon className={classes.warning} />}
                    invisible={diff < 30}
                    className={classes.margin}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <RefreshIcon />
                  </Badge>
                </ListItemIcon>
              </ListItem>
            </Grid>
          </Grid>
        </List>

      </Drawer>

      {menuState.poligon && <PoligonDrawer openL={props.open} scroll={scroll} create={props.create} open={menuState.poligon} name="poligon" onClose={() => { toggleDrawer("poligon") }} />}
      {menuState.datefilter && <PredizaFilter open={menuState.datefilter} name="datefilter" onClose={() => { toggleDrawer("datefilter") }} />}
      {menuState.environment && <EnvironmentDrawer open={menuState.environment} name="environment" onClose={() => { toggleDrawer("environment") }} />}
      {menuState.measure && <MeasureDrawer view={props.view} name="measure" open={menuState.measure} onClose={() => { toggleDrawer("measure") }} />}
      {menuState.function && <FunctionDrawer open={menuState.function} name="function" onClose={() => { toggleDrawer("function") }} />}
      {menuState.scale && <ScaleDrawer open={menuState.scale} name="scale" onClose={() => { toggleDrawer("scale") }} />}
      {menuState.fill && <FillDrawer open={menuState.fill} name="fill" onClose={() => { toggleDrawer("fill") }} />}
      {menuState.refresh && <RefreshDrawer open={menuState.refresh} name="refresh" onClose={() => { toggleDrawer("refresh") }} />}
      {menuState.devices && <DevicesDrawer view={props.view} name="devices" open={menuState.devices} onClose={() => { toggleDrawer("devices") }} />}
      <Timer timeout={10000} enabled={true} callback={defineDiff} />
    </Grid>
  );
})