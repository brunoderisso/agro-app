import React, { useState, useEffect, useRef } from "react";
import InputMask from 'react-input-mask';
import { useTranslation } from "react-i18next";

import Grid from "@material-ui/core/Grid";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import { FormControl, TextField, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../../styles/Configuration/PropertyForm";
import toolsUtils from "../../utils/toolsUtils";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import { ConstantsUtils } from "../../utils/constantsUtils";
import { ReactComponent as InfoIcon } from "../../img/InfoIcon.svg";
import PredizaScrollBar from "../Common/PredizaScrollBar";
import tokens from "../../stores/CancelTokenList";
import geoStore from "../../stores/GeoStore";
import CustomOutlineSelect from "../Common/CustomOutlineSelect";
import ZipCodeField from "../Common/ZipCodeField";
import PhoneField from "../Common/PhoneField";


function PropertyForm(props) {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [countryIso2, setCountryIso2] = useState('');
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [formState, setFormState] = useState(null);
  const [initials, setInitials] = useState('AA');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flagNameError, setFlagNameError] = useState(false);
  const [textNameError, setTextNameError] = useState('');
  const [flagZipCodeError, setFlagZipCodeError] = useState(false);
  const [textZipCodeError, setTextZipCodeError] = useState('');
  const [flagStreetError, setFlagStreetError] = useState(false);
  const [textStreetError, setTextStreetError] = useState('');
  const [flagCityError, setFlagCityError] = useState(false);
  const [textCityError, setTextCityError] = useState('');
  const [flagDistrictError, setFlagDistrictError] = useState(false);
  const [textDistrictError, setTextDistrictError] = useState('');
  const [flagCountryError, setFlagCountryError] = useState(false);
  const [textCountryError, setTextCountryError] = useState('');
  const [flagEmailError, setFlagEmailError] = useState(false);
  const [textEmailError, setTextEmailError] = useState('');
  const [flagTelephoneError, setFlagTelephoneError] = useState(false);
  const [textTelephoneError, setTextTelephoneError] = useState('');

  const handleChangeRef = useRef(false);

  useEffect(() => {
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.formState) {
      setFormState(props.formState);
    }
  }, [props.formState])

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading])

  useEffect(() => {
    if (formState?.name?.length > 1) {
      setInitials(toolsUtils.getInitials(formState.name));
    }

    if (typeof props.onChange === "function") {
      props.onChange(formState);
    }

    if (formState?.name?.length > 0) {
      setFlagNameError(false);
      setTextNameError('');
    }

    if (formState?.zipcode?.length > 0) {
      setFlagZipCodeError(false);
      setTextZipCodeError('');
    }

    if (formState?.street?.length > 0) {
      setFlagStreetError(false);
      setTextStreetError('');
    }

    if (formState?.city?.length > 0) {
      setFlagCityError(false);
      setTextCityError('');
    }

    if (formState?.district?.length > 0) {
      setFlagDistrictError(false);
      setTextDistrictError('');
    }

    if (formState?.country?.length > 0) {
      if (!handleChangeRef.current) {
        setCountryIso2(formState.country);
      }

      setFlagCountryError(false);
      setTextCountryError('');
    }

    if (formState?.email?.length > 0) {
      setFlagEmailError(false);
      setTextEmailError('');
    }

    if (formState?.telephone?.length > 0) {
      setFlagTelephoneError(false);
      setTextTelephoneError('');
    }

    if (formState?.logo) {
      setImage("data:image/png;base64,".concat(formState.logo));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  useEffect(() => {
    if (countryIso2?.length > 0) {
      setCities(null);
      getStates();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryIso2])

  useEffect(() => {
    if (image && typeof props.handleLogo === "function") {
      props.handleLogo(image);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, props.handleLogo])

  useEffect(() => {
    if (cities?.length > 0) {
      if (handleChangeRef.current) {
        setFormState((prev) => ({ ...prev, city: cities[0].value }));
      } else {
        setFormState((prev) => ({ ...prev, city: prev.city.length > 0 ? prev.city : cities[0].value }));
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities])

  const bind = () => {
    GoogleMapStore.addListener("loading_update", setLoading);
    GoogleMapStore.addListener("propertyForm_check", handleFieldsError);
  }

  const clear = () => {
    GoogleMapStore.removeListener("loading_update", setLoading);
    GoogleMapStore.removeListener("propertyForm_check", handleFieldsError);
  }

  const getStates = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setStates(null);
    geoStore.getGeoStates(cancelToken, countryIso2, responseGetStates);
  }

  const responseGetStates = (response) => {
    tokenList.remove(response.id);

    if (response.data?.Items?.length > 0) {
      const states = response.data.Items.map(state => {
        return {
          label: state.name,
          value: state.iso2
        }
      });

      setStates(states);
    }
  }

  const getCities = (stateIso2) => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    setCities(null);
    geoStore.getGeoCities(cancelToken, countryIso2, stateIso2, responseGetCities);
  }

  const responseGetCities = (response) => {
    tokenList.remove(response.id);

    if (response.data?.Items?.length > 0) {
      const cities = response.data.Items.map(city => {
        return {
          value: city.name,
          label: city.name,
        }
      });

      setCities(cities);
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (!["street", "email"].includes(name)) {
      value = value.replaceAll("_", "").replaceAll("-", "").replaceAll("(", "").replaceAll(")", "");
    }

    if (name === "telephone") {
      value = value.replaceAll(" ", "");
    }

    if (name === "company_name") {
      value = value.replaceAll(".", "");
    }

    if (name === "country") {
      handleChangeRef.current = true;
      setCountryIso2(value);
    }

    if (name === "district") {
      handleChangeRef.current = true;
      getCities(states.find(state => state.value === value).value);
    }

    if (name === "country") {
      setFormState((prev) => ({ ...prev, [name]: value, district: "", city: "" }));
    } else if (name === "district") {
      setFormState((prev) => ({
        ...prev,
        [name]: { value, label: states.find(state => state.value === value)?.label || "" }
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  }

  const responseGetAddress = (response) => {
    if (response) {
      if (response.address.length > 0 && response.city.length > 0) {
        setFormState((prev) => ({ ...prev, street: response.address, city: response.city }));
      }
    }
  }

  const handleFieldsError = (property) => {
    if (property?.name?.length === 0) {
      setFlagNameError(true);
      setTextNameError(t("alert.fillInProperty"));
    }

    if (property?.zipcode?.length < 8) {
      setFlagZipCodeError(true);
      setTextZipCodeError(t("alert.fillInCEP"));
    }

    if (property?.street?.length === 0) {
      setFlagStreetError(true);
      setTextStreetError(t("alert.fillInAddress"));
    }

    if (property?.city?.length === 0) {
      setFlagCityError(true);
      setTextCityError(t("alert.fillInCity"));
    }

    if (property?.district?.length === 0) {
      setFlagDistrictError(true);
      setTextDistrictError(t("alert.fillInState"));
    }

    if (!property?.country || property?.country?.length === 0) {
      setFlagCountryError(true);
      setTextCountryError(t("alert.fillInCountry"));
    }

    if (property?.email?.length === 0) {
      setFlagEmailError(true);
      setTextEmailError(t("alert.fillInEmail"));
    }

    if (property?.telephone?.length < 11) {
      setFlagTelephoneError(true);
      setTextTelephoneError(t("alert.fillInPhone"));
    }
  }

  return (
    <>
      <Grid item xs={12}>
        <Grid container justifyContent="flex-start" alignItems="center" style={{ gap: "12px" }}>
          <Grid item xs={1}>
            <InfoIcon className={classes.iconConfig} />
          </Grid>
          <Grid item xs={10}>
            <Typography variant="caption" className={classes.outlineText}>
              {t("configuration.step1_drawerWarning")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <PredizaScrollBar customHeight={props.step === 0 ? "calc(100vh - 340px)" : "calc(100vh - 285px)"}>
        <Grid item xs={12}>

          <Grid container spacing={2} className={classes.container}>
            {loading &&
              <>
                <Grid item container>
                  <Grid item xs={2}>
                    <Skeleton variant="circle" width={40} height={40} />
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container >
                      <Grid item xs={12}>
                        <Skeleton variant="text" height={10} width={"80%"} />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="text" height={10} width={"40%"} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Grid container style={{ margin: "12px 0 12px 0" }} alignItems="center" key={index}>
                    <Grid item xs={12}>
                      <Grid container>
                        <Grid item xs={12}>
                          <Skeleton variant="text" height={10} width={"80%"} />
                        </Grid>
                        <Grid item xs={12}>
                          <Skeleton variant="text" height={10} width={"40%"} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </>
            }
            {!loading &&
              <form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <div className={classes.badge}>
                          <Badge
                            overlap="circle"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={
                              <IconButton size="small" className={classes.iconButton} component="label">
                                <EditIcon fontSize="inherit" className={classes.iconColor} />
                                <input
                                  type="file"
                                  accept="image/jpeg, image/png"
                                  style={{ display: 'none' }}
                                  onChange={handleImageChange}
                                />
                              </IconButton>
                            }
                          >
                            <Avatar src={image} className={classes.avatar}>
                              {!image && <Typography variant="subtitle2" className={classes.avatarText}>{initials}</Typography>}
                            </Avatar>
                          </Badge>
                        </div>
                      </Grid>
                      <Grid item xs={9}>
                        <TextField
                          label={`* ${t("management.myProperties_propertyName")}`}
                          name="name"
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                            className: classes.textFieldLabel
                          }}
                          value={formState?.name}
                          onChange={handleChange}
                          className={classes.inputs}
                          variant="outlined"
                          fullWidth
                          error={flagNameError}
                          helperText={textNameError}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <ZipCodeField
                      value={formState?.zipcode}
                      handleChange={handleChange}
                      responseBlur={responseGetAddress}
                      flagError={flagZipCodeError}
                      textError={textZipCodeError}
                      country={countryIso2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={`* ${t("common.address")}`}
                      name="street"
                      InputLabelProps={{
                        shrink: true,
                        className: classes.textFieldLabel
                      }}
                      size="small"
                      value={formState?.street}
                      onChange={handleChange}
                      className={classes.inputs}
                      variant="outlined"
                      fullWidth
                      error={flagStreetError}
                      helperText={textStreetError}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <CustomOutlineSelect
                        name="country"
                        value={formState?.country || countryIso2}
                        handleValue={handleChange}
                        label={t(`* ${t("common.country")}`)}
                        menuItems={ConstantsUtils.CountriesList}
                        error={flagCountryError}
                        helperText={textCountryError}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <CustomOutlineSelect
                        name="district"
                        value={formState?.district?.value || ""}
                        handleValue={handleChange}
                        label={`* ${t("common.state")}`}
                        menuItems={states}
                        error={flagDistrictError}
                        helperText={textDistrictError}
                        disabled={!states}
                        hasSearchInput={true}
                        placeholderInput={t("common.searchState")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" size="small">
                      <CustomOutlineSelect
                        name="city"
                        value={formState?.city || ""}
                        handleValue={handleChange}
                        label={`* ${t("common.city")}`}
                        menuItems={cities}
                        error={flagCityError}
                        helperText={textCityError}
                        disabled={!cities}
                        hasSearchInput={true}
                        placeholderInput={t("common.searchCity")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={`* ${t("common.email")}`}
                      name="email"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                        className: classes.textFieldLabel
                      }}
                      value={formState?.email}
                      onChange={handleChange}
                      className={classes.inputs}
                      variant="outlined"
                      fullWidth
                      error={flagEmailError}
                      helperText={textEmailError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PhoneField
                      name="telephone"
                      value={formState?.telephone}
                      handleChange={handleChange}
                      flagError={flagTelephoneError}
                      textError={textTelephoneError}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputMask mask="999.999.999.999-9"
                      name="company_name"
                      size="small"
                      value={formState?.company_name}
                      onChange={handleChange}
                    >
                      {(inputProps) =>
                        <TextField
                          label={t("common.producerNumber")}
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
                  </Grid>
                </Grid>
              </form>
            }
          </Grid>
        </Grid>
      </PredizaScrollBar>
    </>
  )
}

export default PropertyForm;