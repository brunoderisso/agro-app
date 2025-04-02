import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    environmentName: {
        fontSize: "11px",
        fontWeight: 600,
        marginTop: "-15px",
        overflow: "hidden",
        maxWidth: "6vw",
        maxHeight: "2vh",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "12vw",
            fontSize: "9px",
            fontWeight: "600"
        },
    },
    poligonName: {
        margin: "0px",
    },
    environmentNameExpanded: {
        fontSize: "14px",
        fontWeight: 600,
        marginTop: "-5px",
    },
    propertyEdit: {
        textAlign: "end",
        position: "relative",
        left: "15px",
    },
    cardButtons: {
        margin: "10%",
    },
    editButton: {
        margin: "-7px",
        position: "relative",
        left: "51%",

    },
    iconSize: {
        fontSize: "15px",
    },
    addButton: {
        border: "solid 5px white",
        borderRadius: "1.5em",
        maxWidth: "133px",
        minHeight: "138px",
    },
    buttonAdd: {
        color: "#008eff",
        fontSize: "50px",

    },
    test: {
        width: "105%",
        marginTop: "0em",
        [theme.breakpoints.down(sizes.xs)]: {
            width: " 92vw"
        },
    },
    card: {
        '&:hover': {
            border: "solid 3px #008eff!important",
        },
    },
    cardChart: {
        borderRadius: "20px",
        border: "solid 3px #ffffff",
        maxHeight: "85px!important",
        '&:hover': {
            border: "solid 3px #008eff",
        },
    },
    checkbox: {
        position: "relative",
        left: "30%",
        top: "17%",
    },
    cardContent: {
        padding: 5,

        '&:last-child': {
            paddingBottom: 5,
        },
    },
    cardsContainer: {
        maxHeight: "100%",
        maxWidth: "100%",
        overflowY: "scroll",
        boxSizing: "content-box",
        paddingRight: "80px",
        paddingLeft: "7px",
        textAlign: "-webkit-center",

        [theme.breakpoints.down(sizes.xl)]: {
            maxHeight: "95%",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginTop: "20px",
        },
    },
    cardContainer: {
        margin: "5px 0px",
        width: "80%",
        paddingBottom: "20%",
        borderRadius: "20px",
        overflow: "hidden",
        [theme.breakpoints.down(sizes.xs)]: {
            minWidth: "110px",
        },
    },
    cardContainerExpanded: {
        margin: "5px 0px",
        maxWidth: "300px",
        borderRadius: "20px",
        overflow: "hidden",
        transition: "1s",
        [theme.breakpoints.down(sizes.xs)]: {

        },
    },
    cardContainerChart: {
        margin: "5px 0px",
        borderRadius: "20px",
        overflow: "hidden",

    },
    sizePolygon: {
        marginTop: "25px",
    },
    paperBack: {
        backgroundColor: "#000",
    },
    modalBody: {
        margin: "28vh 40vw",
        width: "45vw",
        backgroundColor: "#FFFFFF",
        border: "solid 1px #4d4d4d",
        borderRadius: "2em",
        height: "50vh",

        [theme.breakpoints.down(sizes.xs)]: {
            width: "92vw",
            margin: "35vh 5vw",
        },
    }
}