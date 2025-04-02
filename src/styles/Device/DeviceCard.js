import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    batteryIcon: {
        marginRight: 5,
        marginleft: 5
    },
    error: {
        fontSize: 24,
        color: "red",
    },
    iconButton:{
        padding: "5px"
    },
    warning: {
        fontSize: 24,
        color: "yellow",
    },
    success: {
        fontSize: 24,
        color: "green",
    },
    img: {
        maxWidth: "100%",
        maxHeight: "30vh",
        minHeight: "30vh"
    },
    data: {
        marginBottom: 5
    },
    score: {
        marginTop: 10,
        fontSize: "3.2vh"
    },
    otherscore: {
        fontSize: "2vh"
    },
    card: {
        margin: 5,
        [theme.breakpoints.between('xs', 'sm')]: {
            minHeight: "54vh"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            minHeight: "46vh",

        },
    },
    spinner: {
        marginTop: "5vh"
    },
    map: {
        height: "30vh",
        width: "100%"
    },
    GMap: {
        overflow: "hidden",
        borderRadius: "1.25em",
        position: "relative",
        bottom: "10px",
        height: "30vh",
        width: "100%",
        margin: "10px",
        [theme.breakpoints.up(sizes.xl)]: {
            height: "29vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "29vh",
        },
    },
    device: {
        fontWeight: 300
    },
    onIcon: {
        color: "black"
    }
}