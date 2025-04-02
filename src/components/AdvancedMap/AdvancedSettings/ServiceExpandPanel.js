import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import useStyles from "../../../styles/GoogleMaps/AdvancedSettings/ServicesDrawer";
import GMapStore from '../../../stores/GoogleMapsStore';
import CustomOutlineSelect from '../../Common/CustomOutlineSelect';
import sessionStore from '../../../stores/SessionStore';


function ServiceExpandPanel(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [expanded, setExpanded] = useState(false);
    const [visualization, setVisualization] = useState(GMapStore.getLayer());
    const [toggleDistance, setToggleDistance] = useState(sessionStore.getRadius());

    const previewModeOptions = [
        { value: 'heatmap', label: 'advancedmap.advanced_collectorViewIntensity' },
        { value: 'interpolation', label: 'advancedmap.advanced_collectorViewInterpolation' },
    ]
    const viewModeDescription = t('advancedmap.advanced_collectorViewDescription')

    useEffect(() => {
        bind();

        return clear;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.expand) {
            setExpanded(props.title);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.expand]);

    useEffect(() => {
        if (props.recall) {
            setExpanded(false);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.recall]);

    useEffect(() => {
        if (expanded === props.title) {
            GMapStore.emit('accordionPanel_change', true);
        } else {
            GMapStore.emit('accordionPanel_change', false);
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded]);

    useEffect(() => {
        if (visualization !== GMapStore.getLayer()) {
            GMapStore.setLayer(visualization);
        }
    }, [visualization]);

    const bind = () => {
        GMapStore.addListener("advancedPanel_close", setExpanded);
        GMapStore.addListener("advancedDrawer_click", handleOpenedService);
    }

    const clear = () => {
        GMapStore.removeListener("advancedPanel_close", setExpanded);
        GMapStore.removeListener("advancedDrawer_click", handleOpenedService);
    }

    const handleOpenedService = () => {
        setExpanded(GMapStore.getSelectedMenuItem())
    }

    const handleChangeVisualization = (e) => {
        setVisualization(e.target.value);
    }

    const handleChangeAccordion = () => (_, isExpanded) => {
        setExpanded(isExpanded ? props.title : false);

        if (!isExpanded && typeof props.handleExpand === 'function') {
            props.handleExpand(false);
        }

        if (isExpanded && typeof props.handleRecall === 'function') {
            props.handleRecall(false);
        }
    }

    const handleDistanceInmet = (_, newDistance) => {
        setToggleDistance(+newDistance);

        if (GMapStore.getSelectedMenuItem() === 'inmet') {
            sessionStore.setRadius(+newDistance);
        } else {
            sessionStore.setRadius(+newDistance, false);
        }
    }

    return (
        <Grid container>
            <Accordion
                expanded={expanded === props.title}
                onChange={handleChangeAccordion()}
                elevation={0}
                style={{ width: "100%" }}
                className={classes.accordionContainer}
                TransitionProps={{ unmountOnExit: true }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    className={classes.accordionSummary}
                >
                    <Typography variant="overline" className={classes.accordionTitle}>{props.title}</Typography>
                </AccordionSummary>

                <AccordionDetails
                    style={{ marginLeft: "0px", padding: "0px 10px 0px 0px" }}
                >
                    <Grid container spacing={3}>
                        {expanded === 'coletor' &&
                            <Grid item xs={12} style={{ paddingRight: '4px' }}>
                                <CustomOutlineSelect
                                    value={visualization}
                                    handleValue={handleChangeVisualization}
                                    name={t(`advancedmap.advanced_collectorView`)}
                                    label={t(`advancedmap.advanced_collectorView`)}
                                    menuItems={previewModeOptions}
                                    iconLabel={true}
                                    hasTooltip={true}
                                    textTooltip={viewModeDescription}
                                />
                            </Grid>
                        }
                        {expanded === 'inmet' &&
                            <Grid item xs={12} style={{ paddingRight: '4px' }}>
                                <ToggleButtonGroup
                                    value={toggleDistance}
                                    exclusive
                                    onChange={handleDistanceInmet}
                                    aria-label="distance inmet"
                                    style={{ width: '100%' }}
                                >
                                    {sessionStore.getListRadius().map((option, index) => {
                                        return (
                                            <ToggleButton key={index} value={option.value} aria-label="left aligned" className={classes.toggleButton}>
                                                <Typography variant='button' className={classes.toggleText}>
                                                    {option.label}
                                                </Typography>
                                            </ToggleButton>
                                        )
                                    })}
                                </ToggleButtonGroup>
                            </Grid>
                        }
                        {props.children}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
}

ServiceExpandPanel.propTypes = {
    title: PropTypes.string.isRequired,
    expand: PropTypes.bool.isRequired,
    recall: PropTypes.bool.isRequired,
    handleExpand: PropTypes.func.isRequired,
    handleRecall: PropTypes.func.isRequired,
};

export default ServiceExpandPanel;