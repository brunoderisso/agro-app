import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';
import sizes from "../../../../Utils/DashboardTheme";

const useStyles = makeStyles(() => ({
    content: {
        padding: '16px 0',
    },
    contentCards: {
        display: 'flex',
        gap: '24px',
        [theme.breakpoints.down(sizes.xmd)]: {
            flexDirection: 'column',
        },
    },
    subtitle: {
        color: theme.colors.onPrimaryContainer,
        fontFamily: theme.typography.fontFamily,
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '40px',
        letterSpacing: '-0.283px',
        marginBottom: '24px'
    }
}));

export default useStyles;