import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    appBar: {
        top: 'auto',
        bottom: 0,
        margin: 0,
        left: 0,
        rigth: 0,
    },
    nested: {
        paddingLeft: "40px"
    },
    radiusItem: {
        padding: "5px",
        border: "1px solid black",
        borderRadius: "10px"
    },
    root: {
        flexGrow: 1,
        height: "50px",
        minHeight: "50px",
        overflow: "hidden",
    },
    circularProgress: {
        textAlign: "center",
        marginLeft: "46.5vw",
        marginTop: "36vh",
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "40vw",
        },
    },
    cardStationContainer: {
        [theme.breakpoints.down(sizes.xs)]: {
            paddingLeft: "3vw"
        },

    },
    tabsDashboard: {
        "& #simple-tab-0": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "0em 1em 1em 0em",
            height: "50px",
        }
    },
    tabsChart: {
        "& #simple-tab-1": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em 1em 1em 1em",
            height: "50px",
        }
    },
    tabsStats: {
        "& #simple-tab-2": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em 0em 0em 1em",
            height: "50px",
        }
    },
    iconLabelWrapper: {
        flexDirection: "row",
        color: "white",
    },
    grow: {
        flexGrow: 1,
    },
    grid: {
        minWidth: "18vw",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "100%",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: "50%"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: "33.333%"
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "25%"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "20%"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "16.666%",
            minWidth: "15vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            width: "12.5%"
        },
        padding: 5,
    },
}

export default styles;