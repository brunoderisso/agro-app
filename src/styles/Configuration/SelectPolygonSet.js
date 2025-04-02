import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapperCardPol: {
    display: 'flex'
  },
  wrapperPolygon: {
    paddingRight: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  radioPolygon: {
    '&.MuiIconButton-root': {
      width: '1em',
      height: '1em',
      padding: '0',
      margin: '3px'
    }
  },
  cardTitleItem: {
    color: theme.colors.onPrimaryContainer,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  wrapperCanvas: {
    margin: '8px 0'
  },
  contentText: {
    color: theme.colors.onPrimaryContainer
  },
  containerPolygon: {
    marginBottom: "40px"
  }
}));

export default useStyles;