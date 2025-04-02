import { makeStyles } from "@material-ui/core";

const drawerWidth = "400px";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    position: "absolute",
    zIndex: 1202,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: "40px 14px 34px 24px",
    borderRadius: "10px 0px 0px 10px",
    backgroundColor: theme.colors.onPrimary
  },
  iconEdit: {
    fontSize: "18px",
    color: theme.colors.primary[40]
  },
  iconClose: {
    fontSize: "24px",
    color: theme.colors.onPrimaryContainer
  },
  title: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: 600
  },
  wrapperTitle: {
    paddingLeft: "16px",
  },
  smallerIcon: {
    fontSize: "18px",
    color: theme.colors.onPrimaryContainer
  },
  wrapperSmallerIcons: {
    gap: "10px"
  },
}))

export default useStyles;