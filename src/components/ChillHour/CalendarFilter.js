import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

import 'moment/locale/pt-br';
import 'moment/locale/es';
import moment from "moment"

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import Styles from "../../styles/Common/Calendar";


export default withStyles(Styles)(function CalendarFilter(props) {
    const { classes } = props;
    const { t, i18n: { language } } = useTranslation();

    const [startDate, setStartDate] = useState(undefined);
    const [endDate, setEndDate] = useState(undefined);
    const [selectComplete, setSelectComplete] = useState(false);
    const [flag, setFlag] = useState(false);

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
            month: n => months[n],
            day: n => days[n]
        },
        formatLong: {}
    }

    useEffect(() => {
        moment.locale(language);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (props.date !== undefined && props.date.start !== undefined) {
            setStartDate(new Date(parseInt(props.date.start)))
            setEndDate(new Date(parseInt(props.date.end)))
            setSelectComplete(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.date])

    useEffect(() => {
        if (props.get && selectComplete === true) {
            props.get(convert(startDate), convert(endDate, true));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectComplete])

    const onClickCalendar = () => {
        const f = flag;
        setFlag(!f);
    }

    const handleClickAway = () => {
        setFlag(false);
    }

    const onChange = date => {
        if (!selectComplete && !startDate) {
            setStartDate(date);
            return;
        }

        if (!selectComplete && startDate && !endDate) {
            if (moment(date).format('x') < moment(startDate).format('x')) {
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
            return;
        }
    }

    const convert = (str, flag) => {
        let s = str + "";
        let ss = s.split(' (');

        if (flag) {
            return moment(ss[0] + "").add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format('x');
        }
        return moment(ss[0] + "").format('x').toString();
    }

    const split = (str) => {
        let s = str + "";
        let ss = s.split('(');

        return moment(ss[0] + "").format('D/MMM');
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid container direction="column" alignItems="center" justifyContent="center">
                        <Button onClick={onClickCalendar} variant="contained" color="primary" className={classes.buttonCalendar}>
                            {startDate === undefined && endDate === undefined &&
                                t('common.selectPeriod')
                            }
                            {startDate !== undefined &&
                                split(startDate)
                            }
                            {endDate !== undefined &&
                                "  -  " + split(endDate)
                            }
                        </Button>
                    </Grid>
                </Grid>
                {flag &&
                    <div id={"calendar"} className={classes.newday}>
                        <DatePicker
                            selected={startDate}
                            onChange={onChange}
                            startDate={startDate}
                            endDate={endDate}
                            locale={locale}
                            selectsRange
                            inline
                        />
                    </div>
                }
            </Grid>
        </ClickAwayListener>
    )
})