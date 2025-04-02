import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';


const CustomRadio = withStyles({
    root: {
        color: (props) => props.color,
        '&$checked': {
            color: (props) => props.color,
        },
    },
    checked: {},
})((props) => <Radio color='default' {...props} />);

export default CustomRadio;