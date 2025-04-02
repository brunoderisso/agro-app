import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    backgroundColor: theme.colors.primary[95]
  },
  text: {
    color: theme.colors.onPrimaryContainer,
  },
  textOutline: {
    color: theme.colors.outline,
  },
  labelMain: {
    backgroundColor: theme.colors.onPrimary,
    borderRadius: "4px",
    padding: "11px 16px 8px 16px"
  },
  labelTitle: {
    backgroundColor: theme.colors.onPrimary,
    borderRadius: "4px",
    padding: "0 4px",
    width: "fit-content",
    marginLeft: "12px",
    marginBottom: "-10px"
  },
  containerLabels: {
    display: "flex",
    gap: "6px",
    flexDirection: "column"
  },
  customXs6: {
    maxWidth: "calc(50% - 4px)"
  }
}));

export default useStyles;