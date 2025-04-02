import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapperCard: {
        padding: '24px',
        width: '444px',
        height: 'min-content',

    },
    btPrimary: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    iconBt: {
        fontSize: theme.iconProp.fontSize,
        color: theme.colors.primary[40],
    },
    textBtPrimary: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        color: theme.colors.primary[40],
    },
    containerForm: {
        marginBottom: '24px'
    }
}));

export default useStyles;