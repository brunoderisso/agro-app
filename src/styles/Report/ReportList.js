import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    tableHeader: {
        background: "#F4F3F4",
        borderRadius: "12px",
        padding: "15px",
        margin: "10px",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#818A81"
    },

    test: {
        width: "102%",
        marginTop: "0em",
        [theme.breakpoints.down(sizes.xs)]: {
            width: " 92vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
           width: "100%"
        },
    },

    tableRow: {
        background: "#FFFFFF",
        borderRadius: "12px",
        padding: "15px",
        margin: "10px",
        fontSize: "15px"
    },

    scrollContainer: {
        maxHeight: "300px",
    },

    thumb: {
        background: theme.colors.predizadark,
        borderRadius: "2em",
    },

    tableLabel: {
        textAlign: "center",
        wordBreak: "break-all",
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "10px",
        },
    },

    reportItem: {
        cursor: "pointer",
    }
}

export default styles;