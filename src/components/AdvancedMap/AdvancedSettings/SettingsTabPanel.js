import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import TabPanel from '../../Common/TabPanel';
import SettingsTabs from './SettingsTabs';
import SettingsMenuSection from './SettingsMenuSection';
import SettingsWidgetsSection from './SettingsWidgetsSection';


function SettingsTabPanel() {
    const [page, setPage] = useState(0);

    const handleChange = (value) => {
        setPage(value)
    }

    return (
        <Grid>
            <SettingsTabs onChange={handleChange} page={page} />
            <TabPanel value={page} index={0} noPadding={true}>
                <SettingsMenuSection />
            </TabPanel>
            <TabPanel value={page} index={1} noPadding={true}>
                <SettingsWidgetsSection />
            </TabPanel>
        </Grid>
    );
}

export default SettingsTabPanel;