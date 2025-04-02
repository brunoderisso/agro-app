import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerPestCard: {
        background: "white",
        borderRadius: "20px",
        padding: "10px",
        margin: "5px",
        height: '100%',
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "100%"
        },
    },
    buttonCapture: {
        height: "10px",
        textAlign: "end",
    },
    alignLoading: {
        position: "fixed",
        top: "50%",
        left: "50%"
    },
    cycleContainer: {
        padding: "20px",
        [theme.breakpoints.down(sizes.xs)]: {
            padding: "5px",
        },
    },
    infoContainer: {
        padding: "10px",
        paddingTop: "20px",
        background: "#F7F8FB",
        border: "2px solid #E3E3E3",
        borderRadius: "20px",
        textAlign: "center",
        minHeight: "155px",
        width: "fit-content",
        maxWidth: "11vw",
        position: "relative",
        [theme.breakpoints.down(sizes.sm)]: {
            width: "fit-content",
            maxWidth: "29vw"
        },
    },
    subtitleCard: {
        fontSize: "14px"
    }
}

export default styles;