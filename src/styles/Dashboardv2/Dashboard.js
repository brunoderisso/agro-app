import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
  cardTitle:{
    color: theme.colors.onPrimaryContainer
  },
  externalButton: {
    color: theme.colors.primary[40],
    marginTop: "12px"
  },
  measureName: {
    color: theme.colors.primary[40]
  },
  measureCard:{
    width: "150px"
  },
  measureValue: {
    fontSize: "40px",
    fontWeight: 500
  },
  measureUnity: {
    fontSize: "12px",
    fontWeight: 400,
    marginTop: "-8px"
  }
}));

export default useStyles;