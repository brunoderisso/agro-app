import { makeStyles } from '@material-ui/core';

import theme from '../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapper: {
        paddingTop: '64px',
        backgroundColor: theme.colors.background,
        height: '100vh',
    },
    warningMessage: {
        padding: '16px 32px 8px 24px',
        width: 'calc(100vw - 273px)',
        backgroundColor: theme.colors.warning,
        display: 'flex',
        gap: 80,
        '& .MuiSvgIcon-root': {
            fill: theme.colors.error[40],
            width: 40,
            height: 40,
        }
    },
    warningText: {
        color: theme.colors.onErrorContainer,
        fontSize: 14,
        lineHeight: '20.02px',
        letterSpacing: 0.15,
    },
    contentWarning: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
    },
    wrapperWarningBtn: {
        display: 'flex',
        gap: 8,
        marginLeft: 'auto'
    },
    warningTextBtn: {
        color: theme.colors.primary[40],
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: 0.4,
    },
    propBtn: {
        height: 38,
        '&:hover': {
            backgroundColor: theme.colors.primary[95]
        }
    }
}));

export default useStyles;