import theme from "../Utils/theme";

const styles = {
    paper: {
        position: 'absolute',
        width: 400,
        height: 500,
        marginLeft: -200,
        marginTop: -225,
        backgroundColor: theme.colors.predizaregular,
        boxShadow: theme.shadows[5],
        top: "50%",
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
        minWidth: "95px"
    },
    deleteButton: {
        color: "white",
        minWidth: "95px",
        backgroundColor: "#ff050a",
        '&:hover': {
            backgroundColor: "#b00205",
        },

    },
    formContainer: {
        background: "#fff",
        height: "47vh",
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
    }
}

export default styles;