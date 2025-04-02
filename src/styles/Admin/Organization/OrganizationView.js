import theme from "../../Utils/theme";
import sizes from "../../Utils/DashboardTheme";

export default {
    box: {
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft:"30vw",
            maxWidth: "55vw"

        },
        [theme.breakpoints.up(sizes.xs)]: {
            marginLeft: "25vw",
            maxWidth: "61vw"

        },
        [theme.breakpoints.up(sizes.sm)]: {
            marginLeft: "25vw",
            maxWidth: "61vw"

        },
        [theme.breakpoints.up(sizes.md)]: {
            marginLeft: "0vw",
            maxWidth: "77vw"

        },
        [theme.breakpoints.up(sizes.lg)]: {
        marginLeft: "0vw",
           maxWidth: "77vw"

        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginLeft: "0vw",
            maxWidth: "77vw"

        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
    },
}