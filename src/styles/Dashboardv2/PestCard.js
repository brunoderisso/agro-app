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
  numberDay: {
    color: theme.colors.onPrimaryContainer,
    fontSize: "14px"
  },
  letterDay: {
    color: theme.colors.outline,
    fontSize: "12px"
  },
  chartCSS: {
    "& .apexcharts-heatmap-rect": {
      transform: "translate(2px, 2px)", // Adiciona um deslocamento para simular padding
      width: "22px", // Reduz a largura para deixar espaço entre os elementos
      height: "21px", // Reduz a altura para criar margens verticais
    },
  },
  diseaseTitle: {
    color: theme.colors.onPrimaryContainer
  }
}));

export default useStyles;