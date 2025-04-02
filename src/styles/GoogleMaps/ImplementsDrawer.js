import { makeStyles } from '@material-ui/core';

const drawerWidth = '260px'

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
        height: 'calc(100vh - 64px)',
        marginTop: '64px',
        borderRadius: '4px 0px 0px 4px',
    },
    container: {
        margin: "16px 16px 16px 16px",
        paddingRight: "42px"
    },
    icon: {
        color: theme.colors.onPrimaryContainer,
        fontSize: "16px"
    },
    text: {
        color: theme.colors.onPrimaryContainer,
    },
    subtext: {
        color: theme.colors.outline
    },
    active: {
        backgroundColor: theme.colors.secondary,
        color: "white",
        borderRadius: "4px",
        padding: "4px"

    },
    inactive: {
        backgroundColor: theme.colors.tertiary,
        color: "white",
        borderRadius: "4px",
        padding: "4px"
    },
    stoped: {
        backgroundColor: theme.colors.error[40],
        color: "white",
        borderRadius: "4px",
        padding: "4px"
    },
    table: {
        borderRadius: "4px",
        overflow: "hidden"
    },
    activity: {
        textAlign: "center",
        backgroundImage: "linear-gradient(to right, black 33%, rgba(255,255,255,0) 0%)",
        backgroundPosition: "bottom",
        backgroundSize: "10px 1px",
        backgroundRepeat: "repeat-x",
    },
    buttons: {
        color: theme.colors.primary[40]
    }
}));

export default useStyles;