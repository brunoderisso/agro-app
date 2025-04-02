import theme from "../Utils/theme";

export default {
    card: {
        margin: 10,
        [theme.breakpoints.between('xs', 'sm')]: {
            minHeight: "60vh",
            maxHeight: "60vh"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            minHeight: "57vh",
            maxHeight: "57vh"
        }
    },

    input: {
        display: "none"
    },

    label: {
        width: "100%",
        minHeight: "30vh",
        backgroundColor: "#2196f34d",
        marginTop: "30px",
        marginBottom: "12vh",
    },

    img: {
        maxWidth: "100%",
        maxHeight: "30vh",
        minHeight: "30vh"
    },

    highlight: {
        border: "3px dotted #2196f3",
    }
}