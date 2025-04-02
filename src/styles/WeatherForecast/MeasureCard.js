import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    MeasureContainer: {
        [theme.breakpoints.down(sizes.xs)]: {

        },
        [theme.breakpoints.up(sizes.xs)]: {

        },
        [theme.breakpoints.up(sizes.sm)]: {

        },
        [theme.breakpoints.up(sizes.md)]: {

        },
        [theme.breakpoints.up(sizes.lg)]: {

        },
        [theme.breakpoints.up(sizes.xl)]: {

        },
        [theme.breakpoints.up(sizes.xxl)]: {

        },
    },
    PaperContainer: {
        height: "47px",
        marginBottom: "15px",
        padding: "4%",
        backgroundColor: "#f7f8fb",
        borderRadius: "1em",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "92%",
            maxHeight: "70px",
            height: "auto"

        },
        [theme.breakpoints.up(sizes.xs)]: {

        },
        [theme.breakpoints.up(sizes.sm)]: {

        },
        [theme.breakpoints.up(sizes.md)]: {

        },
        [theme.breakpoints.up(sizes.lg)]: {

        },
        [theme.breakpoints.up(sizes.xl)]: {

        },
        [theme.breakpoints.up(sizes.xxl)]: {

        },
    },
    Measure: {
        position: "relative",
        bottom: "8px",
        left: "30px",
    },
    boxMeasureIcon: {
        position: "relative",
        bottom: "6px",
    }
}