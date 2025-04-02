import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapperCard: {
        padding: '24px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '40px',
    },
    titleTable: {
        lineHeight: '32px',
        fontSize: '12px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    textTable: {
        color: theme.colors.onPrimaryContainer,
    },
    rowTable: {
        height: '64px'
    },
    commonText: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
    },
    wrapperPagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    }
}));

export default useStyles;