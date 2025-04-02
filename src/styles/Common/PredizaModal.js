import theme from "../Utils/theme";

const styles = {
   paper: {
      position: 'absolute',
      backgroundColor: theme.colors.onPrimary,
      borderRadius: "8px",
      boxShadow: theme.shadows[6],
   },
   container: {
      padding: "24px"
   },
   title: {
      fontWeight: 600,
      color: theme.colors.onPrimaryContainer
   },
   content: {
      color: theme.colors.onPrimaryContainer
   },
   content2: {
      color: theme.colors.outline
   },
   icon: {
      color: theme.colors.error
   },
   actionButton: {
      color: theme.colors.primary[40],
      "&:hover": {
         backgroundColor: theme.colors.primary[95],
      }
   },
   tabs: {
      '&> span': {
         backgroundColor: '#635ee7',
      },
      "&.PrivateTabIndicator-root": {
         backgroundColor: '#635ee7',
      }
   },
   appBar: {
      backgroundColor: theme.colors.onPrimary,
      color: theme.colors.primary[40]
   },
   root: {
      width: "100%"
   },
   dropArea: {
      border: `2px dashed ${theme.colors.inactive}`,
      padding: theme.spacing(2),
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
         borderColor: theme.colors.primary[40],
         backgroundColor: theme.colors.primary[95],
      },
   },
   fileLoaded: {
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.background
   },
   uploadButton: {
      backgroundColor: theme.colors.primary[40],
      color: theme.colors.onPrimary,
      borderRadius: "50%",
      width: "38px",
      height: "38px",
      margin: "8px",
      textAlign: "center",
      paddingTop: "6px",
      "&:hover": {
         backgroundColor: theme.colors.primary[30],
      },
      boxShadow: theme.shadows[2],
   },
   wrapperDefaultBt: {
      textAlign: 'end',
      marginLeft: 'auto'
   }

}

export default styles;