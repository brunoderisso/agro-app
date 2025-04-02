import sizes from "../Utils/DashboardTheme";
import theme from "../Utils/theme";

export default {
    devicescard: {
        marginTop: 30,
        [theme.breakpoints.down(sizes.xs)]: {
            height: "100vw",
        },
    },

    addButton: {
        margin: "10px",
        background: "#fff",
        border: "3px solid " + theme.colors.predizaregular,
        color: theme.colors.predizaregular,
        borderRadius: "30px",
        fontSize: "17px",
        width: "87%",
        height: "60px",
        '&:hover': {
            backgroundColor: "#ededed"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: "92%"
        },
    },

    alignCenter: {
        textAlign: "center",
    },
}