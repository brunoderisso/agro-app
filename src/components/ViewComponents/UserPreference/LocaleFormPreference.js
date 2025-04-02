import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import PropTypes from "prop-types";

import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../../../styles/ViewComponents/UserPreference/LocaleFormPreference";
import TokenList from "../../../stores/CancelTokenList";
import CustomOutlineSelect from "../../Common/CustomOutlineSelect";
import geoStore from "../../../stores/GeoStore";
import { ConstantsUtils } from "../../../utils/constantsUtils";
import sessionStore from "../../../stores/SessionStore";
import stringsUtils from "../../../utils/stringsUtils";
import PhoneField from "../../Common/PhoneField";


function LocaleFormPreference(props) {
  const classes = styles();
  const tokenList = new TokenList();
  const { t } = useTranslation();

  const [formState, setFormState] = useState(null);
  const [countryIso2, setCountryIso2] = useState("");
  const [stateIso2, setStateIso2] = useState("");
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);

  const handleChangeRef = useRef(false);

  const languageOptions = [
    { value: "pt-BR", label: t("languages.portuguese") },
    { value: "en", label: t("languages.english") },
    { value: "es", label: t("languages.spanish") },
  ];

  useEffect(() => {
    if (props.locale) {
      const preference = sessionStore.getPreference();

      setFormState({
        country: ConstantsUtils.CountriesList.find(country => country.label === props.locale.country)?.value
          || ConstantsUtils.CountriesList[0].value,
        state: props.locale.state,
        city: props.locale.city ? stringsUtils.toCapitalize(props.locale.city.toLowerCase()) : "",
        mobilephone: props.locale.mobilephone,
        locale: preference?.locale?.length > 0 ? preference.locale : sessionStore.getLanguageStore()
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.locale])

  useEffect(() => {
    if (formState?.country?.length > 0 && !handleChangeRef.current) {
      setCountryIso2(formState.country);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  useEffect(() => {
    if (cities?.length > 0) {
      if (handleChangeRef.current) {
        if (typeof props.handleFormState === "function") {
          props.handleFormState({ ...formState, city: cities[0].value });
        }

        setFormState((prev) => ({ ...prev, city: cities[0].value }));
      } else {
        if (typeof props.handleFormState === "function") {
          props.handleFormState({
            ...formState,
            city: formState.city?.length > 0 ? formState.city : cities[0].value
          });
        }

        setFormState((prev) => ({
          ...prev,
          city: prev.city?.length > 0 ? prev.city : cities[0].value
        }));
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities])

  useEffect(() => {
    if (countryIso2?.length > 0) {
      setCities(null);
      getStates();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryIso2])

  useEffect(() => {
    if (stateIso2?.length > 0) {
      getCities(stateIso2);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateIso2])

  const getStates = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (typeof props.handleLoadingCities === "function") {
      props.handleLoadingCities(true);
    }

    setStates(null);
    geoStore.getGeoStates(cancelToken, countryIso2, responseGetStates);
  }

  const responseGetStates = (response) => {
    tokenList.remove(response.id);

    if (typeof props.handleLoadingCities === "function") {
      props.handleLoadingCities(false);
    }

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

    if (typeof props.handleLoadingCities === "function") {
      props.handleLoadingCities(true);
    }

    setCities(null);
    geoStore.getGeoCities(cancelToken, countryIso2, stateIso2, responseGetCities);
  }

  const responseGetCities = (response) => {
    tokenList.remove(response.id);

    if (typeof props.handleLoadingCities === "function") {
      props.handleLoadingCities(false);
    }

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

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "country") {
      handleChangeRef.current = true;
      setCountryIso2(value);
    }

    if (name === "mobilephone") {
      value = value.replaceAll("_", "").replaceAll("-", "").replaceAll("(", "").replaceAll(")", "").replaceAll(" ", "");
    }

    if (name === "state") {
      handleChangeRef.current = true;
      setStateIso2(states.find(state => state.value === value).value);
    }

    if (name === "country") {
      setFormState((prev) => ({ ...prev, [name]: value, state: "", city: "" }));
    } else if (name === "state") {
      setFormState((prev) => ({ ...prev, [name]: states.find(state => state.value === value).label }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }

    if (typeof props.handleFormState === "function") {
      props.handleFormState({ ...formState, [name]: value });
    }

  }

  return (
    <>
      {!props.loading
        ? <Grid container spacing={2}>
          <Grid item xs={6}>
            <CustomOutlineSelect
              value={countryIso2}
              handleValue={handleChange}
              name="country"
              label={t("common.country")}
              menuItems={ConstantsUtils.CountriesList}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomOutlineSelect
              value={stateIso2}
              handleValue={handleChange}
              name="state"
              label={t("common.state")}
              menuItems={states}
              disabled={!states}
              hasSearchInput={true}
              placeholderInput={t("common.searchState")}
            />

          </Grid>
          <Grid item xs={12}>
            <CustomOutlineSelect
              value={cities ? formState?.city : ""}
              handleValue={handleChange}
              name="city"
              label={t("common.city")}
              menuItems={cities}
              disabled={!cities}
              hasSearchInput={true}
              placeholderInput={t("common.searchCity")}
            />
          </Grid>
          <Grid item xs={6}>
            <PhoneField
              name="mobilephone"
              value={formState?.mobilephone}
              handleChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomOutlineSelect
              value={formState ? formState.locale : ""}
              handleValue={handleChange}
              name="locale"
              label={t("preference.interfaceLanguage")}
              menuItems={languageOptions}
            />
          </Grid>
        </Grid>
        : <Grid container>
          <Grid item xs={6} className={classes.spacing}>
            <Grid container>
              <Skeleton variant="text" width={"30%"} height={20} />
            </Grid>
            <Grid container>
              <Skeleton variant="text" width={"80%"} height={20} />
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.spacing}>
            <Grid container>
              <Skeleton variant="text" width={"30%"} height={20} />
            </Grid>
            <Grid container>
              <Skeleton variant="text" width={"80%"} height={20} />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Skeleton variant="text" width={"30%"} height={20} />
            </Grid>
            <Grid container>
              <Skeleton variant="text" width={"80%"} height={20} />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container>
              <Skeleton variant="text" width={"30%"} height={20} />
            </Grid>
            <Grid container>
              <Skeleton variant="text" width={"80%"} height={20} />
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  )
}

LocaleFormPreference.propTypes = {
  locale: PropTypes.object,
  handleFormState: PropTypes.func.isRequired,
  handleLoadingCities: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default LocaleFormPreference