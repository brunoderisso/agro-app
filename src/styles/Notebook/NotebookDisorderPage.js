import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    appBar: {
        top: 'auto',
        bottom: 0,
        margin: 0,
        left: 0,
        rigth: 0,
        [theme.breakpoints.down(sizes.xs)]: {
            bottom: "55px"
        },
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
    tabsDisease: {
        "& #simple-tab-0": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "0em 1em 1em 0em",
            height: "50px",
        }
    },
    tabsPest: {
        "& #simple-tab-1": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em 0em 0em 1em",
            height: "50px",
        }
    },
}

export default styles;