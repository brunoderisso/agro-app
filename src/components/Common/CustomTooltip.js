import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import theme from '../../styles/Utils/theme';

const CustomTooltip = withStyles(({
    tooltip: {
        backgroundColor: theme.colors.backgroundTooltip,
        color: theme.colors.onPrimary,
        borderRadius: '8px',
        display: 'inline-flex',
        padding: '4px 8px',
        alignItems: 'center',
    },
  }))(Tooltip);

export default CustomTooltip;