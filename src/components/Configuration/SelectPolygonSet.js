import React, { useEffect, useState } from "react";

import PropTypes from 'prop-types';

import { Card, Grid, Typography } from "@material-ui/core";

import PredizaScrollBar from "../Common/PredizaScrollBar";
import styles from "../../styles/Configuration/SelectPolygonSet";
import CustomRadio from "../Common/CustomRadio";
import Canvas from "../Common/Canvas";
import PolygonStore from '../../stores/PoligonStore';
import theme from "../../styles/Utils/theme";
import CustomCheckBox from "../Common/CustomCheckBox";


function SelectPolygonSet(props) {
  const classes = styles();

  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(0);
  const [checkboxesField, setCheckboxesField] = useState(null);

  useEffect(() => {
    if (typeof props.handleSelectedPolygon === "function") {
      props.handleSelectedPolygon(props.polygons[selectedPolygonIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.polygons, props.handleSelectedPolygon, selectedPolygonIndex])

  useEffect(() => {
    if (checkboxesField && typeof props.handleSelectedFields === "function") {
      props.handleSelectedFields(checkboxesField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxesField, props.handleSelectedFields])

  useEffect(() => {
    if (props.isCheckbox && props.polygons?.length > 0) {
      const newCheckboxes = {};

      props.polygons.forEach(polygon => {
        newCheckboxes[polygon.name] = false;
      })

      setCheckboxesField(newCheckboxes);
    }
  }, [props.polygons, props.isCheckbox])

  const handleChangePolygon = (index) => {
    setSelectedPolygonIndex(index);
  }
  const handleChangeField = (event) => {
    setCheckboxesField({ ...checkboxesField, [event.target.name]: event.target.checked });
  }

  return (
    <PredizaScrollBar customHeight={"288px"}>
      <Grid container justifyContent='center' alignContent='center'>
        {props.polygons?.length > 0 && props.polygons.map((polygon, index) => {
          return (
            <Grid item xs={4} key={index} className={classes.containerPolygon}>
              <Card className={classes.wrapperCardPol} elevation={0}>
                <Grid className={classes.wrapperPolygon}>
                  {props.isRadio &&
                    <CustomRadio
                      checked={selectedPolygonIndex === index}
                      onChange={() => { handleChangePolygon(index) }}
                      value={index}
                      name={`radio-button-${index}`}
                      inputProps={{ 'aria-label': index }}
                      size='small'
                      className={classes.radioPolygon}
                      color={theme.colors.onPrimaryContainer}
                    />
                  }
                  {props.isCheckbox && checkboxesField &&
                    <CustomCheckBox
                      checked={checkboxesField[polygon.name]}
                      onChange={handleChangeField}
                      name={polygon.name}
                      color={theme.colors.primary[40]}
                    />
                  }
                </Grid>
                <Grid container justifyContent='center' alignContent='center' style={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography variant='caption' className={classes.cardTitleItem}>
                      {polygon.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.wrapperCanvas}>
                    <Canvas pts={polygon.path} width="100" height="70" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='caption' className={classes.contentText}>
                      {`${PolygonStore.convertAreaToHa(
                        PolygonStore.computeAreaGauss(polygon.path)
                      ).replace('.', ',')} ha`}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </PredizaScrollBar>
  );
}

SelectPolygonSet.propTypes = {
  polygons: PropTypes.array.isRequired,
  isRadio: PropTypes.bool,
  isCheckbox: PropTypes.bool,
  handleSelectedPolygon: PropTypes.func,
  handleSelectedFields: PropTypes.func,
};

export default SelectPolygonSet;