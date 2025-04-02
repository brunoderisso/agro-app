import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerDiseaseCard: {
        background: "white",
        borderRadius: "20px",
        padding: "15px",
        maxWidth: "406px",
        height: "100%",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "100%"
        },
    },
    leftBar: {
        width: "6px",
        height: "100%",
        borderRadius: "6px",
        [theme.breakpoints.down(sizes.xs)]: {
            height: "100%",
        },
    },
    _leftBar: {
        minHeight: "100%",
        [theme.breakpoints.down(sizes.xl)]: {
            minHeight: "100%"
        },
    },
    cropName: {
        fontSize: "17px",
        fontWeight: "bold",
    },
    environmentInfo: {
        fontSize: "15px",
        marginTop: "10px",
    },
    icon: {
        marginTop: "10px"
    },
    infoContainer: {
        padding: "5px",
        paddingTop: "10px",
        paddingBottom: "5px",
        background: "#F7F8FB",
        border: "2px solid #E3E3E3",
        borderRadius: "20px",
        textAlign: "center",
        minHeight: "155px",
        position: "relative",
        width: "133px",
    },
    infoTitle: {
        fontWeight: "bold",
        color: "#818A81",
        [theme.breakpoints.down(sizes.xmd)]: {
            fontSize: "8px",
        },
    },
    infoValue: {
        fontSize: "17px",
        fontWeight: "bold",
        marginTop: "10px",
    },
    containerInfoCards: {
        marginTop: "10px"
    },
    legend: {
        marginTop: "30px",
        fontSize: "8px",
        color: theme.colors.predizadark
    },
    riskCard: {
        top: "65px",
        fontSize: "10px",
        textAlign: "center",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "83%",
            top: "44%"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "72%"
        },
    },
    gridContainer: {
        position: "relative",
    },
    visibility: {
        position: "absolute",
        top: "-11px",
        right: "-11px",
    },
}

export default styles;