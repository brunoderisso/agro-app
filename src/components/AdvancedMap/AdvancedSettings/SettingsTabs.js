import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from "prop-types";

import { Tab, Tabs } from '@material-ui/core';

import useStyles from "../../../styles/GoogleMaps/AdvancedSettings/SettingsTabs"


function a11yProps(index) {
    return {
        id: `horizontal-tab-${index}`,
        'aria-controls': `horizontal-tabpanel-${index}`,
    };
}

function SettingsTabs(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [value, setValue] = useState(0);

    useEffect(() => {
        if (props.page) {
            setValue(props.page);
        }
    }, [props.page])

    const handleChange = (_, newValue) => {
        props.onChange(newValue);
        setValue(newValue);
    };

    return (
        <Tabs
            orientation='horizontal'
            value={value}
            onChange={handleChange}
            aria-label='Horizontal tabs account'
            classes={{ indicator: classes.indicatorSelectedTab }}
        >
            <Tab classes={{ root: classes.tabWidth, selected: classes.selectedTab }} label={t('advancedmap.advanced_menuTab')} {...a11yProps(0)} />
            <Tab classes={{ root: classes.tabWidth, selected: classes.selectedTab }} label={t('advancedmap.advanced_widgetTab')} {...a11yProps(1)} />
        </Tabs>
    );
}

SettingsTabs.propTypes = {
    onChange: PropTypes.func,
    page: PropTypes.number
};

export default SettingsTabs;