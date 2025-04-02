import { makeStyles } from '@material-ui/core';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    content: {
        padding: '16px 0',
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
    wrapperCard: {
        padding: '24px',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '40px',
        width: "100%"
    },
    rowTable: {
        height: '64px'
    },
    containerBtn: {
        padding: '0 24px',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    iconButton: {
        padding: '0',
        minWidth: 'auto',
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
            color: theme.colors.onPrimaryContainer,
        },
    },
    commonText: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
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
    wrapperPagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    disableDownloadIcon: {
        '& span': {
            '& svg': {
                '& g': {
                    '& path': {
                        fill: theme.colors.outline
                    }
                }
            }
        }
    }
}));

export default useStyles;