import { makeStyles } from '@material-ui/core';

import theme from "../../../../Utils/theme";

const useStyles = makeStyles(() => ({
    content: {
        padding: '24px',
    },
    containerCard: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    itemTitle: {
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '32px',
        letterSpacing: '0.15px',
        textTransform: 'uppercase',
        marginBottom: '8px',
    },
    defaultText: {
        color: theme.colors.onPrimaryContainer,
        fontFamily: theme.typography.fontFamily,
        fontStyle: 'normal',
    },
    highlight: {
        color: theme.colors.secondary,
        fontFamily: theme.typography.fontFamily,
        fontStyle: 'normal',
    },
    couponAction: {
        color: theme.colors.primary[40],
        fontFamily: theme.typography.fontFamily,
        fontStyle: 'normal',
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    costValue: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '0.15px',
    },
    textOutline: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '0.4px',
        color: theme.colors.outline,
    },
    wrapperTable: {
        margin: '16px 0',
    },
    wrapperTableAlt: {
        margin: '16px 0 24px 0',
    },
    topText: {
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    rowTable: {
        height: '64px',
    },
    rowText: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
    },
    columnBold: {
        fontWeight: 600,
    },
    columnExtraBold: {
        fontWeight: 700,
    },
    credCardPlan: {
        width: '352px',
        flex: 1
    },
    displayPrice: {
        fontSize: '24px',
        lineHeight: '32.016px',
    },
    mgBottomPrice: {
        marginBottom: '32px',
        flexGrow: 1,
    },
    textBtCommon: {
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    textSuspendError: {
        color: theme.colors.error[40],
    },
    btCommon: {
        height: '40px',
    },
    textBtConfirm: {
        color: theme.colors.primary[40],
    },
    outlinedPrimaryBt: {
        border: '1px solid' + theme.colors.primary[40],
    },
    btPrimary: {
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    btError: {
        '&:hover': {
            backgroundColor: theme.colors.error[95],
        },
    }
}));

export default useStyles;