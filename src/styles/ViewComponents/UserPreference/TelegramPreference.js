import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "24px"
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
  checkedText: {
    fontSize: "12px",
    color: theme.colors.secondary,
  },
  containerTelegram: {
    marginTop: "16px"
  },
  iconProps: (props) => ({
    width: "16px",
    height: "16px",
    fill: props.linked ? theme.colors.secondary : theme.colors.outline,
    marginRight: "8px"
  }),
  containerStatus: {
    display: "flex",
    alignItems: "center",
    paddingLeft: "16px",
    paddingBottom: "8px"
  }
}))

export default useStyles;