import sizes from "../../components/DashboardTheme";
import theme from "../../theme";

export default {
    root: {
        width: "100%",
        minWidth: "100%",
        [theme.breakpoints.down(sizes.xs)]: {
            maxHeight: "75vw",
            minHeight: "75vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            maxHeight: "40vw",
            minHeight: "40vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            maxHeight: "30vw",
            minHeight: "30vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            maxHeight: "23vw",
            minHeight: "23vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            maxHeight: "20vw",
            minHeight: "20vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            maxHeight: "13vw",
            minHeight: "13vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
            maxHeight: "11.5vw",
            minHeight: "11.5vw"
        }
    },
    widgetIcon: {
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "12vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "7vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "4.5vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "4vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "3.4vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "2.0vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },

    },
    data: {
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "5vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "2.7vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "2.2vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "1.7vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "1.3vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "1vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
    },
    label: {
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "5vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "2.7vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "2.1vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "1.6vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "1.3vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "1vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },
    },
    center: {
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "10vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "6vw"
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "4vw"
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "3.5vw"
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "2.9vw"
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "1.8vw"
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },

    },
    widgetPos: {
        fontWeight: 500,
        [theme.breakpoints.down(sizes.xs)]: {
            fontSize: "5vw",
            marginTop: "1vw",
            marginBottom: "4vw"
        },
        [theme.breakpoints.up(sizes.xs)]: {
            fontSize: "2.7vw",
            marginTop: "0.7vw",
            marginBottom: "0.5vw",
        },
        [theme.breakpoints.up(sizes.sm)]: {
            fontSize: "2.2vw",
            marginTop: "0.7vw",
            marginBottom: "0.5vw",
        },
        [theme.breakpoints.up(sizes.md)]: {
            fontSize: "1.7vw",
            marginTop: "0",
            marginBottom: "0.1vw",
        },
        [theme.breakpoints.up(sizes.lg)]: {
            fontSize: "1.3vw",
            marginTop: "0.15vw",
            marginBottom: "0.5vw",
        },
        [theme.breakpoints.up(sizes.xl)]: {
            fontSize: "1vw",
            marginTop: "0",
            marginBottom: "0.15vw",
        },
        [theme.breakpoints.up(sizes.xxl)]: {
        },

    },

}