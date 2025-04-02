import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';

export default function TabPanel(props) {
    const { Banner, children, value, index, noPadding, ...other } = props;

    return (
        <Grid
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {typeof Banner === 'function' && <Banner />}
            {value === index && (
                <Box p={noPadding ? 0 : 3}>
                    <Grid>{children}</Grid>
                </Box>
            )}
        </Grid>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number,
    Banner: PropTypes.func,
    noPadding: PropTypes.bool
};