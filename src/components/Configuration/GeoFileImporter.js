import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import JSZip from 'jszip';
import { parseString } from 'xml2js';

import { Grid, Typography, Paper } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

import PolygonStore from "../../stores/PoligonStore";
import toolsUtils from '../../utils/toolsUtils';
import { useStyles } from '../../styles/Common/GeoFileImporter';


function GeoFileImporter(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [importedPolygons, setImportedPolygons] = useState([]);

  useEffect(() => {
    if (importedPolygons.length > 0 && typeof props.onChange === 'function') {
      props.onChange(importedPolygons);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedPolygons]);

  useEffect(() => {
    if (file) {
      readFile(file);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleLoadFile = (file) => {
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  }

  const extractPolygons = (placemarks) => {
    const results = [];

    for (const object of placemarks) {
      const name = object.name[0];
      const coordinateString = object?.Polygon[0]?.outerBoundaryIs[0]?.LinearRing[0]?.coordinates[0];
      const coordinateArrayString = coordinateString.trim().split(/\s+/);
      const coordinateFloat = coordinateArrayString.map(coord => {
        const [lng, lat] = coord.split(',').map(parseFloat);
        return [lng, lat];
      });

      results.push({ name, path: coordinateFloat });
    }

    return results;
  }

  const extractPoints = (placemarks) => {

    const coordinates = [];

    for (const object of placemarks) {
      const coordinatesString = object.Point[0].coordinates[0];
      const [lng, lat] = coordinatesString.split(',').map(parseFloat);

      coordinates.push([lng, lat]);
    }

    return [{ name: "assets", path: coordinates }];
  }

  const extractLines = (placemarks) => {
    const results = [];

    for (const object of placemarks) {
      const name = object.name[0];
      const coordinatesString = object.LineString[0].coordinates[0];
      const coordinatesArrayString = coordinatesString.trim().split(/\s+/);
      const convertedCoordinates = coordinatesArrayString.map(coordinate => {
        const [lng, lat] = coordinate.split(',').map(parseFloat);

        return [lng, lat];
      });

      results.push({ name, path: convertedCoordinates });
    }

    return results;
  }

  const sortPolygons = (polygons) => {
    const polsByArea = [];
    const sortedPols = [];

    polygons.forEach(pol => {
      polsByArea.push({
        name: pol.name,
        area: PolygonStore.computeAreaGauss(pol.path)
      })
    });

    polsByArea.sort((a, b) => { return b.area - a.area });
    polsByArea.forEach(polByArea => {
      sortedPols.push(polygons.filter(pol => { return pol.name === polByArea.name })[0]);
    });

    return sortedPols;
  }

  const findFileData = (data) => {
    //diretorio comum a todos formatos
    if (data.kml && data.kml.Document) {
      const doc = data.kml.Document[0];

      //FOLDER
      if (doc && doc.Folder) {
        const folder = data.kml.Document[0].Folder[0];

        if (folder && folder.Placemark) {
          const placemarks = folder.Placemark;

          if (placemarks && placemarks.length > 0) {
            const keys = Object.keys(placemarks[0]);

            //Verifica se são poligonos ou pontos
            if (keys.includes('Polygon')) {
              let polygons = extractPolygons(placemarks);

              if (polygons.length > 0) {
                const sortedPols = sortPolygons(polygons);

                setImportedPolygons(sortedPols);

                return;
              }
            } else if (keys.includes('Point')) {
              const points = extractPoints(placemarks);

              setImportedPolygons(points);
            }
          }
        }
      }
      //NO FOLDER
      if (doc && doc.Placemark) {
        const placemarks = doc.Placemark;

        if (placemarks && placemarks.length > 0) {
          const keys = Object.keys(placemarks[0]);

          if (keys.includes('LineString')) {
            const polygons = extractLines(placemarks);

            setImportedPolygons(polygons);
          }
        }
      }
    }
    return;
  }

  const extractXML = (string) => {
    let data = null;

    //Parse XML 2 JSON
    parseString(string, function (err, result) {
      if (err) {
        console.log(err);
        return
      }
      data = result;
    });
    if (data) {
      findFileData(data);
    }
  }

  const readKMZ = async (file) => {
    const zip = new JSZip();
    const zipFile = await zip.loadAsync(file); // Carregar o arquivo KMZ

    // Extrair os arquivos do KMZ
    zipFile.forEach(async (_, zipEntry) => {
      if (!zipEntry.dir) {
        const content = await zipEntry.async("string");
        // Faz algo com o conteúdo do arquivo extraído
        extractXML(content);
      }
    });
  }

  const parseCoordinates = (inputString) => {
    const coordinatesArray = inputString.trim().split(/\s+/); // Divide a string em elementos separados por espaços
    const resultArray = [];

    for (const coord of coordinatesArray) {
      const [longitude, latitude] = coord.split(',').map(Number);

      if (longitude && latitude) {
        resultArray.push([longitude, latitude]);
      }
    }

    return resultArray;
  }

  const readKML = (kmlContent) => {
    const parser = new DOMParser();
    const kmlDocument = parser.parseFromString(kmlContent, "text/xml");

    const placemarks = kmlDocument.querySelectorAll("Placemark");
    const polygons = [];

    placemarks.forEach(placemark => {
      let name = "";

      if (placemark.querySelector("name")) {
        name = placemark.querySelector("name").textContent;
        let points = null;

        if (placemark.querySelector("LineString")) {
          points = parseCoordinates(placemark.querySelector("LineString").textContent);

          polygons.push({ name, path: points });
        } else if (placemark.querySelector('coordinates')) {
          const coordinates = getCoordinates(placemark);

          coordinates[coordinates.length - 1] = coordinates[0];
          polygons.push({ name, path: coordinates });
        }

      } else {
        // Extrair nome e oficial
        const nameElement = placemark.querySelector('SimpleData[name="nome"]');
        const name = nameElement ? nameElement.textContent : null;

        const yearElement = placemark.querySelector('SimpleData[name="ano"]');
        const year = yearElement ? yearElement.textContent : null;
        const coordinates = getCoordinates(placemark);

        polygons.push({ name: name || "Limite - " + year, path: coordinates });
      }

    });

    setImportedPolygons(polygons);
  }

  // Extrair as coordenadas
  const getCoordinates = (placemark) => {
    const coordinatesElement = placemark.querySelector('coordinates');
    const coordinatesText = coordinatesElement ? coordinatesElement.textContent : null;
    const coordinatesArray = coordinatesText ? coordinatesText.split(' ') : [];
    const coordinates = coordinatesArray.map(coord => {
      const [longitude, latitude] = coord.split(',').map(parseFloat);
      return [longitude, latitude];
    });

    return coordinates;
  }

  const readFile = (file) => {
    let names = file.name.split(".");
    let ext = names[names.length - 1];

    if (ext === "kmz")
      readKMZ(file);

    if (ext === "kml") {
      const reader = new FileReader();

      reader.onload = function (e) {
        const kmlContent = e.target.result;
        readKML(kmlContent);
      };

      reader.readAsText(file);
    }

    return;
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleLoadFile(droppedFiles[0]);
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      handleLoadFile(selectedFiles[0]);
    }
  };

  const getFileInput = () => {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper
            elevation={0}
            className={clsx(classes.dropArea, {
              [classes.fileLoaded]: !toolsUtils.isEmptyString(fileName)
            })}
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <Typography variant="caption" component="div">
              {t('subscription.dragAndDropOrClickToUpload')}
            </Typography>
            <Grid item xs={12}>
              <input
                type="file"
                id="fileInput"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <label htmlFor="fileInput">
                <Grid container justifyContent='center' alignContent='center' alignItems='center'>
                  <Grid item className={classes.uploadButton}>
                    <PublishIcon />
                  </Grid>
                </Grid>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption'>
                {!toolsUtils.isEmptyString(fileName) ? fileName : t('subscription.noFileSelected')}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid>
      {getFileInput()}
    </Grid>
  );
}

export default GeoFileImporter;