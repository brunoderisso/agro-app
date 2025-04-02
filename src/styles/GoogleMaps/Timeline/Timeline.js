import { makeStyles } from "@material-ui/core";
import theme from "../../Utils/theme";

const useStyles = makeStyles(() => ({
    root: {
        width: '100%',
    },
    step: {
        padding: '0px 1px 0px 0px',
        width: "min-content"
    },
    timelineContainer: {
        background: 'transparent',
        paddingLeft: "10px"
    },
    text: {
        color: theme.colors.onPrimary,
        fontSize: "12px",
    },
    selectedText: {
        color: theme.colors.primary[80],
    },
    alertedText: {
        color: theme.colors.error[87],
    },
    label: {
        marginTop: "4px!important",
    },
    buttonRoot: {
        minWidth: 18,
        maxWidth: 18,
        height: 18,
        color: theme.colors.onPrimary,
        backgroundColor: "transparent",

    },
    calendar: {
        color: theme.colors.onPrimary,
        marginLeft: "8px",
        transform: "scale(0.7)"
    },
    clickable: {
        cursor: 'pointer',
        '&:hover': {
            '& .hoveredStep': {
                backgroundColor: theme.colors.surfaceDim,
            },
            '& .MuiStepLabel-labelContainer': {
                '& .MuiTypography-root': {
                    color: theme.colors.surfaceDim,
                }
            }
        }
    }
}));

export default useStyles;