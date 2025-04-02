import theme from "../../theme";
import sizes from "../../components/DashboardTheme";

export default {
    container: {
        backgroundColor: theme.colors.predizadark,
        height: "100vh",
        width: "100vw",
        padding: "0.7vmax"
    },
    logo: {
        marginLeft: "3.8%",
        width: "8%",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "20%",
            marginTop: "5px"
        },
    },
    header: {
        maxHeight: "7.8vh"
    },
    body: {
        height: "93.2vh"
    },
    infoArea: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: "13vh",
        fontFamily: "Roboto, sans-serif",
        fontWeight: "500",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "7vh",
        },
    }
}