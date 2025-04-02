import React, { cloneElement, memo, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import { InputAdornment, Menu, MenuItem, TextField, makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  inputs: {
    "& .MuiInputBase-input": {
      fontSize: "12px",
      fontWeight: 400,
      color: theme.colors.onPrimaryContainer
    },
    "& label.Mui-focused": {
      color: theme.colors.primary[40],
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: theme.colors.primary[40],
      },
    },
    "& .MuiSelect-root": {
      height: "14px"
    },
    "& .MuiInputBase-root": {
      height: "40px",
      backgroundColor: theme.colors.onPrimary,
    },
  },
  iconSearch: {
    width: "18px",
    height: "18px",
    fill: theme.colors.onPrimaryContainer
  },
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: theme.colors.primary[99],
    }
  }
}));

const CustomOutlinedText = memo(({
  name, value, label, handleChange, hasIcon, placeholder, iconElement, iconPosition,
  menuList, handleClickMenu, menuItemComponent
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const inputRef = useRef(null);

  const handleChangeFunc = (event) => {
    const value = event.target.value;

    if (typeof handleChange === 'function') {
      handleChange(value);
    }

    if (value) {
      const rect = event.currentTarget.getBoundingClientRect();

      setMenuPosition({
        top: rect.bottom + window.scrollY + 3, // Posiciona abaixo do textField
        left: rect.left - 24
      });
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  }

  const handleMenuOpen = () => {
    // Mantém o focus no CustomOutlinedText
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClose = () => {
    setAnchorEl(null);

    // Mantém o foco no CustomOutlinedText ao fechar o menu
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleClickFunc = (item) => {
    if (typeof handleClickMenu === "function") {
      handleClickMenu(item);
    }

    handleClose();
  }

  return (
    <>
      <TextField
        name={name}
        size="small"
        value={value}
        onChange={handleChangeFunc}
        placeholder={placeholder}
        label={label}
        className={classes.inputs}
        variant="outlined"
        fullWidth
        inputRef={inputRef}
        InputLabelProps={{
          shrink: true,
          className: classes.textFieldLabel,
        }}
        InputProps={{
          endAdornment: (
            hasIcon && iconElement && iconPosition === "end" &&
            <InputAdornment
              position={"end"}
            >
              {/* cloneElement permite adicionar uma classe desse componente no componente props */}
              {cloneElement(iconElement, { className: classes.iconSearch })}
            </InputAdornment>
          ),
          startAdornment: (
            hasIcon && iconElement && iconPosition === "start" &&
            <InputAdornment
              position={"start"}
            >
              {/* cloneElement permite adicionar uma classe desse componente no componente props */}
              {cloneElement(iconElement, { className: classes.iconSearch })}
            </InputAdornment>
          ),
        }}
      />
      {menuList?.length > 0 &&
        <Menu
          anchorReference="anchorPosition"
          anchorPosition={menuPosition}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className={classes.menu}
          elevation={4}
          keepMounted
          disableAutoFocusItem
          disableEnforceFocus
          TransitionProps={{ onEnter: handleMenuOpen }}
          PaperProps={{
            style: {
              maxHeight: 500,
              overflowY: "auto",
            },
          }}
        >
          {menuList.map((item, index) => (
            <MenuItem key={index} onClick={() => handleClickFunc(item)} disabled={item.disabled}>
              {menuItemComponent(item)}
            </MenuItem>
          ))}
        </Menu>
      }
    </>
  );
})

CustomOutlinedText.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasIcon: PropTypes.bool,
  iconElement: PropTypes.element,
  iconPosition: PropTypes.string,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  menuList: PropTypes.array,
  handleClickMenu: PropTypes.func,
  menuItemComponent: PropTypes.func
}

export default CustomOutlinedText;