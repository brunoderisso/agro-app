import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  containerBottom: {
    marginTop: "16px"
  },
  commonText: {
    fontSize: "12px",
    lineHeight: "20px",
    letterSpacing: "0.4px",
    color: theme.colors.outline
  },
  boldText: {
    fontWeight: 700
  },
}))

export default useStyles;