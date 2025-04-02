import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {
    container: {
        margin: "10px",
        background: "#F7F8FB",
        borderRadius: "40px",
        padding: "15px",
        height: "85vh",
        fontFamily: "Lato, sans-serif",
        [theme.breakpoints.up(sizes.xl)]: {
            height: "90vh",
            padding: "30px",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            padding: "0px",
        },
    },
    addButton: {
        margin: "10px",
        background: "#fff",
        border: "3px solid " + theme.colors.predizaregular,
        color: theme.colors.predizaregular,
        borderRadius: "30px",
        fontSize: "17px",
        width: "87%",
        height: "60px",
        '&:hover': {
            backgroundColor: "#ededed"
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: "92%"
        },
    },
    alignCenter: {
        textAlign: "center",
    },
    listContainer: {
        maxWidth: "90%",
        margin: "10px",
        marginLeft: "5%",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "100%",
            marginLeft: "0%",

        },
    },
    tagsTitle: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "27px",
        color: theme.colors.predizaregular,
        marginTop: "2vh",
        marginBottom: "4vh",
        [theme.breakpoints.down(sizes.xl)]: {
            visibility: "hidden",
            marginBottom: "-100px",
        },
    }
}

export default styles;