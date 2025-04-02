import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    container: {
        background: "#F7F8FB",
        borderRadius: "2em",
        height: "86vh",
        marginTop: "1px",
        marginLeft: "80px",
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "5px"
        },
    },
    header: {
        background: "#EAEDF5",
        borderRadius: "2em 2em 0em 0em",
        height: "8vh",
        width: "100%",
        textAlign: "center",
        paddingTop: "10px",
        fontSize: "24px",
        fontFamily: "fantasy, sans-serif",
        color: "#1455BE",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "20px",
            paddingTop: "18px",
        },

    },
    spaces: {
        marginTop: "15px",
    },
    uploader: {
        marginLeft: "10px",
    },
    name: {
        fontSize: "21px",
        color: "black",
        fontWeight: "bold",
    },
    titles: {
        fontSize: "17px",
        color: "#818A81",
        fontWeight: "bold",
    },
    padding: {
        padding: "15px",
    },
    productinfo: {
        minHeight: "24vh",
    },
    maintitle: {
        fontSize: "21px",
        color: "#818A81",
        fontWeight: "bold"
    },
    subtitles: {
        fontSize: "13px",
        color: "#818A81",
        fontWeight: "regular",
    },
    GMap: {
        overflow: "hidden",
        borderRadius: "1.25em",
        position: "fixed",
        bottom: "40px",
        width: "28%",
        height: "31vh",
        marginTop: "10px",
        marginLeft: "15px",
        [theme.breakpoints.up(sizes.xl)]: {
            height: "41vh",
            marginLeft: "0px",
            width: "29%",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "45vh",
            position: "relative",
            width: "90%",
            bottom: "0px",
            marginLeft: "4px",

        },
    },
    icons: {
        transform: "scale(1)",
    },
    ad: {
        marginTop: "20px",
    },
    meio: {
        '& span': {
            position: "relative",
            bottom: "30px",
            background: "#4285F4",
            height: "50px",
            maxWidth: "60px",
            borderRadius: "1.2em",
        }
    },
    more: {
        marginTop: "10%",
        color: "white",
        fontSize: "40px",
    },
    root: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        zIndex: 100,
        '& span': {
            height: "65px",
        }
    },
}