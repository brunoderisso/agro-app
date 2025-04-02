import React from 'react';

import PropTypes from 'prop-types';

import { makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import theme from '../../styles/Utils/theme';


const useStyles = makeStyles(() => ({
  select: {
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
}));

function CustomStandardSelect(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.handleValue(event);
  }

  return (
    <TextField
      id="standard-select-crop"
      select
      fullWidth
      className={classes.select}
      size="small"
      label={props.label}
      value={props.value}
      onChange={handleChange}
      SelectProps={{
        IconComponent: ExpandMoreIcon,
      }}
    >
      {props.menuItems && props.menuItems.map((item, index) => {
        return <MenuItem key={index} value={item.value}>
          <Typography variant='body2' style={{ color: theme.colors.onPrimaryContainer }}>
            {item.label}
          </Typography>
        </MenuItem>
      })}
    </TextField>
  );
}

CustomStandardSelect.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  handleValue: PropTypes.func,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
}

export default CustomStandardSelect;