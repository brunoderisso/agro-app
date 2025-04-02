import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import JSZip from 'jszip';
import { parseString } from 'xml2js';

import { Grid, Typography, AppBar, Tabs, Tab, FormControl, TextField, Paper, Card } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import PublishIcon from '@material-ui/icons/Publish';

import toolsUtils from '../../utils/toolsUtils';
import TabPanel from '../Common/TabPanel';
import PredizaModal from '../Common/PredizaModal';
import Canvas from '../Common/Canvas';
import CustomRadio from '../Common/CustomRadio';
import PolygonStore from '../../stores/PoligonStore';
import { useStyles } from '../../styles/Common/FileUploaderModal';
import theme from '../../styles/Utils/theme';


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function FileUploaderModal(props) {
    const classes = useStyles(props);

    const { t } = useTranslation();

    const [openModal, setOpenModal] = useState(true);
    const [disableImportBt, setDisableImportBt] = useState(false);
    const [titleModal, setTitleModal] = useState(t("subscription.importProperties"));
    const [textModal, setTextModal] = useState(t("subscription.needPropertyData"));
    const [step, setStep] = useState(1);
    const [tabValue, setTabValue] = useState(1);
    const [car, setCar] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [contentPolygons, setContentPolygons] = useState(null);
    const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(0);
    const [importedPolygons, setImportedPolygons] = useState([]);

    const modalButtons = [
        { label: t("subscription.importLater"), action: () => handleClose() },
        { label: t("subscription.importNow"), action: () => handleForward() },
        { label: t("common.cancelButton"), action: () => handleClose() },
        { label: t("common.import"), action: () => handleForward() },
        { label: t("common.backButton"), action: () => handlePrevious() }
    ];

    useEffect(() => {
        setOpenModal(props.open);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if ((tabValue === 0 && !toolsUtils.isEmptyString(car)) || (tabValue === 1 && !toolsUtils.isEmptyString(fileName))) {
            setDisableImportBt(false);
        } else if (step === 2) {
            setDisableImportBt(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabValue, car, fileName]);

    const handleClose = (error = null) => {
        if (typeof props.handleClose === "function") {
            props.handleClose(error);
        }

        if (!error) {
            setOpenModal(false);
        }
    };

    const handleForward = () => {
        switch (step) {
            case 1:
                setStep(2);
                setTextModal(t("subscription.provideCARRegistrationOrUploadKMZ"));
                setDisableImportBt(true);

                return;
            case 2:
                setStep(3);
                setTextModal(t("subscription.selectEquivalentPolygon"));
                setTitleModal(t("common.selectEnvironment"));
                readFile(file);

                return;
            default:
                sendChosenPolygon();

                return;
        }
    }

    const handlePrevious = () => {
        setStep(2);
        setTextModal(t("subscription.provideCARRegistrationOrUploadKMZ"));
        setTitleModal(t("subscription.importProperties"));
    }

    const handleTabChange = (_, newValue) => {
        setTabValue(newValue);
    };

    const handleChangeValueCar = (e) => {
        if (e.target.name === 'car') {
            setCar(e.target.value);
        }
    }

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
            const coordinateString = object.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
            const coordinateArrayString = coordinateString.trim().split(/\s+/);
            const coordinateFloat = coordinateArrayString.map(coordenada => {
                const [longitude, latitude] = coordenada.split(',').map(parseFloat);
                return { longitude, latitude };
            });

            results.push({ name, Points: coordinateFloat });
        }

        return results;
    }

    const sendChosenPolygon = () => {
        setDisableImportBt(true);

        const polygonEnv = {
            bounds: PolygonStore.arrayToString(importedPolygons[selectedPolygonIndex].Points),
            area: PolygonStore.computeAreaGauss(importedPolygons[selectedPolygonIndex].Points), // TODO: Corrigir os Points
            name: importedPolygons[selectedPolygonIndex].name || "",
            index: props.index || 0
        }

        PolygonStore.setSelectedPolygon(polygonEnv);
        handleClose();

    }


    const handleChangePoligon = (index) => {
        setSelectedPolygonIndex(index);
    }

    const generateContent = (polygons) => {
        let content = polygons.map((polygon, index) => {
            return (
                <Grid item xs={3} key={index} className={classes.containerCardPol}>
                    <Card className={classes.wrapperCardPol} elevation={0}>
                        <Grid className={classes.wrapperRadio}>
                            <CustomRadio
                                checked={selectedPolygonIndex === index}
                                onChange={() => { handleChangePoligon(index) }}
                                value={index}
                                name={`radio-button-${index}`}
                                inputProps={{ 'aria-label': index }}
                                size='small'
                                className={classes.radioPolygon}
                                color={theme.colors.onPrimaryContainer}
                            />
                        </Grid>
                        <Grid container justifyContent='center' alignContent='center' style={{ textAlign: 'center' }}>
                            <Grid item xs={12} >
                                <Typography variant='caption' className={classes.cardTitleItem}>
                                    {polygon.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Canvas pts={polygon.Points} width="100" height="70" />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            );
        })

        setContentPolygons(content);
    }

    const extractPoints = (placemarks) => {

        const coordinates = [];

        for (const object of placemarks) {
            const coordinatesString = object.Point[0].coordinates[0];
            const [longitude, latitude] = coordinatesString.split(',').map(parseFloat);

            coordinates.push({ latitude, longitude });
        }

        return [{ name: "assets", Points: coordinates }];
    }

    const extractLines = (placemarks) => {
        const results = [];

        for (const object of placemarks) {
            const name = object.name[0];
            const coordinatesString = object.LineString[0].coordinates[0];
            const coordinatesArrayString = coordinatesString.trim().split(/\s+/);
            const convertedCoordinates = coordinatesArrayString.map(coordinate => {
                const [longitude, latitude] = coordinate.split(',').map(parseFloat);

                return { latitude, longitude };
            });

            results.push({ name, Points: convertedCoordinates });
        }

        return results;
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
                                generateContent(sortedPols);

                                return;
                            }
                        } else if (keys.includes('Point')) {
                            let points = extractPoints(placemarks);
                            console.log(points);
                            //TRATAMENTO DE PONTOS (ASSETS)
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

                        if (polygons.length > 0) {
                            generateContent(polygons);
                            return;
                        }
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
            resultArray.push({ latitude, longitude });
        }

        return resultArray;
    }

    const readKML = (kmlContent) => {
        const parser = new DOMParser();
        const kmlDocument = parser.parseFromString(kmlContent, "text/xml");

        const placemarks = kmlDocument.querySelectorAll("Placemark");
        const polygons = [];

        placemarks.forEach(placemark => {
            if (placemark.querySelector("name")) {
                const name = placemark.querySelector("name").textContent;
                const points = parseCoordinates(placemark.querySelector("LineString").textContent);
                polygons.push({ name, Points: points });
            }
            if (true) {
                // Extrair nome e oficial
                const nomeElement = placemark.querySelector('SimpleData[name="nome"]');
                const nome = nomeElement ? nomeElement.textContent : null;

                const yearElement = placemark.querySelector('SimpleData[name="ano"]');
                const year = yearElement ? yearElement.textContent : null;

                // Extrair as coordenadas
                const coordinatesElement = placemark.querySelector('coordinates');
                const coordinatesText = coordinatesElement ? coordinatesElement.textContent : null;
                const coordinatesArray = coordinatesText ? coordinatesText.split(' ') : [];
                const coordinates = coordinatesArray.map(coord => {
                    const [longitude, latitude] = coord.split(',').map(parseFloat);
                    return { longitude, latitude };
                });
                polygons.push({ name: nome || "Limite - " + year, Points: coordinates });
            }
        });

        setImportedPolygons(polygons);
        generateContent(polygons);
    }

    const sortPolygons = (polygons) => {
        const polsByArea = [];
        const sortedPols = [];

        polygons.forEach(pol => {
            polsByArea.push({
                name: pol.name,
                area: PolygonStore.computeAreaGauss(pol.Points) // TODO: Corrigir os Points
            })
        });

        polsByArea.sort((a, b) => { return b.area - a.area });
        polsByArea.forEach(polByArea => {
            sortedPols.push(polygons.filter(pol => { return pol.name === polByArea.name })[0]);
        });

        return sortedPols;
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

    const getTabs = () => {
        return (
            <div className={classes.root}>
                <AppBar position='static' className={classes.appBar} elevation={0}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label='simple tabs example'
                        TabIndicatorProps={{
                            style: {
                                backgroundColor: '#0053DB'
                            }
                        }}>
                        <Tab label={t('subscription.importFromCAR')} {...a11yProps(0)} disabled />
                        <Tab label={t('subscription.importFromFile')} {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={tabValue} index={0}>
                    <FormControl fullWidth>
                        <TextField
                            id='car'
                            name='car'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={car}
                            onChange={handleChangeValueCar}
                            label={t('subscription.carRegistration')}
                            variant='outlined'
                            placeholder={t('subscription.provideCARRegistrationNumber')}
                            size='small'
                            className={classes.inputs}
                        />
                    </FormControl>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {getFileInput()}
                </TabPanel>
            </div>
        );
    }

    const thumb = () => {
        return (
            <Grid id={"thumb"}>
            </Grid>
        )
    }

    const bodyModal = () => {
        return (
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant='body2' className={classes.content}>
                            {textModal}
                        </Typography>
                    </Grid>
                    {step === 1 &&
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={1} style={{ alignSelf: 'center' }}>
                                    <ErrorIcon className={classes.icon} />
                                </Grid>
                                <Grid item xs={11}>
                                    <Typography variant='caption' className={classes.content2}>
                                        {t('subscription.noDataProvidedWarning')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {step === 2 &&
                        <Grid item xs={12}>
                            <Grid container>
                                {getTabs()}
                            </Grid>
                        </Grid>
                    }
                    {step === 3 && contentPolygons &&
                        <Grid item xs={12}>
                            <Scrollbars style={{ width: "100%", height: "400px" }} renderThumbVertical={thumb} className={classes.scrollList}>
                                <Grid container justifyContent='center' alignContent='center'>
                                    {importedPolygons.map((polygon, index) => {
                                        return (
                                            <Grid item xs={3} key={index} className={classes.containerCardPol}>
                                                <Card className={classes.wrapperCardPol} elevation={0}>
                                                    <Grid className={classes.wrapperRadio}>
                                                        <CustomRadio
                                                            checked={selectedPolygonIndex === index}
                                                            onChange={() => { handleChangePoligon(index) }}
                                                            value={index}
                                                            name={`radio-button-${index}`}
                                                            inputProps={{ 'aria-label': index }}
                                                            size='small'
                                                            className={classes.radioPolygon}
                                                            color={theme.colors.onPrimaryContainer}
                                                        />
                                                    </Grid>
                                                    <Grid container justifyContent='center' alignContent='center' style={{ textAlign: 'center' }}>
                                                        <Grid item xs={12}>
                                                            <Typography variant='caption' className={classes.cardTitleItem}>
                                                                {polygon.name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} className={classes.wrapperPolygon}>
                                                            <Canvas pts={polygon.Points} width="100" height="70" />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Typography variant='caption' className={classes.content}>
                                                                {`${PolygonStore.convertAreaToHa(
                                                                    PolygonStore.computeAreaGauss(polygon.Points) // TODO: Corrigir os Points
                                                                ).replace('.', ',')} ha`}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </Scrollbars>
                        </Grid>
                    }
                </Grid>
            </Grid>
        );
    }

    return (
        <PredizaModal
            open={openModal}
            dispense={step === 1 ? modalButtons[0] : modalButtons[2]}
            confirm={step === 1 ? modalButtons[1] : modalButtons[3]}
            title={titleModal}
            disableConfirmBt={disableImportBt}
            leftBt={step === 3 ? modalButtons[4] : null}
        >
            {bodyModal()}
        </PredizaModal>
    );
}

export default FileUploaderModal;