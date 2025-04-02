import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid } from "@material-ui/core";

import CustomInputText from '../../Common/CustomInputText';
import useStyles from '../../../styles/GoogleMaps/AdvancedSettings/SettingsWidgetsSection';


function SettingsWidgetsSection() {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleChangeSearch = () => {

    }

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                <CustomInputText label={t('advancedmap.advanced_searchWidget')} hasIcon={true} handleChange={handleChangeSearch} />
            </Grid>

            <Grid item xs={12}>

            </Grid>
        </Grid>
    );
}

export default SettingsWidgetsSection;