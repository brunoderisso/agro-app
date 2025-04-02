import theme from "./Utils/theme";
import sizes from "./Utils/DashboardTheme";

export default {
    root: {
        flexGrow: 1,
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
    },

    mainPlans:{
        paddingLeft: "0px!important",
        paddingTop: "64px!important",
        paddingRight: "0px!important",
        paddingBottom: "0px!important"
    },

    mainForecast: {
        width: "100%",
        paddingTop: 69,
        paddingRight: 5,
        flex: 1,
        [theme.breakpoints.down(sizes.xs)]: {
            paddingBottom: "0!important",
            paddingTop: "60px!important",
            paddingRight: 0,
            paddingLeft: "0px!important",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            paddingBottom: "0!important"
        },
        [theme.breakpoints.up(sizes.md)]: {
            paddingBottom: "0!important"
        },
    },

    notFoundError:{
        padding: "0px",
        paddingTop: "64px"
    },

    alarm: {
        paddingLeft: "5px",
    },

    admin: {
        paddingLeft: "210px!important"
    },

    mainPoligon: {
        [theme.breakpoints.down(sizes.xs)]: {
            marginLeft: "calc(100% - 55px)",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            marginLeft: "calc(50% - 55px)"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            marginLeft: "calc(40% - 55px)"
        },
        [theme.breakpoints.up(sizes.md)]: {
            marginLeft: "calc(35% - 55px)"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            marginLeft: "calc(25% - 55px)"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            marginLeft: "calc(16% - 55px)"
        }
    },

    login: {
        padding: "0"
    },

    stylesLoader: {
        position: "fixed",
        top: "50%",
        left: "47%"
    }
}
