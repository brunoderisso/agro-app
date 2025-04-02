import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import clsx from 'clsx';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { ClickAwayListener, IconButton, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import styles from '../../../../styles/GoogleMaps/Timeline/Timeline';
import SessionStore from "../../../../stores/SessionStore";
import DatepickerCalendar from "../../DatepickerCalendar";
import GoogleMapStore from "../../../../stores/GoogleMapsStore";
import ColorStep from "./ColorStep";


export default function Timeline() {
    const classes = styles();
    const { i18n: { language } } = useTranslation();

    const [activeStep, setActiveStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [warningAlerts, setWarningAlerts] = useState(null);
    // Formato de objeto para os alertas. Ex:
    // 234321321321: {
    //     open: false,
    //     events: [
    //         { icon: "advmapCollectors", text: "services.coletor" },
    //         { icon: "advmapSatellite", text: "services.satelite" },
    //     ]
    // }

    useEffect(() => {
        moment.locale(language.toLowerCase());
        setSteps(generateWeek());
        setActiveStep(3);
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (steps.length > 0) {
            const selected = steps[activeStep].moment;
            const start = moment(selected).subtract(3, 'hours').valueOf();
            const end = moment(selected).endOf('day').subtract(3, 'hours').valueOf();

            GoogleMapStore.storeSatelliteObject(null);
            GoogleMapStore.storeTimelineActiveStep(activeStep);
            SessionStore.setCustomTime(start, end);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep, steps])

    const bind = () => {
        SessionStore.addListener('timeline.update', updateWeek);
        GoogleMapStore.addListener('activeStep_update', setActiveStep);
        GoogleMapStore.addListener('warningAlerts_handle', handleWarningAlerts);
    }

    const clear = () => {
        SessionStore.removeListener('timeline.update', updateWeek);
        GoogleMapStore.removeListener('activeStep_update', setActiveStep);
        GoogleMapStore.removeListener('warningAlerts_handle', handleWarningAlerts);
    }

    const handleWarningAlerts = (alerts) => {
        setWarningAlerts((prevState) => {
            const totalAlerts = { ...prevState };

            alerts.forEach(alert => {
                if (
                    totalAlerts[alert.date] &&
                    !totalAlerts[alert.date].events.some(event => event.icon === alert.icon && event.text === alert.text)
                ) {
                    totalAlerts[alert.date].events = [
                        ...totalAlerts[alert.date].events,
                        { icon: alert.icon, text: alert.text }
                    ]
                }
                else if (!totalAlerts[alert.date]) {
                    totalAlerts[alert.date] = {
                        open: false,
                        events: [{ icon: alert.icon, text: alert.text }]
                    }
                }
            });


            return totalAlerts;
        });
    }

    const updateWeek = (day) => {
        setSteps(generateWeek(day));
        setActiveStep(3);
        setWarningAlerts((prevState) => {
            const totalAlerts = { ...prevState };

            Object.keys(totalAlerts).forEach(day => {
                totalAlerts[day].open = false;
            })

            return totalAlerts;
        });
    }

    const generateWeek = (newDay) => {
        let center = 3;
        let today = moment();
        let week = [];

        if (newDay) {
            today = newDay;
        }

        week[center] = { label: today.format("dddd DD"), moment: today.startOf('day').valueOf() };
        for (let i = 1; i <= center; i++) {
            week[center + i] = {
                label: moment(today).add(i, 'days').format("dddd DD"),
                moment: moment(today).add(i, 'days').startOf('day').valueOf()
            };
            week[center - i] = {
                label: moment(today).subtract(i, 'days').format("dddd DD"),
                moment: moment(today).subtract(i, 'days').startOf('day').valueOf()
            };
        }

        return week;
    }

    const totalSteps = () => {
        return steps.length;
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    }

    const isFirstStep = () => {
        return activeStep === 0;
    }

    const handleNext = () => {
        const newActiveStep =
            isLastStep()
                ? activeStep
                : activeStep + 1;

        GoogleMapStore.storeFlagSatelliteGetOneDay(true);
        setActiveStep(newActiveStep);
    }

    const handlePrev = () => {
        const newActiveStep =
            isFirstStep()
                ? activeStep
                : activeStep - 1;

        GoogleMapStore.storeFlagSatelliteGetOneDay(true);
        setActiveStep(newActiveStep);
    }

    const handleDay = (index, selectedDate) => {
        GoogleMapStore.storeFlagSatelliteGetOneDay(true);
        setActiveStep(index);

        if (warningAlerts?.[selectedDate]) {
            setWarningAlerts((prevState) => {
                const totalAlerts = { ...prevState };

                totalAlerts[selectedDate].open = true;

                return totalAlerts;
            });
        }
    }

    const handleClickAway = () => {
        setOpenCalendar(false);
    }

    const hasAlerts = (step) => {
        return warningAlerts && warningAlerts[step.moment];
    }

    const closeCard = (date) => {
        setWarningAlerts((prevState) => {
            const totalAlerts = { ...prevState };

            totalAlerts[date].open = false;

            return totalAlerts;
        });
    }

    return (
        <Grid container justifyContent="center" alignContent="center" alignItems="center">
            <ClickAwayListener onClickAway={handleClickAway}>
                <Grid style={{ marginBottom: "15px" }}>
                    <Button
                        onClick={handlePrev}
                        classes={{
                            root: classes.buttonRoot
                        }}
                    >
                        {"<"}
                    </Button>
                    <Button
                        onClick={handleNext}
                        classes={{
                            root: classes.buttonRoot
                        }}
                    >
                        {">"}
                    </Button>
                    <IconButton size="small" color="white" onClick={() => setOpenCalendar(true)}>
                        <CalendarTodayIcon className={classes.calendar} />
                    </IconButton>
                    <DatepickerCalendar open={openCalendar} handleOpen={setOpenCalendar} />
                </Grid>
            </ClickAwayListener>
            <Stepper alternativeLabel nonLinear activeStep={activeStep} className={classes.timelineContainer} connector={<Grid></Grid>}>
                {steps.map((step, i) => {
                    const label = step.label
                    return (
                        <Step key={label} className={classes.step}>
                            <StepLabel
                                StepIconComponent={(props) => (
                                    <ColorStep
                                        {...props}
                                        step={step}
                                        alert={warningAlerts ? warningAlerts[step.moment] : null}
                                        hasAlerts={hasAlerts}
                                        onClickDay={() => handleDay(i, step.moment)}
                                        closeCard={closeCard}
                                    />
                                )}
                                classes={{
                                    alternativeLabel: classes.label,
                                    label: classes.label
                                }}
                                className={classes.clickable}
                            >
                                <Grid onClick={() => handleDay(i, step.moment)}>
                                    <Typography className={clsx(classes.text, {
                                        [classes.selectedText]: i === activeStep,
                                        [classes.alertedText]: hasAlerts(step),
                                    })} variant="caption">
                                        {label}
                                    </Typography>
                                </Grid>
                            </StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
        </Grid>
    )
}