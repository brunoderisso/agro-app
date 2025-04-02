import { makeStyles } from "@material-ui/core";
//import sizes from "../Utils/DashboardTheme";
const drawerWidth = "320px";

const useStyles = makeStyles((theme) => ({
   container: {
      height: "100%",
      padding: "24px 4px 0 0"
   },
   tutorial: {
      marginTop: "50px",
      color: theme.colors.onPrimary,
      background: theme.colors.onPrimaryContainer,
      padding: "10px",
      opacity: 0.6,
      borderRadius: "5px"
   },
   polygonList: {
      height: "85%"
   },
   drawer: {
      width: drawerWidth,
      flexShrink: 0,

   },
   drawerPaper: {
      width: drawerWidth,
      paddingTop: "64px",
      overflow: "hidden",
      backgroundColor: theme.colors.onPrimary
   },
   outline: {
      color: theme.colors.outline
   },
   scroll: {
      '& > div': {
         paddingRight: "5px"
      }
   },
   polygonScroll: {
      '& div': {
         paddingRight: "10px"
      }
   },
   buttonColor: {
      color: theme.colors.primary[40],
      marginTop: "16px",
      '&:hover': {
         backgroundColor: theme.colors.primary[95],
      },
   },
   buttonColorMarginZero: {
      color: theme.colors.primary[40],
      '&.MuiButton-text': {
         padding: '2px 8px'
      },
      '&:hover': {
         backgroundColor: theme.colors.primary[95],
      },
   },
   tabsHeader: {
      background: theme.colors.onPrimary,
      color: theme.colors.primary[40],
   },
   itemPadding: {
      paddingBottom: "16px",
      paddingLeft: "24px"
   },
   text: {
      color: theme.colors.onPrimaryContainer
   },
   buttonContainer: {
      height: "100%",
      gap: "8px"
   },
   buttonContainer2: {
      gap: "24px"
   },
   expandBtn: {
      '& .MuiIconButton-root': {
         padding: '8px'
      }
   },
   containerProperty: {
      height: "100%",
      padding: "24px 24px 0 24px"
   },
   iconEdit: {
      fontSize: "18px",
      color: theme.colors.primary[40]
   }
}));

export default useStyles;