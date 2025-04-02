import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   inputs: {
      "& .MuiInputBase-input": {
         fontSize: "12px",
         fontWeight: 400
      },
      '& label.Mui-focused': {
         color: theme.colors.primary[40],
      },
      '& .MuiOutlinedInput-root': {
         '&.Mui-focused fieldset': {
            borderColor: theme.colors.primary[40],
         },
      }
   },
   margin: {
      margin: "24px"
   },
   inputLabel: {
      fontSize: "13px"
   },
   root: {
      backgroundColor: theme.colors.inactive,
      zIndex: 1,
      color: '#fff',
      width: 24,
      height: 24,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
   },
   active: {
      backgroundColor: theme.colors.primary[40],
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
   },
   completed: {
      backgroundColor: theme.colors.primary[40]
   },
   stepper: {
      background: "transparent",
      padding: 0
   },
   textLabel: {
      color: theme.colors.outline,
   },
   button: {
      color: theme.colors.primary[40]
   },
   textEmpty: {
      color: theme.colors.onPrimaryContainer,
      fontSize: '12px',
      marginLeft: '10px'
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