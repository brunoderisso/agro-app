import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from 'prop-types';

import { Button, Collapse, Grid, Typography } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/PredizaSelector";
import SearchSelectInput from "./SearchSelectInput";
import useKeyPress from "../../../Hook/useKeyPress";


function PredizaSelector(props) {
  const classes = styles();
  const { t } = useTranslation();

  const [itens, setItens] = useState([]);
  const [selectedItens, setSelectedItens] = useState([]);
  const [showSelect, setShowSelect] = useState(false);

  const escape = useKeyPress('Escape')

  useEffect(() => {
    setShowSelect(true);
    setTimeout(() => {
      setShowSelect(false);
    }, 100);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (escape) {
      setShowSelect(false);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escape]);

  useEffect(() => {
    setItens(props.itens || []);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    props.onChangeSelectedItens(selectedItens.map((item) => { return item.item }));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItens]);

  const onChange = (itens) => {
    setSelectedItens(itens);
  }

  const handleClickSelect = () => {
    setShowSelect(!showSelect);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {(selectedItens.length !== itens.length) && selectedItens.map((item) => {
            return (
              <Grid item>
                <Grid container className={classes.itemLabel}>
                  <Typography className={classes.textLabel}>
                    {item.label}
                  </Typography>
                </Grid>
              </Grid>
            )
          })}
          {(selectedItens.length === itens.length) &&
            <Grid item>
              <Grid container className={classes.itemLabel}>
                <Typography className={classes.textLabel}>
                  {t("common.allText").toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          }
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button className={classes.button} onClick={handleClickSelect}>
          {props.buttonLabel}
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Collapse in={showSelect} mountOnEnter>
          <SearchSelectInput selectedItens={props.selectedItens} itens={itens} onChange={onChange} />
        </Collapse>
      </Grid>
    </Grid>
  );
}

PredizaSelector.propTypes = {
  itens: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      alternativeLabel: PropTypes.string,
      objectid: PropTypes.string.isRequired,
      item: PropTypes.object.isRequired
    })
  ),
  buttonLabel: PropTypes.string.isRequired
};

export default PredizaSelector;