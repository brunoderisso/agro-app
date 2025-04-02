import React from 'react';

import PropTypes from 'prop-types';

import { Grid, InputAdornment, TextField, Typography, makeStyles } from '@material-ui/core';

import { ReactComponent as SearchIcon } from '../../img/AdvancedMapIcons/SearchIcon.svg';


const useStyles = makeStyles((theme) => ({
    searchLabel: {
        '& label.Mui-focused': {
            marginLeft: '-12px'
        },
        '& label.MuiFormLabel-root.Mui-focused': {
            color: theme.colors.primary[40]
        },
        '& .MuiInput-underline:after': {
            borderBottom: '2px solid ' + theme.colors.primary[40]
        },
        '& .MuiInputBase-inputMarginDense': {
            paddingTop: "8px",
        },
    },
    iconSearch: {
        marginRight: '10px',
    },
    inputText: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.4px',
        color: theme.colors.onPrimaryContainer
    },
}));

function CustomInputText(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        if (typeof props.handleChange === 'function') {
            props.handleChange(event.target.value);
        }
    }

    const handleClick = () => {
        if (typeof props.handleClick === 'function') {
            props.handleClick();
        }
    }

    return (
        <TextField
            size="small"
            label={props.label &&
                <Grid style={{ marginLeft: "16px" }}>
                    <Typography variant='caption'>{props.label}</Typography>
                </Grid>
            }
            classes={{ root: classes.searchLabel }}
            onChange={handleChange}
            InputProps={{
                endAdornment: (
                    props.hasIcon &&
                    <InputAdornment
                        position="end"
                        onClick={handleClick}
                    >
                        <SearchIcon className={classes.iconSearch} />
                    </InputAdornment>

                ),
                className: classes.inputText
            }}
        />
    );
}

CustomInputText.propTypes = {
    label: PropTypes.string,
    hasIcon: PropTypes.bool,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
}

export default CustomInputText;