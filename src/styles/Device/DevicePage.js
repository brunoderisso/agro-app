import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    paper: {
        position: 'absolute',
        padding: 20,
        [theme.breakpoints.down(sizes.xs)]: {
            width: "70vw",
            marginLeft: "14vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: "49vw",
            marginLeft: "24vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: "44vw",
            marginLeft: "28vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "36vw",
            marginLeft: "32vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "30vw",
            marginLeft: "36vw"
        },

    },

    container: {
        position: "fixed",
        top: "auto",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fafafa",
        zIndex: 1000
    },
}