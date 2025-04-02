import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({

  itemLabel: {
    borderRadius: "24px",
    backgroundColor: theme.colors.outline,
    color: "white",
    padding: "4px 16px"
  },
  textLabel: {
    fontWeight: 500,
    fontSize: "14px"
  },
  button: {
    color: theme.colors.primary[40]
  }

}));

export default useStyles;