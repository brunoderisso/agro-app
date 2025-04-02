import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({
  cardTitle: {
    color: theme.colors.onPrimaryContainer
  },
  externalButton: {
    color: theme.colors.primary[40],
    marginTop: "12px"
  },
  temperature: {
    color: theme.colors.primary[30],
    fontSize: "40px",
    fontWeight: 600
  },
  temperatureMin: {
    color: theme.colors.primary[60],
  },
  temperatureMax: {
    color: theme.colors.primary[20],
  },
  iconWeather: {
    position: "relative",
    top: "-65px",
    left: "-85px",
    transform: "scale(0.3)"
  },
  rainText: {
    color: theme.colors.outline
  }
}));

export default useStyles;