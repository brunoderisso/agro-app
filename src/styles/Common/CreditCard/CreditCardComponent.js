import theme from "../../Utils/theme";

const styles = {
    container: {
        background: theme.colors.onPrimaryContainer,
        width: "352px",
        borderRadius: "16px",
        padding: "24px",
    },
    containerShadow:{
        boxShadow: "0px 10px 19px 0px rgba(0,0,0,0.75)",
    },
    chip: {
        width: "60px",
        margin: "0px 10px"
    },
    itemNumber: {
        fontSize: "14px",
        fontWeight: 400,
        color: "white",
        width: "8.5px"
    },
    itemColor:{
        color: theme.colors.inactive,
        letterSpacing: "1.6px"
    },
    itemLetter: {
        fontSize: "14px",
        fontWeight: 400,
        color: "white",
        width: "9px",
        textAlign: "center"
    },
    flip: {
        transform: "rotateY(180deg)",
    },
    cardFrontHidden: {
        visibility: "hidden"
    },
    cardFront: {
        transitionDuration: "200ms",
    },
    cardBackHidden: {
        visibility: "hidden"
    },
    cardBackShow: {
        visibility: "visible",
        transform: "rotateY(180deg)",

    },
    tarja: {
        height: "50px",
        width: "500px",
        background: "black",
        marginLeft: "-20px"
    },
    cvv:{
        backgroundColor: "white",
        color: "black",
        fontSize: "17px",
        textAlign: "center",
        width: "40px",
        transform: "rotateY(180deg)",
        position: "relative",
        bottom: "60px",
        left: "50px"
    }
}

export default styles;