import theme from "../../theme";
import sizes from "../../components/DashboardTheme";

export default {
    paper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: 20,
        [theme.breakpoints.down(sizes.xs)]: {
            width: "95vw",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: "75vw",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: "60vw",
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "45vw",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "30vw",
        },

    },
}