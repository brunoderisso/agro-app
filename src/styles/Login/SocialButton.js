import { makeStyles } from '@material-ui/core/styles';
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({

    buttonBase: {
        width: "100%",
        height: "40px",
        boxShadow: theme.shadows[2],
        "&:hover": {
            boxShadow: theme.shadows[4],
        },
    },
    textGoogle: {
        color: "black",
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",
        paddingLeft: theme.spacing(1)

    },
    textYahoo: {
        color: "white",
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",
        paddingLeft: theme.spacing(2)

    },
    textMicrosoft: {
        color: "white",
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",

    },
    textPrediza: {
        color: "white",
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "uppercase",
        paddingLeft: theme.spacing(2)

    },
    containerMicrosoft: {
        height: "100%",
        alignItems: "center",
        backgroundColor: theme.colors.microsoft,
        borderRadius: theme.spacing(0.5),
    },
    containerPrediza: {
        height: "100%",
        alignItems: "center",
        backgroundColor: theme.colors.predizadark,
        borderRadius: theme.spacing(0.5),
    },
    containerGoogle: {
        height: "100%",
        alignItems: "center",
        backgroundColor: theme.colors.google,
        borderRadius: theme.spacing(0.5),
    },
    containerYahoo: {
        height: "100%",
        alignItems: "center",
        backgroundColor: theme.colors.yahoo,
        borderRadius: theme.spacing(0.5),
    },
    predizaLogo: {
        width: "100%",
        marginTop: "13px",
        [theme.breakpoints.up(sizes.xlg)]: {
            width: "70%"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: "55%"
        }
    },
    googleIcon: {
        height: "24px"
    }
}))

export default useStyles;