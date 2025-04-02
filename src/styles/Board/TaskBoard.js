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
    containerColumn: {
        padding: "10px",
        margin: "10px"
    },
    addButton: {
        color: "black",
        height: "60px",
        padding: "5px",
        fontSize: "21px",
        boxShadow: "0px 4px 14px -4px rgb(0 0 0 / 74%)",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        lineHeight: "50px",
        borderRadius: "20px",
        margin: "20px",
        width: "264px",
    },
    newList: {
        color: "black",
        height: "60px",
        padding: "15px 20px 10px 20px",
        fontSize: "21px",
        boxShadow: "0px 4px 14px -4px rgb(0 0 0 / 74%)",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        lineHeight: "50px",
        borderRadius: "20px",
        margin: "20px",
        minWidth: "264px",
    },
    thumb: {
        background: "#AEAEAE",
        borderRadius: "2em",
    },
    scrollList: {
        '& > div': {
            display: "flex"
        }
    },
    resize: {
        fontSize: "21px",
        fontFamily: "Poppins, sans-serif",
    },
    
}

export default styles;