import React, { useState, useEffect, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import { Skeleton } from "@material-ui/lab";

import PolygonCard from "./PolygonCard";
import styles from "../../styles/Configuration/PolygonsEditList";
import NoteStore from "../../stores/NoteStore";
import tokens from "../../stores/CancelTokenList";
import GoogleMapStore from "../../stores/GoogleMapsStore";
import PoligonStore from "../../stores/PoligonStore";
import sessionStore from "../../stores/SessionStore";


function PolygonsEditList(props) {
  const classes = styles();
  const tokenList = new tokens();

  const [polygons, setPolygons] = useState([]);
  const [crops, setCrops] = useState([]);
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(false);

  const polygonsRef = useRef(null);
  const stepRef = useRef(null);

  useEffect(() => {
    const bind = () => {
      GoogleMapStore.addListener("polygonsMap_create", onCreatePolygons);
      GoogleMapStore.addListener("editMode_cancel", onCancelEditMode);
      sessionStore.addListener("polygons_stored", () => setLoading(false));
    }
    const clear = () => {
      GoogleMapStore.removeListener("polygonsMap_create", onCreatePolygons);
      GoogleMapStore.removeListener("editMode_cancel", onCancelEditMode);
      sessionStore.removeListener("polygons_stored", () => setLoading(false));
    }
    bind();

    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (!NoteStore.getCropsList()) {
      NoteStore.getCrops(cancelToken, responseGetCrops);
    }

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setStep(props.step);
  }, [props.step])

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading])

  useEffect(() => {
    if (props.flagStep) {
      setPolygons(props.polygons);
    } else {
      mergePolygons(props.polygons);
    }
  }, [props.polygons, props.flagStep])

  useEffect(() => {
    polygonsRef.current = polygons;
  }, [polygons])

  useEffect(() => {
    stepRef.current = step;
  }, [step])


  const onCancelEditMode = () => {
    let polygons = polygonsRef.current;

    polygons = polygons.filter((p)=>{ return !(p.objectid.includes("new"))});
    setPolygons(polygons);
  }

  const onCreatePolygons = () => {
    let pols = filterPolygonFields(polygonsRef.current);

    if (pols.length === 0) {
      return;
    }

    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    if (typeof props.handleLoading === 'function') {
      props.handleLoading(true);
    }

    setLoading(true);
    PoligonStore.savePolygonsConfiguration(pols, cancelToken, responsePostPolygons);
  }

  const responsePostPolygons = (response) => {
    tokenList.remove(response.id);
    setLoading(false);

    if (typeof props.handleLoading === 'function') {
      props.handleLoading(false);
    }

    if (response.data) {
      if (stepRef.current === 2) {
        props.onChangeStep(4);
      }

      sessionStore.storePolygons(true);

      if (response.data.status === 200) {
        return;
      }

      GoogleMapStore.emit("googleMapsError_set", "200");
    }

    if (response.status) {
      GoogleMapStore.emit("googleMapsError_set", response.status.toString());
    }
  }

  const filterPolygonFields = (polygons) => {
    return polygons
      .filter(({ objectid }) => objectid.includes("new"))
      .map(({ name, polygon, crop_objectid }) => ({
        name,
        polygon,
        crop_objectid
      }));
  }

  const mergePolygons = (newPolygons) => {
    setPolygons((prevPolygons) => {
      const polygonMap = new Map(prevPolygons.map(p => [p.objectid, p]));

      newPolygons.forEach((newPolygon) => {
        const existingPolygon = polygonMap.get(newPolygon.objectid);
        polygonMap.set(newPolygon.objectid, {
          ...existingPolygon,
          ...newPolygon
        });
      });

      const sortedPolygons = [];
      const others = [];

      // Separar os polígonos que têm "new" no objectid e os que não têm
      polygonMap.forEach((polygon) => {
        if (polygon.objectid.includes("new")) {
          sortedPolygons.unshift(polygon);
        } else {
          others.push(polygon);
        }
      });

      // Combine as listas, garantindo que os "new" estejam no início
      return [...sortedPolygons, ...others];
    });
  }

  const responseGetCrops = (response) => {
    tokenList.remove(response.id);
    if (response.data) {
      setCrops(response.data);
    }
  }

  const onChangePolygon = (updatedPolygon, index) => {
    setPolygons(prevPolygons => {
      const newPolygons = [...prevPolygons];
      newPolygons[index] = updatedPolygon;
      return newPolygons;
    });
  }

  const subtractPolygons = (polygon) => {
    setPolygons(prevPolygons => {
      const indexPolygon = prevPolygons.findIndex(pol => pol.objectid === polygon.objectid);
      prevPolygons.splice(indexPolygon, 1);

      const newPolygons = [...prevPolygons];

      return newPolygons;
    })
  }

  return (
    <Grid container className={classes.container}>
      {loading &&
        [...Array(4)].map((_, index) => (
          <Grid container style={{ margin: "24px" }} alignItems="center" key={index}>
            <Grid item xs={2}>
              <Skeleton variant="circle" width={40} height={40} />
            </Grid>
            <Grid item xs={10}>
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
        ))
      }
      {!loading && polygons.map((polygon, index) => (
        <PolygonCard
          key={polygon.objectid}
          polygon={polygon}
          index={index}
          onChange={onChangePolygon}
          subtractPolygons={subtractPolygons}
          crops={crops}
          step={step}
          onClickPolygon={props.onClickPolygon}
        />
      ))}
    </Grid>
  )
}

export default PolygonsEditList;