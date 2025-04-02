import { makeStyles } from '@material-ui/core';

import theme from '../Utils/theme';

const useStyles = makeStyles(() => ({
    container: {
        width: '200px',
        padding: '16px 16px 8px 16px',
        transform: `translate(-50%, -110%)`,
    },
    iconBt: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '18px'
    },
    defaultText: {
        color: theme.colors.onPrimaryContainer
    },
    outlineText: {
        color: theme.colors.outline
    },
    textH4: {
        color: theme.colors.primary[30],
        fontWeight: 500,
        fontSize: '32px',
        lineHeight: '40px',
        letterSpacing: '-0.28px'
    },
    textH3: {
        color: theme.colors.primary[30],
        fontWeight: 500,
        fontSize: '48px',
        lineHeight: '56.02px',
    },
    marginContainer: {
        marginTop: '16px',
    },
    marginText: {
        marginRight: '8px'
    },
    iconRotate: {
        transform: 'rotate(180deg)',
        transition: 'transform 0.3s ease',
    },
    iconInitRotate: {
        transform: 'rotate(0deg)',
        transition: 'transform 0.3s ease',
    },
    btPrimary: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
        width: '100%',
        margin: '16px 0'
    },
    textBt: {
        color: theme.colors.primary[40],
    },
    textH6: {
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '32px',
        letterSpacing: '0.15px'
    },
    textBody: {
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0.15px'
    },
}));

export default useStyles;