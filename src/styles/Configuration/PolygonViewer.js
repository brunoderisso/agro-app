import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   label: {
      color: theme.colors.outline
   },
   value:{
      color: theme.colors.onPrimaryContainer
   },
   margin: {
      margin: "24px"
   },
   arrowIcon: {
      color: theme.colors.onPrimaryContainer
   },
   containerButton: {
      marginLeft: "auto",
      marginRight: "24px"
   },
   iconButton: {
      padding: "6px 0",
      minWidth: "auto",
      '&:hover': {
         backgroundColor: theme.colors.primary[95],
      },
   },
}));

export default useStyles;