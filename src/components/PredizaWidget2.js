import React, { useState, useEffect } from "react";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import MeasureInfo from "../components/Measure/MeasureInfo";
import MeasureStore from "../stores/MeasureStore";
import SessionStore from "../stores/SessionStore";

// External weather icons
import '../css/weather-icons.css';

import styles from "../styles/Widgets/PredizaWidget"


export default withStyles(styles)(function Widget(props) {
  const [color, setColor] = useState([]);
  const [open, setOpen] = useState(false);

  const { classes } = props;

  useEffect(() => {
    setOpen(true);
    SessionStore.on("environment.change", () => {
      if (!open) {
        return
      }
      getColor();
    });
    getColor();

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    setOpen(false);
  }

  const getColor = () => {
    let t = MeasureStore.getGradientColor(props.measure, props.stats);
    if (t !== undefined && t.length !== 0) {
      setColor(t);
    }
  }

  let style = { backgroundColor: "white" }

  if (color.length > 0) {
    if (color[0].percent < color[1].percent) {
      style = { background: "radial-gradient(circle, " + color[1].color + " 0%, " + color[0].color + " " + (100 - color[0].percent) + "%)" }
    } else {
      style = { background: "radial-gradient(circle, " + color[0].color + " 0%, " + color[1].color + " " + (100 - color[1].percent) + "%)" }
    }
  }

  return (
    <Card className={classes.widgetCard} classes={{ root: classes.root }} style={style}>
      <CardContent>
        <MeasureInfo stats={props.stats} measure={props.measure} device={props.device || null} />
      </CardContent>
    </Card>
  )
})