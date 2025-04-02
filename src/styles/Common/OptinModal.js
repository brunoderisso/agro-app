import theme from '../Utils/theme'

export default {
    paper: {
        position: 'absolute',
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        [theme.breakpoints.between('xs', 'md')]: {
            maxHeight: "42vh",
            minHeight: "42vh"
        },
        [theme.breakpoints.between('md', 'xl')]: {
            maxHeight: "22vh",
            minHeight: "22vh"
        },
    },
}