import { makeStyles } from '@material-ui/core/styles';

import theme from "../Utils/theme";

const useStyles = makeStyles(() => ({
    content: {
        color: theme.colors.onPrimaryContainer
    },
    content2: {
        color: theme.colors.outline
    },
    icon: {
        color: theme.colors.error[40]
    },
    appBar: {
        backgroundColor: theme.colors.onPrimary,
        color: theme.colors.primary[40]
    },
    root: {
        width: "100%"
    },
    dropArea: {
        border: `2px dashed ${theme.colors.inactive}`,
        padding: "80px 10px",
        textAlign: 'center',
        height: "280px",
        cursor: 'pointer',
        '&:hover': {
            borderColor: theme.colors.primary[40],
            backgroundColor: theme.colors.primary[95],
        },
    },
    fileLoaded: {
        borderColor: theme.colors.primary[40],
        backgroundColor: theme.colors.background
    },
    uploadButton: {
        backgroundColor: theme.colors.primary[40],
        color: theme.colors.onPrimary,
        borderRadius: "50%",
        width: "38px",
        height: "38px",
        margin: "8px",
        textAlign: "center",
        paddingTop: "6px",
        "&:hover": {
            backgroundColor: theme.colors.primary[30],
        },
        boxShadow: theme.shadows[2],
    },
    wrapperCardPol: {
        display: 'flex'
    },
    cardTitleItem: {
        color: theme.colors.onPrimaryContainer,
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 600,
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    radioPolygon: {
        '&.MuiIconButton-root': {
            width: '1em',
            height: '1em',
            padding: '0',
            margin: '3px'
        }
    },
    wrapperRadio: {
        paddingRight: '8px',
        display: 'flex',
        alignItems: 'center',
    },
    containerCardPol: {
        marginBottom: '24px'
    },
    wrapperPolygon: {
        margin: '8px 0'
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
}))

export { useStyles };