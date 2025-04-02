import theme from "../../Utils/theme";

export default {
    paper: {
        position: 'absolute',
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        [theme.breakpoints.between('xs', 'md')]: {
            maxHeight: "90vh",
            minHeight: "90vh",
            minWidth:"60vw",
            maxWidth:"60vw"
        },
        [theme.breakpoints.between('md', 'xl')]: {
            maxHeight: "75vh",
            minHeight: "75vh",
            minWidth:"70vw",
            maxWidth:"70vw"
        },
    },
}