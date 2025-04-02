import React, { useState, useEffect } from "react";
import { TwitterPicker } from 'react-color';
import InputMask from 'react-input-mask';
import { useTranslation } from "react-i18next";

import clsx from 'clsx';
import moment from "moment";

import { Skeleton } from "@material-ui/lab";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {
  Typography,
  IconButton,
  FormControl,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  withStyles,
  StepConnector
} from "@material-ui/core";

import styles from "../../styles/Configuration/PolygonForm";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import NoteStore from "../../stores/NoteStore";
import tokens from "../../stores/CancelTokenList";
import PredizaScrollBar from "../Common/PredizaScrollBar";
import poligonStore from "../../stores/PoligonStore";
import { ConstantsUtils } from "../../utils/constantsUtils";
import sessionStore from "../../stores/SessionStore";
import { ReactComponent as DeleteIcon } from '../../img/DeleteIcon.svg';


const LineConnector = withStyles({
  line: {
    width: "13px",
    marginLeft: "-4px"
  },
})(StepConnector);

function PolygonForm(props) {
  const tokenList = new tokens();
  const classes = styles();
  const { t } = useTranslation();

  const [polygon, setPolygon] = useState(null);
  const [environmentCrop, setEnvironmentCrop] = useState(null);
  const [stage, setStage] = useState(-1);
  const [phenologicalStages, setPhenologicalStages] = useState([]);
  const [polygonColor, setPolygonColor] = useState(null);
  const [colorVisible, setColorVisible] = useState(false);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flagDateError, setFlagDateError] = useState(false);
  const [textDateError, setTextDateError] = useState('');

  useEffect(() => {
    if (NoteStore.getCropsList()) {
      setCrops(NoteStore.getCropsList());
    }
  }, []);

  useEffect(() => {
    setPolygon(props.polygon);
  }, [props.polygon]);

  useEffect(() => {
      setLoading(props.loading);
    }, [props.loading]);

  useEffect(() => {
    if (polygon) {
      const storedPolygons = sessionStore.getStoredPolygons();
      const foundedPolygon = storedPolygons.find(pol => pol.objectid === polygon.objectid);

      GoogleMapStore.emit("polygon_setEditable", { ...polygon, ref: polygon.polygon });
      GoogleMapStore.emit("polygon_center", polygon.polygon);

      if (polygon?.crop && foundedPolygon?.crop?.checked === undefined) {
        const cancelToken = {};

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoading(true);
        NoteStore.getEnvCrop(polygon.crop.objectid, cancelToken, responseGetEnvCrop);
      } else {
        if (foundedPolygon.crop?.crop_planting_date) {
          foundedPolygon.crop.crop_planting_date = moment(foundedPolygon.crop.crop_planting_date).format("DD/MM/YYYY");
        }

        setPolygonColor(foundedPolygon?.crop?.polygon?.color || foundedPolygon?.color || "#0053DB");
        setEnvironmentCrop(foundedPolygon.crop);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon]);

  useEffect(() => {
    if (environmentCrop?.phenological_stage) {
      setPhenologicalStages(environmentCrop.phenological_stage);

      if (environmentCrop.crop_phenological_stage) {
        const index = environmentCrop.phenological_stage.findIndex(stage => stage.objectid === environmentCrop.crop_phenological_stage);

        if (index > -1) {
          setStage(index);
        }
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentCrop]);

  const stageLabelIcon = (props) => {
    const classes = styles();
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        <Typography style={{ fontSize: "12px" }}>{phenologicalStages[props.icon - 1]?.label || ConstantsUtils.NullFieldMask}</Typography>
      </div>
    );
  }

  const responseGetEnvCrop = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      const cropResponse = response.data;

      setPolygonColor(cropResponse.polygon.color || "#0053DB");

      if (cropResponse) {
        const storedPolygons = sessionStore.getStoredPolygons();
        const foundedPolygon = storedPolygons.find(pol => pol.crop?.objectid === cropResponse.objectid);

        if (foundedPolygon) {
          const newPolygon = {
            ...foundedPolygon,
            crop: {
              ...cropResponse,
              checked: true
            }
          }

          sessionStore.updateStoredPolygon(newPolygon);
        }
      }

      if (cropResponse.crop_planting_date) {
        cropResponse.crop_planting_date = moment(cropResponse.crop_planting_date).format("DD/MM/YYYY");
      }

      setEnvironmentCrop(cropResponse);
    }
  }

  const onChangeEnvironmentCrop = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (typeof props.setPolygon === 'function') {
        props.setPolygon({ ...polygon, name: value });
      }

      if (environmentCrop) {
        setEnvironmentCrop((prevcrop) => ({
          ...prevcrop,
          polygon: {
            ...prevcrop.polygon,
            [name]: value,
          }
        }));
      }
    } else {
      setEnvironmentCrop((prevcrop) => ({
        ...prevcrop,
        [name]: value,
      }));
    }

  }

  const onClickStage = (stage, index) => {
    setEnvironmentCrop((prevcrop) => ({
      ...prevcrop,
      crop_phenological_stage: stage.objectid,
    }));
    setStage(index);
  }

  const handleChangeColor = (color) => {
    setColorVisible(false);
    setPolygonColor(color.hex);
  }

  const onClickSavePolygon = () => {
    const cancelToken = {};

    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    const polygonReference = GoogleMapStore.getPolygonReferences().find(polRef => polRef.object?.objectid === polygon?.objectid);
    const coordinates = GoogleMapStore.getCoordinatesPolygon(polygonReference);

    if (environmentCrop && isNaN(moment(environmentCrop.crop_planting_date, "DD/MM/YYYY").valueOf())) {
      setFlagDateError(true);
      setTextDateError(t("alert.invalidDate"));

      return;
    }

    setFlagDateError(false);
    setTextDateError("");

    let body = null;

    if (environmentCrop) {
      body = { ...environmentCrop.polygon, name: polygon.name, polygon: coordinates, color: polygonColor };
      body.crop = {
        ...environmentCrop,
        crop_number_of_plants: +environmentCrop.crop_number_of_plants,
        crop_spacing_line: +environmentCrop.crop_spacing_line,
        crop_spacing_plant: +environmentCrop.crop_spacing_plant,
        crop_planting_date: new Date(moment(environmentCrop.crop_planting_date, "DD/MM/YYYY").valueOf()).toISOString(),
        polygon: {
          ...environmentCrop.polygon,
          color: polygonColor
        }
      };
    } else {
      body = { ...polygon, polygon: coordinates, color: polygonColor };
    }

    setLoading(true);
    poligonStore.updateCropPolygonConfiguration(cancelToken, body, (response) => responseOnClickSavePolygon(body, response));
  }

  const responseOnClickSavePolygon = (polygon, response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      if (typeof props.setPolygon === 'function') {
        props.setPolygon(null);
      }

      sessionStore.updateStoredPolygon(polygon);
      props.getEnvironmentPolygons();
      GoogleMapStore.emit("googleMapsError_set", "200");
    }

    if (response.status) {
      GoogleMapStore.emit("googleMapsError_set", response.status.toString());
    }
  }

  const closeEditMode = () => {
    if (typeof props.setPolygon === 'function') {
      props.setPolygon(null);
    }

    GoogleMapStore.emit("polygon_setUneditable", { ...polygon, ref: polygon.polygon });
  }

  const deletePolygon = () => {
    GoogleMapStore.emit("alertModal_open", polygon);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
          <Grid item>
            <IconButton onClick={closeEditMode}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {t("configuration.editPolygon")}
            </Typography>
          </Grid>

          <Grid item className={classes.containerButton}>
            <Button
              onClick={deletePolygon}
              className={classes.iconButton}
              disabled={loading}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {loading &&
        <Grid container spacing={2} style={{ padding: "24px" }}>
          <Grid item xs={12}>
            <Skeleton variant="rect" width={"100%"} height={40} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rect" width={"100%"} height={40} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width={"50%"} height={10} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rect" width={"100%"} height={20} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rect" width={"100%"} height={40} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rect" width={"100%"} height={40} />
          </Grid>
        </Grid>
      }
      {!loading && polygon &&
        <Grid item xs={12} className={classes.margin}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={polygon.name}
                  name="name"
                  onChange={onChangeEnvironmentCrop}
                  className={classes.inputs}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  size="small"
                  label={t("common.name")}
                />
              </FormControl>
            </Grid>
            {environmentCrop &&
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <TextField
                      value={environmentCrop.crop_objectid}
                      select
                      disabled
                      name="crop_objectid"
                      onChange={onChangeEnvironmentCrop}
                      className={classes.inputs}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      size="small"
                      label={t("common.crop")}
                    >
                      {crops.map((crop) => (
                        <MenuItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="caption" className={classes.textLabel}>
                        {t("common.phenologicalStageFull")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {phenologicalStages.length > 0 &&
                        <PredizaScrollBar customHeight={"45px"}>
                          <Stepper alternativeLabel activeStep={stage} connector={<LineConnector />} className={classes.stepper}>
                            {phenologicalStages.map((stage, index) => {
                              return (
                                <Step key={stage.objectid} onClick={() => { onClickStage(stage, index) }}>
                                  <StepLabel StepIconComponent={stageLabelIcon}></StepLabel>
                                </Step>
                              )
                            })}
                          </Stepper>
                        </PredizaScrollBar>
                      }
                      {phenologicalStages.length === 0 &&
                        <Typography variant="body2" className={classes.textEmpty}>{t("advancedmap.emptyPhenologicalStage")}</Typography>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputMask mask="99/99/9999"
                      name="crop_planting_date"
                      value={environmentCrop.crop_planting_date}
                      size='small'
                      onChange={onChangeEnvironmentCrop}
                      error={flagDateError}
                      helperText={textDateError}
                    >
                      {(inputProps) =>
                        <TextField
                          variant="outlined"
                          label={t("common.plantingDate")}
                          className={classes.inputs}
                          InputLabelProps={{
                            shrink: true,
                            classes: {
                              root: classes.inputLabel,  // Aplica o estilo personalizado ao label
                            },
                          }}
                          {...inputProps}
                        />
                      }
                    </InputMask>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      value={environmentCrop.crop_number_of_plants}
                      name="crop_number_of_plants"
                      defaultValue={0}
                      InputLabelProps={{
                        shrink: true,
                        classes: {
                          root: classes.inputLabel,  // Aplica o estilo personalizado ao label
                        },
                      }}
                      onChange={onChangeEnvironmentCrop}
                      className={classes.inputs}
                      variant="outlined"
                      type="number"
                      size="small"
                      label={t("configuration.step3_polygonPlantNumberConstrict")}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      value={environmentCrop.crop_spacing_line}
                      name="crop_spacing_line"
                      defaultValue={0}
                      InputLabelProps={{
                        shrink: true,
                        classes: {
                          root: classes.inputLabel,  // Aplica o estilo personalizado ao label
                        },
                      }}
                      onChange={onChangeEnvironmentCrop}
                      className={classes.inputs}
                      type="number"
                      variant="outlined"
                      size="small"
                      label={t("configuration.step3_polygonLine")}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      value={environmentCrop.crop_spacing_plant}
                      name="crop_spacing_plant"
                      defaultValue={0}
                      InputLabelProps={{
                        shrink: true,
                        classes: {
                          root: classes.inputLabel,  // Aplica o estilo personalizado ao label
                        },
                      }}
                      type="number"
                      onChange={onChangeEnvironmentCrop}
                      className={classes.inputs}
                      variant="outlined"
                      size="small"
                      label={t("configuration.step3_polygonPlant")}
                    />
                  </FormControl>
                </Grid>
              </>
            }

            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="caption" className={classes.textLabel}>
                    {t("common.color")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={2}>
                      <div style={{ height: '35px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: polygonColor }}
                          onClick={() => { setColorVisible(!colorVisible) }}>
                        </div>
                      </div>
                    </Grid>
                    <Grid item>
                      <Typography variant="caption" className={classes.textLabel}>*{t("common.onlyGraphics")}</Typography>
                    </Grid>
                  </Grid>
                  {colorVisible &&
                    <Grid item xs={12}>
                      <TwitterPicker
                        color={polygonColor}
                        onChangeComplete={handleChangeColor}
                        styles={{ maxWidth: '100px' }}
                      />
                    </Grid>
                  }
                </Grid>
                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Button className={classes.button} onClick={closeEditMode}>
                        {t("common.cancelButton")}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button className={classes.button} onClick={onClickSavePolygon}>
                        {t("common.saveButton")}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default PolygonForm;