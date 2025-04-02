import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    cardTitle: {
        marginTop: "15px",
        marginLeft: "10px",
        color: "white",
        position: "relative",
    },
    menu: {
        margin: "1px",
        position: "absolute",
        right: "-10px",
        [theme.breakpoints.down(sizes.xs)]: {
            right: "10px",
        },

    },
    NaN: {
        fontSize: "45px",
        textAlign: "center",
        marginTop: "5vh",
        marginBottom: "10vh",
    },
    cardTemperature: {
        marginTop: "15px",
        color: "white",
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "55px",
        },
    },
    temperature: {
        textAlign: "-webkit-center"
    },
    temperatureTitle: {
        textAlign: "center",
        fontSize: "20px",
    },
    temperatureCards: {

    },
    temperatureIcons: {
        textAlign: "center",
    },
    temperatureContainer: {
        marginLeft: "40px",
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "55px",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            marginLeft: "25px",
        },
        [theme.breakpoints.up(sizes.md)]: {
            marginLeft: "25px",
        },
        [theme.breakpoints.up(sizes.xmd)]: {
            marginLeft: "60px",
        },
    },
    temperatureNumero: {
        fontSize: "60px",
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "40px",
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "55px",
        },
    },
    temperatureMedida: {
        fontSize: "30px",
        color: "#e0e0e0b0",
        paddingLeft: "25px",
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "20px",
            paddingLeft: "50px",
        },
        [theme.breakpoints.up(sizes.xmd)]: {
            paddingLeft: "20px",
        },
    },
    cardsSemana: {
        color: "white",
        marginTop: "10px",
        paddingRight: "20px",
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "105px",
        },
        [theme.breakpoints.down(sizes.sm)]: {
            paddingRight: "20px",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            paddingRight: "0px",
        },
    },
    cardsHora: {
        textAlign: "center",
        border: "solid 2px",
        borderRadius: "1em",
        margin: "3px",
        padding: "3px",
        minWidth: "54px",
    },
    containerIcon:{
        maxHeight: "85px", 
        marginLeft: "15%",
        [theme.breakpoints.down(sizes.md)]: {
            marginLeft: "3%",
        },
    },
    test: {
        width: "105%",
        marginTop: "0em",
        [theme.breakpoints.down(sizes.md)]: {
            marginTop: "3em",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: " 92vw"
        },
    },
    arcoContainer: {
        width: "24.6vw",
        position: "relative",
        left: "-10px",
        top: "10px",
        [theme.breakpoints.down(sizes.md)]: {
            width: "103%",
        },
        [theme.breakpoints.down(sizes.xsm)]: {
            width: "103%",
        },
        [theme.breakpoints.down(sizes.sm)]: {
            width: "104%",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: "104%",
            marginTop: "5em",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "104%",
            marginTop: "6em",        },
    },
    environmentName: {
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "18px",
        },
        [theme.breakpoints.up(sizes.xmd)]: {
            fontSize: "25px",
        },
    },
    cityName: {
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "15px",
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "20px",
        },
    },
    iconWeather: {
        right: "25px",
        transform: "scale(0.4)",
        position: "relative",
        bottom: "40px",
        [theme.breakpoints.down(sizes.sm)]: {
            right: "-33%"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            right: "1vw",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            right: "-33%",
            bottom: "47px",
            transform: "scale(0.4)",

        },
        [theme.breakpoints.up(sizes.md)]: {
            right: "25px",
            bottom: "40px",
            transform: "scale(0.4)",
            position: "relative",
        },
    },
    iconHour: {
        transform: "scale(0.2)",
        position: "relative",
        right: "75px",
        marginTop: "-60px",
        marginBottom: "-60px",
    },
    iconMoon: {
        position: "relative",
    },
    MoonContainer: {
        textAlign: "-webkit-center",
        position: "relative",
        bottom: "15px",
        fontWeight: "600",
    },
    horarioSun: {
        padding: "1px 15px",
        position: "relative",
        top: "10px",
    },
    por: {
        textAlign: "right",
        fontWeight: "600",
    },
    nascer: {
        textAlign: "left",
        fontWeight: "600",
    }

}