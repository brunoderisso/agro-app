import sizes from "../../styles/Utils/DashboardTheme";
import theme from "../Utils/theme";

export default {
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    grid: {
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
            width: "16.666%"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            width: "12.5%"
        },
        padding: 5,
    },
}