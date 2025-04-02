import { makeStyles } from '@material-ui/core/styles';

import theme from '../../../../Utils/theme';

const useStyles = makeStyles(() => ({
    wrapper: {
        padding: '24px',
        minWidth: '444px'
    },
    title: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '12px',
        lineHeight: '32px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    wrapperTable: {
        margin: '16px 0 32px 0'
    },
    btPrimary: {
        '& span': {
            gap: '8px'
        },
        '&:hover': {
            backgroundColor: theme.colors.primary[95],
        },
    },
    txtBtAdd: {
        color: theme.colors.primary[40],
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    textModal: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '14px',
        lineHeight: '20.02px',
        letterSpacing: '0.15px'
    },
    highlightText: {
        fontWeight: 600
    },
    modalInput: {
        marginTop: "24px"
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
    },
}))

export { useStyles };