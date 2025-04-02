import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    loader: {
        position: "fixed",
        left: "48vw",
        top: "50vh",
    },

    titleDays: {
        marginLeft: "15px",
        marginBottom: "-17px",
        marginTop: "7px",
        [theme.breakpoints.down(sizes.sm)]: {
            color: "white",
        },
    },

    containerD: {
        paddingLeft: "25px",
        paddingTop: "5px",
        [theme.breakpoints.down(sizes.xs)]: {
            backgroundColor: "#1455be",
            paddingBottom: "25px",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "2vh"
        },
    },

    containerDays: {
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "4vh"
        },
    },

    cardWeather: {
        backgroundColor: "#1455BE",
        padding: "10px",
        borderRadius: "2em",
        height: "87vh",

        [theme.breakpoints.down(sizes.md)]: {
            height: "87vh",
        },
        [theme.breakpoints.down(sizes.sm)]: {
            maxWidth: "92%",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            borderRadius: "0em",
            maxWidth: "100%"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "2vh",
        }
    },

    containerMeasures: {
        [theme.breakpoints.down(sizes.sm)]: {
            maxWidth: "100%",
        },
    }
}