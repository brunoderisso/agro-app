import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.colors.primary[95]
  },
  text: {
    fontSize: "14px",
    lineHeight: "20.02px",
    letterSpacing: "0.15px",
    color: theme.colors.onPrimaryContainer
  },
  textAvatar: {
    color: theme.colors.onPrimaryContainer,
    fontSize: "15px"
  },
  containerAvatar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  containerText: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  }
}));

export default useStyles;