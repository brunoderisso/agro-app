import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    containerItemInfo: {
        flexDirection: 'column',
        display: 'flex',
        padding: '11px 16px 8px 16px',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
    },
    marginContent: {
        marginBottom: '3px'
    },
    textCommon: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
    },
    subtitle: {
        color: theme.colors.outline
    },
    itemText: {
        overflow: 'hidden',
        color: theme.colors.onPrimaryContainer,
        textOverflow: 'ellipsis',
        whitespace: 'nowrap',
    },
}));

export default useStyles;