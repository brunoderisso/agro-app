import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapperCard: {
        padding: '24px',
        width: '512px',
        display: 'flex',
        flexDirection: 'column'
    },
    iconButton: {
        padding: "6px 0",
        minWidth: "auto",
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    iconContent: {
        flexDirection: 'row-reverse',
    },
    marginContent: {
        marginBottom: '3px'
    },
    iconProp: {
        color: theme.colors.onPrimaryContainer,
        fontSize: theme.iconProp.fontSize,
    },
    gapIcons: {
        gap: '16px',
        display: 'flex'
    },
    textModal: {
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px',
        color: theme.colors.onPrimaryContainer,
        marginBottom: '24px'
    },
    highlightText: {
        fontWeight: 600
    },
    inputs: {
        '& label.Mui-focused': {
           color: theme.colors.primary[40],
        },
        '& .MuiOutlinedInput-root': {
           '&.Mui-focused fieldset': {
              borderColor: theme.colors.primary[40],
           },
        }
    }
}));

export default useStyles;