import theme from "../../Utils/theme";
import sizes from "../../Utils/DashboardTheme";

export default {
    container: {
        marginLeft: "11vw",
        [theme.breakpoints.down(sizes.lg)]: {
            marginLeft: "14vw",
        },
    }
}