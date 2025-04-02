import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

import moment from "moment";
import "moment/locale/pt-br";
import 'moment/locale/es';
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import Fade from "@material-ui/core/Fade";
import DateRangeIcon from "@material-ui/icons/DateRange";

import Styles from "../../styles/Common/Calendar";
import SessionStore from "../../stores/SessionStore";


export default withStyles(Styles)(function CalendarFilter(props) {
  const { classes } = props;
  const { t, i18n: { language } } = useTranslation();

  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [selectComplete, setSelectComplete] = useState(false);
  const [flag, setFlag] = useState(false);
  const [anchorPreset, setAnchorPreset] = useState(null);
  const [text, setText] = useState(false);
  const [first, setFirst] = useState(true);

  const months = [
    t('common.january'),
    t('common.february'),
    t('common.march'),
    t('common.april'),
    t('common.may'),
    t('common.june'),
    t('common.july'),
    t('common.august'),
    t('common.september'),
    t('common.october'),
    t('common.november'),
    t('common.december'),
  ];
  const days = [
    t('common.sunday'),
    t('common.monday'),
    t('common.tuesday'),
    t('common.wednesday'),
    t('common.thursday'),
    t('common.friday'),
    t('common.saturday'),
  ];

  const locale = {
    localize: {
      month: (n) => months[n],
      day: (n) => days[n],
    },
    formatLong: {},
  };

  useEffect(() => {
    moment.locale(language);

    if (props.date === undefined && !props.presets) {
      let time = SessionStore.getTime();
      setStartDate(new Date(parseInt(time.start)));
      setEndDate(new Date(parseInt(time.end)));
      setSelectComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.date !== undefined && props.date.start !== undefined) {
      setStartDate(new Date(parseInt(props.date.start)));
      setEndDate(new Date(parseInt(props.date.end)));
      setSelectComplete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.date]);

  useEffect(() => {
    if (props.get && selectComplete === true) {
      props.get(convert(startDate), convert(endDate, true));
    } else if (props.getEvapo && selectComplete === true) {
      props.getEvapo({
        start: convert(startDate),
        end: convert(endDate, true),
      });
      SessionStore.setCustomTime(
        parseInt(convert(startDate)),
        parseInt(convert(endDate, true))
      );
    } else if (props.global && selectComplete === true && !first) {
      SessionStore.setCustomTime(
        parseInt(convert(startDate)),
        parseInt(convert(endDate, true))
      );
    }

    if (selectComplete) {
      setText(true);
      setTimeout(() => {
        setText(false);
      }, 3000);
      SessionStore.forceCustomTime(
        parseInt(convert(startDate)),
        parseInt(convert(endDate, true))
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectComplete]);

  const onClickCalendar = () => {
    const f = flag;
    setFlag(!f);
    const t = text;
    setText(!t);
  };

  const handleClickAway = () => {
    setFlag(false);
  };

  const onChange = (date) => {
    if (!selectComplete && !startDate) {
      setStartDate(date);
      return;
    }

    if (!selectComplete && startDate && !endDate) {
      if (moment(date).format("x") < moment(startDate).format("x")) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelectComplete(true);
      onClickCalendar();
      return;
    }

    if (selectComplete && startDate && endDate) {
      setStartDate(date);
      setEndDate(undefined);
      setSelectComplete(false);
      setFirst(false);
      return;
    }
  };

  const convert = (str, flag) => {
    let s = str + "";
    let ss = s.split(" (");

    if (flag) {
      let a = moment(ss[0] + "");
      a.set("hour", 23);
      a.set("minute", 59);
      a.set("second", 59);
      return a.format("x").toString();
    }
    return moment(ss[0] + "")
      .format("x")
      .toString();
  };

  const split = (str) => {
    let s = str + "";
    let ss = s.split("(");

    return moment(ss[0] + "").format("D/MMM");
  };

  const onClickPresets = (e) => {
    setAnchorPreset(e.currentTarget);
  };

  const handleClose = (p) => {
    setPreset(p);
    setAnchorPreset(null);
  };

  const setPreset = (p) => {
    if (p === "last24") {
      let end = moment();
      let start = moment(end).subtract(24, "hours");

      setStartDate(new Date(parseInt(start.valueOf())));
      setEndDate(new Date(parseInt(end.valueOf())));

      SessionStore.forceCustomTime(
        parseInt(convert(start.valueOf())),
        parseInt(convert(end.valueOf(), true))
      );

      if (typeof props.get === "function") {
        props.get(start.valueOf(), end.valueOf());
      }
      if (typeof props.getEvapo === "function") {
        props.getEvapo({ start: start.valueOf(), end: end.valueOf() });
      }
      return;
    }
    if (p === "last") {
      let date = moment();

      let start = moment(date).subtract(1, "day");
      start.set("hour", 0);
      start.set("minute", 0);
      start.set("second", 0);

      let end = moment(date).subtract(1, "day");
      end.set("hour", 23);
      end.set("minute", 59);
      end.set("second", 59);

      if (typeof props.get === "function") {
        props.get(start.valueOf(), end.valueOf());
      }
      if (typeof props.getEvapo === "function") {
        props.getEvapo({ start: start.valueOf(), end: end.valueOf() });
      }
      return;
    }
    if (p === "today") {
      let end = moment();
      let start = moment(end);
      start.set("hour", 0);
      start.set("minute", 0);
      start.set("second", 0);

      if (typeof props.get === "function") {
        props.get(start.valueOf(), end.valueOf());
      }
      if (typeof props.getEvapo === "function") {
        props.getEvapo({ start: start.valueOf(), end: end.valueOf() });
      }
      return;
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Grid container>
        <Grid item xs={12}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            {(props.button === undefined || props.button === "default") && (
              <Grid
                item
                xs={12}
                className={(props.fixed && classes.calendarContainer) || ""}
              >
                <Button
                  onClick={onClickCalendar}
                  variant="contained"
                  color="primary"
                  className={classes.calendarButton}
                >
                  {startDate === undefined &&
                    endDate === undefined &&
                    "Selecione um período"}
                  {startDate !== undefined && split(startDate)}
                  {endDate !== undefined && "  -  " + split(endDate)}
                </Button>
                {props.presets && (
                  <Button
                    onClick={onClickPresets}
                    id="presetButton"
                    variant="contained"
                    color="primary"
                    className={classes.presetButton}
                  >
                    <ArrowDropUpIcon />
                  </Button>
                )}
              </Grid>
            )}

            {props.button === "float" && (
              <Button
                onClick={onClickCalendar}
                variant="contained"
                color="primary"
                className={classNames(
                  classes.floatButtonCalendar,
                  (props.styles && props.styles.button) || ""
                )}
              >
                <Grid
                  container
                  style={
                    (props.mobile && {
                      marginLeft: "-3px",
                      top: "-4px",
                      textAlign: "end",
                      marginTop: "-3px",
                      position: "relative",
                    }) || {
                      marginLeft: "-6px",
                      marginTop: "-3px",
                      position: "relative",
                      textAlign: "end",
                    }
                  }
                >
                  <Grid
                    item
                    xs={12}
                    style={{ position: "absolute", marginLeft: "-3px" }}
                  >
                    <Fade in={!text}>
                      <Grid
                        style={props.mobile && { whiteSpace: "break-spaces" }}
                      >
                        {startDate === undefined &&
                          endDate === undefined &&
                          "Selecione uma data"}
                        {startDate !== undefined && split(startDate)}
                        {endDate !== undefined && "  a  " + split(endDate)}
                      </Grid>
                    </Fade>
                  </Grid>
                  <Grid item xs={12}>
                    <Fade in={text}>
                      <Grid>
                        <DateRangeIcon
                          fontSize={(props.mobile && "small") || "medium"}
                        />
                      </Grid>
                    </Fade>
                  </Grid>
                </Grid>
              </Button>
            )}
          </Grid>
        </Grid>
        <Slide
          direction={(props.button === "float" && "left") || "up"}
          in={flag}
          mountOnEnter
          unmountOnExit
        >
          <div
            id={"calendar"}
            className={classNames(
              classes.newday,
              (props.styles && props.styles.calendar) || ""
            )}
          >
            <DatePicker
              id="1233214"
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              locale={locale}
              selectsRange
              inline
              allowSameDay
            />
          </div>
        </Slide>
        <Slide
          direction={"up"}
          in={Boolean(anchorPreset)}
          mountOnEnter
          unmountOnExit
        >
          <Grid container>
            <Menu
              id="Preset Menu"
              anchorEl={anchorPreset}
              keepMounted
              open={Boolean(anchorPreset)}
              onClose={handleClose}
              classes={{ paper: classes.menuPresets }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleClose("last24");
                }}
              >
                {t("common.last24Hours")}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose("last");
                }}
              >
                {t('common.yesterday')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose("today");
                }}
              >
                {t('common.today')}
              </MenuItem>
            </Menu>
          </Grid>
        </Slide>
      </Grid>
    </ClickAwayListener>
  )
});
