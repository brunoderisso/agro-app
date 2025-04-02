import theme from "../../Utils/theme";

const styles = {
   title: {
      textAlign: "center",
      fontSize: "25px",
      fontWeight: 600,
      paddingBottom: "15px"
   },
   paddingInputs: {
      padding: "12px 0px"
   },
   leftInput: {
      paddingRight: '8px'
   },
   rightInput: {
      paddingLeft: '8px'
   },
   inputs: {
      '& label.Mui-focused': {
         color: theme.colors.primary[40],
      },
      '& .MuiOutlinedInput-root': {
         '&.Mui-focused fieldset': {
            borderColor: theme.colors.primary[40],
         },
      }
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
   link: {
      color: theme.colors.primary[40]
   }
}

export default styles;