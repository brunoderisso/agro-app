import theme from "../Utils/theme";

const styles = {
   container: {
      width: "444px",
      borderRadius: "8px",
      padding: "40px 24px 24px 24px",
      flexDirection: "column",
      alignItems: "center",
   },
   importButton: {
      color: theme.colors.primary[40]
   },
   nextButton: {
      borderRadius: "4px",
      padding: "8px 16px",
      color: theme.colors.onPrimary,
      backgroundColor: theme.colors.primary[40],
      "&:hover": {
         backgroundColor: theme.colors.primary[30],
      }
   },
   prevButton: {
      borderRadius: "4px",
      padding: "8px 16px",
      color: theme.colors.primary[40],
      borderColor: theme.colors.primary[40],
      "&:hover": {
         backgroundColor: theme.colors.primary[95],
      }
   },
   cleanButton: {
      color: theme.colors.primary[40],
      "&:hover": {
         backgroundColor: theme.colors.primary[95],
      }
   },
   iconSize: {
      transform: "scale(0.7)"
   },
}

export default styles;