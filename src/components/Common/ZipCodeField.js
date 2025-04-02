import React, { memo, useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import { makeStyles, TextField } from '@material-ui/core';

import GoogleMapStore from '../../stores/GoogleMapsStore';
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

const ZipCodeField = memo(({ value, handleChange, responseBlur, flagError, textError, country }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [mask, setMask] = useState(ConstantsUtils.CountriesList[0].maskZipCode);

  useEffect(() => {
    if (country) {
      const definedMask = ConstantsUtils.CountriesList.find(option => option.value === country);

      if (definedMask) {
        setMask(definedMask.maskZipCode);
      }
    }
  }, [country])

  const onBlurAddress = (_) => {
    if (value.length > 0) {
      GoogleMapStore.emit("addres_find", { address: value, callback: responseBlur });
    }
  }

  const handleChangeFunc = (event) => {
    if (typeof handleChange === "function") {
      handleChange(event);
    }
  }

  return (
    <InputMask mask={mask}
      name="zipcode"
      value={value}
      size="small"
      onChange={handleChangeFunc}
      onBlur={onBlurAddress}
      error={flagError}
      helperText={textError}
    >
      {(inputProps) =>
        <TextField
          label={`* ${t("common.zipCode")}`}
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

ZipCodeField.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  responseBlur: PropTypes.func,
  flagError: PropTypes.bool,
  textError: PropTypes.string,
  country: PropTypes.string,
}

export default ZipCodeField;