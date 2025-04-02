import theme from "../Utils/theme"
import drawerStyle from "../../styles/Drawer"

const drawerWidth = 300;

export default {
    root: {
        display: 'flex',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        overflowY: "auto",
        [theme.breakpoints.between('xs', 'sm')]: {
            height: "calc(100% - 50px)",
        },
        [theme.breakpoints.between('sm', 'xl')]: {
            height: "calc(100% - 71px)",
        },
        marginLeft: 50
    },
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
    },
    container: {
        minHeight: "100%",
        maxHeight: "100%"
    },
    footer: {
        position: "fixed",
        bottom: 90,
        width: 300,
        marginLeft: 115
    },
    title: {
        marginTop: 10,
        fontSize: 30,
        marginBottom: 10
    },
    newButton: {
        paddingRight: 7
    },
    ...drawerStyle
}