import theme from "../../theme";
import sizes from "../../components/DashboardTheme";

export default {
    root: {
        flexGrow: 1,
        height: "50px",
        minHeight: "50px",
        overflow: "hidden",
    },
    rootEvapo: {
        flexGrow: 1,
        height: "87vh",
        minHeight: "50px",
        overflow: "hidden",
        [theme.breakpoints.down(sizes.xs)]: {
            height: "80vh",
        },
        
    },
    rootIcon: {
        marginRight: "15px",
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        margin: 0,
        left: 0,
        rigth: 0,
    },
    tabsMapa: {
        "& #simple-tab-0": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em",
            height: "50px",
        }
    },
    tabsGrafico: {
        "& #simple-tab-1": {
            transitionDuration: "1s",
            backgroundColor: "#005293",
            color: "black",
            borderRadius: "1em",
            height: "50px",
        }
    },
    iconLabelWrapper: {
        flexDirection: "row",
        color: "white",
    },
}