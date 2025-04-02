import { makeStyles } from '@material-ui/core/styles';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    contentCel: {
        gap: '24px',
    },
    brand: {
        width: '48px'
    },
    nameCard: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.1px',
        alignSelf: 'stretch'
    },
    numberCard: {
        alignSelf: 'stretch',
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px'
    },
    infoCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: 'auto',
        flexGrow: 1
    },
    validityCard: {
        alignSelf: 'stretch',
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
    },
    centerContent: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'center'
    },
    btOptions: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
            color: theme.colors.onPrimaryContainer,
        },
    },
    textItemMenu: {
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px',
        color: theme.colors.onPrimaryContainer
    },
    title: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '12px',
        lineHeight: '32px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
}))

export { useStyles };