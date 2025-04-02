import { makeStyles } from "@material-ui/core";

const drawerWidth = "600px";
const drawerHeight = "464px";

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: "absolute",
    zIndex: 1203,
  },
  drawerPaper: {
    height: drawerHeight,
    borderRadius: "10px",
    backgroundColor: theme.colors.onPrimary,
    boxShadow: theme.shadows[8],
    overflow: "hidden"
  },
  title: {
    fontWeight: 600,
    color: theme.colors.onPrimaryContainer,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block'
  },
  button: {
    color: theme.colors.primary[40],
    height: "40px",
    width: "133px",
    "&:hover": {
      backgroundColor: theme.colors.primary[95],
    }
  },
  container: {
    flexDirection: "column",
    width: drawerWidth,
    height: drawerHeight,
    padding: "24px 40px",
  },
  wrapperSearch: {
    margin: "24px 0 16px 0"
  },
  icon: {
    width: "20px",
    height: "20px",
    fill: theme.colors.primary[40],
    marginRight: "8px"
  },
  smallIcon: {
    width: "18px",
    height: "18px",
    fill: (props) => (props.emailHasAdded ? theme.colors.outline : theme.colors.primary[40])
  },
  wrapperLinkButton: {
    display: "flex",
    justifyContent: "flex-end",
    marginLeft: "auto"
  },
  subtitle: {
    fontSize: "12px",
    lineHeight: "32px",
    letterSpacing: "1px",
    color: theme.colors.onPrimaryContainer,
  },
  containerButton: {
    gap: "24px"
  },
  loadingInput: {
    color: theme.colors.primary[40],
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  loadingInputCircle: {
    strokeLinecap: 'round',
  },
  text: {
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.4px",
    color: (props) => (props.emailHasAdded ? theme.colors.inactive : theme.colors.onPrimaryContainer)
  },
  textModal: {
    color: theme.colors.onPrimaryContainer
  },
  containerMenu: {
    display: "flex",
    gap: "8px"
  },
  textTooltip: {
    color: theme.colors.onPrimary
  }
}))

export default useStyles;