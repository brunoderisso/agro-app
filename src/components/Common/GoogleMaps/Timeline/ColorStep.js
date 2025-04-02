import React from "react";

import clsx from 'clsx';

import { Grid, withStyles } from "@material-ui/core";

import theme from "../../../../styles/Utils/theme";
import AdvancedMapIcons from "../MapSideMenu/AdvancedMapIcons";
import AlertsCard from "./AlertsCard";


const useColorlibStepIconStyles = {
  root: {
    backgroundColor: theme.colors.onPrimary,
    zIndex: 1,
    width: 157,
    height: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: theme.colors.primary[80],
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  alert: {
    backgroundColor: theme.colors.error[87],
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
  alertIcon: {
    transform: "scale(0.67)"
  },
  containerAlerts: {
    marginTop: "-28px",
    marginBottom: "4px"
  },
  wrapperCard: {
    marginTop: "-101px",
    marginBottom: "35px",
    width: "100%",
  }
};

const allStyles = Object.assign({}, useColorlibStepIconStyles, AdvancedMapIcons);

export default withStyles(allStyles)(function ColorStep(props) {
  const { active, completed, alert, step, classes, hasAlerts, onClickDay, closeCard } = props;

  return (
    <Grid>
      <Grid container>
        {alert?.open &&
          <Grid style={{ marginTop: `${-101 - (alert.events.length * 24)}px` }} className={classes.wrapperCard}>
            <AlertsCard alert={alert} date={step.moment} onClose={closeCard} />
          </Grid>
        }
      </Grid>
      {/* Renderização dos ícones de eventos do alerta */}
      <Grid container onClick={onClickDay}>
        {alert?.events.map((event, index) => {
          return (
            <Grid key={index} item className={classes.containerAlerts}>
              <i className={clsx(
                classes.sprite,
                classes[`${event.icon}E87`],
                classes.alertIcon
              )}></i>
            </Grid>
          )
        })}
        <Grid
          className={clsx(classes.root, "hoveredStep", {
            [classes.active]: active,
            [classes.completed]: completed,
            [classes.alert]: hasAlerts(step),
          })}
        >
        </Grid>
      </Grid>
    </Grid>
  );
})