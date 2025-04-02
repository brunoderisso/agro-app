import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    MapContainer: {
        width: "48vw",
        [theme.breakpoints.down(sizes.md)]: {
            width: "86vw",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            marginLeft: "40px",
        },
        [theme.breakpoints.up(sizes.md)]: {
            marginLeft: "0px",
        },
    }
}