import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    root: {
    },
    cardHederRoot:{
        paddingBottom: "0px"
    },
    test: {
        width: "100%",
        marginTop: "0em",
        [theme.breakpoints.down(sizes.md)]: {
            marginTop: "3em",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            width: " 92vw"
        },
        '& div .slick-list':{
            marginLeft: "20px"
        }
    },
    styleCard: {
        borderRadius: "2em",
        background: "#F7F8FB",
        width: "30vw",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "90vw",
            marginLeft: "3vw",
        },
    },
    containerSlider: {
        maxWidth: "25vw",
        marginLeft: "1vw",
        marginTop: "3vh",
        textAlign: "center",
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "73vw",
            marginLeft: "3vw",
        },
    },
    polygonProd: {
        fontWeight: 600,
        color: "#A0A0A0"
    },
    substage: {
        background: "#C7E4FC",
        maxWidth: "50px",
        minHeight: "50px",
        borderRadius: "5px 20px",
        textAlign: "center",
        paddingTop: "7%",
        fontSize: "20px",
        fontWeight: 500,
        color: "#4285F4",
    },
    environmentText: {
        color: "black",
        fontWeight: 600
    },
    cardActions: {
        maxHeight: "0vh",
        marginBottom: "-20px"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        position: "relative",
        bottom: "46px",
        color: "black"
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    contentExpand: {
        background: "#F7F8FB",
    },
    polygonItens: {
        fontWeight: 600,
        color: "#A0A0A0"
    },
    messageInfo:{
        fontWeight: 600,
        color: "#707070",
        fontSize: "10px",
        marginTop: "5px"
    },
    formControl: {
        margin: 8,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: 16,
    },
    imageViwer:{
        position: "fixed",
        top: "15%",
        left: "25%",
        zIndex: "9999",
        [theme.breakpoints.up(sizes.xl)]: {
            left: "30%",
        },

    },
    imagesItem:{
        cursor: "pointer",
        '&:hover':{
            border: "solid 1px #2196f3"
        }
    }
}