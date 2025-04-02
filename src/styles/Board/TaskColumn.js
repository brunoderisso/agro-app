import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";
const styles = {
    topTitle: {
        fontSize: "21px",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        borderRadius: "20px",
        padding: "5px",
        color: "white",
        height: "60px",
        lineHeight: "50px",
        webkitBoxShadow: "0px 4px 14px -4px rgba(0,0,0,0.74)",
        boxShadow: "0px 4px 14px -4px rgba(0,0,0,0.74)"
    },
    backgroundColumn: {
        background: "#efefef",
        minHeight: "80vh",
        alignContent: "flex-start",
        width: "264px",
        borderRadius: "20px"
    },
    taskList: {
        padding: "8px",
        transition: "background - color 0.2s ease",
        flexGrow: 1,
        height: "64vh",
    },
    fading: {
        bottom: "8vh",
        left: 0,
        position: "absolute",

        /* Size */
        height: "30px",
        width: "100%",

        /* Gradient background */
        background: "linear-gradient(rgba(255, 255, 255, 0.01), #efefef)",
        [theme.breakpoints.up(sizes.xlg)]: {
            bottom: "9vh",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            bottom: "10vh",
        },
    },
    thumb: {
        background: "#AEAEAE",
        borderRadius: "2em",
    },
    containeraddButton: {
        textAlign: "center",
        padding: "10px",
        width: "inherit",
        cursor: "pointer"
    },
    addButton: {
        border: "dotted 2px #7e7e7e",
        borderRadius: "20px",
        '&:hover': {
            transitionDuration: "1s",
            backgroundColor: theme.colors.predizaregular,
        }
    },
    newCard: {
        width: "inherit",
        margin: "10px",
        padding: "10px",
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'white',
            },
            '&:hover fieldset': {
                borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'white',
            },
        },
        '& .MuiInput-underline:after': {
            borderBottom: "2px solid #FFFFFF"
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: "2px solid #FFFFFF"
        },
        '& .MuiInput-underline:before': {
            borderBottom: "2px solid #FFFFFF"
        }
    },
    editColumn: {
        marginTop: "10px",
        '& .MuiInput-underline:after': {
            borderBottom: "2px solid #FFFFFF00"
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: "2px solid #FFFFFF00"
        },
        '& .MuiInput-underline:before': {
            borderBottom: "2px solid #FFFFFF00"
        }
    },
    resize: {
        fontSize: "14px",
        textAlign: "center"
    },
    resizeColumn: {
        fontSize: "20px",
        textAlign: "center",
        color: "white"
    },
    autoCloseColumn: {
        position: "absolute",
        top: "7px",
    }

}

export default styles;