import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from 'prop-types';

import Grid from "@material-ui/core/Grid";
import { Button, Drawer, IconButton, Snackbar, Typography } from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import EditIcon from "@material-ui/icons/Edit";

import styles from "../../styles/Configuration/ConfigurationDrawer";
import polygonIcon from '../../img/AdvancedMapIcons/polygonIcon.png';
import handIcon from '../../img/AdvancedMapIcons/handIcon.png';
import PropertyForm from "./PropertyForm";
import PredizaScrollBar from '../Common/PredizaScrollBar';
import GoogleMapStore from "../../stores/GoogleMapsStore";
import EnvironmentStore from "../../stores/EnvironmentStore";
import AccountStore from "../../stores/AccountStore";
import tokens from "../../stores/CancelTokenList";
import SessionStore from "../../stores/SessionStore";
import PolygonsEditList from "./PolygonsEditList";
import PoligonStore from "../../stores/PoligonStore";
import PolygonViewer from "./PolygonViewer";
import PolygonForm from "./PolygonForm";
import PropertyPanel from "./PropertyPanel";
import useBase64ToUint8Array from "../../Hook/useBase64ToUint8Array";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      style={{ width: '100%' }}
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container>
          {children}
        </Grid>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ConfigurationDrawer(props) {
  const tokenList = new tokens();
  const classes = styles();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [openTutorial, setOpenTutorial] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeEnv, setEditModeEnv] = useState(false);
  const [step, setStep] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [environmentPolygons, setEnvironmentPolygons] = useState([]);
  const [environmentBounds, setEnvironmentBounds] = useState(null);
  const [tab, setTab] = useState(0);
  const [property, setProperty] = useState(null);
  const [flagStep, setFlagStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [propertyMethodRequest, setPropertyMethodRequest] = useState('put');
  const [environmentLogoBase64, setEnvironmentLogoBase64] = useState(null);

  const environmentLogoArray = useBase64ToUint8Array(environmentLogoBase64);

  const stepRef = useRef(null);
  const isImportedEnvironmentBoundsRef = useRef(false);
  const flagCreatePolygonsRef = useRef(true);
  const importedPolygonsRef = useRef(null);

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    setStep(props.step);

  }, [props.step]);

  useEffect(() => {
    setEnvironmentPolygons(props.environmentPolygons);
  }, [props.environmentPolygons]);

  useEffect(() => {
    setPolygon(props.polygon);
  }, [props.polygon]);

  useEffect(() => {
    setPolygons(props.polygons);
  }, [props.polygons]);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  useEffect(() => {
    setEnvironmentBounds(props.environmentBounds);
  }, [props.environmentBounds]);

  useEffect(() => {
    if (editModeEnv && (step === 3 || step === 0)) {
      const envPolygon = GoogleMapStore.getPolygonReferences().find(polygon => polygon.object?.isEnvironment);

      if (envPolygon) {
        GoogleMapStore.emit("polygon_setEditable", envPolygon);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModeEnv]);

  useEffect(() => {
    GoogleMapStore.emit("polygon_stopDrawing");
    GoogleMapStore.emit("polygonsMap_create");

    setEditMode(false);
    setEditModeEnv(false);
  }, [tab]);

  useEffect(() => {
    stepRef.current = step;

    if (props.open && step === 0) {
      getEnvironmentDatas();
    }

    if (props.open && step === 2 && flagCreatePolygonsRef.current) {
      setTimeout(() => {
        onCreatePolygonsMode();
        flagCreatePolygonsRef.current = false;
      }, 1000);
    }

    if (props.open && step === 3) {
      getEnvironmentDatas();
      getEnvironmentPolygons();

      isImportedEnvironmentBoundsRef.current = false;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (step === 0 && environmentBounds) {
      // Para polígono de ambiente importado por arquivo
      onUpdateEnvironmentPolygon(environmentBounds, true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, environmentBounds]);

  const bind = () => {
    GoogleMapStore.addListener("drawingPolygons_change", onChangeDrawingPolygons);
    GoogleMapStore.addListener("drawingPolygons_reset", clearPolygon);
    GoogleMapStore.addListener("isImportedEnvironmentBounds_set", handleIsImportedEnvironmentBounds);
    GoogleMapStore.addListener("flagCreatePolygonsRef_set", handleFlagCreatePolygonsRef);
    GoogleMapStore.addListener("environmentPolygon_create", setEnvironmentBounds);
    GoogleMapStore.addListener("importedPolygonsRef_set", handleImportedPolygonsRef);
    GoogleMapStore.addListener("polygonsMode_create", handleOnCreatePolygonsMode);
    SessionStore.addListener("polygons_stored", () => setLoading(false));
  }

  const clear = () => {
    GoogleMapStore.removeListener("drawingPolygons_change", onChangeDrawingPolygons);
    GoogleMapStore.removeListener("drawingPolygons_reset", clearPolygon);
    GoogleMapStore.removeListener("isImportedEnvironmentBounds_set", handleIsImportedEnvironmentBounds);
    GoogleMapStore.removeListener("flagCreatePolygonsRef_set", handleFlagCreatePolygonsRef);
    GoogleMapStore.removeListener("environmentPolygon_create", setEnvironmentBounds);
    GoogleMapStore.removeListener("importedPolygonsRef_set", handleImportedPolygonsRef);
    GoogleMapStore.removeListener("polygonsMode_create", handleOnCreatePolygonsMode);
    SessionStore.removeListener("polygons_stored", () => setLoading(false));
  }

  const handleOnCreatePolygonsMode = () => {
    if (!flagCreatePolygonsRef.current) {
      setTimeout(() => {
        onCreatePolygonsMode();
      }, 1000);
    }
  }

  const handleImportedPolygonsRef = (polygons) => {
    importedPolygonsRef.current = polygons;
  }

  const onChangeDrawingPolygons = (polygons) => {
   
    setPolygons(polygons);

    if (stepRef.current === 3) {
      setEnvironmentPolygons(polygons);
      setFlagStep(true);
    }
  }

  const handleIsImportedEnvironmentBounds = (flag) => {
    isImportedEnvironmentBoundsRef.current = flag;
  }

  const handleFlagCreatePolygonsRef = (flag) => {
    flagCreatePolygonsRef.current = flag;
  }

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
  }

  const getEnvironmentDatas = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setLoading(true);
    EnvironmentStore.getEnvironmentDatas(cancelToken, responseGetEnvironmentDatas);
  }

  const responseGetEnvironmentDatas = (response) => {
    tokenList.remove(response.id);

    setLoading(false);

    if (response.length === 2) {
      const dataEnv = response[1].data;

      if (step === 0) {
        setOpenTutorial(true);
      }

      setPropertyMethodRequest('put');
      setProperty({ ...response[0].data, name: dataEnv.name, area: dataEnv.area });

      if (response[1].data) {
        SessionStore.emit("environmentName.update", response[1].data);
      }

      if (response[1].data?.polygon?.length > 0) {
        if (step === 3) {
          GoogleMapStore.emit("environmentPolygon_store", response[1].data.polygon);
        }

        onUpdateEnvironmentPolygon(response.polygon);
      } else if (!isImportedEnvironmentBoundsRef.current) {
        onCreateEnvironmentPolygon();
      }
    }

    if (response.status) {
      const environment = SessionStore.getEnvironment(SessionStore.getEnvironment());

      setProperty({
        name: environment.name,
        area: environment.area,
        zipcode: '',
        street: '',
        city: '',
        district: '',
        country: '',
        email: '',
        telephone: ''
      });
      setPropertyMethodRequest('post');
      onCreateEnvironmentPolygon();
    }
  }

  const getEnvironmentPolygons = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setLoading(true);
    PoligonStore.getEnvironmentPolygons(cancelToken, SessionStore.getEnvironment(), responseGetEnvironmentPolygons);
  }

  const responseGetEnvironmentPolygons = (response) => {
    setLoading(false);

    if (response) {
      setEnvironmentPolygons(response);
      props.onChangePolygons(response);
    }
  }

  const getBody = () => {
    switch (step) {
      case 0:
        return getPropertyForm();

      case 2:
        return getPolygonsForm();

      case 3:
        if (editModeEnv) {
          return getPropertyForm();
        } else if (polygon?.objectid && polygon?.mode === 1) {
          return getPolygonEdit();
        } else if ((!polygon) || (polygon?.objectid && polygon?.mode === 0)) {
          return getConfigurationTabs();
        }

        break;

      default:
        break;
    }
  }

  const onCreatePolygonsMode = () => {
    if (flagCreatePolygonsRef.current) {
      GoogleMapStore.emit("polygon_drawing", importedPolygonsRef.current || []);
      setOpenTutorial(true);
    } else {
      GoogleMapStore.emit("polygonsList_add", importedPolygonsRef.current);
    }

    if (importedPolygonsRef.current?.length > 0) {
      const points = [];

      importedPolygonsRef.current.forEach(polygon => {
        points.push(...polygon.path);
      });

      GoogleMapStore.emit("polygon_center", points);
    }
  }

  const onUpdatePolygons = (response) => {
    const polygons = response.map((polygon) => ({ ...polygon, ref: polygon.polygon || [] }));
    const envPolygon = SessionStore.getEnvironmentDetail(props.environmentId);

    if (step === 2) {
      polygons.push({ objectid: envPolygon.objectid, isEnvironment: true, ref: envPolygon.polygon || [] })
    }

    GoogleMapStore.emit("polygon_drawing", polygons);
    setOpenTutorial(true);
  }

  const onCreateEnvironmentPolygon = () => {
    GoogleMapStore.emit("polygon_drawing");
  }

  const onUpdateEnvironmentPolygon = (polygon, isLocked = false) => {
    GoogleMapStore.emit("polygon_drawing", [{ objectid: "environment", ref: polygon, locked: isLocked }]);
  }

  const onConfirmCreate = () => {
    if (step === 0 && !isImportedEnvironmentBoundsRef.current) {
      GoogleMapStore.emit("drawingPolygons_check");
    }

    if (
      property?.name !== "" && property?.zipcode?.length === 8 && property?.street !== "" &&
      property?.city !== "" && property?.district !== "" && property?.country && property?.country !== "" &&
      property?.email !== "" && property?.telephone?.length > 7
    ) {
      GoogleMapStore.emit("createPolygon_confirm", onChangePolygons);
    } else {
      GoogleMapStore.emit("propertyForm_check", property);
    }
  }

  const onConfirmCreatePolygons = () => {
    setEditMode(false);

    GoogleMapStore.emit("polygon_stopDrawing");
    GoogleMapStore.emit("polygonsMap_create");
  }

  const clearPolygon = (isDraw = true) => {
    GoogleMapStore.emit("polygon_reset");
    GoogleMapStore.emit("polygon_stopDrawing");

    if (isDraw) {
      GoogleMapStore.emit("polygon_drawing");
    }

    setOpenTutorial(true);
  }

  const handleCloseTutorial = () => {
    setOpenTutorial(false)
  }

  const onClickAddPolygon = () => {
    setEditMode(true);
    onUpdatePolygons(polygons);
  }

  const onChangePolygons = (polygons) => {
    if (polygons?.length > 0) {
      const cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      setLoading(true);
      GoogleMapStore.emit("loading_update", true);

      const newProperty = { ...property, district: property.district.label, logo: environmentLogoArray };

      EnvironmentStore.setEnvironmentPreferences(newProperty, propertyMethodRequest, (response) => responseSetPreference(response, polygons[0]));
      AccountStore.updateEnvironment(
        cancelToken,
        { name: property.name, polygon: polygons[0].polygon },
        null,
        (response) => responseSetPreference(response, polygons[0])
      )
    }
  }

  const responseSetPreference = (response, newPolygon) => {
    if (response?.id) {
      tokenList.remove(response.id)
    }

    setLoading(false);
    GoogleMapStore.emit("loading_update", false);

    if (response === 'OK') {
      GoogleMapStore.emit("googleMapsError_set", "200");
      GoogleMapStore.emit("googleMapsErrorMessage_set", "");

      if (step === 3) {
        GoogleMapStore.emit("environmentPolygon_update", newPolygon.polygon);
      }

      if (step === 0 && typeof props.onStepChange === 'function') {
        props.onStepChange(1);
      } else if (step === 3) {
        cancelEditModeEnv(false);
        getEnvironmentDatas();
      }
    }
  }

  const editProperty = () => {
    setEditModeEnv(true);
    GoogleMapStore.emit("polygon_center", environmentBounds);
  }

  const onChangeProperty = (property) => {
    setProperty(property)
  }

  const handleImportModal = () => {
    if (step === 3 && tab === 0) {
      GoogleMapStore.emit("activeStep_handle", 0);
    }

    if(step === 3 && tab === 1){
      GoogleMapStore.emit("activeStep_handle", 2);
    }

    if (typeof props.handleConfigurationModal === "function") {
      props.handleConfigurationModal(true);
    }
  }

  const TutorialContent = ({ props }) => {
    return (
      <Grid container {...props}>
        <Grid item xs={12}>
          <Typography variant="body2" style={{ opacity: 1 }}>
            {t("common.press")} <img src={polygonIcon} alt="Polygon Icon" style={{ verticalAlign: 'middle', width: '20px', height: '20px' }} /> {t("configuration.instructionsMapPart1")} <img src={handIcon} alt="Hand Icon" style={{ verticalAlign: 'middle', width: '20px', height: '20px' }} /> {t("configuration.instructionsMapPart2")}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  const onChangeStep = (step) => {
    if (props?.onStepChange && typeof props.onStepChange === 'function') {
      props.onStepChange(step);
    }
  }

  const cancelEditMode = () => {
    setPolygons(polygons.filter((p)=>{return !(p.objectid.includes("new"))}))
    setEditMode(false);
    GoogleMapStore.emit("polygon_stopDrawing");
    GoogleMapStore.emit("editMode_cancel");
  }

  const cancelEditModeEnv = (isCancelAction) => {
    setEditModeEnv(false);

    const envPolygon = GoogleMapStore.getPolygonReferences().find(polygon => polygon.object?.isEnvironment);

    if (envPolygon) {
      GoogleMapStore.emit("polygon_setUneditable", envPolygon);
    }

    if (isCancelAction) {
      GoogleMapStore.emit("environmentPolygon_revert");
    }
  }

  const getConfigurationTabs = () => {
    return (
      <Grid container>
        <AppBar position="static" className={classes.tabsHeader}>
          <Tabs variant="fullWidth" value={tab} indicatorColor={'primary'} onChange={handleChangeTab} aria-label="simple tabs example">
            <Tab label={t("common.property")} {...a11yProps(0)} />
            <Tab label={t("common.field")} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          {!editModeEnv && getPropertyPanel()}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {!polygon && getPolygonsList()}
          {(polygon?.objectid && polygon?.mode === 0) &&
            <PolygonViewer setPolygon={setPolygon} polygon={polygon} loading={loading} />
          }
        </TabPanel>
      </Grid>
    )
  }

  const getPolygonEdit = () => {
    return (
      <Grid container>
        <PolygonForm
          setPolygon={setPolygon}
          polygon={polygon}
          getEnvironmentPolygons={getEnvironmentPolygons}
          loading={loading}
        />
      </Grid>
    )
  }

  const getPropertyPanel = () => {
    return (
      <Grid container className={classes.containerProperty} spacing={3}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={11}>
              <Typography variant="h6" className={classes.text}>
                {t("common.myProperty")}
              </Typography>
            </Grid>
            <Grid container item xs={1} alignItems="center">
              <IconButton size="small" onClick={editProperty}>
                <EditIcon className={classes.iconEdit} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <PropertyPanel property={property} environmentBounds={environmentBounds} loading={loading} />
      </Grid>
    )
  }

  const getPolygonsList = () => {
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <Grid item className={classes.itemPadding}>
              <Typography variant="h6" className={classes.text}>
                {t("configuration.myPolygons")}
              </Typography>
            </Grid>
            {editMode &&
              <Grid item>
                <Button className={classes.buttonColorMarginZero} onClick={handleImportModal}>
                  <Typography variant="overline">{t("common.import")}</Typography>
                </Button>
              </Grid>
            }
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PredizaScrollBar customHeight={"calc(100vh - 280px)"}>
            <PolygonsEditList
              polygons={environmentPolygons}
              onChangeStep={onChangeStep}
              onClickPolygon={onClickPolygon}
              step={step}
              flagStep={flagStep}
              loading={loading}
              handleLoading={setLoading}
            />
          </PredizaScrollBar>
        </Grid>
        <Grid item xs={12}>
          {editMode
            ? <Grid container justifyContent="flex-end" alignItems="flex-end" className={classes.buttonContainer}>
              <Grid item>
                <Button className={classes.buttonColor} onClick={cancelEditMode}>{t("common.cancelButton")}</Button>
              </Grid>
              <Grid item>
                <Button className={classes.buttonColor} onClick={onConfirmCreatePolygons}>{t("common.saveButton")}</Button>
              </Grid>
            </Grid>
            : <Grid container style={{ height: "100%" }}>
              <Grid container item xs={12} justifyContent="center">
                <Button className={classes.buttonColor} onClick={onClickAddPolygon} disabled={loading}>{t("configuration.addPolygon")}</Button>
              </Grid>
              {/* TODO: Descomentar quando tiver funcionalidade */}
              {/* <Grid container item xs={12} justifyContent="center" className={classes.expandBtn}>
                <IconButton onClick={() => { }}>
                  <ExpandLess fontSize="small" />
                </IconButton>
              </Grid> */}
            </Grid>
          }
        </Grid>
      </Grid>
    )
  }

  const onClickPolygon = (polygon) => {
    setPolygon(polygon);
  }

  const backFromStep2 = () => {
    onChangeStep(1);
    GoogleMapStore.emit("polygon_stopDrawing");
  }

  const getPolygonsForm = () => {
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <Grid item className={classes.itemPadding}>
              <Typography variant="h6">
                {t("configuration.createPolygon")}
              </Typography>
            </Grid>
            <Grid item style={{ marginRight: "20px" }}>
              <Button className={classes.buttonColorMarginZero} onClick={handleImportModal}>
                <Typography variant="overline">{t("common.import")}</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <PredizaScrollBar customHeight={"calc(100vh - 240px)"}>
            <PolygonsEditList
              polygons={polygons}
              onChangeStep={onChangeStep}
              onClickPolygon={onClickPolygon}
              step={step}
              loading={loading}
              handleLoading={setLoading}
            />
          </PredizaScrollBar>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" alignItems="flex-end" className={classes.buttonContainer}>
            <Grid item>
              <Button className={classes.buttonColor} onClick={backFromStep2} disabled={loading}>{t("common.cancelButton")}</Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.buttonColor}
                onClick={onConfirmCreatePolygons}
                disabled={polygons.length === 0 || loading}
              >{t("common.saveButton")}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const getPropertyForm = () => {
    return (
      <Grid container spacing={3} className={classes.containerProperty}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" className={classes.text}>
                {step === 0 ? t("configuration.step1_drawerHeader") : t("configuration.step3_editProperty")}
              </Typography>
            </Grid>
            <Grid item>
              <Button className={classes.buttonColorMarginZero} onClick={handleImportModal}>
                <Typography variant="overline">{t("common.import")}</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {step === 0 &&
              <Grid item xs={12}>
                <Typography variant="body2" className={classes.text}>
                  {t("configuration.step1_drawerText")}
                </Typography>
              </Grid>
            }
            <PropertyForm
              onChange={onChangeProperty}
              formState={property}
              loading={loading}
              step={step}
              handleLogo={setEnvironmentLogoBase64}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" alignItems="flex-end" style={{ gap: "8px" }}>
            <Grid item>
              {step === 0
                ? <Button className={classes.buttonColor} onClick={clearPolygon} disabled={loading}>{t("configuration.step1_resetArea")}</Button>
                : <Button className={classes.buttonColor} onClick={() => cancelEditModeEnv(true)} disabled={loading}>{t("common.cancelButton")}</Button>
              }
            </Grid>
            <Grid item>
              <Button className={classes.buttonColor} onClick={onConfirmCreate} disabled={loading}>{t("common.confirmButton")}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openTutorial}
          onClose={handleCloseTutorial}
          classes={{ root: classes.tutorial }}
          key={'tutorial'}
        >
          <TutorialContent className={classes.tutorial} />
        </Snackbar>
        {getBody()}
      </Grid>
    </Drawer>
  )
}

export default ConfigurationDrawer;