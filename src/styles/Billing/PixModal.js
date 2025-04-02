 
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    backgroundColor: theme.colors.onPrimary,
    borderRadius: "8px",
    width: "444px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  container: {
    padding: "40px 40px 24px 40px"
  },
  textColor: {
    color: theme.colors.onPrimaryContainer
  },
  feedback: {
    color: theme.colors.secondary
  },
}));

export default useStyles;
