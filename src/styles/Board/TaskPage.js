import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

const styles = {

    containerForm: {
        margin: "10px",
        padding: "20px 20px 30px 20px",
        backgroundColor: "#efefef",
        borderRadius: "20px",
        width: "87vw",
        display: "block",
        position: "relative",
        [theme.breakpoints.up(sizes.lg)]: {
            width: "90vw",
        },
        [theme.breakpoints.up(sizes.xlg)]: {
            width: "92vw",
        },
        [theme.breakpoints.down(sizes.sm)]: {
            width: "94vw",
            marginBottom: "50px"
        },
    },
    removeIcon: {
        position: "absolute",
        zIndex: "999",
        top: "-8px",
        right: "-10px",
        opacity: "0.6",
        '&:hover': {
            opacity: "1"
        }
    },
    categorieItem: {
        position: "relative",
        border: "1px solid black",
        borderRadius: "10px",
        padding: "5px",
        fontWeight: "bold",
        marginRight: "10px"
    },
    titleForm: {
        fontSize: "27px",
        color: theme.colors.predizadark,
        maxHeight: "100px",
        marginBottom: "10px",
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
    editTitle: {
        fontSize: "27px",
        color: theme.colors.predizadark,
    },
    textField: {
        borderRadius: "20px",
        position: 'relative',
        backgroundColor: "white",
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
    labels: {
        color: "#818A81",
        marginLeft: "5px",
        fontSize: "17px",
        fontFamily: "Lato, sans-serif",
        fontWeight: "bold"

    },
    labelItem: {
        padding: "8px",
        margin: "5px",
        borderRadius: "10px",
    },
    modalBody: {
        position: 'absolute',
        width: "fit-content",
        borderRadius: "20px",
        padding: "10px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        boxShadow: "0px 6px 19px -4px rgba(0,0,0,0.75)",
    },
    polygonItem: {
        padding: "8px",
        margin: "5px",
        borderRadius: "10px",
        backgroundColor: "white",
        textAlign: "center",
        width: "min-content",
        
    },
    ajustPolygon:{
        position: "relative",
        right: "19%",
        [theme.breakpoints.up(sizes.lg)]: {
            right: "13%",
        },
    },
    userItem: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        textAlign: "center",
        fontWeight: "bold",
        margin: "5px",
        padding: "1em",
        position: "relative"
    },
    imageItem: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        textAlign: "center",
        fontWeight: "bold",
        margin: "5px",
        position: "relative",
        overflow: "hidden"
    },
    dates: {
        marginTop: "15px",
        padding: "10px"
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',

        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
    closeButton: {
        margin: "1px",
        position: "absolute",
        right: "10px"
    },
    notifyButton: {
        margin: "1px",
        position: "absolute",
        right: "65px"
    },
    deleteButton: {
        margin: "1px",
        position: "absolute",
        right: "115px"
    },
    saveButton: {
        margin: "1px",
        position: "absolute",
        right: "170px"
    },
}

export default styles;