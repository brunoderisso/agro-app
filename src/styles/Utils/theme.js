import { createTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";


const theme = createTheme({
  palette: {
    primary: blue,
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Poppins',
      'sans-serif',
    ].join(','),
  },
  widgetCard: {
    width: "100%",
    maxWidth: "100%",
  },
  widgetTitle: {
    fontSize: 14,
  },
  widgetPos: {
    marginBottom: "3vh",
  },
  iconProp: {
    fontSize: 18,
  },
  colors: {
    predizadark: "#1455BE",
    predizaregular: "#4285F4",
    google: "#1a8bf6",
    microsoft: "#2f2f2f",
    yahoo: "#720d9e",
    primary: {
      20: "#002A78",
      30: "#003EA8",
      40: "#0053DB",
      60: "#618BFF",
      80: "#B4C5FF",
      95: "#EEF0FF"
    },
    primaryThirtyTransparent: "#003EA8E5",
    primaryTransparent: "#003EA899",
    secondary: "#3C6A00",
    outline: "#757680",
    tertiary: "#AA00A4",
    error: {
      40: "#BA1A1A",
      87: "#FFCFC9",
      95: "#FFF0EE",
    },
    inactive: "#C5C6D0",
    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#00174B",
    onPrimaryContainerTransparent: {
      60: "#00174B99",
      90: "#00174BE5"
    },
    primaryContainer: "#DBE1FF",
    surface: "#FBF8FD",
    onSurfaceVariant: "#45464F",
    background: "#FEFBFF",
    onSurface: "#1B1B1F",
    surfaceDim: "#DBD9DD",
    disabledBackground: "#E2E2EC",
    backgroundTooltip: "#00174B80",
    warning: '#FFDAD6',
    onErrorContainer: '#410002',
    neutral: {
      90: '#E4E2E6',
      95: '#F2F0F4'
    },
    onResting: "#2B87F9",
    black: "#000000"
  },
  stepper: {
    iconColor: 'red'
  }
});

export default theme;
