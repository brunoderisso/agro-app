import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: theme.colors.primary[95]
  },
  avatarText: {
    fontSize: "20px",
    color: theme.colors.onPrimaryContainer,
  },
  container: {
    borderBottom: "solid 1px" + theme.colors.inactive,
    padding: "6px 24px 6px 8px",
    gap: "16px"
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
  primaryColorText: {
    color: theme.colors.onPrimaryContainer
  },
  inactiveColorText: {
    color: theme.colors.inactive
  },
  outlineColorText: {
    color: theme.colors.outline
  },
  text: {
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.4px"
  },
  smallerText: {
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "0.4px"
  },
  iconButton: {
    padding: "6px 0",
    minWidth: "auto",
    '&:hover': {
      backgroundColor: theme.colors.primary[95],
    }
  },
  variableBox: {
    flex: 1
  },
  selectColumn: {
    width: "100px"
  }
}))

export default useStyles;