import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

import StyledLinearProgress from '../../styles/Common/CustomLinearProgress';


function CustomLinearProgress(props) {
    const [progress, setProgress] = useState(props.value);

    useEffect(() => {
        if (props.value) {
            setProgress(normalise(props.value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value]);

    // minValue = Minimum expected value
    // maxValue = Maximium expected value
    // Function to normalise the values (MIN / MAX could be integrated)
    const normalise = value => (value - props.minValue) * 100 / (props.maxValue - props.minValue);

    return (
        <StyledLinearProgress value={progress}/>
    );
}

CustomLinearProgress.propTypes = {
    minValue: PropTypes.number.isRequired,
    maxValue: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

export default CustomLinearProgress;