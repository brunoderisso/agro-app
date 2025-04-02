import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";
const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth, // Largura da drawer quando expandida ou recolhida
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerPaper: {
    width: drawerWidth,
    borderRadius: "4px 0px 0px 4px",
    padding: theme.spacing(3),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "hidden"
  },
  textColor: {
    color: theme.colors.onPrimaryContainer,
  },
  tabs: {
    color: theme.colors.primary[40],
    '& .MuiTab-textColorPrimary': {
      color: theme.colors.primary[40], // cor do texto das Tabs
    },
    '& .MuiTabs-indicator': {
      backgroundColor: theme.colors.primary[40], // cor do indicador
    },
  },
  tab: {
    '&:hover': {
      color: theme.colors.primary[30],
      opacity: 1,
    },
    '&$selected': {
      color: theme.colors.primary[40],
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: theme.colors.primary[40],
    },
  },
  textFieldRoot: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "gray", // Cor padrão da borda
      },
      "&:hover fieldset": {
        borderColor: "black", // Cor da borda no hover
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.colors.onPrimaryContainer, // Cor da borda quando o campo está em foco
      },
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.colors.onPrimaryContainer,  // Cor do sublinhado ao focar
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "gray", // Cor do sublinhado normal
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "black", // Cor do sublinhado ao passar o mouse
    },
  },
  iconFocused: {
    color: theme.colors.onPrimaryContainer,  // Cor do ícone quando o campo está em foco
  },
  selectRoot: {
    "&:focus": {
      backgroundColor: "transparent", // remover o fundo cinza no foco
    },
  },
  settingsContainer: {
    padding: theme.spacing(2)
  },
  button: {
    color: theme.colors.primary[40]
  },
  visualizationInfo: {
    color: theme.colors.outline
  },
  serviceName: {
    color: theme.colors.onPrimaryContainer
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