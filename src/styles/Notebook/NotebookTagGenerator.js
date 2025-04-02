import theme from "../../theme";
import sizes from "../../components/DashboardTheme";

export default {
    main: {

    },
    envName: {
        fontSize: "9px!important",
        textAlign: "center",
    },
    envContainer: {
        textAlign: "-webkit-center",
    },
    envRoll: {
        overflowY: "scroll",
        height: "45vh",
        [theme.breakpoints.down(sizes.xl)]: {
            height: "31vh",
        },
    },
    Fcontainer: {
        margin: "5px 15px",
        minWidth: "80px!important",
    },
    orange: {
        backgroundColor: "#1455BE"
    },
    title: {
        textAlign: "center",
        fontSize: "30px",
        marginTop: "30px",
        marginBottom: "30px",
        color: "#4285F4",
        fontWeight: 600,
        marginRight: "6vw"
    },
    subtitle: {
        fontWeight: 600,
        color: "#a5a5a5",
        fontSize: "20px",
        marginLeft: "20px",
    },
    Scontainer: {
        marginLeft: "20px",
        maxWidth: "28vw",
    },
    container: {
        background: "#f1f1f1",
        borderRadius: "2em",
        height: "90vh",
        marginTop: "11px",
        width: "100%",
        [theme.breakpoints.down(sizes.xl)]: {
            height: "87vh",
        },
    },
    cardGenerator: {
        textAlign: "center",
        border: "solid 4px #4285F4",
        borderRadius: "1em",
        height: "220px",
        maxWidth: "400px",
        background: "white",
        [theme.breakpoints.down(sizes.xl)]: {
            height: "185px",
            maxWidth: "380px"
        },

    },
    containerGenerator: {
        textAlign: "-webkit-center",
        marginTop: "5vh",
    },
    titleGenerator: {
        fontSize: "27px",
        fontWeight: "bold",
        marginTop: "5vh",
        whiteSpace: "break-spaces",
    },
    buttonGenerator: {
        borderRadius: "0.5em 1em",
        minWidth: "10vw",
        marginTop: "10px"
    }
}