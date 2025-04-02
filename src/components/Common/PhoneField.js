import React, { memo, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import { makeStyles, TextField } from '@material-ui/core';

import { ConstantsUtils } from '../../utils/constantsUtils';


const useStyles = makeStyles((theme) => ({
  inputs: {
    "& .MuiInputBase-input": {
      fontSize: "12px",
      fontWeight: 400,
      color: theme.colors.onPrimaryContainer
    },
    '& label.Mui-focused': {
      color: theme.colors.primary[40],
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.colors.primary[40],
      },
    },
    '& .MuiSelect-root': {
      height: '14px'
    },
    '& .MuiInputBase-root': {
      backgroundColor: theme.colors.onPrimary,
    },
  },
  textFieldLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    backgroundColor: theme.colors.onPrimary
  },
}));

const PhoneField = memo(({ name, value, handleChange, flagError, textError }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [mask, setMask] = useState(ConstantsUtils.CountriesList[0].maskPhone);

  useEffect(() => {
    if (value?.length > 0) {
      let phoneValue = value;

      if (value.length > 4) {
        if (["+54", "+55"].includes(value.substring(0, 3))) {
          phoneValue = value.substring(0, 3);
        } else if (["+591", "+595"].includes(value.substring(0, 4))) {
          phoneValue = value.substring(0, 4);
        }
      }

      const country = ConstantsUtils.CountriesList.find(option => option.ddi === phoneValue);

      if (country) {
        setMask(country.maskPhone);
      }
    }
  }, [value])

  const handleChangeFunc = (event) => {
    if (typeof handleChange === "function") {
      handleChange(event);
    }
  }

  return (
    <InputMask mask={mask}
      name={name}
      size="small"
      value={value}
      onChange={handleChangeFunc}
      error={flagError}
      helperText={textError}
    >
      {(inputProps) =>
        <TextField
          label={`* ${t("common.phone")}`}
          className={classes.inputs}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
            className: classes.textFieldLabel
          }}
          {...inputProps}
        />
      }
    </InputMask>
  );
})

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  flagError: PropTypes.bool,
  textError: PropTypes.string,
}

export default PhoneField;