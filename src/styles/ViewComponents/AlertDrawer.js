import { makeStyles } from "@material-ui/core";

const drawerWidth = "360px";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1202
  },
  drawerPaper: {
    width: drawerWidth,
    padding: "24px 14px 24px 24px",
    zIndex: 1202,
    borderRadius: "10px 0px 0px 10px",
    backgroundColor: theme.colors.surface
  },
  textColor: {
    color: theme.colors.onPrimaryContainer
  },
  title: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: 600
  },
  menuButton: {
    color: theme.colors.onPrimaryContainer
  },
  removeButton: {
    color: theme.colors.error[40]
  },
  buttonColor: {
    color: theme.colors.primary[40],
    borderColor: theme.colors.primary[40]
  },
  status: {
    width: "16px",
    height: "16px",
    borderRadius: "2px"
  },

  switchBase: {
    color: theme.colors.outline, // Cor quando o switch está "unchecked"
    '&$checked': {
      color: theme.colors.primary[40], // Cor quando o switch está "checked"
    },
    '&$checked + $track': {
      backgroundColor: theme.colors.primary[40], // Cor da trilha quando "checked"
    },
    '& + $track': {
      backgroundColor: theme.palette.grey[400], // Cor da trilha quando "unchecked"
    },
  },
  checked: {},
  track: {},
  label: {
    color: theme.colors.outline,
    fontSize: "12px"
  }



}));

export default useStyles;