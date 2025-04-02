import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid "+theme.colors.inactive,
    borderRadius: "8px",
    paddingBottom: "8px"
  }
}));

export default useStyles;