import theme from "../../Utils/theme";

export default {
    device:{
        fontWeight:300
    },
    measure:{
        fontWeight: 500
    },
    xs: {
        [theme.breakpoints.between('xs', 'sm')]: {
            display: "none"
        }
    },
    md: {
        [theme.breakpoints.between('sm', 'xl')]: {
            display: "none"
        }
    }
}