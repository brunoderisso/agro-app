import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {

    gradientBarProp: {
        position: "relative",
        float: "right",
        top: "-62vh",

        [theme.breakpoints.down(sizes.xs)]: {
            top: "-43vh"
        },
    },
    mapPosition: {
        height: "calc(100vh - 64px)",
    }
}


