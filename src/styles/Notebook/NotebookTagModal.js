import theme from "../Utils/theme";

const styles = {
    paper: {
        position: 'absolute',
        width: 400,
        height: 574,
        marginLeft: -200,
        marginTop: -225,
        backgroundColor: theme.colors.predizaregular,
        boxShadow: theme.shadows[5],
        top: "40%",
        left: "50%",
        borderRadius: "12px",
        overflow: "hidden",
    },
    modalTitle: {
        height: "40px",
        fontSize: "17px",
        marginTop: "15px",
        textAlign: "center",
        color: "white",
        marginLeft: "50px",
    },
    closeButton: {
        color: "white",
        position: "relative",
        bottom: "11px",
    },
    addButton: {
        borderRadius: "2em",
        bottom: "95px"
    },
    formContainer: {
        background: "#fff",
        height: "535px",
        padding: "15px",       
    },
    formControl: {
        width: "100%",
    },
    center: {
        textAlign: "center",
        marginTop: "25px"
    },
    spacing: {
        marginBottom: "10px",
    },
    thumb: {
        background: theme.colors.predizadark,
        borderRadius: "2em",
    },
}

export default styles;