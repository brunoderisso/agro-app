import theme from "../../Utils/theme";

export default {
    min: {
        [theme.breakpoints.between('sm', 'xl')]: {
            paddingLeft: "5vw"
        }
    },
    max: {
        [theme.breakpoints.between('sm', 'xl')]: {
            paddingLeft: "5vw"
        }
    },
    container: {
        margin: theme.spacing(1)
    },
    number: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw"
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw"
        },
        marginRight: 2
    },
    label: {
        [theme.breakpoints.between('xs', 'sm')]: {
            fontSize: "6vw",
            fontWeight: 500
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            fontSize: "1.05vw",
            fontWeight: 500
        },
        marginRight: 5
    },
    xs: {
        [theme.breakpoints.only('xs')]: {
            display: "none"
        }
    },
    md: {
        [theme.breakpoints.between('sm', 'xl')]: {
            display: "none"
        },
        marginLeft: 24
    },
    panel: {
        paddingLeft: 0
    },
    wrapperSpinning: {
        height: '200px',
        width: '100vw'
    }
}