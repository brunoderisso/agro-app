import theme from "../../theme";
import sizes from "../../components/DashboardTheme";

export default {
    box: {
        padding: 20,
        [theme.breakpoints.down(sizes.xs)]: {
            width: "40vw",
            paddingTop: "30vh",
            minWidth: "99vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            paddingTop: "30vh",
            width: "74vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            paddingTop: "30vh",
            width: "73vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: "44vw",
            paddingTop: "30vh"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: "36vw",
            paddingTop: "30vh"
        },


    },
    container: {
        top: "auto",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fafafa",
        zIndex: 1000
    },
    title:{
        
        [theme.breakpoints.down(sizes.xs)]: {
            paddingLeft: "3vh",
            paddingTop: "4vh",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            paddingLeft: "3vh",
            paddingTop: "4vh",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            paddingLeft: "3vh",
            paddingTop: "4vh",
        },
        [theme.breakpoints.up(sizes.md)]: {
            paddingLeft: "3vh",
            paddingTop: "4vh",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            paddingLeft: "3vh",
            paddingTop: "4vh",
        },
    },
    teste:{
        paddingTop:"2vh",
    }
}