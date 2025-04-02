import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    colorText: {
        color: theme.colors.onPrimaryContainer,
    },
    outlineText: {
        color: theme.colors.outline,
    },
    contentCard: {
        padding: '24px',
        width: '400px'
    },
    titleCard: {
        lineHeight: '32px',
        letterSpacing: '1px',
        fontSize: '12px'
    },
    iconButton: {
        padding: "6px 0",
        minWidth: "auto",
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    iconContent: {
        gap: '16px',
        flexDirection: 'row-reverse'
    },
    spacingWrapper: {
        marginBottom: '24px'
    },
    fieldItem: {
        padding: '0 16px'
    },
    mbFieldItem: {
        marginBottom: '14px'
    },
    commonText: {
        lineHeight: '20px',
        letterSpacing: '0.4px',
        fontSize: '12px'
    },
    textModal: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px'
    },
    warningText: {
        color: theme.colors.outline,
        fontSize: '12px',
        lineHeight: '24px',
        letterSpacing: '0.4px'
    },
    highlightText: {
        fontWeight: 600
    },
    contentWarningText: {
        gap: '10px',
        marginTop: '18px',
    },
    iconWarning: {
        color: theme.colors.error[40]
    },
    emptyText: {
        fontSize: 16,
        lineHeight: '32px',
        letterSpacing: 0.15,
        color: theme.colors.onPrimaryContainer,
    }
}));

export default useStyles;