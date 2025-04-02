import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
    box: {
        margin: "1px",
    },
    buttonCalendar: {
        zIndex: "999",
        position: "fixed",
        bottom: "53px",
        marginLeft: "0.8vw",
        borderRadius: "5px 15px",

        [theme.breakpoints.down(sizes.md)]: {
            maxWidth: "20vw",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "60vw",
        },
    },
    calendarContainer:{
        position: "fixed",
        bottom: "53px",
        display: "flex"
    },
    calendarButton:{
        borderRadius: "5px 0px 0px 15px",
        [theme.breakpoints.down(sizes.md)]: {
            maxWidth: "20vw",
        },
        [theme.breakpoints.down(sizes.xs)]: {
            maxWidth: "60vw",
        },
    },
    borderR:{
        borderRadius: "5px 0px 0px 15px",
    },
    menuPresets: {
        backgroundColor: "#2196f3",
        color: "white"
    },
    floatButtonCalendar: {
        zIndex: "999",
        position: "fixed",
        minWidth: "50px",
        maxWidth: "50px",
        maxHeight: "50px",
        minHeight: "50px",
        borderRadius: "50%",
    },
    presetButton: {
        backgroundColor: "#2196f3",
        minWidth: "0px",
        maxWidth: "40px",
        borderRadius: "0px 15px 5px 0px",
        height: "36px",
        zIndex: "999",
        [theme.breakpoints.up(sizes.lg)]: {
            height: "36.5px",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            height: "36.5px",
        },
    },
    newday: {
        zIndex: "999",
        position: "fixed",
        top: "52vh",
        left: "2.4vw",

        "& div .react-datepicker__day--today": {
            color: "#ffb100!important",

        },
        "& div .react-datepicker .react-datepicker__month-container .react-datepicker__month .react-datepicker__week .react-datepicker__day": {
            width: "2.7em!important",
            color: "white",
            "&:hover": {
                backgroundColor: "#040067!important",
            },
            [theme.breakpoints.down(sizes.xl)]: {
                width: "2.7em!important",
                height: "25px!important",
            },
            [theme.breakpoints.up(sizes.xl)]: {
                width: "3.6em!important",
                height: "4.3vh!important",
            },
        },
        "& div .react-datepicker": {
            backgroundColor: "#1455BE!important",
            borderRadius: "2em",
        },
        "& div .react-datepicker .react-datepicker__month-container .react-datepicker__header .react-datepicker__day-names .react-datepicker__day-name": {
            width: "2.2rem!important",
            color: "white",
            [theme.breakpoints.up(sizes.xl)]: {
                width: "2.8rem!important",
            },
        },
        "& div .react-datepicker .react-datepicker__month-container .react-datepicker__header .react-datepicker__day-names .react-datepicker__day-name:hover": {
            backgroundColor: "#002a4c",
        },
        "& div .react-datepicker .react-datepicker__month-container .react-datepicker__header": {
            backgroundColor: "#1455BE!important",
            borderTopLeftRadius: "2em",
            borderTopRightRadius: "2em",
        },
        "& div .react-datepicker__current-month": {
            color: "white"
        },
        "& div .react-datepicker .react-datepicker__navigation": {
            [theme.breakpoints.down(sizes.xs)]: {
                width: "25px!important"
            },
        },

        [theme.breakpoints.down(sizes.xs)]: {
            left: "15%",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            top: "55vh",
            left: "2.3vw",

        },
    },

}