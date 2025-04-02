import { makeStyles } from '@material-ui/core/styles';
import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    backgroundColor: theme.colors.onPrimary,
    borderRadius: theme.spacing(1),
    alignItems: "center",
    maxWidth: "336px"
  },
  buttonsContainer: {
    width: "100%"
  },
  justify: {
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  },
  formHeader: {
    fontWeight: "500",
    fontSize: "14px",
    color: theme.colors.onPrimaryContainer,
    textAlign: "left"
  },
  boxContainer: {
    padding: theme.spacing(5),
    minHeight: "512px"
  },
  createPosition: {
    marginTop: theme.spacing(3)
  },
  missed: {
    color: "#b5b9b5"
  },
  powered: {
    color: theme.colors.primaryContainer,
    fontWeight: 400,
    fontSize: "12px",
    textAlign: "center",
    marginTop: theme.spacing(3)
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
    backgroundColor: theme.colors.primary[40],
    borderRadius: "0.7vw",
    padding: "15px 50px",
    fontSize: "15px"
  },
  container: {
    [theme.breakpoints.down(sizes.xs)]: {
      paddingLeft: "5vw",
      paddingRight: "5vw",
      paddingTop: "13vh",

    },
    [theme.breakpoints.up(sizes.xs)]: {
      paddingLeft: "20vw",
      paddingRight: "20vw",
      paddingTop: "13vh",

    },
    [theme.breakpoints.up(sizes.sm)]: {
      paddingLeft: "27vw",
      paddingRight: "27vw",
      paddingTop: "13vh",

    },
    [theme.breakpoints.up(sizes.md)]: {
      paddingLeft: "30vw",
      paddingRight: "30vw",
      paddingTop: "15vh",

    },
    [theme.breakpoints.up(sizes.lg)]: {
      paddingLeft: "35vw",
      paddingRight: "33vw",
      paddingTop: "26vh",

    },
    [theme.breakpoints.up(sizes.xl)]: {
      paddingLeft: "36vw",
      paddingRight: "33vw",
      paddingTop: "26vh",

    },
    [theme.breakpoints.up(sizes.xxl)]: {
    },
  },
  width: {
    [theme.breakpoints.down(sizes.xs)]: {
      width: "75vw"

    },
    [theme.breakpoints.up(sizes.xs)]: {
      width: "75vw"

    },
    [theme.breakpoints.up(sizes.sm)]: {
      width: "39vw"

    },
    [theme.breakpoints.up(sizes.md)]: {
      width: "28vw"

    },
    [theme.breakpoints.up(sizes.lg)]: {
      width: "28vw"

    },
    [theme.breakpoints.up(sizes.xl)]: {
      width: "28vw"

    },
    [theme.breakpoints.up(sizes.xxl)]: {
    },
  },
  scale: {
    width: "100%",
  },
  margin: {
    [theme.breakpoints.down(sizes.xs)]: {
      paddingBottom: "2vh"

    },
    [theme.breakpoints.up(sizes.xs)]: {
      paddingBottom: "2vh"

    },
    [theme.breakpoints.up(sizes.sm)]: {
      paddingBottom: "2vh"

    },
    [theme.breakpoints.up(sizes.md)]: {
      paddingBottom: "1vh"

    },
    [theme.breakpoints.up(sizes.lg)]: {
      paddingBottom: "0vh"

    },
    [theme.breakpoints.up(sizes.xl)]: {
      paddingBottom: "0vh"

    },
    [theme.breakpoints.up(sizes.xxl)]: {
    },
  }
}));

export default useStyles;