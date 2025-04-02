import React from 'react';
import Scrollbars from 'react-custom-scrollbars';

import PropTypes from 'prop-types';

import { Grid } from '@material-ui/core';

import useStyles from '../../styles/Common/PredizaScrollBar';
import theme from '../../styles/Utils/theme';


function PredizaScrollBar(props) {
    const classes = useStyles();
    const height = props.customHeight || `${props.height}${props.unity}`;

    const thumbVertical = () => {
        return <Grid id={"thumbVertical"} className={classes.thumbVertical}></Grid>;
    };

    const thumbHorizontal = () => {
        return <Grid id={"thumbHorizontal"} className={classes.thumbHorizontal}></Grid>;
    };

    const trackVertical = ({ style, ...props }) => {
        const trackStyle = {
            backgroundColor: theme.colors.inactive,
            borderRadius: '8px',
            right: '0px',
            bottom: '0px',
            top: '0px',
            width: '4px'
        };

        return <Grid style={{ ...style, ...trackStyle }} {...props} />;
    }

    const trackHorizontal = ({ style, ...props }) => {
        const trackStyle = {
            backgroundColor: theme.colors.inactive,
            borderRadius: '8px',
            left: '0px',
            bottom: '0px',
            height: "4px",
            width: "100%"
        };
        return <div style={{ ...style, ...trackStyle }} {...props} />;
    };

    return (
        <Scrollbars
            style={{ width: "100%", height: height }}
            renderThumbVertical={thumbVertical}
            renderTrackVertical={trackVertical}
            renderThumbHorizontal={thumbHorizontal}
            renderTrackHorizontal={trackHorizontal}
            thumbMinSize={30}
            className={props.className}
            universal
            hideTracksWhenNotNeeded
        >
            <Grid className={classes.wrapperContent}>
                {props.children}
            </Grid>
        </Scrollbars>

    );
}

PredizaScrollBar.propTypes = {
    height: PropTypes.number,
    unity: PropTypes.string,
    customHeight: PropTypes.string,
    className: PropTypes.string
};

export default PredizaScrollBar;