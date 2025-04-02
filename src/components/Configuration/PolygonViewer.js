import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";

import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Typography, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import styles from "../../styles/Configuration/PolygonViewer";
import Canvas from "../Common/Canvas";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import stringsUtils from "../../utils/stringsUtils";
import polygonUtils from "../../utils/polygonUtils";
import { ConstantsUtils } from "../../utils/constantsUtils";
import tokens from "../../stores/CancelTokenList";
import noteStore from "../../stores/NoteStore";
import sessionStore from "../../stores/SessionStore";


function PolygonViewer(props) {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [polygon, setPolygon] = useState(null);
  const [crop, setCrop] = useState(null);
  const [phenologicalStage, setPhenologicalStage] = useState(null);
  const [loading, setLoading] = useState(false);

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

      GoogleMapStore.emit("polygon_center", polygon.polygon);

      if (foundedPolygon?.crop && foundedPolygon.crop.checked === undefined) {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoading(true);
        noteStore.getEnvCrop(polygon.crop.objectid, cancelToken, responseGetEnvCrop);
      } else if (foundedPolygon?.crop) {
        setCrop(foundedPolygon.crop);

        if (foundedPolygon.crop.phenological_stage?.length > 0) {
          setPhenologicalStage(foundedPolygon.crop.phenological_stage.find(stage =>
            stage.objectid === foundedPolygon.crop.crop_phenological_stage
          ));
        }
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon]);

  const responseGetEnvCrop = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      const cropResponse = response.data;

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

      setCrop(cropResponse);

      if (cropResponse.phenological_stage?.length > 0) {
        setPhenologicalStage(cropResponse.phenological_stage.find(stage => stage.objectid === cropResponse.crop_phenological_stage));
      }
    }
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
          <Grid item>
            <IconButton onClick={() => { props.setPolygon(null) }}>
              <ArrowBackIcon fontSize="small" className={classes.arrowIcon} />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {polygon?.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.margin}>
        <Grid container spacing={3}>
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <Grid item container alignItems="center" key={index}>
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
            ))
          }
          {!loading &&
            <>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("common.cultivate")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {polygon?.crop &&
                      <Typography variant="caption" className={classes.value}>
                        {t(`crop.${polygon.crop.crop_name}${polygon.crop.crop_variety.replaceAll(" ", "")}`)}
                      </Typography>
                    }
                    {!polygon?.crop && <Typography className={classes.label} variant="caption">{ConstantsUtils.NullFieldMask}</Typography>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("advancedmap.phenologicalStage")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.value}>
                      {phenologicalStage?.label || ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography variant="caption" className={classes.label}>{t("common.area")}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" className={classes.value}>
                          {polygon?.area
                            ? stringsUtils.formatToHa(polygonUtils.convertAreaToHa(polygon.area))
                            : ConstantsUtils.NullFieldMask}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Canvas height={40} width={40} pts={polygon?.polygon} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("common.plantingDate")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.value}>
                      {crop?.crop_planting_date
                        ? moment(crop.crop_planting_date).format("DD/MM/YYYY")
                        : ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("configuration.step3_polygonLine")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.value}>
                      {crop?.crop_spacing_line
                        ? `${crop.crop_spacing_line} m`
                        : ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("configuration.step3_polygonPlant")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.value}>
                      {crop?.crop_spacing_plant
                        ? `${crop.crop_spacing_plant} m`
                        : ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.label}>{t("configuration.step3_polygonPlantNumber")}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" className={classes.value}>
                      {crop?.crop_number_of_plants || ConstantsUtils.NullFieldMask}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PolygonViewer;