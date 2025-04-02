import React from 'react';

import { withStyles, LinearProgress } from '@material-ui/core';

import theme from '../Utils/theme';

const StyledLinearProgress = withStyles({
    root: {
        height: 8,
    },
    colorPrimary: {
        backgroundColor: theme.colors.onPrimary,
    },
    bar: {
        backgroundColor: theme.colors.primary[40],
    },
})((props) => <LinearProgress variant="determinate" {...props} />);

export default StyledLinearProgress;