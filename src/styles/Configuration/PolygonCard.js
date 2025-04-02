import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  polygonCard: {
    padding: '16px',
    '&:hover': {
      background: theme.colors.neutral[95],

      '& $buttonsContainer': {
        visibility: 'visible',
      },
    },
  },
  textColor: {
    color: theme.colors.onPrimaryContainer
  },
  textFields: {
    '& .MuiInputBase-root': {
      height: 20,
      marginTop: "8px" // Ajuste a altura conforme necessário
    },
    '& .MuiInputLabel-marginDense': {
      transform: "translate(0, 10px) scale(1)"
    },
    '& label + .MuiInput-formControl': {
      marginTop: "8px"
    },
    '& .MuiSelect-icon': {
      fontSize: "18px",
      color: theme.colors.onPrimaryContainer
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.colors.primary[40],
    },
    '& .MuiInput-input': {
      color: theme.colors.onPrimaryContainer,
      fontSize: "13px",
      lineHeight: '20px',
      letterSpacing: 0.4,
    },
    '& label.MuiInputLabel-root': {
      fontSize: "13px",
      lineHeight: '20px',
      letterSpacing: 0.4,
      top: "-3px"
    }
  },
  textCaption: {
    color: theme.colors.outline
  },
  iconButton: {
    padding: "6px 0",
    minWidth: "auto",
    '&:hover': {
      backgroundColor: theme.colors.primary[95],
    },
  },
  iconColor: {
    color: theme.colors.onPrimaryContainer
  },
  buttonsContainer: {
    visibility: 'hidden', // Oculta os botões inicialmente
    gap: '4px',
    display: 'flex'
  },
}));

export default useStyles;