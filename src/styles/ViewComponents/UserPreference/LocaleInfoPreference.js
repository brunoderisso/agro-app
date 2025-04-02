import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spacing: {
    marginBottom: "22px"
  },
  label: {
    color: theme.colors.outline
  },
  text: {
    color: theme.colors.onPrimaryContainer
  }
}))

export default useStyles;