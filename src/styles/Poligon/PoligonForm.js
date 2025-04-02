import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    container: {
        margin: "20px",
    },
    formContainer:{
        maxWidth: "500px",
        margin: "20px",
        textAlignLast: "start"
    },
    formControl: {
        margin: 10,
        minWidth: 120,
        position: "relative",
        left: "-10px"
    },
    textField: {
        width: "100%",
        marginBottom: "10px",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "80vw",
        },
    },
    btns: {
        position: "relative",
        left: "-10px"
    },
    margins: {
        paddingRight: "15px",
    },
    mapContainer: {
        marginBottom: "30px",
    },
    GMap: {
        overflow: "hidden",
        borderRadius: "1.25em",
        position: "relative",
        bottom: "10px",
        height: "79vh",
        width: "100%",
        margin: "10px",
        [theme.breakpoints.up(sizes.xl)]: {
            height: "86vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            height: "45vh",
        },
    },
}