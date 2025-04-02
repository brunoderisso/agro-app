import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";
const fullWidth = 172;
const minWidth = 64;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: (props) => (props.open ? fullWidth : minWidth), // Largura da drawer quando expandida ou recolhida
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaper: {
    width: (props) => (props.open ? fullWidth : minWidth),
    backgroundColor: theme.colors.primary[30],
    color: "#fff",
    paddingTop: "64px",
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "hidden"
  },
  toggleButton: {
    color: "#fff",
    width: "fit-content",
    paddingLeft: theme.spacing(2)
  },
  itens: {
    paddingLeft: 0
  },
  listItemText: {
    color: "#fff",
    opacity: (props) => (props.open ? 1 : 0), // Esconder texto quando drawer está recolhida
    transition: 'opacity 0.2s',
  },
  listItemIcon: {
    color: "#fff",
    justifyContent: "center",
  },
  page: {
    marginLeft: "-48px",
    width: "85%"
  }
}));

export default useStyles;