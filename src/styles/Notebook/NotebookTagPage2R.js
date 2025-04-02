import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerTag: {
        width: "455px",
        height: "315px",
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "400px",
            height: "325px",
            padding: "12px",
        },
    },
    varietyTitle: {
        fontSize: "20px",
        marginTop: "0px",
        marginBottom: "10px",
    },
    weightText: {
        fontSize: "15px",
        marginBottom: "20px",
        marginTop: "7px",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "15px",
        },
    },
    weightSize: {
        fontSize: "17px",
        marginTop: "4px",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "17px",
            marginTop: "6px",
        },
    },
    localText: {
        fontSize: "13px",
        textTransform: "uppercase",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "12px"
        },
    },
    dateText: {
        fontSize: "14px",
        marginTop: "30px",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "15px",
        },
    },
    codeText: {
        fontSize: "14px",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "12px"
        },
    },
    infoText: {
        fontSize: "8px",
        textTransform: "uppercase",
        lineBreak: "normal",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "10px"
        },
    },
    developText: {
        fontSize: "9px",
        marginLeft: "-1px",
        marginTop: "6px",
        minWidth: "16vw",
    },
    tracer: {
        position: "relative",
        bottom: "4.7vh",
        fontSize: "16px",
        left: "1.5vw",
        [theme.breakpoints.down(sizes.xl)]: {
            left: "2.5vw",
            bottom: "7vh"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            left: "7vw",
            bottom: "5.1vh",
            fontSize: "13px",
        },
    },
    baseboard: {
        marginTop: "5px",
    },
    svg: {
        maxWidth: "22vw",
        [theme.breakpoints.down(sizes.xl)]: {
            maxWidth: "31vw",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "72vw",
        },
    },
    downloadButton: {
        marginLeft: "160px",
    },
    containerTags: {
        marginTop: "1px",
    }

}

export default styles;