import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
  container:{
    padding: "8px 8px 8px 16px"
  },
  card: {
    width: "96px",
    height: "96px",
    borderRadius: "8px",
    padding: "8px",
    backgroundColor: theme.colors.background,
    opacity: ".7"
  },
  title: {
    fontSize: "10px",
    color: theme.colors.outline,
    fontWeight: 500
  },
  measure: {
    color: theme.colors.onPrimaryContainer,
    fontSize: "12px",
    fontWeight: 400
  },
  value: {
    fontSize: "20px",
    fontWeight: 500,
    color: theme.colors.primary[30],
    textAlign: "center"
  },
  legend: {
    fontSize: "8px",
    fontWeight: 400,
    color: theme.colors.outline,
    textAlign: "center"
  }
}));

export default useStyles;