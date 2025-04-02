import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  ListSubheader,
  MenuItem,
  TextField,
} from "@material-ui/core";

import { ReactComponent as PredizaSearchIcon } from "../../../img/AdvancedMapIcons/SearchIcon.svg";
import CustomCheckBox from "../CustomCheckBox";
import styles from "../../../styles/ViewComponents/SearchSelectInput";


const SearchSelectInput = (props) => {
  const classes = styles();
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [itens, setItens] = useState([]);
  const [checkboxes, setCheckboxes] = useState(null);
  const [allChecked, setAllChecked] = useState(false);

  useEffect(() => {
    if (itens.length > 0) {
      let newCheckboxes = {};

      itens.forEach((item) => {
        // Se selectedItens for null, o item será marcado como true. Caso contrário, verifica se está presente em selectedItens.
        newCheckboxes[item.objectid] =
          props.selectedItens === null
            ? true
            : props.selectedItens?.includes(item.objectid)
            ? true
            : false;
      });

      setCheckboxes(newCheckboxes);
    }
  }, [itens, props.selectedItens])

  useEffect(() => {
    if (checkboxes) {
      setAllChecked(Object.values(checkboxes).every((item) => item));
    }
    if (props.onChange && checkboxes) {
      props.onChange(itens.filter((item) => checkboxes[item.objectid]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxes]);

  useEffect(() => {
    setItens(props.itens);
  }, [props]);

  const displayedOptions = useMemo(() => {
    return itens.filter((item) => item.label.includes(searchText));
  }, [searchText, itens]);

  const clearAllCheckboxes = () => {
    if (checkboxes) {
      const newCheckboxes = Object.keys(checkboxes).reduce((acc, objectid) => {
        acc[objectid] = false;
        return acc;
      }, {});

      setCheckboxes(newCheckboxes);
    }
  }

  const handleChangeAll = (event) => {
    setAllChecked(event.target.checked);

    if (event.target.checked) {
      const newCheckboxes = { ...checkboxes };

      Object.keys(newCheckboxes).forEach((objectid) => {
        newCheckboxes[objectid] = true;
      });
      setCheckboxes(newCheckboxes);
    } else {
      clearAllCheckboxes();
    }
  }

  const handleChangeCheckBox = (event) => {
    setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
  }

  return (
    <FormControl className={classes.selectInputForm} size="small">
      <ListSubheader className={classes.selectInputListSubheader}>
        <TextField
          className={classes.textFieldSearch}
          size="small"
          autoFocus
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PredizaSearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Escape") {
              event.stopPropagation();
            }
          }}
        />
      </ListSubheader>
      <Box component="hr" className={classes.hrStyle} />
      <Grid className={classes.rollableContainer}>
        <Box display="flex" flexDirection="column" ml="16px">
          <FormControlLabel
            label={t("common.allText")}
            control={
              <CustomCheckBox checked={allChecked} onChange={handleChangeAll} />
            }
          />
        </Box>
        {checkboxes && (
          <Box display="flex" flexDirection="column">
            {displayedOptions &&
              displayedOptions.map((option, index) => (
                <MenuItem key={index} value={option.objectid}>
                  <FormControlLabel
                    label={
                      option.alternativeLabel
                        ? `${option.label} - ${option.alternativeLabel}`
                        : option.label
                    }
                    control={
                      <CustomCheckBox
                        className={classes.containerFilterCheckBox}
                        checked={checkboxes[option.objectid]}
                        onChange={(event) => handleChangeCheckBox(event)}
                        name={option.objectid}
                      />
                    }
                  />
                </MenuItem>
              ))}
          </Box>
        )}
      </Grid>
    </FormControl>
  );
}

export default SearchSelectInput;
