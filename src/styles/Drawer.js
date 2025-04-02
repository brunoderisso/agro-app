import sizes from "./Utils/DashboardTheme";
import theme from "./Utils/theme";

export default {
    drawerWidth: {
        [theme.breakpoints.down(sizes.xs)]: {
            width: "calc(100vw - 55px)",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: "calc(50vw - 55px)"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: "calc(40vw - 55px)"
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "calc(35vw - 55px)"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "calc(25vw - 55px)"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "calc(16vw - 55px)"
        }
    }
}