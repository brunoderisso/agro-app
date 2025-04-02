const styles = {
    addButton: {
        border: "dotted 2px #7e7e7e",
        borderRadius: "20px",
        background: "transparent",
        height: "55px",
        minWidth: "auto",
    },
    list: {
        position: "absolute",
        top: "0",
        right: "60px",
        padding: "10px",
        backgroundColor: "white",
        width: "auto",
        borderRadius: "20px",
        zIndex: 1000
    },
    labelItem: {
        padding: "8px",
        margin: "5px",
        borderRadius: "10px",
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
    effectCursor: {
        cursor: "pointer",
        '&:hover':{
            backgroundColor: "#d5d5d5"
        }
    }
}

export default styles;