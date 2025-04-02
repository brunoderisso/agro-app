import theme from "../../theme";
import sizes from "../../components/DashboardTheme";
export default {

    buttons: {
        paddingTop: "10px!important",
        paddingLeft: "0!important",
        paddingRight: "0!important"
    },
    message: {
        marginLeft: "5px!important",
    },
    width: {
        [theme.breakpoints.down(sizes.xs)]: {
            width: "75vw"

        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: "75vw"

        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: "39vw"

        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "28vw"

        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "28vw"

        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "28vw"

        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
    },

}