import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";

const useStyles = makeStyles((theme) => ({

  textColor: {
    color: theme.colors.onPrimaryContainer,
  },
  alignInputs: {
    position: "relative",
    top: "3px"
  },
  noSpinner: {
    // Para Chrome, Safari, Edge, Opera
    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    // Para Firefox
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
  },
  timeLabel: {
    color: theme.colors.outline,
    fontSize: "11px"
  },
  title: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: 600
  },
  confirmButton: {
    color: theme.colors.primary[40]
  },
  accordion: {
    backgroundColor: "transparent"
  },
  accordionLabel: {
    color: theme.colors.primary[30],
  },
  textCaption: {
    color: theme.colors.outline
  },
  switchBase: {
    color: theme.colors.outline, // Cor quando o switch está "unchecked"
    '&$checked': {
      color: theme.colors.primary[40], // Cor quando o switch está "checked"
    },
    '&$checked + $track': {
      backgroundColor: theme.colors.primary[40], // Cor da trilha quando "checked"
    },
    '& + $track': {
      backgroundColor: theme.palette.grey[400], // Cor da trilha quando "unchecked"
    },
  },
  checked: {},
  track: {},

}));

export default useStyles;