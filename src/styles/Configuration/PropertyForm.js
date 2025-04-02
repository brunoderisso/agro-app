import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   container: {
      padding: theme.spacing(2)
   },
   avatar: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      backgroundColor: theme.colors.primary[95]
   },
   iconButton: {
      position: 'absolute',
      bottom: "32px",
      right: "-4px",
      backgroundColor: theme.palette.background.paper,
      borderRadius: '50%',
   },
   badge: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
   },
   avatarContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
   },
   avatarLabel: {
      marginLeft: theme.spacing(2),
      fontSize: '1.2rem',
   },
   textFieldLabel: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'block',
      backgroundColor: theme.colors.onPrimary
   },
   iconColor: {
      color: theme.colors.primary[40]
   },
   avatarText: {
      color: theme.colors.onPrimaryContainer,
   },
   textColor: {
      color: theme.colors.onPrimaryContainer,
   },
   outlineText: {
      color: theme.colors.outline
   },
   inputs: {
      "& .MuiInputBase-input": {
         fontSize: "12px",
         fontWeight: 400,
         color: theme.colors.onPrimaryContainer
      },
      '& label.Mui-focused': {
         color: theme.colors.primary[40],
      },
      '& .MuiOutlinedInput-root': {
         '&.Mui-focused fieldset': {
            borderColor: theme.colors.primary[40],
         },
      },
      '& .MuiSelect-root': {
         height: '14px'
      },
      '& .MuiInputBase-root': {
         backgroundColor: theme.colors.onPrimary,
      },
   },
   iconConfig: {
      width: "17px",
      height: "17px"
   }
}));

export default useStyles;