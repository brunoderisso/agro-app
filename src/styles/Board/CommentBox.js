import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    textField: {
        borderRadius: "20px",
        position: 'relative',
        backgroundColor: "white",
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
    },
    userItem: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        textAlign: "center",
        fontWeight: "bold",
        margin: "5px",
        padding: "10px",
    },
    commentContainer: {
        height: "40vh",
        padding: "10px",
        [theme.breakpoints.up(sizes.xlg)]: {
            height: "39vh",
        },
    },
    commentBox: {
        backgroundColor: "white",
        padding: "5px 10px",
        borderRadius: "20px",
        width: "fit-content",
        maxWidth: "97%",
        lineBreak: "anywhere",
    },
    thumb: {
        background: "#AEAEAE",
        borderRadius: "2em",
    },
}

export default styles;