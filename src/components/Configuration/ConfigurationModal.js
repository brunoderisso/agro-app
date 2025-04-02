import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import classNames from "classnames";

import Grid from "@material-ui/core/Grid";
import { Button, Modal, Typography } from "@material-ui/core";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import styles from "../../styles/Configuration/ConfigurationModal";
import WelcomeImg from "../../img/Configuration/image.png";
import FinishImg from "../../img/Configuration/finishImage.png";
import GeoFileImporter from "./GeoFileImporter";
import PropertyConfirmForm from "./PropertyConfirmForm";
import history from "../../history";
import SelectPolygonSet from "./SelectPolygonSet";
import GoogleMapStore from "../../stores/GoogleMapsStore";
// import { ReactComponent as ChevronLeft } from '../../img/ChevronLeft.svg'


function ConfigurationModal(props) {
  const classes = styles();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [nextButton, setNextButton] = useState(t("configuration.welcome_buttonStart"));
  const [activeStep, setActiveStep] = useState(-1);
  const [polygons, setPolygons] = useState([]);
  const [showPolygons, setShowPolygons] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [selectedFields, setSelectedFields] = useState(null);

  const steps = [
    {
      step: 1,
      title: t("configuration.step1_header"),
      subtitle: showPolygons ? t("subscription.selectEquivalentPolygon") : t("configuration.step1_text")
    },
    { step: 2, title: t("common.myProperty"), subtitle: "" },
    { step: 3, title: t("configuration.step3_headerModal"), subtitle: t("configuration.step3_textModal") },
    { step: 4, title: t("configuration.step4_headerModal"), subtitle: t("configuration.step4_textModal") }
  ];

  useEffect(() => {
    bind();

    return clear;
  }, [])

  useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  useEffect(() => {
    if (props.step === 4) {
      setActiveStep(3);

      return;
    }

    setActiveStep(props.step);
  }, [props.step])

  useEffect(() => {
    if (activeStep === 0) {
      setNextButton(t("common.setManually"));
    } else if (activeStep === 1) {
      setNextButton(t("common.next"));
    } else if (activeStep === 2) {
      setNextButton(t("common.setManually"));
    } else if (activeStep === 3) {
      setNextButton(t("configuration.step4_goPainelButton"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep])

  const bind = () => {
    GoogleMapStore.addListener("activeStep_handle", setActiveStep);
  }

  const clear = () => {
    GoogleMapStore.removeListener("activeStep_handle", setActiveStep);
  }

  const handleClose = () => {
    setOpen(false);
    setShowPolygons(false);
    setPolygons([]);

    if (typeof props.handleModalOpen === 'function') {
      props.handleModalOpen(false);
    }
  }

  const handleNext = (_, polygon, isImport) => {
    if (activeStep === steps.length) {
      return;
    }

    if (activeStep === 0) {
      if (polygon) {
        GoogleMapStore.emit("isImportedEnvironmentBounds_set", true);

        if (props.step === 0) {
          GoogleMapStore.emit("drawingPolygons_reset", false);
        }

        if (props.step === -1 || props.step === 0) {
          GoogleMapStore.emit("environmentPolygon_create", polygon.path);
        }

        if (props.step === 3) {
          GoogleMapStore.emit("environmentPolygon_update", polygon.path);
          GoogleMapStore.emit("polygon_center", polygon.path);
        }
      }

      if (props.step === -1 && typeof props.onStepChange === 'function') {
        props.onStepChange(0);
      }

      handleClose();

      return;
    }

    if (activeStep === 2) {
      if (isImport && Object.values(selectedFields).every(check => !check)) {
        GoogleMapStore.emit("googleMapsErrorMessage_set", t("alert.selectAtLeastOne"));
        GoogleMapStore.emit("googleMapsError_set", "401");

        return;
      }

      // Reseta os talhões selecionados, caso seja selecionado a criação manual deles
      if (!isImport && selectedFields) {
        Object.keys(selectedFields).forEach(name => { selectedFields[name] = false });
      }

      if (typeof props.onStepChange === 'function') {
        props.onStepChange(activeStep);
      }

      const newPolygons = [];

      // Seleciona os polygonos com check = true
      polygons.forEach((polygon, index) => {
        if (selectedFields[polygon.name]) {
          newPolygons.push({
            ...polygon,
            ref: polygon.path,
            objectid: "new" + index,
            locked: true
          });
        }
      })

      GoogleMapStore.emit("importedPolygonsRef_set", newPolygons);
      GoogleMapStore.emit("polygonsMode_create");

      setShowPolygons(false);
      setPolygons([]);

      return;
    }

    if (activeStep === 3) {
      history.push("/map");

      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  // TODO: descomentar quando tiver o compartilhamento de propriedade
  // const handleBack = () => {
  //   if (activeStep === 0) {
  //     return
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // }

  const handleCustom = () => {
    if (activeStep === 3 && typeof props.onStepChange === 'function') {
      props.onStepChange(3);
    }
  }

  const onUpload = (data) => {
    setPolygons(data);
    handleShowPolygons();
  }

  const getBody = () => {
    switch (activeStep) {
      case -1:
        return (
          <Grid container justifyContent="center">
            <img src={WelcomeImg} height={250} alt="Welcome" />
          </Grid>
        )

      case 0:
        return (
          <Grid>
            {showPolygons
              ? <SelectPolygonSet polygons={polygons} isRadio={true} handleSelectedPolygon={setSelectedPolygon} />
              : <GeoFileImporter onChange={onUpload} />
            }
          </Grid>
        )

      case 1:
        return (
          <PropertyConfirmForm />
        )

      case 2:
        return (
          <Grid>
            {showPolygons
              ? <SelectPolygonSet polygons={polygons} isCheckbox={true} handleSelectedFields={setSelectedFields} />
              : <GeoFileImporter onChange={onUpload} />
            }
          </Grid>
        )

      case 3:
        return (
          <Grid container justifyContent="center">
            <img src={FinishImg} height={250} alt="Finish" />
          </Grid>
        )
      default:
        break;
    }
  }

  const handleShowPolygons = () => {
    setShowPolygons(true);
  }

  const body = () => {
    return (
      <Grid className={classes.modalContainer}>
        <Grid container spacing={2} className={classes.body}>
          {/* STEPPER */}
          <Grid item xs={12}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label.step} className={classes.step}>
                  <StepLabel></StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          {/* TITLE & SUBTITLE */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" className={classNames(classes.textColor, classes.title)}>
                  {(activeStep >= 0 && steps[activeStep]?.title) || ""}
                  {activeStep < 0 && t("configuration.welcome_header")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.textColor}>
                  {activeStep >= 0 && steps[activeStep].subtitle}
                  {activeStep < 0 && t("configuration.welcome_text")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* BODY */}
          <Grid item xs={12}>
            {getBody()}
          </Grid>
          {/* BOTTOM */}
          <Grid item xs={12}>
            {/* TODO: descomentar quando tiver o compartilhamento de propriedade */}
            {/* {activeStep >= 0 &&
              <Grid container className={classes.body} justifyContent="flex-start" alignItems="flex-start">
                <Grid item>
                  <Button color="primary" className={classes.btPrimary} onClick={handleBack}>
                    <ChevronLeft />
                    <Typography variant="button" className={classes.btText}>Voltar</Typography>
                  </Button>
                </Grid>
              </Grid>
            } */}
            <Grid container className={classes.body} justifyContent="flex-end" alignItems="flex-end" spacing={3}>
              {activeStep === 3 &&
                <Grid item>
                  <Button color="primary" className={classes.btPrimary} onClick={handleCustom}>
                    <Typography variant="button" className={classes.btText}>{t("configuration.step4_keepManagingButton")}</Typography>
                  </Button>
                </Grid>
              }
              <Grid item>
                {polygons.length > 0 && (activeStep === 0 || activeStep === 2) &&
                  <Button
                    color="primary"
                    className={classes.btPrimary}
                    onClick={showPolygons
                      ? (activeStep === 0
                        ? (event) => handleNext(event, selectedPolygon)
                        : (event) => handleNext(event, null, true)
                      )
                      : handleShowPolygons}
                  >
                    <Typography variant="button" className={classes.btText}>
                      {showPolygons ? t("common.importButton") : t("common.next")}
                    </Typography>
                  </Button>
                }
                <Button color="primary" className={classes.btPrimary} onClick={handleNext}>
                  <Typography variant="button" className={classes.btText}>{nextButton}</Typography>
                </Button>
                {activeStep === 2 &&
                  <Button
                    color="primary"
                    className={classNames(classes.btPrimary, classes.marginButton)}
                    onClick={() => props.onStepChange(4)}
                  >
                    <Typography variant="button" className={classes.btText}>{t("common.next")}</Typography>
                  </Button>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body()}
      </Modal>
    </Grid>
  )
}

export default ConfigurationModal;