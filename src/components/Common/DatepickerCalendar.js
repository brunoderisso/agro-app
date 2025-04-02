import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";

import moment from "moment";
import PropTypes from 'prop-types';

import { Grid, Slide, withStyles } from "@material-ui/core";

import sessionStore from "../../stores/SessionStore";
import Styles from "../../styles/Common/DatepickerCalendar";
import GoogleMapStore from "../../stores/GoogleMapsStore";


function DatepickerCalendar(props) {
  const { classes } = props;
  const { t, i18n: { language } } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [startDate, setStartDate] = useState(undefined);
  const [open, setOpen] = useState(false);

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

    if (props.date === undefined) {
      const time = sessionStore.getTime();

      setSelectedDate(moment(parseInt(time.end)).valueOf());
      setStartDate(moment(parseInt(time.end)).subtract(3, 'days').startOf('day').valueOf());
      setEndDate(moment(parseInt(time.end)).add(3, 'days').startOf('day').valueOf());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  const onClickCalendar = () => {
    setOpen(prev => !prev);

    if (typeof props.handleOpen === "function") {
      props.handleOpen(!open);
    }
  }

  const onChange = (date) => {
    setSelectedDate(moment(date).valueOf());
    setStartDate(moment(date).subtract(3, 'days').startOf('day').valueOf());
    setEndDate(moment(date).add(3, 'days').startOf('day').valueOf());
    onClickCalendar();

    GoogleMapStore.storeFlagSatelliteGetOneDay(false);
    sessionStore.emit('timeline.update', moment(date));
  }

  return (
    <Grid container>
      <Slide
        direction={"up"}
        in={open}
        mountOnEnter
        unmountOnExit
      >
        <Grid
          id={"calendar"}
          className={classes.newday}
        >
          <DatePicker
            id="1233214"
            selected={selectedDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            locale={locale}
            selectsRange
            inline
            allowSameDay
          />
        </Grid>
      </Slide>
    </Grid>
  )
}

DatepickerCalendar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
}

export default withStyles(Styles)(DatepickerCalendar)