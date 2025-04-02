import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import history from '../../../history';

import { Button, Card, Collapse, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Skeleton } from '@material-ui/lab';

import useStyles from '../../../styles/GoogleMaps/DeviceCard';
import { ConstantsUtils } from '../../../utils/constantsUtils';
import sessionStore from '../../../stores/SessionStore';
import measureStore from '../../../stores/MeasureStore';


function DeviceCard(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [measure, setMeasure] = useState(sessionStore.getPreference()?.measure);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const bind = () => {
        measureStore.addListener("change.measure", changeMeasure);
    }

    const clear = () => {
        measureStore.removeListener("change.measure", changeMeasure);
    }

    const changeMeasure = () => {
        setMeasure(sessionStore.getPreference().measure);

        if (typeof props.handleInfoMeasure === "function") {
            props.handleInfoMeasure(props.device);
        }
    }

    const onClose = () => {
        if (typeof props.handleClose === "function") {
            props.handleClose(props.device);
        }
    }

    const appendTextInfoWindows = (value, isMainValue) => {
        const meta = props.device.measures.find(measu => measu.name === measure)?.meta || '';

        return (
            <>
                <span className={clsx({
                    [classes.textH3]: isMainValue
                })}>{value.toFixed(2).replace('.', ',')}</span>
                <span className={clsx({
                    [classes.textH4]: isMainValue
                })}>{meta}</span>
            </>
        );
    }

    const handleChangeAccordion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const redirectDetails = () => {
        history.push('/chart');
    }

    return (
        <Card className={classes.container}>
            {props.device
                ? <>
                    <Grid container>
                        <Grid item xs={11}>
                            <Typography variant='overline' className={classes.outlineText}>{props.device.description}</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton size="small" onClick={onClose}>
                                <CloseIcon className={classes.iconBt} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '8px' }}>
                        <Typography variant='subtitle2' className={classes.defaultText}>
                            {t(`measures.${measure}`)}
                        </Typography>
                    </Grid>
                    <Grid className={classes.marginContainer}>
                        <Typography>
                            {props.device.measure?.value
                                ? appendTextInfoWindows(props.device.measure.value, true)
                                : <span className={classes.textH3}>{ConstantsUtils.NotANumber}</span>
                            }
                        </Typography>
                    </Grid>

                    <Grid container justifyContent="center" className={classes.marginContainer}>
                        <Collapse mountOnEnter unmountOnExit timeout={500} in={expanded}>
                            <Grid>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant='caption' className={clsx(classes.marginText, classes.outlineText)}>
                                            {t(`advancedmap.standardDeviation`)}
                                        </Typography>
                                        <Typography variant='caption' className={clsx(classes.defaultText, classes.textH6)}>
                                            {props.device.measure?.stddev
                                                ? `±${props.device.measure.stddev.toFixed(1).replace('.', ',')}`
                                                : ConstantsUtils.NotANumber
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant='caption' className={clsx(classes.marginText, classes.outlineText)}>
                                            {t(`common.max`)}
                                        </Typography>
                                        <Typography variant='caption' className={clsx(classes.defaultText, classes.textBody)}>
                                            {props.device.measure?.max
                                                ? appendTextInfoWindows(props.device.measure.max)
                                                : ConstantsUtils.NotANumber
                                            }
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant='caption' className={clsx(classes.marginText, classes.outlineText)}>
                                            {t(`common.min`)}
                                        </Typography>
                                        <Typography variant='caption' className={clsx(classes.defaultText, classes.textBody)}>
                                            {props.device.measure?.min
                                                ? appendTextInfoWindows(props.device.measure.min)
                                                : ConstantsUtils.NotANumber
                                            }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Button color="primary" size='small' className={classes.btPrimary} onClick={redirectDetails}>
                                    <Typography variant='button' className={classes.textBt}>
                                        {t(`advancedmap.moreDetails`)}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Collapse>

                        <IconButton onClick={handleChangeAccordion} size='small'>
                            <ExpandMoreIcon className={clsx(classes.iconBt, {
                                [classes.iconRotate]: expanded,
                                [classes.iconInitRotate]: !expanded,
                            })} />
                        </IconButton>
                    </Grid>
                </>
                : <Grid container spacing={2} style={{ paddingBottom: "8px" }}>
                    <Grid item xs={12}>
                        <Skeleton variant="text" width={"80%"} height={20} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="text" width={"100%"} height={20} />
                    </Grid>
                    <Grid item xs={12}>
                        <Skeleton variant="rect" width={"100%"} height={60} />
                    </Grid>
                    <Grid container item xs={12} justifyContent="center">
                        <Skeleton variant="circle" width={20} height={20} />
                    </Grid>
                </Grid>
            }
        </Card>
    )
}

DeviceCard.propTypes = {
    device: PropTypes.object,
    handleClose: PropTypes.func,
    handleInfoMeasure: PropTypes.func, // Props para o device, inmet não usa
};

export default DeviceCard;