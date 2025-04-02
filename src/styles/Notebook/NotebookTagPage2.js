import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerTag: {
        width: "1025px",
        height: "730px",
        background: "white",
        borderRadius: "2em",
        padding: "40px",
    },
    varietyTitle: {
        fontSize: "47px",
        marginTop: "4px",
        marginBottom: "20px",
    },
    weightText: {
        fontSize: "37px",
        marginBottom: "60px",
    },
    weightSize: {
        fontSize: "47px",
    },
    localText: {
        fontSize: "31px",
        textTransform: "uppercase",
    },
    dateText: {
        fontSize: "27px",
        marginTop: "70px",
    },
    codeText: {
        fontSize: "29px",
    },
    infoText: {
        fontSize: "21px",
        textTransform: "uppercase",
        lineBreak: "normal",
    },
    developText: {
        fontSize: "21px",
        marginLeft: "-120px",
        marginTop: "20px",
        minWidth: "16vw",
    },
    tracer: {
        position: "relative",
        bottom: "6vh",
        fontSize: "33px",
        left: "5vw",
        [theme.breakpoints.down(sizes.xl)]: {
            bottom: "7.5vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            left: "30vw",
            bottom: "7vh"
        },
    },
    baseboard: {
        marginTop: "35px",
    },
    svg: {
        maxWidth: "48vw",
        [theme.breakpoints.down(sizes.xl)]: {
            maxWidth: "67vw",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            minWidth: "234vw",
        },
    },
    downloadButton: {
        marginLeft: "23vw",
    },
    containerTags: {
        marginTop: "1px",
    }

}

export default styles;