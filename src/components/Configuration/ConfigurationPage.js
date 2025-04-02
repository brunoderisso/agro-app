import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";

import styles from "../../styles/Configuration/ConfigurationPage";
import theme from "../../styles/Utils/theme";
import SessionStore from "../../stores/SessionStore";
import GoogleMaps from "../Common/GoogleMaps/GoogleMapsv2";
import ConfigurationModal from "./ConfigurationModal";
import ConfigurationDrawer from "./ConfigurationDrawer";
import PredizaModal from "../Common/PredizaModal";
import poligonStore from "../../stores/PoligonStore";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import tokens from "../../stores/CancelTokenList";


function ConfigurationPage(props) {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [environment, setEnvironment] = useState({});
  const [environmentBounds, setEnvironmentBounds] = useState(null);
  const [polygons, setPolygons] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [step, setStep] = useState(-1);
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [environmentPolygons, setEnvironmentPolygons] = useState([]);

  const actualEnvironmentBoundsRef = useRef(null);

  const modalButtons = [
    { label: t('common.cancelButton'), action: status => handleModal(status) },
    { label: t('common.deleteButton'), action: () => handleDeletePolygon(), color: theme.colors.error[40] }
  ];

  useEffect(() => {
    bind();
    GoogleMapStore.storeEnableCards(false);

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.environmentId) {
      setEnvironment(SessionStore.getEnvironmentDetail(props.environmentId));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    if (environment?.polygon) {
      setEnvironmentBounds(environment.polygon);
      setDrawerOpen(true);
      setModalOpen(false);
      setStep(3);
    } else {
      setModalOpen(true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment]);

  const bind = () => {
    GoogleMapStore.addListener("alertModal_open", handleAlertModal);
    GoogleMapStore.addListener("environmentPolygon_update", setEnvironmentBounds);
    GoogleMapStore.addListener("environmentPolygon_store", handleActualEnvironmentBoundsRef);
    GoogleMapStore.addListener("environmentPolygon_revert", revertEnvironmentBounds);
    SessionStore.addListener("polygons_stored", updatePolygons);
  }

  const clear = () => {
    GoogleMapStore.removeListener("alertModal_open", handleAlertModal);
    GoogleMapStore.removeListener("environmentPolygon_update", setEnvironmentBounds);
    GoogleMapStore.removeListener("environmentPolygon_store", handleActualEnvironmentBoundsRef);
    GoogleMapStore.removeListener("environmentPolygon_revert", revertEnvironmentBounds);
    SessionStore.removeListener("polygons_stored", updatePolygons);
  }

  const handleActualEnvironmentBoundsRef = (coordinates) => {
    actualEnvironmentBoundsRef.current = coordinates;
  }

  const revertEnvironmentBounds = () => {
    if (actualEnvironmentBoundsRef.current) {
      setEnvironmentBounds([...actualEnvironmentBoundsRef.current]);
    }
  }

  const updatePolygons = () => {
    setEnvironmentPolygons(SessionStore.getStoredPolygons());
    setPolygons(SessionStore.getStoredPolygons());
  }

  const handleAlertModal = (polygon) => {
    setOpenAlertModal(true);
    setSelectedPolygon(polygon)
  }

  const onChangePolygons = (polygons) => {
    setPolygons(polygons);
  }

  const handleModal = (status) => {
    setOpenAlertModal(status);
  }

  const handleDeletePolygon = () => {
    deletePolygon();
    setOpenAlertModal(false);
  }

  const deletePolygon = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    const newSelectedPolygon = { ...selectedPolygon }

    setLoading(true);
    poligonStore.deleteEnvPolygon(
      cancelToken,
      newSelectedPolygon.objectid,
      (response) => responseDeletePolygon(newSelectedPolygon.objectid, response)
    )
  }

  const responseDeletePolygon = (polygonId, response) => {
    tokenList.remove(response.id);

    if (response.data) {
      SessionStore.deleteStoredPolygon(polygonId);
      getEnvironmentPolygons();
    }

    if (response.status) {
      setLoading(false);
      GoogleMapStore.emit("googleMapsError_set", response.status.toString());
    }
  }

  const getEnvironmentPolygons = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    poligonStore.getEnvironmentPolygons(cancelToken, SessionStore.getEnvironment(), responseGetEnvironmentPolygons);
  }

  const responseGetEnvironmentPolygons = (response) => {
    onChangePolygons(response);
    setEnvironmentPolygons(response || []);
    setLoading(false);
    setSelectedPolygon(null);
    GoogleMapStore.emit("googleMapsError_set", "200");

    if (response) {
      const points = []

      response.forEach(polygon => {
        points.push(...polygon.polygon)
      });
      GoogleMapStore.emit("polygon_center", points);
    } else {
      GoogleMapStore.resetPolygonReferences();
    }
  }

  const onStepChange = (step) => {
    setStep(step);

    switch (step) {
      case 0:
        setModalOpen(false);
        setDrawerOpen(true);
        break;

      case 1:
        setModalOpen(true);
        setDrawerOpen(false);
        break;

      case 2:
        setModalOpen(false);
        setDrawerOpen(true);
        break;

      case 3:
        setModalOpen(false);
        setDrawerOpen(true);
        break;

      case 4:
        setDrawerOpen(false);
        setModalOpen(true);
        break;

      default:
        break;
    }
  }

  const handleConfigurationModal = (status) => {
    setModalOpen(status);
  }

  const bodyModal = () => {
    return (
      <Grid>
        <Typography variant="body2" className={classes.textModal}>
          {t('alert.confirmDeletePolygon')}
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container className={classes.container}>
      <GoogleMaps
        polygons={polygons}
        environmentBounds={environmentBounds}
        environment={environment}
        disableDefaultControls
        customizedMapControls
        configuration
        page={step}
      />
      <ConfigurationDrawer
        onStepChange={onStepChange}
        onChangePolygons={onChangePolygons}
        handleConfigurationModal={handleConfigurationModal}
        open={drawerOpen}
        step={step}
        environmentPolygons={environmentPolygons}
        environmentBounds={environmentBounds}
        polygon={selectedPolygon}
        polygons={polygons || []}
        loading={loading}
      />
      <ConfigurationModal onStepChange={onStepChange} open={modalOpen} handleModalOpen={setModalOpen} step={step} />
      <PredizaModal
        open={openAlertModal}
        dispense={modalButtons[0]}
        confirm={modalButtons[1]}
        title={t('configuration.deletePolygon')}
        size={'small'}
      >
        {bodyModal()}
      </PredizaModal>
    </Grid>
  )
}

export default ConfigurationPage;