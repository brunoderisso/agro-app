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
    floatButton: {
        position: "fixed",
        bottom: "4vw",
        left: "1vw",
        fontSize: "7px"
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
    tabsEvapo: {
        "& #simple-tab-2": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em 0em 0em 1em",
            height: "50px",
        }
    },
    nested:{
        paddingLeft: "40px"
    },
    root: {
        flexGrow: 1,
        height: "50px",
        minHeight: "50px",
        overflow: "hidden",
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