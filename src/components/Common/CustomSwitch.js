import { withStyles } from '@material-ui/core/styles';

import theme from '../../styles/Utils/theme';
import { Switch } from '@material-ui/core';

const CustomSwitch = withStyles({
    switchBase: {
        color: theme.colors.background,
        '&$checked': {
            color: theme.colors.primary[40],
        },
        '&$checked + $track': {
            backgroundColor: theme.colors.primary[40],
        },
    },
    checked: {},
    track: {},
})(Switch);

export default CustomSwitch;