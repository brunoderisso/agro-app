import theme from "../Utils/theme";
import sizes from "../Utils/DashboardTheme";

export default {
  newday: {
    zIndex: "999",
    position: "fixed",
    bottom: "70px",

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
  },
}