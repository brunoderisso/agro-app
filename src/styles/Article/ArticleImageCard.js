import theme from "../Utils/theme";
export default {
    card: {
        margin: 10,
        [theme.breakpoints.between('xs', 'sm')]: {
            minHeight: "60vh",
            maxHeight: "60vh"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            minHeight: "45vh",
            maxHeight: "45vh"
        },
        width:"100%"
    },  
    input: {
        display: "none"
    },
    label: {
        width: "100%",
        minHeight: "30vh",
        backgroundColor: "#2196f34d",
        marginTop: "30px",
    },
    img: {
        maxWidth: "100%",
        maxHeight: "30vh",
        minHeight: "30vh"
    }
}