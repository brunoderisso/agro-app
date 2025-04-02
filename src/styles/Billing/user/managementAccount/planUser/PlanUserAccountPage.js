import { makeStyles } from '@material-ui/core';

import theme from "../../../../Utils/theme";
import sizes from "../../../../Utils/DashboardTheme";

const useStyles = makeStyles(() => ({
    content: {
        padding: '16px 0'
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
    },
    contentCards: {
        display: 'flex',
        gap: '24px',
        [theme.breakpoints.down(sizes.xmd)]: {
            flexDirection: 'column',
        },
    },
    wrapperSubscription: {
        marginBottom: 24,
    },
    messageWarning: {
        padding: '16px 32px 8px 24px',
        width: '100%',
        backgroundColor: theme.colors.warning
    },
    textModal: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px'
    },
    contentWarningText: {
        marginTop: '16px',
    },
    iconWarning: {
        color: theme.colors.error[40]
    },
    warningText: {
        color: theme.colors.outline,
        fontSize: '12px',
        lineHeight: '24px',
        letterSpacing: '0.4px'
    },
    emptyText: {
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
        color: theme.colors.onPrimaryContainer,
    }
}));

export default useStyles;