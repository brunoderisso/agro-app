import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import Grid from "@material-ui/core/Grid";
import { Button, IconButton, TextField, Typography } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';

import useStyles from "../../styles/Configuration/PolygonCard";
import Canvas from "../Common/Canvas";
import { ReactComponent as DeleteIcon } from '../../img/DeleteIcon.svg';
import GoogleMapStore from "../../stores/GoogleMapsStore";
import CustomStandardSelect from "../Common/CustomStandardSelect";
import noteStore from "../../stores/NoteStore";


const comparePolygons = (polygon1, polygon2) => {
  const polygon1Copy = { ...polygon1 };
  const polygon2Copy = { ...polygon2 };

  delete polygon1Copy.ref;
  delete polygon2Copy.ref;

  return JSON.stringify(polygon1Copy) === JSON.stringify(polygon2Copy);
}

function PolygonCard(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [polygon, setPolygon] = useState(props.polygon);

  const polygonRef = useRef(polygon);

  useEffect(() => {
    if (props.polygon) {
      const coordinates = [];

      if ((props.step === 2 || props.polygon.objectid.includes("new")) && props.polygon.ref) {
        const path = props.polygon.ref.getPath();

        if (path) {
          for (let i = 0; i < path.getLength(); i++) {
            const point = path.getAt(i);
            coordinates.push([point.lng(), point.lat()]);
          }
          coordinates.push(coordinates[0]);
        }
      } else if (props.polygon.polygon?.length > 0) {
        props.polygon.polygon.forEach(coordinate => {
          coordinates.push(coordinate);
        });
      }

      setPolygon((prevPolygon) => ({
        ...prevPolygon,
        polygon: coordinates,
        objectid: props.polygon.objectid,
        name: props.polygon.name,
        crop_objectid: props.polygon.crop_objectid,
      }));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.polygon])

  useEffect(() => {
    if (props.crops?.length > 0) {
      noteStore.storeCropsList(props.crops.map(crop => {
        return {
          value: crop.objectid,
          label: t(`crop.${crop.name}${crop.variety.replaceAll(" ", "")}`)
        }
      }));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.crops])

  useEffect(() => {
    polygonRef.current = polygon;

    if (!comparePolygons(polygon, props.polygon)) {
      props.onChange(polygon, props.index);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygon])

  const changeName = (e) => {
    setPolygon({ ...polygon, name: e.target.value });
  }

  const handleChangeCrop = (event) => {
    setPolygon({ ...polygon, crop_objectid: event.target.value });
  }

  const deletePolygon = () => {
    GoogleMapStore.emit("polygonsList_subtract", polygon)
    if (typeof props.subtractPolygons === "function") {
      props.subtractPolygons(polygon);
    }
  }

  const onClickViewPolygon = (polygon) => {
    props.onClickPolygon({ ...polygon, mode: 0 });
  }

  const onClickEditPolygon = (polygon) => {
    props.onClickPolygon({ ...polygon, mode: 1 });
  }

  return (
    <Grid item xs={12} className={classes.polygonCard}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Canvas height={40} width={40} pts={polygon.polygon} />
        </Grid>
        <Grid item xs={props.step === 2 || props.polygon.objectid.includes("new") ? 9 : 7}>
          <Grid container>
            <Grid item xs={12}>
              {!props.polygon.objectid.includes("new")
                ? (
                  <Typography className={classes.textColor} variant="body2">
                    {polygon.name}
                    {polygon.objectid === "environment" && t("common.environment")}
                  </Typography>
                )
                : (
                  <TextField
                    className={classes.textFields}
                    defaultValue={t("configuration.newPolygon")}
                    value={polygon.name || t("configuration.newPolygon")}
                    onChange={changeName}
                    size="small"
                  />
                )
              }
            </Grid>
            <Grid item xs={12}>
              {!props.polygon.objectid.includes("new")
                ? (
                  <Typography className={classes.textCaption} variant="caption">
                    {polygon.crop && t(`crop.${polygon.crop.crop_name}${polygon.crop.crop_variety.replaceAll(" ", "")}`)}
                    {!polygon.crop && t("common.noCrop")}
                  </Typography>
                )
                : (
                  <CustomStandardSelect
                    value={polygon.crop_objectid}
                    handleValue={handleChangeCrop}
                    label={polygon.crop_objectid ? "" : t("common.crop")}
                    menuItems={noteStore.getCropsList()}
                  />
                )
              }
            </Grid>
          </Grid>
        </Grid>
        {props.polygon.objectid.includes("new") &&
          <Grid item xs={1}>
            <Button
              onClick={deletePolygon}
              className={classes.iconButton}
            >
              <DeleteIcon />
            </Button>
          </Grid>
        }
        {!props.polygon.objectid.includes("new") && props.step === 3 &&
          <Grid item className={classes.buttonsContainer} xs={3}>
            <IconButton size="small" onClick={() => { onClickViewPolygon(polygon) }}>
              <VisibilityIcon className={classes.iconColor} />
            </IconButton>
            <IconButton size="small" onClick={() => { onClickEditPolygon(polygon) }}>
              <EditIcon className={classes.iconColor} />
            </IconButton>
          </Grid>
        }
      </Grid>
    </Grid>
  )
}

export default PolygonCard;
