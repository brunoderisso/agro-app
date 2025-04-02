import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    containerExterno: {
        position: "relative",
        backgroundColor: "#FFFFFF",
        padding: "8px",
        marginRight: "-60px",
        [theme.breakpoints.down(sizes.xs)]: {
            top: "5px",
            left: "0px",
            borderRadius: "0em",
            width: "125%",
            height: "84vh",
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "96em",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "96em",
            height: "84vh"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "100%",
            height: "90vh",
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            width: "100%",
        },
    },
    number: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw"
        },
        marginRight: 2
    },
    centerH:{
        [theme.breakpoints.up(sizes.xl)]: {
            paddingTop: "10%"
        },
    },
    label: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw",
            fontWeight: 500
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw",
            fontWeight: 500
        },
        marginRight: 5
    },
    chartContainer: {
        maxWidth: "64vw",

        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "98vw",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            maxWidth: "70vw",
        },

    },
    chartName: {
        fontSize: "20px",
        fontWeight: "500",
        textAlign: "-webkit-center",
        marginTop: "10px",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "16px",
        },
    },
    chartPadding: {
        paddingTop: "25px",
    },
    talhoesContainer: {
        overflow: "hidden",
        height: "93%",
    },
    environmentName: {
        fontSize: "20px",
        fontWeight: "500",
        marginTop: "6px",
        left: "3.5vw",
        position: "relative",
        [theme.breakpoints.up(sizes.xl)]: {
            marginBottom: "-30px",
        },
    },
    paper: {
        backgroundColor: "#efefef",
        borderRadius: "2em",
        textAlign: "center",
        padding: "5px",
        height: "79vh",
        [theme.breakpoints.up(sizes.xl)]: {
            marginLeft: "30px",
            maxWidth: "20vw",
            height: "86vh"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "21vh",
            width: "97vw",
        },
    },
}