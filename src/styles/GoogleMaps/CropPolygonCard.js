import { makeStyles } from '@material-ui/core';

import theme from '../Utils/theme';

const useStyles = makeStyles(() => ({
  containerCard: {
    width: '200px',
    transform: `translate(-50%, -110%)`,
    zIndex: 9999,
    position: 'absolute',
    cursor: 'pointer',
    pointerEvents: 'auto' /* Garantir que a div capture cliques */
  },
  container: {
    padding: '16px 16px 0 16px',
  },
  outlineText: {
    color: theme.colors.outline
  },
  iconBt: {
    color: theme.colors.onPrimaryContainer,
    fontSize: '18px'
  },
  defaultText: {
    color: theme.colors.onPrimaryContainer
  },
  containerEditMode: {
    padding: "8px 0"
  },
  headerEditMode: {
    padding: "0 16px"
  }
}));

export default useStyles;