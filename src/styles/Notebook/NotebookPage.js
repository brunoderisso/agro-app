import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    buttonPosition:{
        position: "relative",
        fontSize: "7px",
    },

    calendarPosition:{
        right: "auto",
        left: "80px",
        bottom: "5px",
        top: "auto",
    },

    icons: {
        transform: "scale(0.9)",
    },

    iconsHidden: {
        transform: "scale(0.6)",
    },

    labeldis: {
        top: "5px!important",
    },

    iconsDis:{
        transform: "scale(1.4)",
    },

    iconsConfig:{
        left: "15px",
        position: "relative",
    },

    wrapper: {
        height: "45px",
    },

    root: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100vw",
        zIndex: 100,
        '& span': {
            height: "65px",
            position: "relative",
            top: "-1px",
            fontSize: "10px !important"
        }
    },

    ad: {
        marginTop: "20px",
    },

    meio: {
        '& span': {
            position: "relative",
            bottom: "30px",
            background: "#4285F4",
            height: "50px",
            maxWidth: "60px",
            borderRadius: "1.2em",
        }
    },

    more: {
        marginTop: "10%",
        color: "white",
        fontSize: "40px",
    },

    container: {
        marginLeft: "80px",
        overflow: "hidden",
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "0vw",
        },
    }
}
