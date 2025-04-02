import { makeStyles } from '@material-ui/core';

import theme from '../Utils/theme';

const useStyles = makeStyles(() => ({
    rowTable: {
        height: '64px'
    },
    textTable: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
        color: theme.colors.onPrimaryContainer,
    },
}));

export default useStyles;