import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";

import { ReactComponent as EnvironmentIcon } from "../../img/EnvironmentIcon.svg";
import { ReactComponent as RastreabilityIcon } from "../../img/RastreabilityIcon.svg";
import { ReactComponent as DiseaseIcon } from "../../img/DiseaseIcon.svg";
import { ReactComponent as TasksIcon } from "../../img/TasksIcon.svg";
import { ReactComponent as GenerateIcon } from "../../img/GenerateIcon.svg";
import { ReactComponent as DashboardIcon } from "../../img/DashboardIcon.svg";
import { ReactComponent as ManagementIcon } from "../../img/SettingsIcon.svg";

import sizes from "../../styles/Utils/DashboardTheme";
import CalendarFilter from "../Common/CalendarFilter";
import { useTranslation } from "react-i18next";

const drawerWidth = 80;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#1455BE",
  },
  drawerContainer: {
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  centerItems: {
    textAlign: "center",
    minWidth: "73px",
  },
  drawerIcon: {
    transform: "scale(0.75)",
    position: "relative",
  },
  drawerIcon_: {
    filter: "brightness(20)",
    transform: "scale(0.75)",
    position: "relative",
  },
  drawerButton: {
    background: "white",
    borderRadius: "50%",
    maxWidth: "44px",
    height: "44px",
    position: "relative",
    left: "15px",
  },
  drawerButton_: {
    background: "#4285F4",
    borderRadius: "50%",
    maxWidth: "44px",
    height: "44px",
    position: "relative",
    left: "15px",
  },
  drawerText: {
    color: "white",
    fontSize: "11px",
    marginTop: "3px",
  },
  containerButtons: {
    maxWidth: "100%",
    padding: "5px",
    textAlign: "center",
  },
  calendarPosition: {
    left: "auto",
    right: "65px",
    top: "74px",
    bottom: "auto",
    [theme.breakpoints.down(sizes.xs)]: {
      right: "5%",
      top: "100px",
    },
  },
  buttonPosition: {
    zIndex: 1999,
    right: "10px",
    top: "74px",
    fontSize: "8px",
    lineHeight: "10px",
  },
}));

export default function NotebookDrawer(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              button
              onClick={() => {
                props.changeComponent("properties");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "properties" &&
                      classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <EnvironmentIcon
                    className={
                      (props.component === "properties" &&
                        classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuProperties")}
                </Grid>
              </Grid>
            </ListItem>

            <ListItem
              button
              onClick={() => {
                props.changeComponent("disorder");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "disorder" && classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <DiseaseIcon
                    style={{
                      position: "relative",
                      right: "2.5px",
                      bottom: "1px",
                    }}
                    className={
                      (props.component === "disorder" && classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuPests")}
                </Grid>
              </Grid>
            </ListItem>

            <ListItem
              button
              onClick={() => {
                props.changeComponent("tags");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "tags" && classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <RastreabilityIcon
                    className={
                      (props.component === "tags" && classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuTag")}
                </Grid>
              </Grid>
            </ListItem>

            <ListItem
              button
              onClick={() => {
                props.changeComponent("tasks");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "tasks" && classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <TasksIcon
                    className={
                      (props.component === "tasks" && classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuTasks")}
                </Grid>
              </Grid>
            </ListItem>

            <ListItem
              button
              onClick={() => {
                props.changeComponent("dashboard");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "dashboard" && classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <DashboardIcon
                    style={{ transform: "scale(1.5)", marginTop: "10px" }}
                    className={
                      (props.component === "dashboard" && classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuDashboard")}
                </Grid>
              </Grid>
            </ListItem>

            {/* <ListItem button onClick={() => { props.changeComponent("inmet") }} className={classes.containerButtons}>
                            <Grid container className={classes.centerItems}>
                                <Grid item xs={12} className={(props.component === "inmet" && classes.drawerButton) || classes.drawerButton_}>
                                    <InmetIcon style={{transform: "scale(1.5)", marginTop: "10px"}} className={(props.component === "inmet" && classes.drawerIcon) || classes.drawerIcon_} />
                                </Grid>
                                <Grid item xs={12} className={classes.drawerText}>
                                    Inmet
                                </Grid>
                            </Grid>
                        </ListItem> */}

            {props.component === "disorder" && (
              <Grid>
                <CalendarFilter
                  global
                  button={"float"}
                  styles={{
                    calendar: classes.calendarPosition,
                    button: classes.buttonPosition,
                  }}
                />
              </Grid>
            )}
            {/* <ListItem button onClick={() => { props.changeComponent("PageGenerator") }} className={classes.containerButtons}>
                            <Grid container className={classes.centerItems}>
                                <Grid item xs={12} className={(props.component === "PageGenerator" && classes.drawerButton) || classes.drawerButton_}>
                                    <RastreabilityPageIcon className={(props.component === "PageGenerator" && classes.drawerIcon) || classes.drawerIcon_} />
                                </Grid>
                                <Grid item xs={12} className={classes.drawerText}>
                                    Rastreio
                                </Grid>
                            </Grid>
                        </ListItem> */}
            <Divider />
            <ListItem
              button
              onClick={() => {
                props.changeComponent("generate");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "generate" && classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <GenerateIcon
                    className={
                      (props.component === "generate" && classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t("notebook.menuReports")}
                </Grid>
              </Grid>
            </ListItem>
            <ListItem
              button
              onClick={() => {
                props.changeComponent("management");
              }}
              className={classes.containerButtons}
            >
              <Grid container className={classes.centerItems}>
                <Grid
                  item
                  xs={12}
                  className={
                    (props.component === "management" &&
                      classes.drawerButton) ||
                    classes.drawerButton_
                  }
                >
                  <ManagementIcon
                    className={
                      (props.component === "management" &&
                        classes.drawerIcon) ||
                      classes.drawerIcon_
                    }
                  />
                </Grid>
                <Grid item xs={12} className={classes.drawerText}>
                  {t('notebook.menuManage')}
                </Grid>
              </Grid>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}
