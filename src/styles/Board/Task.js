import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerDiseaseCard: {
        background: "white",
        borderRadius: "20px",
        padding: "15px",
        maxWidth: "406px",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "100%"
        },
    },
    containerCard: {
        width: "inherit",
        margin: "10px 15px 10px 10px",
        borderRadius: "20px",
    },
    cardTitle: {
        fontSize: "14px",
        fontFamily: "Lato, sans-serif",
        fontWeight: "bold",
        marginBottom: "2px"
    },
    userItem: {
        borderRadius: "50%",
        maxHeight: "25px",
        maxWidth: "25px",
        fontSize: "12px",
        lineHeight: "25px",
        textAlign: "center",
        marginRight: "-4px"
    }
}

export default styles;