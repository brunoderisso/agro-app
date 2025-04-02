import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    cardsDia: {
        border: "solid 2px #efefef",
        backgroundColor: "#f7f8fb",
        borderRadius: "1em",
        margin: "3px",
        padding: "3px",
        minWidth: "115px",
        "&:hover": {
            border: "solid 2px #afafaf",
        },
        [theme.breakpoints.down(sizes.xsm)]: {
            minWidth: "100px",
        },
        [theme.breakpoints.up(sizes.xsm)]: {
            minWidth: "115px",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            minWidth: "9vw",
            minHeight: "23vh",
        },

    },
    dayWeek: {
        color: "#676767",
        fontWeight: "400!important",
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "1.6rem",
        },
    },
    cardDate: {
        position: "relative",
        bottom: "7px",
        marginBottom: "-17px",
        maxWidth: "40px",
        [theme.breakpoints.up(sizes.xl)]: {
            left: "38%",
        },
    },
    cardFullDate:{
        marginTop: "-5px",
    },
    iconDays: {
        marginTop: "-5px",
        marginBottom: "5px"
    },
    containerS: {
        position: "relative",
        marginTop: "28px",
        marginLeft: "10px",
        textAlign: "-webkit-center",
        [theme.breakpoints.up(sizes.md)]: {
            maxWidth: "50em",
        },
        [theme.breakpoints.up(sizes.xmd)]: {
            maxWidth: "100%",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            maxWidth: "100%",
        },
        [theme.breakpoints.down(sizes.sm)]: {
            maxWidth: "94%",
            marginLeft: "-1vw",
        },
    },
    min: {
        color: "#8a8a8a",
    },
    temps:{
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "20px",
        },
    },
    titleNav: {
        position: "relative",
        bottom: "10px",
        border: "solid 1px #cecece",
        borderRadius: "5px",
        height: "30px",
        maxWidth: "66em",
        paddingLeft: "5px",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "25em",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            maxWidth: "42em",
        },
        [theme.breakpoints.up(sizes.md)]: {
            maxWidth: "48em",
        },
        [theme.breakpoints.up(sizes.xmd)]: {
            maxWidth: "50em",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            maxWidth: "66em",
        },
    },
    navColor: {
        [theme.breakpoints.down(sizes.xs)]: {
            color: "white",
        },
    },
    prec: {
        fontSize: "10px",
        marginTop: "-10px",
        color: "#1455be",
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "20px",
            fontSize: "15px",
        },
    },
    iconWeather: {
        right: "52px",
        transform: "scale(0.3)",
        position: "relative",
        bottom: "40px",
        marginBottom: "-80px",
        [theme.breakpoints.down(sizes.xs)]: {
            right: "52px",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            right: "43px",
            bottom: "40px",
            transform: "scale(0.3)",
        },
        [theme.breakpoints.up(sizes.md)]: {
            right: "47px",
            transform: "scale(0.3)",
            position: "relative",
            bottom: "40px",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            right: "15px",
            bottom: "20px",
            transform: "scale(0.5)",
        },
    },
}