import { createTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";


const theme = createTheme({
  palette: {
    primary: green,
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
    google: "#FFFFFF",
    microsoft: "#2f2f2f",
    yahoo: "#7E1FFF",
    predizadark: "#003EA8",
    primary: {
      20: "#004D26",
      30: "#007338",
      40: "#00994A",
      60: "#4AC48C",
      80: "#99E0C0",
      95: "#E6FAF0",
      99: "#FEFBFF"
    },
    primaryThirtyTransparent: "#007338E5",
    primaryTransparent: "#00733899",
    secondary: "#4E8C00",
    outline: "#6B7863",
    tertiary: "#5EAB60",
    error: {
      40: "#BA1A1A",
      87: "#FFDAD4",
      95: "#FFEFEF"
    },
    inactive: "#AFC8B0",
    onPrimary: "#FFFFFF",
    onPrimaryContainer: "#003311",
    onPrimaryContainerTransparent: {
      60: "#00331199",
      90: "#003311E5"
    },
    primaryContainer: "#CCF2D6",
    surface: "#F6FFF9",
    onSurfaceVariant: "#435145",
    background: "#F0FDF4",
    onSurface: "#203E28",
    surfaceDim: "#D6E8D8",
    disabledBackground: "#E1F0E6",
    backgroundTooltip: "#00331180",
    warning: "#FFEDDA",
    onErrorContainer: "#410002",
    neutral: {
      90: "#DDE8E1",
      95: "#EFF5F0"
    },
    onResting: "#60AF79",
    black: "#000000"
  },
  stepper: {
    iconColor: 'red'
  }
});

export default theme;
