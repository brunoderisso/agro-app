import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "16px",
  },
  title: {
    color: theme.colors.onPrimaryContainer,
    fontSize: "12px",
    lineHeight: "32px",
    letterSpacing: "1px"
  },
  outlineText: {
    fontSize: "12px",
    color: theme.colors.outline,
  },
  containerSwitch: {
    marginTop: "16px"
  },
  switch: {
    marginRight: "4px",
    marginLeft: 0,
    "& .MuiFormControlLabel-label": {
      fontSize: "12px",
      lineHeight: "20px",
      letterSpacing: "0.4px",
      color: theme.colors.onPrimaryContainer,
    }
  },
  containerNotification: {
    display: "flex",
    alignItems: "center"
  },
  tooltipText: {
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.4px",
    color: theme.colors.onPrimary,
  }
}))

export default useStyles;