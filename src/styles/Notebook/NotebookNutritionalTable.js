import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    container: {
        border: "solid 2px #4285F4",
        borderRadius: "2em",
        margin: "10px",
        position: "relative",
        left: "-10px",
    },
    title: {
        fontSize: "15px",
        color: "#818A81",
        fontWeight: "bold"
    },
    text:{
        fontSize: "15px",
        color: "#818A81",
        fontWeight: "regular"
    },
    margin: {
        margin: "15px",
    },
    divider: {
        background: "#4285F4",
        height: "2px",
        width: "26vw",
        marginTop: "0px",
        [theme.breakpoints.up(sizes.xl)]: {
            width: "29vw",
        },
        [theme.breakpoints.down(sizes.xs)]: {
           width: "65vw",
        },
    },
    dailyText:{
        [theme.breakpoints.down(sizes.xl)]: {
            maxWidth: "96%"
        },
    },
    dividerv: {
        width: "2px",
        background: "#4285F4",
        marginBottom: "-13px",
    },
    linename:{
        fontSize: "12px",
    }
}