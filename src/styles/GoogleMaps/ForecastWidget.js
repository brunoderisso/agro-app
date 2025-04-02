import { makeStyles } from "@material-ui/core";
import WeatherIcons from "../WeatherForecast/WeatherIcons";

const useStyles = makeStyles((theme) => (Object.assign({}, WeatherIcons, {
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
  day: {
    fontSize: "10px",
    fontWeight: 500,
    color: theme.colors.outline,
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  date:{
    fontSize: "8px",
    fontWeight: 400,
    color: theme.colors.outline,
  },
  precipitation:{
    fontSize: "8px",
    fontWeight: 400,
    color: theme.colors.primary[20]
  },
  min: {
    fontSize: "8px",
    fontWeight: 500,
    color: theme.colors.primary[60]
  },
  max: {
    fontSize: "8px",
    fontWeight: 500,
    color: theme.colors.primary[20]
  },
  iconWeather: {
    position: "relative",
    transform: "scale(0.2)",
    bottom: "115px",
    right: "75px"
  }
})));

export default useStyles;