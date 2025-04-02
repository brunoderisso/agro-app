import theme from "../../styles/Utils/theme";
import sizes from "../../styles/Utils/DashboardTheme";

export default {
    container: {
        position: "fixed",
        top: "auto",
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        [theme.breakpoints.down(sizes.xs)]: {
            height: 48
        },
        [theme.breakpoints.up(sizes.xs)]: {
            height: 48
        },
        [theme.breakpoints.up(sizes.md)]: {
            height: 72,
        },
        "&:hover": {
            cursor: "pointer"
        },
        background: "#f5f5f5"
    },
    icon: {
        color: "#2196f3",
        fontSize: 40,
        padding: 5,
        "&:hover": {
            borderStyle: "solid",
            borderRadius: 16,
            borderWidth: 2
        }
    }
}