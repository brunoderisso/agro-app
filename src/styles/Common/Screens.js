import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    contentHighPdLeft: {
        width: "100%",
        paddingLeft: 64.33,
        paddingTop: 69,
        paddingRight: 5,
        flex: 1,
        [theme.breakpoints.down(sizes.xs)]: {
            paddingBottom: 53
        },
        [theme.breakpoints.up(sizes.xs)]: {
            paddingBottom: 53
        },
        [theme.breakpoints.up(sizes.md)]: {
            paddingBottom: 77,
        },
    },
    contentLowPdLeft: {
        width: "100%",
        paddingLeft: 5,
        paddingTop: 69,
        paddingRight: 5,
        flex: 1,
        [theme.breakpoints.down(sizes.xs)]: {
            paddingBottom: 53
        },
        [theme.breakpoints.up(sizes.xs)]: {
            paddingBottom: 53
        },
        [theme.breakpoints.up(sizes.md)]: {
            paddingBottom: 77,
        },
    },
    contentPdTop: {
        width: "100%",
        paddingTop: 64
    }
}