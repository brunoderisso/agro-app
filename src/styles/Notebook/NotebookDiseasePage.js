import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    containerDisease: {
        margin: "10px",
        marginBottom: "45px",
        background: "#F7F8FB",
        borderRadius: "40px",
        padding: "15px",
        width: "90vw",
        fontFamily: "Lato, sans-serif",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "95vw",
            marginBottom: "100px"
        },
    },
    alignLoading: {
        position: "fixed",
        top: "50%",
        left: "50%"
    },
    containerCaption: {
        marginLeft: "15px",
        padding: "5px 10px 10px 10px"
    },
    titleCaption: {
        textTransform: "uppercase",
        color: theme.colors.outline,
    },
    backdrop: {
        zIndex: 5000,
    },
    captionBlock: {
        padding: "10px"
    },
    itemCaption: {
        color: theme.colors.onPrimaryContainer,
        marginLeft: "4px"
    },
    containerItemCaption: {
        display: "flex"
    }
}

export default styles;