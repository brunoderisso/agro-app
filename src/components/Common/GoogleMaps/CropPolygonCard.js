import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Card, Grid, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { Skeleton } from '@material-ui/lab';

import useStyles from '../../../styles/GoogleMaps/CropPolygonCard';
import { ConstantsUtils } from '../../../utils/constantsUtils';
import { ReactComponent as EditIcon } from '../../../img/EditIcon.svg';
import CustomStepper from '../CustomStepper';
import TokenList from "../../../stores/CancelTokenList"
import poligonStore from '../../../stores/PoligonStore';
import GoogleMapStore from '../../../stores/GoogleMapsStore';
import sessionStore from '../../../stores/SessionStore';


function CropPolygonCard(props) {
  const classes = useStyles();
  const tokenList = new TokenList();
  const { t } = useTranslation();

  const [phenologicalStage, setPhenologicalStage] = useState(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const tempPhenologicalStageRef = useRef(null);

  useEffect(() => {
    if (props.polygon?.crop?.phenological_stage) {
      const indexPhenologicalStage = props.polygon.crop.phenological_stage.findIndex(stage =>
        stage.objectid === props.polygon.crop.crop_phenological_stage);

      setActiveStageIndex(indexPhenologicalStage);
      setPhenologicalStage(props.polygon.crop.phenological_stage[indexPhenologicalStage]);
      tempPhenologicalStageRef.current = props.polygon.crop.phenological_stage[indexPhenologicalStage];
    }

  }, [props.polygon])

  const onClose = () => {
    if (typeof props.handleClose === "function") {
      props.handleClose(props.polygon);
    }
  }

  const checkPhenologicalStage = () => {
    setEditMode(false);

    if (props.polygon.crop?.phenological_stage) {
      const cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      const body = {
        ...props.polygon,
        crop: {
          ...props.polygon.crop,
          crop_phenological_stage: tempPhenologicalStageRef.current.objectid
        }
      }

      setLoading(true);
      poligonStore.updateCropPolygonConfiguration(cancelToken, body, (response) => responseCheckPhenologicalStage(response, body));
    }
  }

  const responseCheckPhenologicalStage = (response, polygon) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (response.data) {
      sessionStore.updateStoredPolygon(polygon);
      GoogleMapStore.emit("cropPolygonsProps_update", polygon);
      GoogleMapStore.emit("googleMapsError_set", "200");
    }

    if (response.status) {
      GoogleMapStore.emit("googleMapsError_set", response.status.toString());
    }
  }

  const handlePhenologicalStage = (stage) => {
    tempPhenologicalStageRef.current = stage;
  }

  const handleClick = (event) => {
    event.stopPropagation(); // Impede que o clique seja propagado para o mapa
  }

  return (
    <Card className={clsx(classes.containerCard, classes.gmPointerEvents)} onClick={handleClick}>
      {props.polygon
        ? <>
          <Grid className={classes.container}>
            <Grid container>
              <Grid item xs={10}>
                <Typography variant='overline' className={classes.outlineText}>{props.polygon.name}</Typography>
              </Grid>
              <Grid container item xs={2} alignItems='center' justifyContent='flex-end'>
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon className={classes.iconBt} />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: '8px' }}>
              <Typography variant='subtitle2' className={classes.defaultText}>
                {props.polygon.crop?.crop_name && props.polygon.crop?.crop_variety
                  ? `${props.polygon.crop.crop_name} ${props.polygon.crop.crop_variety}`
                  : t("common.noCrop")}
              </Typography>
            </Grid>
            {props.polygon.crop?.dae &&
              <Grid container>
                <Typography variant='subtitle2' className={classes.defaultText} style={{ fontSize: "12px" }}>
                  {`DAE: ${props.polygon.crop.dae}`}
                </Typography>
              </Grid>
            }
            {props.polygon.crop?.gdd &&
              <Grid container>
                <Typography variant='subtitle2' className={classes.defaultText} style={{ fontSize: "12px" }}>
                  {`GDD: ${props.polygon.crop.gdd.toFixed(2).replace(".", ",")}`}
                </Typography>
              </Grid>
            }
            {!editMode &&
              <Grid container style={{ margin: '8px 0' }}>
                <Grid item xs={10}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant='caption' className={classes.outlineText}>{t("advancedmap.phenologicalStage")}</Typography>
                    </Grid>
                    {loading
                      ? <Grid container>
                        <Skeleton variant="text" width={"20%"} height={20} />
                      </Grid>
                      : <Grid item xs={12}>
                        <Typography variant='caption' className={classes.defaultText}>
                          {phenologicalStage?.label || ConstantsUtils.NullFieldMask}
                        </Typography>
                      </Grid>
                    }
                  </Grid>
                </Grid>
                <Grid container item xs={2} justifyContent='flex-end' alignItems='center'>
                  <IconButton size="small" onClick={() => setEditMode(true)}>
                    <EditIcon />
                  </IconButton>
                </Grid>
              </Grid>
            }
          </Grid>
          {editMode &&
            <Grid className={classes.containerEditMode}>
              <Grid container className={classes.headerEditMode}>
                <Grid item xs={8}>
                  <Typography variant='caption' className={classes.outlineText}>{t("advancedmap.phenologicalStage")}</Typography>
                </Grid>
                <Grid container item xs={4}>
                  <IconButton size="small" onClick={() => setEditMode(false)}>
                    <CloseIcon className={classes.iconBt} />
                  </IconButton>
                  <IconButton size="small" onClick={checkPhenologicalStage} style={{ marginLeft: "auto" }}>
                    <DoneIcon className={classes.iconBt} />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid container style={{ margin: '8px 0 16px 0' }}>
                {props.polygon.crop?.phenological_stage
                  ? <CustomStepper
                    listSteppers={props.polygon.crop.phenological_stage}
                    handleChangeStep={handlePhenologicalStage}
                    activeStep={activeStageIndex}
                  />
                  : <Grid className={classes.headerEditMode}>
                    <Typography variant="caption" className={classes.defaultText}>{t("advancedmap.emptyPhenologicalStage")}</Typography>
                  </Grid>
                }
              </Grid>
            </Grid>
          }
        </>
        : <Grid container className={classes.container} spacing={1} style={{ paddingBottom: "8px" }}>
          <Grid item xs={12}>
            <Skeleton variant="text" width={"100%"} height={20} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width={"100%"} height={20} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width={"100%"} height={20} />
          </Grid>
        </Grid>
      }
    </Card>
  );
}

CropPolygonCard.propTypes = {
  polygon: PropTypes.object,
  handleClose: PropTypes.func,
};

export default CropPolygonCard;