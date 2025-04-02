import React, { useState, useEffect } from "react";

//material ui
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagModal";
import Modal from "@material-ui/core/Modal";

import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import MomentUtils from "@date-io/date-fns";
import { format } from "date-fns";
import moment from "moment";

import localeES from 'date-fns/locale/es';
import localeEN from "date-fns/locale/en-US";
import localePT from "date-fns/locale/pt-BR";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import NoteStore from "../../../stores/NoteStore";
import SessionStore from "../../../stores/SessionStore";
import PredizaAlertDialog from "../../PredizaAlertDialog";
import TokenList from "../../../stores/CancelTokenList";
import Scrollbars from "react-custom-scrollbars";
import { useTranslation } from "react-i18next";

export default withStyles(styles)(function NotebookTagForm(props) {
  const [polygons, setPolygons] = useState([]);
  const [crops, setCrops] = useState([]);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState(false);
  const [tag, setTag] = useState({});
  const [muiLng, setMuiLng] = useState({})
  const { classes } = props;
  const tokenList = new TokenList();

  const { t, i18n: { language } } = useTranslation();

  useEffect(() => {
    getPolygons();
    getEnvCrops();

    const serializeLanguage = language[0] + language[1];

    if (serializeLanguage.toLocaleLowerCase() === "pt") {
      setMuiLng(localePT)
    }
    if (serializeLanguage.toLocaleLowerCase() === "en") {
      setMuiLng(localeEN)
    }
    if (serializeLanguage.toLocaleLowerCase() === "es") {
      setMuiLng(localeES)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(props.open);
    setTag({
      environmentobjectid: props.environment.objectid,

      producedat: new Date(),
      validuntil: new Date().setDate(new Date().getDate() + 30),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  useEffect(() => {
    if (props.environment && tag.environmentcrop) {
      let prop = props.environment.name.split(" ");
      if (prop.lenght > 1) {
        prop = prop[0][0].toUpperCase() + prop[1][0].toUpperCase();
      } else {
        prop = prop[0][0].toUpperCase();
      }

      let crop = crops.filter((crop) => {
        return crop.objectid === tag.environmentcrop;
      });

      crop =
        crop[0].crop_name[0].toUpperCase() +
        crop[0].crop_variety[0].toUpperCase();

      setTag({
        ...tag,
        batch: prop + crop + format(new Date(), "yyyyMMdd"),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag.environmentcrop]);


  useEffect(() => {
    if (open) {
      if (polygons.length === 0) {
        setMessage(t('notebook.tags_registerFieldRequired'));
        return;
      }

      if (crops.length === 0) {
        setMessage(t('notebook.tags_associateCultivarToField'));
        return;
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const getPolygons = () => {
    let pols = SessionStore.getDataLocalStorage("polygons");

    pols = pols.filter((pol) => {
      return !pol.isenvironment;
    });
    setPolygons(pols);
  };

  const getEnvCrops = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    NoteStore.getEnvCrops(cancelToken, responseGetCrops);
  };

  const clearMessage = () => {
    setMessage("");
    props.close();
  };

  const responseGetCrops = (response) => {
    tokenList.remove(response.id);

    setCrops(response.data);
  };

  const handleChange = (attr) => (event) => {
    if (attr === "netweight") {
      setTag({
        ...tag,
        netweight: parseFloat(event.target.value),
      });
      return;
    }
    if (attr === "talhao") {
      setTag({
        ...tag,
        polygonobjectid: event.target.value,
        environmentcrop: polygons.filter((value) => {
          return value.objectid === event.target.value;
        })[0].crop.objectid,
      });
      return;
    }

    setTag({
      ...tag,
      [attr]: event.target.value,
    });
  };

  const handleDateChange = (type) => (date) => {
    if (type === "V") {
      setTag({
        ...tag,
        validuntil: date,
      });
    }
    if (type === "F") {
      setTag({
        ...tag,
        producedat: date,
      });
    }
  };

  const apply = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    let t = {
      ...tag,
      validuntil: moment(tag.validuntil).toISOString(true),
      producedat: moment(tag.producedat).toISOString(true),
    };

    NoteStore.addTag(
      t,
      props.environment.objectid,
      cancelToken,
      responseAddTag
    );
  };

  const responseAddTag = (response) => {
    tokenList.remove(response.id);

    if (
      response.data !== "" &&
      response.data !== undefined &&
      response.data !== null
    ) {
      setDialog(true);
    }
  };

  const onClose = () => {
    NoteStore.emitAddTag();
    setDialog(false);
    setTag({});
    props.close();
  };
  const thumb = () => {
    return <Grid id={"thumb"} className={classes.thumb}></Grid>;
  };

  const body = (
    <div className={classes.paper}>
      <Grid container>
        <PredizaAlertDialog
          method={"alert"}
          title={t('notebook.tags_tagSuccessfullyAdded')}
          open={dialog}
          close={onClose}
        />
        <Grid item xs={12} className={classes.modalTitle}>
          <Grid container>
            <Grid item xs={10}>
              {t("common.addTag")}
            </Grid>
            <Grid item xs={2}>
              <IconButton
                aria-label="delete"
                className={classes.closeButton}
                onClick={() => {
                  props.close();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={classes.formContainer}>
          <Scrollbars
            style={{ width: "385px", height: "420px" }}
            renderThumbVertical={thumb}
            className={classes.scrollList}
          >
            <Grid container style={{ paddingRight: "20px" }}>
              <Grid item xs={12} className={classes.spacing}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("common.property")}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      id="outlined-disabled"
                      defaultValue={props.environment.name || ""}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.spacing}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("common.plot")}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={tag.polygonobjectid || ""}
                        onChange={handleChange("talhao")}
                      >
                        <MenuItem key={"nonee"} value="">
                          <em>{t("common.none")}</em>
                        </MenuItem>
                        {polygons.map((pol) => {
                          return (
                            <MenuItem key={pol.objectid} value={pol.objectid}>
                              {pol.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.spacing}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("common.cultivate")}:
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={tag.environmentcrop || ""}
                        disabled
                        onChange={handleChange("environmentcrop")}
                      >
                        <MenuItem key={"none"} value={""}>
                          <em>None</em>
                        </MenuItem>
                        {crops.map((crop) => {
                          return (
                            <MenuItem key={crop.objectid} value={crop.objectid}>
                              {crop?.crop_name.toUpperCase() +
                                " " +
                                crop?.crop_variety.toUpperCase()}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.spacing}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("notebook.tags_netWeight")}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl className={classes.formControl}>
                      <Input
                        id="standard-adornment-weight"
                        value={tag.netweight || ""}
                        step={0.1}
                        type={"number"}
                        onChange={handleChange("netweight")}
                        required
                        endAdornment={
                          <InputAdornment position="end">g</InputAdornment>
                        }
                        aria-describedby={t('notebook.tags_netWeight')}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={muiLng}>
                  <KeyboardDatePicker
                    fullWidth
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("notebook.tags_manufacturingDate")}
                    value={tag.producedat}
                    onChange={handleDateChange("F")}
                    KeyboardButtonProps={{
                      "aria-label": t("notebook.tags_manufacturingDate"),
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={muiLng}>
                  <KeyboardDatePicker
                    fullWidth
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label={t("common.dueDate")}
                    value={tag.validuntil}
                    onChange={handleDateChange("V")}
                    KeyboardButtonProps={{
                      "aria-label": t("common.dueDate"),
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("common.batch")}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleChange("batch")}
                      id="standard-basic"
                      label={t("notebook.tags_batchNumber")}
                      value={tag.batch || ""}
                      fullWidth
                      error={tag.batch === ""}
                      helperText={t("alert.requiredToFillIn")}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={12}>
                    {t("notebook.tags_barcode")}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleChange("gs1128code")}
                      id="standard-basic"
                      value={tag.gs1128code || ""}
                      fullWidth
                      error={tag.batch === ""}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginTop: "10px" }}>
                <Grid container>
                  <Grid item xs={12}>
                    {t('common.details')}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={handleChange("details")}
                      id="standard-basic"
                      value={tag.details || ""}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Scrollbars>
        </Grid>

        <Grid item xs={12} className={classes.center}>
          <Button
            variant="contained"
            color="primary"
            onClick={apply}
            className={classes.addButton}
          >
            {t('common.addButton')}
          </Button>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <div>
      <PredizaAlertDialog
        method={"alert"}
        title={message}
        open={message.length > 0}
        close={clearMessage}
      />
      {tag.validuntil !== undefined && (
        <Modal
          open={open}
          onClose={props.close}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
      )}
    </div>
  );
});
