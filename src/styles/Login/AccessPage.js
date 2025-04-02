import { makeStyles } from '@material-ui/core/styles';
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.colors.primary[30],
        height: "100vh",
        width: "100vw",
        padding: "0.7vmax",
        [theme.breakpoints.down(sizes.xs)]: {
            height: "100vh",
        }
    },
    containerNotFound: {
        backgroundColor: theme.colors.primary[30],
        height: "calc(100vh - 64px)",
        width: "100vw",
        padding: "calc(50vh - 64px)",
        [theme.breakpoints.down(sizes.xs)]: {
            height: "100vh",
        },
        textAlign: "center",
    },
    codeError: {
        fontSize: "40px",
        color: "white"
    },
    textError: {
        fontSize: "12px",
        color: "white"
    },
    logo: {
        marginLeft: "3.8%",
        width: "8%",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "20%",
            marginTop: "5px"
        },
    },
    header: {
        maxHeight: "4.8vh"
    },
    body: {
        height: "93vh"
    },
    createPosition: {
        position: "relative",
        bottom: "0px",
        padding: "0px 10px"
    },
    infoArea: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: "13vh",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "500",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "7vh",
            maxHeight: "0px"
        },
    }
}))

export default useStyles;