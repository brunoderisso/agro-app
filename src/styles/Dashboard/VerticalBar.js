import theme from "../Utils/theme";

const drawerWidth = 60;

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
        width: drawerWidth,
        overflowY: "auto",
        overflowX: "hidden",
        [theme.breakpoints.between('xs', 'sm')]: {
          height: "calc(100% - 50px)"
        },
        [theme.breakpoints.between('md', 'xl')]: {
          height: "calc(100% - 71px)"
        },
      },
      toolbar: theme.mixins.toolbar,
      content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3),
      },
      warning: {
        fontSize: 24,
        color: "#ffa700",
      },
}