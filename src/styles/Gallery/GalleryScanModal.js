import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    paper: {
        inset: "0px 0px 0px 0px",
        position: 'fixed',
        zIndex: 1300,
        '& [aria-labelledby="prediza-modal"]':{
            margin:0,
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
        }
    },
}