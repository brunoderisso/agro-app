import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    root: {
    },
    collapseMobile: {
        maxHeight: "0px",
    },
    viewMore: {
        textAlign: "right",
    },
    groupButton:{
        marginTop: "10px",
    },
    arrow: {
        transform: 'rotate(0deg)',
        marginLeft: '25vw',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        position: "relative",
        bottom: "46px",
        color: "black",
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "67vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginLeft: '26vw',
        },
    },
    hiddenTag:{
        position: "absolute",
        left: "-500vw",
    },
    buttonMore: {
        fontSize: "10px",
        position: "relative",
        top: "1vh",
    },
    styleCard: {
        borderRadius: "2em",
        background: "#4285F4",
        width: "43vw",
        marginBottom: "10px",
        marginTop: "10px",
        [theme.breakpoints.down(sizes.xs)]: {
            width: "87vw",
            marginLeft: "10px",
            marginTop: "10px",
            marginBottom: "60px"
        },
    },
    environmentText: {
        color: "white"
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
        color: "white"
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    contentExpand: {
        background: "#F7F8FB",
    },
    envItens: {
        marginTop: "20px",
        fontWeight: 600,
        color: "#A0A0A0"
    },
    test: {
        width: "102%",
        marginTop: "0em",
        [theme.breakpoints.down(sizes.xs)]: {
            width: " 92vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
           width: "100%"
        },
    },
    linkdisabled:{
        color:"#717273",
        pointerEvents: "none",
        cursor: "default",
        textDecoration: "none",
        marginTop:5
    },
    linkenabled:{
        color:"#717273",
        marginTop:5
    }
    
}