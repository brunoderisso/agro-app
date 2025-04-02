import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    containerExterno: {
        position: "relative",
        left: "0px",
        top: "-5px",
        backgroundColor: "#FFFFFF",
        padding: "8px",
        borderRadius: "2em",
        marginRight: "-60px",
        [theme.breakpoints.down(sizes.xs)]: {
            top: "5px",
            left: "0px",
            borderRadius: "0em",
            width: "100%",
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "99vw",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "99vw",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: "99vw",
            height: "90vh",
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            width: "100%",
        },
    },
    modalBody: {
        margin: "28vh 40vw",
        width: "45vw",
        backgroundColor: "#FFFFFF",
        border: "solid 1px #4d4d4d",
        borderRadius: "2em",
        height: "50vh",

        [theme.breakpoints.down(sizes.xs)]: {
            width: "92vw",
            margin: "35vh 5vw",
        },
    },
    mapContainer: {
        marginBottom: "30px",
    },
    environmentName: {
        fontSize: "20px",
        fontWeight: "500",
        marginTop: "6px",
        left: "3vw",
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
            height: "86vh",
            paddingBottom: "4vh"
        },
        [theme.breakpoints.down(sizes.md)]: {
            height: "70vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "27vh",
            marginBottom: "5px",
        },
    },
    talhoesContainer: {
        overflow: "hidden",
        height: "93%",
    },
    GMap: {
        overflow: "hidden",
        borderRadius: "1.25em",
        position: "relative",
        bottom: "10px",
        height: "79vh",
        width: "100%",
        margin: "10px",
        [theme.breakpoints.up(sizes.xl)]: {
            height: "86vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "45vh",
        },
    },
}