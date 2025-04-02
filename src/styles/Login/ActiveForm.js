import { makeStyles } from '@material-ui/core/styles';
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    borderRadius: "3vw",
    padding: "2vw",
    border: "0.5vw solid" + theme.colors.predizadark,
    alignItems: "center",
  },
  activeInputs: {
    maxHeight: "45px",
  },
  placeHolder: {
    fontSize: "12px"
  },
  buttonsContainer: {
    width: "55%",
    [theme.breakpoints.down(sizes.xlg)]: {
      width: "66%"
    }
  },
  formHeader: {
    fontWeight: "500",
    fontSize: "18px",
    marginBottom: "25px"
  },
  boxContainer: {
    padding: "2vw"
  },
  createPosition: {
    position: "relative",
    bottom: "0px",
    padding: "0px 10px",
    fontWeight: 600
  },
  missed: {
    color: "#b5b9b5"
  },
  backButton: {
    [theme.breakpoints.up(sizes.xs)]: {
      margin: "1px",
      position: "relative",
      left: "-50px",
      top: "90px",
    }
  },
  button: {
    backgroundColor: theme.colors.predizaregular,
    borderRadius: "0.7vw",
    padding: "15px 50px",
    fontSize: "15px"
  },
  buttonForgot: {
    backgroundColor: theme.colors.predizaregular,
    borderRadius: "0.7vw",
    padding: "10px 50px",
    fontSize: "15px"
  },
  forgotButton: {
    padding: "10px",
    backgroundColor: theme.colors.predizaregular,
    borderRadius: "0.7vw",
    color: "white",
    "&:hover": {
      backgroundColor: theme.colors.predizadark,
    }
  },
  margin: {
    marginBottom: "10px"
  }

}))

export default useStyles;