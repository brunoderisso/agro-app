import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Avatar, Grid, Grow, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import useStyles from '../../styles/Configuration/PropertyForm';
import EnvironmentStore from '../../stores/EnvironmentStore';
import SessionStore from '../../stores/SessionStore';
import TokenList from '../../stores/CancelTokenList';
import toolsUtils from '../../utils/toolsUtils';
import Canvas from '../Common/Canvas';
import GoogleMapStore from '../../stores/GoogleMapsStore';
import { ConstantsUtils } from '../../utils/constantsUtils';
import masksUtils from '../../utils/masksUtils';
import stringsUtils from '../../utils/stringsUtils';
import polygonUtils from '../../utils/polygonUtils';


function PropertyConfirmForm() {
  const classes = useStyles();
  const { t } = useTranslation();
  const tokenList = new TokenList();

  const [environment, setEnvironment] = useState(null);

  useEffect(() => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    EnvironmentStore.getEnvironmentAccount(SessionStore.getEnvironment(), responseGetEnvironment);
    EnvironmentStore.getEnvironmentPreferences(cancelToken, responseGetPreferences);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log(environment);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environment]);

  const responseGetEnvironment = (response) => {
    if (response) {
      SessionStore.updateStoredEnvironments(response);
      GoogleMapStore.emit("environmentPolygon_update", response.polygon);
      setEnvironment((prev) => ({ ...prev, ...response }));
    }
  }

  const responseGetPreferences = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      setEnvironment((prev) => ({ ...prev, ...response.data }));
    }
  }

  return (
    <Grid container spacing={1}>
      {!environment &&
        <>
          <Grid item container style={{ marginBottom: "12px" }} alignItems="flex-start">
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
          {Array.from({ length: 4 }).map((_, index) => (
            <Grid container style={{ margin: "12px" }} alignItems="center" key={index}>
              <Grid item xs={6}>
                <Grid container >
                  <Grid item xs={12}>
                    <Skeleton variant="text" height={10} width={"80%"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton variant="text" height={10} width={"40%"} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container >
                  <Grid item xs={12}>
                    <Skeleton variant="text" height={10} width={"80%"} />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton variant="text" height={10} width={"40%"} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </>
      }
      {environment &&
        <>
          <Grow in={Boolean(environment.name)}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <div className={classes.badge}>
                    <Avatar className={classes.avatar}>
                      <Typography variant="subtitle2" className={classes.textColor}>
                        {environment.name && toolsUtils.getInitials(environment.name)}
                      </Typography>
                    </Avatar>
                  </div>
                </Grid>
                <Grid item>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant='body1' className={classes.textColor}>{environment.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption'>
                        {environment.area
                          ? stringsUtils.formatToHa(polygonUtils.convertAreaToHa(environment.area))
                          : ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Canvas pts={environment.polygon} height={60} width={120} />
                </Grid>
              </Grid>
            </Grid>
          </Grow>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grow in={Boolean(environment.description)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                        {t("common.description")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.description || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.description)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                        {t("common.producerNumber")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.company_name ? masksUtils.formatProducerRegistration(environment.company_name) : ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.street)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.address")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.street || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.zipcode)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.CEP")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.zipcode ? masksUtils.formatZipCode(environment.zipcode) : ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.city)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.city")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.city || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.district)}>
                <Grid item xs={4}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.state")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.district || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.country)}>
                <Grid item xs={2}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.country")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.country
                          ? ConstantsUtils.CountriesList.find(country => country.value === environment.country).label
                          : ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.email)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.email")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.email || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
              <Grow in={Boolean(environment.telephone)}>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={classes.outlineText} variant='caption'>
                      {t("common.phone")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.textColor} variant='caption'>
                        {environment.telephone || ConstantsUtils.NullFieldMask}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grow>
            </Grid>
          </Grid>
        </>
      }
    </Grid>
  );
}

export default PropertyConfirmForm;