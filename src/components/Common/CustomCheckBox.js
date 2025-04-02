import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';


const CustomCheckBox = withStyles({
    root: {
        color: (props) => props.color,
        '&$checked': {
            color: (props) => props.color,
        },
    },
    checked: {},
})((props) => <Checkbox color='default' {...props} />);

export default CustomCheckBox;