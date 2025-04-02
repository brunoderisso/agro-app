import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    container: {
        backgroundColor: theme.colors.predizadark,
        height: "calc(100vh - 64px)",
        padding: "20px",
        [theme.breakpoints.down(sizes.xs)]: {
            padding: "0px",
        },
        position: "relative",
    },
    formContainer: {
        padding: "30px",
        "-webkit-box-shadow": "10px 10px 8px -3px rgba(0,0,0,0.49)",
        "-moz-box-shadow": "10px 10px 8px -3px rgba(0,0,0,0.49)",
        boxShadow: "10px 10px 8px -3px rgba(0,0,0,0.49)",
        backgroundColor: "white",
        borderRadius: "1em",
        position: "absolute",
        transform: "translate(-50%, 0%)",
        left: "50%",
        maxWidth: "40vw",
        marginTop: "125px",
        [theme.breakpoints.down(sizes.xxlg)]: {
            transform: "scale(0.8) translate(-50%, 0%)",
            marginTop: "100px",
        },
        [theme.breakpoints.down(sizes.xs)]: {
           maxWidth: "90vw",
           width: "90vw",
           transform: "scale(0.8) translate(-62%, 0%)",
           marginTop: "155px",
        },

    }
}

export default styles;