import sizes from "../Utils/DashboardTheme";
import theme from "../Utils/theme";

export default {
    chartl: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 15,
        marginTop: 30,
        minHeight: 340
    },
    table: {
        backgroundColor: "white",
        marginTop: 30,
        marginBottom: 5,
        padding: 15,
        borderRadius: 15
    },
    header: {
        padding: 15,
        marginBottom: 30,
        backgroundColor: "white"
    },
    chartdn: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 15,
        marginTop: 30,
        minHeight: 340
    },
    margin: {
        marginTop: -25,
    },
    devicesitem:{
        width: "97%",
        marginLeft: "1.5%",
        marginRight: "1.5%",
        backgroundColor: "white",
        height:"100%",
        borderRadius: 15,
        padding:10
    },
    devicescard: {
        marginTop: 30,
        [theme.breakpoints.down(sizes.xs)]: {
            height: "100vw",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            height: "56vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            height:"53vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            height: "47vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            height: "40vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            height: "35vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            height: "30vw"
        }
    },
    title:{
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "6.5vw",
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "4vw",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "3.4vw",
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "2.6vw",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "2.2vw",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "2w",
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            fontSize: "2vw",
        }
    },
    deviceimg:{
        [theme.breakpoints.down(sizes.xs)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.xs)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.sm)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.md)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.lg)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.xl)]: {
            width: 100,
            height: 100,
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            width: 100,
            height: 100,
        }
    },
    csvButton:{
        position:"absolute",
        right: "5vw",
    }
}