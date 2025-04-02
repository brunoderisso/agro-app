import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import BeatLoader from 'react-spinners/BeatLoader';

import PropTypes from 'prop-types';

//Libs
import GoogleMapReact from 'google-map-react';
import { Backdrop, ButtonGroup, IconButton } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { LocalConfig } from '../../../LocalConfig';

//Stores
import GoogleMapStore from '../../../stores/GoogleMapsStore';
import DeviceStore from '../../../stores/DeviceStore';
import EvapoStore from '../../../stores/EvapoStore';
import TokenList from "../../../stores/CancelTokenList";
import SessionStore from "../../../stores/SessionStore";
import MeasureStore from '../../../stores/MeasureStore';
import InmetStore from '../../../stores/InmetStore';

//Styles & Icons
import { withStyles } from '@material-ui/core/styles';
import styles from "../../../styles/GoogleMaps/GoogleMaps";
import PredizaPin from "../../../img/pins/BluePin.png";
import GatewayIcon from '../../../img/pins/Gateway.png';
import ImplementIcon from '../../../img/pins/Implement.png';
import handIcon from "../../../img/AdvancedMapIcons/handIcon.png"
import polygonIcon from "../../../img/AdvancedMapIcons/polygonIcon.png"
import { ReactComponent as ZoomInIcon } from '../../../img/AdvancedMapIcons/ZoomInIcon.svg';
import { ReactComponent as ZoomOutIcon } from '../../../img/AdvancedMapIcons/ZoomOutIcon.svg';
import { ReactComponent as FullscreenIcon } from '../../../img/AdvancedMapIcons/FullscreenIcon.svg';

//Components
import MapSideMenu from './MapSideMenu/MapSideMenu';
import GradientBar from './GradientBar';
import Timeline from './Timeline/Timeline';
import theme from '../../../styles/Utils/theme';
import { ConstantsUtils } from '../../../utils/constantsUtils';
import UserFeedback from '../UserFeedback';

//Widgets
import ForecastWidget from "./Widgets/ForecastWidget";
import sessionStore from '../../../stores/SessionStore';
import EvapoWidget from "./Widgets/EvapoWidget";
import ChillHourWidget from "./Widgets/ChillHourWidget";
import ChillHour10Widget from "./Widgets/ChillHour10Widget";
import ColdUnitsWidget from "./Widgets/ColdUnitsWidget";
import DeviceCard from './DeviceCard';
import measureStore from '../../../stores/MeasureStore';
import CropPolygonCard from './CropPolygonCard';
import noteStore from '../../../stores/NoteStore';
import moment from 'moment';


const defaultCenter = {
    lat: -8.680201329794073,
    lng: -39.16103292721983
}

const defaultZoom = 1;

function GoogleMapsV2(props) {
    const { classes } = props;
    const tokenList = new TokenList()
    const colors = ConstantsUtils.EvapoGradient;

    const { t } = useTranslation();


    const [environmentBounds, setEnvironmentBounds] = useState({});
    const [polygons, setPolygons] = useState([]);
    const [devices, setDevices] = useState([]);
    const [areas, setAreas] = useState([]);
    const [gateways, setGateways] = useState([]);
    const [inmetStations, setInmetStations] = useState([]);
    const [machines, setMachines] = useState([]);
    const [gradientSatellite, setGradientSatellite] = useState(null);
    const [evapoGradient, setEvapoGradient] = useState(null);

    //CARDS DO MAPA
    const [devicesProps, setDevicesProps] = useState([]);
    const [inmetStationsProps, setInmetStationsProps] = useState([]);
    const [cropPolygonsProps, setCropPolygonsProps] = useState([]);

    const [isDrawed, setIsDrawed] = useState({});
    const [apiLoaded, setApiLoaded] = useState(false);
    const [loadingPolygon, setLoadingPolygon] = useState(false);
    const [loadingDevice, setLoadingDevice] = useState(false);

    const [evapoBounds, setEvapoBounds] = useState([]);
    const [deviceBounds, setDeviceBounds] = useState([]);
    const [drawingPolygons, setDrawingPolygons] = useState([]);

    const [errorResponse, setErrorResponse] = useState('');
    const [errorMessageResponse, setErrorMessageResponse] = useState('');
    const [loader, setLoader] = useState(false);

    const mapsReference = useRef(null);
    const pageRef = useRef(null);
    const apiLoadedRef = useRef(null);
    const drawingManager = useRef(null);
    const drawingPolygon = useRef(null);
    const drawingPolygonsReference = useRef([]);

    const refreshRadiusInmetRef = useRef(false);
    const refreshedDevicesPropsRef = useRef([]);
    const counterDevicesPropsRef = useRef(0);
    const positionEmptyCardRef = useRef(null);

    useEffect(() => {
        bind();

        setIsDrawed({
            polygons: false,
            environmentBounds: false,
            machines: false,
            areas: false,
            devices: false,
            gateways: false
        });

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.environmentBounds) {
            setEnvironmentBounds({ polygon: props.environmentBounds, isEnvironment: true });
        }
        if (props.polygons) {
            setPolygons(props.polygons);
        }
        if (props.areas) {
            setAreas(props.areas);
        }
        if (props.devices) {
            setDevices(props.devices);
        }
        if (props.gateways) {
            setGateways(props.gateways);
        }
        if (props.machines) {
            setMachines(props.machines);
        }
        pageRef.current = props.page;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        drawingPolygonsReference.current = drawingPolygons;

        if (props.page === 0 && drawingPolygons.length === 1) {
            let environmentPolygon = GoogleMapStore.extractNewPolygons(drawingPolygons)[0];
            centerMapBounds(environmentPolygon.polygon);
        }

        if (props.page === 0 && drawingManager.current && drawingPolygons.length === 1) {
            drawingManager.current.draw.setOptions({
                drawingControl: false,
            });
        }

        if ((props.page === 2 || props.page === 3) && drawingManager.current) {
            GoogleMapStore.emit("drawingPolygons_change", drawingPolygons);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawingPolygons]);

    useEffect(() => {
        if (cropPolygonsProps?.length > 0) {
            GoogleMapStore.storeCropPolygonsProps(cropPolygonsProps);
        }
    }, [cropPolygonsProps])

    useEffect(() => {
        counterDevicesPropsRef.current = devicesProps.length;

        if (devicesProps.length > 0) {
            const deviceClick = devicesProps.find((device) => { return device.show === false })

            if (deviceClick) {
                setLoadingDevice(true);

                positionEmptyCardRef.current = [deviceClick.longitude, deviceClick.latitude]
                DeviceStore.getDeviceMeasureStats(deviceClick.deveui, deviceClick.latLng, responseGetDeviceMeasureStats);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devicesProps])

    //UseEffect para desenhar objetos caso eles cheguem atrasados devido a demora na requisição e etc...
    useEffect(() => {
        if (mapsReference.current) {
            if (areas.length > 0 && !isDrawed.areas) {
                drawPolygons(areas);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    areas: true
                }));
            }

            if (polygons.length > 0) {
                GoogleMapStore.resetPolygonReferences();
                
                drawPolygons(polygons);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    polygons: true
                }));
            }

            if (environmentBounds) {
                GoogleMapStore.resetEnvPolygonReferences();

                drawPolygons([environmentBounds]);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    environmentBounds: true
                }));
            }

            if (gateways.length > 0 && !isDrawed.gateways) {
                drawGateways(gateways);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    gateways: true,
                }));
            }

            if (machines.length > 0 && !isDrawed.machines) {
                drawMachines(machines);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    machines: true,
                }));
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [polygons, areas, environmentBounds, gateways, machines]);

    useEffect(() => {
        if (inmetStations.length > 0) {
            drawInmetStations(inmetStations);

            setTimeout(() => {
                const radiusReference = GoogleMapStore.getInmetReferences().radiusReference;
                const radiusCenter = radiusReference.getCenter();

                const latLngInmet = [
                    { lat: radiusCenter.lat(), lng: radiusCenter.lng() + GoogleMapStore.convertMeterToDegree(radiusReference.getRadius()) },
                    { lat: radiusCenter.lat() + GoogleMapStore.convertMeterToDegree(radiusReference.getRadius()), lng: radiusCenter.lng() },
                    { lat: radiusCenter.lat(), lng: radiusCenter.lng() - GoogleMapStore.convertMeterToDegree(radiusReference.getRadius()) },
                    { lat: radiusCenter.lat() - GoogleMapStore.convertMeterToDegree(radiusReference.getRadius()), lng: radiusCenter.lng() },
                ];

                const latLng = latLngInmet.map(point => {
                    return [point.lng, point.lat]
                })

                centerMapBounds(latLng);
            }, 100);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inmetStations]);

    useEffect(() => {
        if (evapoBounds.length > 0 && apiLoaded) {
            centerMapBounds(environmentBounds.polygon)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [evapoBounds, apiLoaded]);

    useEffect(() => {
        if (deviceBounds.length > 0 && apiLoaded) {
            centerMapBounds(environmentBounds.polygon)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceBounds, apiLoaded]);

    useEffect(() => {
        apiLoadedRef.current = apiLoaded;

        if (apiLoaded) {
            //Desenha o poligono de ambiente e centraliza o mapa nele, chamando as funções genericas para desenhar e centralizar poligonos
            if (environmentBounds?.polygon) {
                drawPolygons([environmentBounds]);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    environmentBounds: true,
                }));
                setTimeout(() => {
                    centerMapBounds(environmentBounds.polygon)
                }, 1000);
            }

            //Desenha os Polygons (talhões)
            if (polygons.length > 0) {
                drawPolygons(polygons);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    polygons: true,
                }));
            }

            //Desenha as Áreas
            if (areas.length > 0) {
                drawPolygons(areas);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    areas: true,
                }));
            }

            //Desenha os Devices
            if (devices.length > 0) {
                drawDevices(devices);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    devices: true,
                }));
            }

            //Desenha os Gateways
            if (gateways.length > 0) {
                drawGateways(gateways);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    gateways: true,
                }));
            }

            //Desenha os Implementos
            if (machines.length > 0) {
                drawMachines(machines);
                setIsDrawed((prevState) => ({
                    ...prevState,
                    machines: true,
                }));
            }

            //Insere os componentes do mapa avançado na interface do google maps.
            if (props.advancedMapControls) {
                attachAdvancedMapControls();
            }

            if (props.customizedMapControls) {
                const map = mapsReference.current.map;
                const maps = mapsReference.current.maps;

                attachPersonalizedMapControls(map, maps);
            }

            if (props.widgets) {
                attachWidgets();
            }

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiLoaded]);

    const bind = () => {
        GoogleMapStore.addListener("gatewaysRadius_refresh", refreshGatewaysRadius);
        GoogleMapStore.addListener("googleMapsLayer_change", handleDataDevices);
        GoogleMapStore.addListener("evapoSoil_get", getEvapoData);
        GoogleMapStore.addListener("evapoSoil_clean", clearEvapoData);
        GoogleMapStore.addListener("implements_click", centerImplements);
        GoogleMapStore.addListener("cards.close", closeCards);
        GoogleMapStore.addListener("googleMapsError_set", setErrorResponse);
        GoogleMapStore.addListener("googleMapsErrorMessage_set", setErrorMessageResponse);
        GoogleMapStore.addListener("googleMapsLoader_set", setLoader);
        GoogleMapStore.addListener("addres_find", findAddress);
        MeasureStore.addListener("change.measure", changeMeasure);
        SessionStore.addListener('radius.change', getInmetStations);
        SessionStore.addListener("time.change", timeChange);
        sessionStore.addListener("time_refresh", refreshService);
        sessionStore.addListener("function.change", changeFunctionMeasure);
        GoogleMapStore.addListener("polygon_drawing", startDrawingManager);
        GoogleMapStore.addListener("createPolygon_confirm", confirmCreatePolygon);
        GoogleMapStore.addListener("polygon_stopDrawing", stopDrawingManager);
        GoogleMapStore.addListener("polygon_reset", drawingPolygonReset);
        GoogleMapStore.addListener("polygon_center", centerMapBounds);
        GoogleMapStore.addListener("polygonsList_subtract", subtractDrawingPolygons);
        GoogleMapStore.addListener("polygonsList_add", addStaticDrawingPolygons);
        GoogleMapStore.addListener("polygon_setEditable", polygonSetEditable);
        GoogleMapStore.addListener("polygon_setUneditable", polygonSetUneditable);
        GoogleMapStore.addListener("cropPolygonsProps_update", updateCropPolygonsProps);
        GoogleMapStore.addListener("drawingPolygons_check", drawingPolygonsCheck);
        GoogleMapStore.addListener("satelliteImage_draw", drawSatelliteImage);
        GoogleMapStore.addListener("satelliteGradient_set", mapGradientSatellite);
    }

    const clear = () => {
        GoogleMapStore.removeListener("gatewaysRadius_refresh", refreshGatewaysRadius);
        GoogleMapStore.removeListener("evapoSoil_get", getEvapoData);
        GoogleMapStore.removeListener("googleMapsLayer_change", handleDataDevices);
        GoogleMapStore.removeListener("evapoSoil_clean", clearEvapoData);
        GoogleMapStore.removeListener("implements_click", centerImplements);
        GoogleMapStore.removeListener("cards.close", closeCards);
        GoogleMapStore.removeListener("googleMapsError_set", setErrorResponse);
        GoogleMapStore.removeListener("googleMapsErrorMessage_set", setErrorMessageResponse);
        GoogleMapStore.removeListener("googleMapsLoader_set", setLoader);
        GoogleMapStore.removeListener("addres_find", findAddress);
        MeasureStore.removeListener("change.measure", changeMeasure);
        SessionStore.removeListener('radius.change', getInmetStations);
        SessionStore.removeListener("time.change", timeChange);
        sessionStore.removeListener("time_refresh", refreshService);
        sessionStore.removeListener("function.change", changeFunctionMeasure);
        GoogleMapStore.removeListener("polygon_drawing", startDrawingManager);
        GoogleMapStore.removeListener("createPolygon_confirm", confirmCreatePolygon);
        GoogleMapStore.removeListener("polygon_stopDrawing", stopDrawingManager);
        GoogleMapStore.removeListener("polygon_reset", drawingPolygonReset);
        GoogleMapStore.removeListener("polygon_center", centerMapBounds);
        GoogleMapStore.removeListener("polygonsList_subtract", subtractDrawingPolygons);
        GoogleMapStore.removeListener("polygonsList_add", addStaticDrawingPolygons);
        GoogleMapStore.removeListener("polygon_setEditable", polygonSetEditable);
        GoogleMapStore.removeListener("polygon_setUneditable", polygonSetUneditable);
        GoogleMapStore.removeListener("cropPolygonsProps_update", updateCropPolygonsProps);
        GoogleMapStore.removeListener("drawingPolygons_check", drawingPolygonsCheck);
        GoogleMapStore.removeListener("satelliteImage_draw", drawSatelliteImage);
        GoogleMapStore.removeListener("satelliteGradient_set", mapGradientSatellite);
    }

    const mapGradientSatellite = (index) => {
        if (index === '404') {
            setGradientSatellite(index);
        } else {
            const indexSatellite = {
                ...index,
                gradient: [
                    ...index.gradient.map(gradient => {
                        return {
                            ...gradient,
                            red: gradient.red * 255,
                            green: gradient.green * 255,
                            blue: gradient.blue * 255,
                            valueRGB: gradient.value * 255
                        }
                    })
                ]
            }

            setGradientSatellite(indexSatellite);
        }
    }

    const drawingPolygonsCheck = () => {
        if (drawingPolygonsReference.current.length === 0) {
            setErrorResponse("404");
            setErrorMessageResponse(t('alert.missingEnvironmentPolygon'));
        }
    }

    const updateCropPolygonsProps = (polygon) => {
        setCropPolygonsProps((prevState) => {
            const index = prevState.findIndex(pol => pol.objectid === polygon.objectid);
            const newPolygons = [...prevState];

            newPolygons.splice(index, 1, polygon);
            return newPolygons;
        });
    }

    const polygonSetEditable = (polygon) => {
        if (polygon) {
            let polygonRef = null;

            if (polygon.object?.isEnvironment) {
                polygonRef = polygon;
            } else {
                polygonRef = GoogleMapStore.getPolygonReferences().find(polRef => polRef.object?.objectid === polygon.objectid);
            }

            setSelection(polygonRef.reference);
        }
    }

    const polygonSetUneditable = (polygon) => {
        if (polygon) {
            const maps = mapsReference.current.maps;
            let polygonRef = null;
            let polygonCoords = null;

            if (polygon.object?.isEnvironment) {
                polygonRef = polygon;
                polygonCoords = polygon.object.polygon.map(coord => new maps.LatLng(coord[1], coord[0]));
            } else {
                polygonRef = GoogleMapStore.getPolygonReferences().find(polRef => polRef.object?.objectid === polygon.objectid);
                polygonCoords = polygon.polygon.map(coord => new maps.LatLng(coord[1], coord[0]));
            }

            polygonRef.reference.setPath(polygonCoords);
            clearSelection();
        }
    }

    const subtractDrawingPolygons = (polygon) => {
        const newDrawingPolygons = [...drawingPolygonsReference.current];
        const indexPolygon = newDrawingPolygons.findIndex(pol => pol.objectid === polygon.objectid);

        newDrawingPolygons[indexPolygon].ref.setMap(null);
        newDrawingPolygons.splice(indexPolygon, 1);
        setDrawingPolygons(newDrawingPolygons);
    }

    const confirmCreatePolygon = (callback) => {
        let polygons = null;

        if (pageRef.current === 0) {
            polygons = GoogleMapStore.extractNewPolygons(drawingPolygonsReference.current);
        } else {
            const envPolygon = GoogleMapStore.getPolygonReferences().find(polRef => polRef.object?.isEnvironment);

            polygons = GoogleMapStore.getCoordinatesPolygon(envPolygon);
        }

        if (polygons.length > 0 && typeof callback === 'function') {
            stopDrawingManager();
            callback(pageRef.current === 0 ? polygons : [{ polygon: polygons }]);
        }
    }

    const drawingPolygonReset = () => {
        if (drawingPolygonsReference.current.length > 0) {
            const maps = mapsReference.current.maps;

            let polygons = drawingPolygonsReference.current;
            for (let i = 0; i < polygons.length; i++) {
                polygons[i].ref.setMap(null);
            }
            drawingPolygonsReference.current = [];
            setDrawingPolygons([]);

            if (drawingManager.current?.draw) {
                drawingManager.current.draw.setDrawingMode(maps.drawing.OverlayType.POLYGON);
                drawingManager.current.draw.setOptions({
                    drawingControl: true,
                });
            }
        }
    }

    const stopDrawingManager = (pols = []) => {
        if (drawingManager.current) {
            const { draw, drawListener, clearListener } = drawingManager.current;

           
            draw.setMap(null);

          
            if (drawListener) {
                mapsReference.current.maps.event.removeListener(drawListener);
            }
            if (clearListener) {
                mapsReference.current.maps.event.removeListener(clearListener);
            }

           
            drawingManager.current = null;
        }

       
        drawingPolygonsReference.current.forEach(polygon => {
            polygon.ref.setMap(null);
        });

        setDrawingPolygons([]);

       
       
        //setPolygons(polygons);
    };

    const closeCards = () => {
        setDevicesProps([]);
        GoogleMapStore.storeDevicesProps([]);

        setInmetStationsProps([]);
        GoogleMapStore.storeInmetStationsProps([]);
    }

    const changeFunctionMeasure = () => {
        if (GoogleMapStore.getSelectedMenuItem() === 'inmet') {
            getInmetStations(true);
        }

        changeMeasure();

        // Para cards abertos dos coletores
        if (GoogleMapStore.getDevicesProps()) {
            GoogleMapStore.getDevicesProps().forEach(device => {
                refreshDevicesMeasures(device);
            })
        }
    }

    const getDrawingMode = (maps, drawnPolygons) => {
        if (pageRef.current === 0 && drawnPolygons.length === 0) {
            return maps.drawing.OverlayType.POLYGON;
        } else if (pageRef.current === 2 || pageRef.current === 3) {
            return maps.drawing.OverlayType.POLYGON;
        } else {
            return null;
        }
    }

    const getDrawingControl = (drawnPolygons) => {
        if (pageRef.current === 0 && drawnPolygons.length === 0) {
            return true;
        } else if (pageRef.current === 2 || pageRef.current === 3) {
            return true;
        } else {
            return false;
        }
    }

    const addStaticDrawingPolygons = (polygons = []) => {
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;
        const allDrawingPolygons = [...drawingPolygonsReference.current];
        let lastIndex = allDrawingPolygons.length;

        const drawnPolygons = polygons.map(p => {
            const polygonCoords = p.ref.map(coord => new maps.LatLng(coord[1], coord[0]));
            const polygon = new maps.Polygon({
                paths: polygonCoords,
                editable: false,
                draggable: false,
                strokeColor: p.isEnvironment ? theme.colors.primaryContainer : theme.colors.primary[40],
                strokeOpacity: 0.6,
                strokeWeight: 2,
                fillColor: theme.colors.primaryContainer,
                fillOpacity: 0.25,
                zIndex: p.isEnvironment ? 1 : 2
            });
            polygon.setMap(map);

            return { objectid: p.objectid, ref: polygon, name: p.name, crop: p.crop };
        });

        // Em caso de talhões, corrige o objectid para não repeti-los
        drawnPolygons.forEach((_, index) => {
            drawnPolygons[index].objectid = "new" + lastIndex;
            lastIndex++;
        })

        allDrawingPolygons.push(...drawnPolygons);
        setDrawingPolygons(allDrawingPolygons);
    }

    const startDrawingManager = (polygons = []) => {
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        // Se ja existirem Polygons inicializa com eles para editar
        // Salvamos e Gerenciamos polygons no mapa na forma {objectid, ref}
        // Se o polígono for locked, ele aparecerá no mapa sem possibilidade de seleção e edição.
        const drawnPolygons = polygons.map(p => {
            const polygonCoords = p.ref.map(coord => new maps.LatLng(coord[1], coord[0]));
            const polygon = new maps.Polygon({
                paths: polygonCoords,
                editable: p.objectid === "environment" && !p.locked ? true : false,
                draggable: p.isEnvironment || pageRef.current === 3 || p.locked ? false : true,
                strokeColor: p.isEnvironment ? theme.colors.primaryContainer : theme.colors.primary[40],
                strokeOpacity: 0.6,
                strokeWeight: 2,
                fillColor: theme.colors.primaryContainer,
                fillOpacity: 0.25,
                zIndex: p.isEnvironment ? 1 : 2
            });
            polygon.setMap(map);

            if (!p.locked) {
                // Adicionar listener para permitir a seleção e edição
                maps.event.addListener(polygon, 'click', function () {
                    setSelection(polygon);
                });
            }

            return {...p ,objectid: p.objectid, ref: polygon, name: p.name, crop: p.crop };
        });

        let draw = new maps.drawing.DrawingManager({
            drawingMode: getDrawingMode(maps, drawnPolygons),
            drawingControl: getDrawingControl(drawnPolygons),
            drawingControlOptions: {
                position: maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    maps.drawing.OverlayType.POLYGON
                ],
            },
            polygonOptions: {
                editable: true,
                draggable: true,
                strokeColor: theme.colors.primary[40],
                strokeOpacity: 0.6,
                strokeWeight: 2,
                fillColor: theme.colors.primaryContainer,
                fillOpacity: 0.25,
                zIndex: 2
            },
        });

        draw.setMap(map);

        setTimeout(() => {
            const controls = document.querySelector('.gmnoprint');
            controls.classList.add(classes.customDrawingControls);

            // Substituir os ícones dos botões
            const buttons = document.querySelectorAll(`.${classes.customDrawingControls} button span div`);

            if (buttons.length > 0) {
                // Remova a imagem original
                buttons[0].innerHTML = '';
                buttons[1].innerHTML = '';

                // Adicione a imagem personalizada
                buttons[0].style.backgroundImage = `url(${handIcon})`;
                buttons[1].style.backgroundImage = `url(${polygonIcon})`;
            }
        }, 500);

        let drawListener = maps.event.addListener(draw, 'overlaycomplete', function (event) {
            if (event.type === maps.drawing.OverlayType.POLYGON) {
                const newPolygon = event.overlay;

                maps.event.addListener(newPolygon, 'click', function () {
                    setSelection(newPolygon);
                });

                setSelection(newPolygon);
                setDrawingPolygons((prev) => {
                    const newArray = [...prev];
                    newArray.unshift({ objectid: "new" + prev.length, ref: newPolygon });
                    return newArray;
                });

                if (props.page === -1) {
                    draw.setDrawingMode(null);
                }
            }
        });

        let clearListener = maps.event.addListener(map, 'click', clearSelection);

        if (drawnPolygons.length > 0) {
            GoogleMapStore.emit("drawingPolygons_change", drawnPolygons);
        }

        setDrawingPolygons(drawnPolygons);
        drawingManager.current = { draw, drawListener, clearListener };
    }

    const setSelection = (shape) => {
        clearSelection();
        drawingPolygon.current = shape;
        shape.setEditable(true);
        shape.setDraggable(true);
    }

    const clearSelection = () => {
        if (drawingPolygon.current) {
            drawingPolygon.current.setEditable(false);
            drawingPolygon.current.setDraggable(false);
            drawingPolygon.current = null;
        }
    }

    const getInmetStations = (refresh = false) => {
        if (props.environment?.latitude && props.environment?.longitude) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            const params = {
                latitude: props.environment.latitude,
                longitude: props.environment.longitude,
                limit: sessionStore.getRadius()
            };

            refreshRadiusInmetRef.current = refresh;
            InmetStore.getStations(cancelToken, params, responseGetInmet);
        }
    }

    const responseGetInmet = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setInmetStations(response.data)

            if (refreshRadiusInmetRef.current) {
                GoogleMapStore.getInmetReferences().radiusReference.setRadius(sessionStore.getRadius())
            }
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const centerImplements = () => {
        let points = []

        machines.forEach(machine => {
            points.push({ lat: machine.latitude, lng: machine.longitude })
        });

        centerMapBounds(points);
    }

    // TESTAR MODO DE VISUALIZAÇÃO SELECIONADO
    const handleLayer = () => {
        switch (GoogleMapStore.getLayer()) {
            case "heatmap":
                getHeatmapData();

                break;

            case "interpolation":
                getInterpolationData();

                break;

            default:
                break;
        }
    }

    const timeChange = () => {
        if (["coletor", "inmet"].includes(GoogleMapStore.getSelectedMenuItem())) {
            GoogleMapStore.resetInterpolationReference();
            GoogleMapStore.resetHeatmapReference();

            if (!measureStore.checkSelectedMeasure()) {
                const preference = {
                    ...SessionStore.getPreference(),
                    measure: SessionStore.getEnvironmentDetail()?.Measurements
                        ? SessionStore.getEnvironmentDetail().Measurements[0].name
                        : 'AirTemperature'
                };

                SessionStore.pushPreference(preference, () => {
                    SessionStore.setPreference(preference);
                    MeasureStore.setDefaultMeasure();
                    handleLayer();
                });
            } else {
                handleLayer();
            }
        } else if (GoogleMapStore.getSelectedMenuItem() === "satelite") {
            getSatelliteList();
        } else if (GoogleMapStore.getSelectedMenuItem() === "irrigação") {
            getEvapoData();
        }
    }

    const getSatelliteList = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const time = sessionStore.getTime();

        const startDate = GoogleMapStore.getFlagSatelliteGetOneDay()
            ? time.start
            : moment(time.start).subtract(2, 'days').startOf('day').subtract(3, 'hours').valueOf();
        const endDate = GoogleMapStore.getFlagSatelliteGetOneDay()
            ? time.end
            : moment(time.end).add(3, 'days').endOf('day').subtract(3, 'hours').valueOf();

        const params = {
            start: Math.floor(startDate / 1000),
            end: Math.floor(endDate / 1000)
        }

        setLoader(true);
        GoogleMapStore.getSatelliteList(cancelToken, params, (response) => responseGetSatelliteList(response));
    }

    const responseGetSatelliteList = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data) {
            // TODO: para segunda entrega do satélite
            // getSatelliteStats(response.data.scenes[0].objectid);
            GoogleMapStore.storeSatelliteObject(response.data);
            handleSatelliteData(response.data);

            const satelliteAlerts = [];

            response.data.scenes.forEach(scene => {
                if (!satelliteAlerts.some(alert => moment(alert.date).format('YYYY-MM-DD') === moment(scene.to).format('YYYY-MM-DD'))) {

                    satelliteAlerts.push({
                        icon: 'advmapSatellite',
                        text: 'services.satelite',
                        date: moment(scene.to).startOf('day').valueOf()
                    })
                }
            });

            GoogleMapStore.emit('warningAlerts_handle', satelliteAlerts);
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
            drawSatelliteImage();
        }
    }

    const handleSatelliteData = (satelliteObj) => {
        if (satelliteObj?.scenes?.length > 0) {
            GoogleMapStore.emit("satelliteScenesRef_set", satelliteObj.scenes);

            if (GoogleMapStore.getServicesAdvancedMap()['satelite']?.features[0]?.name) {
                GoogleMapStore.emit("selectedMenuFeature_update", null);
                GoogleMapStore.emit("selectedMenuFeature_update", GoogleMapStore.getServicesAdvancedMap()['satelite'].features[0].name);
            }
        } else {
            setErrorResponse("404");
            GoogleMapStore.emit("satelliteScenesRef_set", []);
            drawSatelliteImage();
        }

        if (satelliteObj?.indexs?.length > 0) {
            GoogleMapStore.emit("satelliteIndexesRef_set", satelliteObj.indexs);
        } else {
            GoogleMapStore.emit("satelliteIndexesRef_set", []);
            mapGradientSatellite("404");
        }
    }

    // TODO: para segunda entrega do satélite
    // const getSatelliteStats = (imageId) => {
    //     const cancelToken = {};
    //     cancelToken.id = tokenList.add();
    //     cancelToken.token = tokenList.get(cancelToken.id);

    //     GoogleMapsStore.getSatelliteStats(cancelToken, imageId, (response) =>
    //         responseGetSatelliteStats(response, imageId)
    //     )
    // }

    // const responseGetSatelliteStats = (response, imageId) => {
    //     tokenList.remove(response.id);
    //     GoogleMapsStore.emit("googleMapsLoader_set", false);

    //     if (response.data) {
    //         GoogleMapsStore.emit("satelliteImage_draw", imageId);
    //     }

    //     if (response.status) {
    //         GoogleMapsStore.emit("googleMapsError_set", response.status.toString());
    //     }
    // }

    const changeMeasure = () => {
        switch (GoogleMapStore.getLayer()) {
            case "heatmap":
                if (GoogleMapStore.getHeatmapReference()) {
                    getHeatmapData();
                }
                break;

            case "interpolation":
                if (GoogleMapStore.getInterpolationReference()) {
                    getInterpolationData();
                }
                break;
            default:
                break;
        }

        // Condição para as estações do inmet
        if (GoogleMapStore.getInmetStationsProps()?.length > 0) {
            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            InmetStore.getListStationData(cancelToken, GoogleMapStore.getInmetStationsProps(), responseGetListStationData);
        }
    }

    const responseGetListStationData = (response) => {
        tokenList.remove(response.id);

        // Atualização dos dados da medida nova
        if (response.length > 0) {
            const inmetStations = [...GoogleMapStore.getInmetStationsProps()];
            const newMeasure = sessionStore.getPreference().measure;

            response.forEach(obj => {
                const stationMeasure = obj.data.measure.find(measure => measure.measure === newMeasure);
                let measure = null;

                if (stationMeasure) {
                    measure = {
                        max: stationMeasure.stats.max,
                        min: stationMeasure.stats.min,
                        stddev: stationMeasure.stats.indice,
                        value: stationMeasure.stats.value
                    };
                } else {
                    measure = {
                        max: null,
                        min: null,
                        stddev: null,
                        value: null
                    };

                    setErrorResponse('404');
                }

                const stationIndex = inmetStations.findIndex(station => station.objectid === obj.data.Station.objectid);

                inmetStations[stationIndex] = {
                    ...inmetStations[stationIndex],
                    measure
                };

            });

            GoogleMapStore.storeInmetStationsProps(inmetStations);
            setInmetStationsProps(inmetStations);
        }
    }

    const getHeatmapData = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        setLoader(true);
        GoogleMapStore.getHeatmapData(cancelToken, responseGetHeatmapData);
    }

    const responseGetHeatmapData = (response) => {
        tokenList.remove(response.id);
        GoogleMapStore.resetHeatmapReference();
        setLoader(false);

        if (response.data) {
            drawHeatmap(response.data);
        }

        if (response.status) {
            setDevicesProps([]);
            setErrorResponse(response.status.toString());
        }
    }

    const getInterpolationData = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        GoogleMapStore.getURLInterpolation(cancelToken, responseGetInterpolation);
    }

    const responseGetInterpolation = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            drawInterpolation(response.data.url);
        } else {
            setErrorResponse("404");
            setTimeout(() => {
                GoogleMapStore.setLayer("heatmap");
            }, 3000);
        }
    }

    const handleDataDevices = () => {
        const bounds = GoogleMapStore.getDeviceReferences().map(device => {
            return {
                lat: device.object.latitude,
                lng: device.object.longitude
            }

        })
        setDeviceBounds(bounds);

        GoogleMapStore.resetHeatmapReference();
        GoogleMapStore.resetInterpolationReference();

        handleLayer();
    }

    const clearEvapoData = () => {
        GoogleMapStore.getPolygonReferences().forEach(pol => {
            if (!pol.object?.isEnvironment) {
                showEvapoStatus(pol.object, true);
            } else {
                pol.reference.setOptions({ strokeColor: theme.colors.primaryContainer, strokeOpacity: 0.6, strokeWeight: 2, fillOpacity: 0 })
            }
        });
    }

    // Função para o CEP
    const findAddress = ({ address, callback }) => {
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        let result = GoogleMapStore.geocodeAddress(address, map, maps);

        callback(result);
    }

    const getEvapoData = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const parameters = SessionStore.getTime();
        const now = moment().add(1, 'day').format("x");

        if (parameters.end > now) {
            return
        }
        setLoader(true);
        EvapoStore.getEvapo(cancelToken, parameters, responseGetEvapoData);
    }

    const responseGetEvapoData = (response) => {
        tokenList.remove(response.id);
        setEvapoGradient({ name: "ETO", gradient: colors });
        if (response.data?.poligonos) {
            const pols = response.data.poligonos;
            const bounds = [];

            pols.forEach(pol => {
                if (pol.etc === null) {
                    showEvapoStatus({ ...pol, etc: response.data.eto });
                } else {
                    showEvapoStatus(pol);
                }

                pol.Points.forEach(point => {
                    bounds.push({ lat: point.latitude, lng: point.longitude });
                })
            });

            setEvapoBounds(bounds);
            setLoader(false);
        } else if (response.data?.eto) {
            showEnvironmentEvapoStatus(response.data.eto);
            setLoader(false);
        }

        if (response.status) {
            setEvapoBounds([]);
            setErrorResponse(response.status.toString());
        }
    }

    const refreshService = () => {
        const service = GoogleMapStore.getSelectedMenuItem();

        switch (service) {
            case 'coletor':
                handleDataDevices();
                MeasureStore.emit('change.measure');

                break;
            case 'maquinas': // TODO: fazer implementos

                break;
            case 'inmet':
                MeasureStore.emit('change.measure');

                break;
            case 'irrigação':
                GoogleMapStore.emit('evapoSoil_get');

                break;
            default:
                break;
        }
    }

    // TODO: deixar genérica para HF tbm
    // Função que pinta o poligono com o resultado da EVAPO
    const showEvapoStatus = (pol, isClean = false) => {
        if (pol.isenvironment)
            return;

        const polygonReferences = GoogleMapStore.getPolygonReferences()

        if (polygonReferences.length > 0 && pol.polygon) {
            polygonReferences.forEach(element => {
                if (element.object.objectid === pol.objectid) {
                    if (isClean) {
                        element.reference.setOptions({ fillColor: theme.colors.primaryContainer, fillOpacity: 0.15 });
                    } else {
                        element.reference.setOptions({ fillColor: getEvapoGradient(pol), fillOpacity: 0.7 });
                    }
                }
            })
        }
    }


    const showEnvironmentEvapoStatus = (eto) => {

        const polygonReferences = GoogleMapStore.getPolygonReferences()
        const polygon = polygonReferences.find((item) => { return item.object.isEnvironment });

        if (polygon && eto) {
            polygon.reference.setOptions({ fillColor: getEvapoGradient({ etc: eto }), fillOpacity: 0.3 });
        }


    }

    //Função que calcula o Gradiente pra EVAPO e HF
    const getEvapoGradient = (pol) => {
        const et = pol.etc || props.info?.eto;

        if (et === null) {
            return "#7e7e7e";
        }

        const index = Math.round(1.55 + 1.48 * (et) + (-1) * ((0.058) * (et ** 2)));
        if (index >= colors.length) {
            return colors[colors.length - 1].color;
        }

        return colors[index].color;

        // if (props.page === "HF") {
        //     let hf = pol.max || props.info.max;

        //     if (hf < 100) {
        //         return "#e80002";
        //     }
        //     else if (hf >= 100 && hf < 200) {
        //         return "#f49c02";
        //     }
        //     else if (hf >= 200 && hf < 300) {
        //         return "#efff0b";
        //     }
        //     else if (hf >= 300 && hf < 400) {
        //         return "#01eefe";
        //     }
        //     else if (hf >= 400 && hf < 500) {
        //         return "#016eff";
        //     }
        //     else if (hf >= 500 && hf < 600) {
        //         return "#0300ff";
        //     }
        //     else if (hf >= 600) {
        //         return "#02009c";
        //     }

        //     return "#afdcff";
        // }
    }

    const getCropListEnv = (polygon) => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const points = polygon.polygon;

        if (polygon.crop && points?.length > 0) {
            positionEmptyCardRef.current = GoogleMapStore.getBiggerLatitude(points);
            setLoadingPolygon(true);

            noteStore.getEnvCrop(polygon.crop.objectid, cancelToken, (response) => responseGetCropListEnv(polygon, response));
        }
    }

    const responseGetCropListEnv = (polygon, response) => {
        tokenList.remove(response.id);
        setLoadingPolygon(false);
        positionEmptyCardRef.current = null;

        if (response.data) {
            const points = polygon.polygon;
            const biggerpoints = GoogleMapStore.getBiggerLatitude(points);
            const newPolygon = {
                ...polygon,
                crop: {
                    ...response.data,
                    checked: true
                },
                topPosition: biggerpoints
            };

            sessionStore.updateStoredPolygon(newPolygon);
            setCropPolygonsProps((prevState) => (
                [...prevState, newPolygon]
            ));
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const refreshGatewaysRadius = () => {
        GoogleMapStore.getGatewayReference().forEach(gateway => {
            gateway.reference.radius.setRadius(GoogleMapStore.getGatewayRadiusKm() * 1000)
        })
    }

    const handleClickedPolygon = (polygon) => {
        const storedPolygons = sessionStore.getStoredPolygons();
        const clickedPolygon = storedPolygons.find(pol => pol.objectid === polygon.objectid);

        // Não adiciona no array os cards de talhões que já estão abertos, para não repetir talhões
        if (!GoogleMapStore.getCropPolygonsProps().some(cropPol => cropPol.objectid === polygon.objectid) && clickedPolygon) {
            // Desabilita evento de clique nos polígonos e devices
            GoogleMapStore.handleClickableOnMap('polygons', false);
            GoogleMapStore.handleClickableOnMap('devices', false);

            if (clickedPolygon.crop?.checked === undefined) {
                // Chama o GET de crop, caso ainda não tenha sido chamado nesta sessão.
                getCropListEnv(polygon);
            } else {
                // Atualiza o estado com o polygon da local storage.
                let newPolygon = { ...clickedPolygon };

                if (clickedPolygon.topPosition === undefined) {
                    const points = polygon.polygon;
                    const biggerpoints = GoogleMapStore.getBiggerLatitude(points);
                    newPolygon = {
                        ...clickedPolygon,
                        topPosition: biggerpoints
                    };

                    sessionStore.updateStoredPolygon(newPolygon);
                }

                setCropPolygonsProps((prevState) => ([...prevState, newPolygon]));
            }
        }
    }

    //Função genérica que desenha os poligonos passados por parametro em um array.
    const drawPolygons = (polygons) => {
        if (polygons.length > 0) {
            polygons.forEach(pol => {
                if (pol?.polygon) {
                    getNewPolygon(pol);
                }
            });
        }
    }

    //Instancia um polygon do google maps, verificando se é um talhão, poligono de ambiente, ou área, e guarda a referência na GoogleMapsStore.
    const getNewPolygon = (polygon) => {
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        //Se tem crop é um poligono talhão
        if (polygon?.hasOwnProperty('crop')) {
            const points = polygon.polygon.map(coord => new maps.LatLng(coord[1], coord[0]));

            if (points && points.length > 2) { // POLIGONO
                const newPolygon = new maps.Polygon({
                    paths: points,
                    strokeColor: theme.colors.primary[40],
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillOpacity: 0,
                    zIndex: 2
                });
                if (newPolygon?.setMap) {
                    newPolygon.setMap(map);
                }
                GoogleMapStore.storePolygonReference(polygon, newPolygon);

                hoverStatusPolygon(
                    newPolygon,
                    { fillOpacity: 0.2, strokeOpacity: 0.9 },
                    { fillOpacity: 0, strokeOpacity: 0.6 }
                );

                if (GoogleMapStore.getEnableCards()) {
                    maps.event.addListener(newPolygon, 'click', function () {
                        handleClickedPolygon(polygon);
                    });
                }

                return newPolygon;
            } else if (points && points.length === 2) { // CIRCULO
                const rad = maps.geometry.spherical.computeDistanceBetween(points[0], points[1]) / 2;
                const newPolygon = new maps.Circle({
                    strokeColor: theme.colors.primary[40],
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillOpacity: 0,
                    map: mapsReference.current.map,
                    center: GoogleMapStore.getCenterCircle(points),
                    radius: rad,
                    zIndex: 2
                });
                if (newPolygon?.setMap) {
                    newPolygon.setMap(map);
                }
                GoogleMapStore.storePolygonReference(polygon, newPolygon);

                hoverStatusPolygon(
                    newPolygon,
                    { fillOpacity: 0.2, strokeOpacity: 0.9 },
                    { fillOpacity: 0, strokeOpacity: 0.6 }
                );

                if (GoogleMapStore.getEnableCards()) {
                    maps.event.addListener(newPolygon, 'click', function () {
                        handleClickedPolygon(polygon);
                    });
                }

                return newPolygon;
            }
            //Se tem a flag isEnvironment é o poligono de ambiente (nós garantimos isso na implementação, não vem do back)
        } else if (polygon?.isEnvironment) {
            const newPolygon = new maps.Polygon({
                paths: polygon.polygon.map(coord => new maps.LatLng(coord[1], coord[0])),
                strokeColor: theme.colors.primaryContainer,
                strokeOpacity: 0.6,
                strokeWeight: 2,
                fillOpacity: 0,
                zIndex: 1
            });
            if (newPolygon?.setMap) {
                newPolygon.setMap(map);
            }
            GoogleMapStore.storePolygonReference(polygon, newPolygon);

            return newPolygon;

            //Se tem placemarks, é uma área
        } else if (polygon?.hasOwnProperty('placemarks')) {
            const newPolygon = new maps.Polygon({
                paths: polygon.polygon.map(coord => new maps.LatLng(coord[1], coord[0])),
                strokeColor: theme.colors.onPrimaryContainer,
                strokeOpacity: 0.5,
                strokeWeight: 1,
                fillOpacity: 0,
                zIndex: 0
            });
            if (newPolygon?.setMap) {
                newPolygon.setMap(map);
            }
            GoogleMapStore.storeAreaReference(polygon, newPolygon);

            return newPolygon;
        }
    }

    const hoverStatusPolygon = (polygon, styleOver, styleOut) => {
        const maps = mapsReference.current.maps;

        maps.event.addListener(polygon, "mouseover", function () {
            polygon.setOptions(styleOver);
        });

        maps.event.addListener(polygon, "mouseout", function () {
            polygon.setOptions(styleOut);
        });
    }

    const drawSatelliteImage = (imageId) => {
        GoogleMapStore.resetSatelliteReference();

        if (!imageId) {
            return
        }

        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;
        const environmentPolygon = SessionStore.getEnvironmentDetail()?.polygon;
        const bounds = new maps.LatLngBounds();

        environmentPolygon.forEach(point => {
            bounds.extend({ lat: point[1], lng: point[0] });
        });

        if (environmentPolygon) {
            const satelliteOverlay = new maps.GroundOverlay(
                "https://api.prediza.io/api/unsafe/satellite/image/" + imageId,
                bounds,
                {
                    opacity: .7,
                    zindex: 999
                }
            );

            satelliteOverlay.setMap(map);
            GoogleMapStore.storeSatelliteReference(satelliteOverlay);
        }
    }

    const drawInterpolation = (img) => {
        GoogleMapStore.resetInterpolationReference();
        if (!img) {
            return
        }
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        const environmentPolygon = SessionStore.getEnvironmentPolygon()?.Points;
        let bounds = new maps.LatLngBounds();

        environmentPolygon.forEach(p => {
            bounds.extend(p);
        });

        if (environmentPolygon) {
            let interpolationOverlay = new maps.GroundOverlay(
                "https://prediza.io" + img,
                bounds,
                {
                    opacity: .7,
                    zindex: 999
                }
            );

            interpolationOverlay.setMap(map);
            GoogleMapStore.storeInterpolationReference(interpolationOverlay);
        }
    }

    const drawHeatmap = (devices) => {
        drawInterpolation();
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        let measure = MeasureStore.getMeasure();
        let radius = MeasureStore.getNewRadius(measure);
        let g = MeasureStore.getNewGradient(measure);
        let gradient = [];

        g.forEach((item, i) => {
            const { r, g, b, a } = item;
            if (i === 0) {
                gradient.push(`rgba(${r}, ${g}, ${b}, ${0})`);
            }
            gradient.push(`rgba(${r}, ${g}, ${b}, ${a})`);
        });

        let points = devices.map((device) => {
            return { location: new maps.LatLng(device.latitude, device.longitude), weight: device.value }
        })

        let heatmap = new maps.visualization.HeatmapLayer({
            data: points,
            dissipating: true,
            gradient: gradient,
            radius: radius,
        });
        heatmap.setMap(map);

        GoogleMapStore.storeHeatmapReference(heatmap);
    }

    const drawMachines = (environmentMachines) => {
        const map = mapsReference.current.map;
        const maps = mapsReference.current.maps;

        if (environmentMachines) {
            environmentMachines.forEach(impl => {
                let path = new maps.Polyline({
                    strokeColor: "#296CFF",
                    strokeWeight: 5,
                    strokeOpacity: 1,
                    zIndex: 3,
                    path: impl.path,
                    map: map
                });

                const marker_image = {
                    url: ImplementIcon,
                    scaledSize: new maps.Size(32, 32),
                    origin: new maps.Point(0, 0),  // The origin for my image is 0,0.
                    anchor: new maps.Point(16, 16)  // The center of the image is 50,50 (my image is a circle with 100,100)
                };
                let icon = new maps.Marker({
                    position: impl.path[impl.path.length - 1],
                    icon: marker_image,
                    zIndex: 4,
                    map: map
                })
                maps.event.addListener(icon, 'click', function (e) {
                    GoogleMapStore.emit('implement_click', impl);
                });
                GoogleMapStore.storeImplementReference(impl, path, icon);
            });
        }
    }

    const drawDevices = (devices) => {
        const maps = mapsReference.current.maps;
        const map = mapsReference.current.map;

        if (devices.length > 0) {
            devices.forEach(device => {
                const marker_image = {
                    url: PredizaPin,
                    scaledSize: new maps.Size(16, 16),
                    origin: new maps.Point(0, 0),  // The origin for my image is 0,0.
                    anchor: new maps.Point(8, 8)  // The center of the image is 50,50 (my image is a circle with 100,100)
                };

                let pin = new maps.Marker({
                    position: { lat: device.latitude, lng: device.longitude },
                    icon: marker_image,
                    zIndex: 3,
                });
                pin.setMap(map);
                maps.event.addListener(pin, 'click', function (e) {
                    const latLng = e.latLng;

                    // Não adiciona no array os cards de devices que já estão abertos, para não repetir devices
                    if (!GoogleMapStore.getDevicesProps().some(devProps => devProps.deveui === device.deveui)) {
                        GoogleMapStore.storeDevicesProps([...devicesProps, { ...device, show: false, latLng }])
                        setDevicesProps((prevState) => (
                            [...prevState, { ...device, show: false, latLng }]
                        ));
                    }
                });

                GoogleMapStore.storeDeviceReference(device, pin);
            });
        }
    }


    const drawGateways = (gateways) => {
        const maps = mapsReference.current.maps;
        const map = mapsReference.current.map;

        if (gateways.length > 0) {
            gateways.forEach(gateway => {
                if (gateway.latitude && gateway.longitude) {
                    const marker_image = new maps.MarkerImage(
                        GatewayIcon,
                        new maps.Size(20, 20),
                        new maps.Point(0, 0),
                        new maps.Point(10, 10)
                    );
                    const pin = new maps.Marker({
                        position: { lat: gateway.latitude, lng: gateway.longitude },
                        icon: marker_image,
                        zIndex: 3
                    });
                    pin.setMap(map);

                    const newCircle = new maps.Circle({
                        strokeColor: theme.colors.error[40],
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        fillColor: theme.colors.error[40],
                        fillOpacity: 0.2,
                        map: map,
                        center: { lat: gateway.latitude, lng: gateway.longitude },
                        radius: GoogleMapStore.getGatewayRadiusKm() * 1000,
                        clickable: false
                    });

                    GoogleMapStore.storeGatewayReference(gateway, pin, newCircle)
                }
            });
        }
    }

    const drawInmetStations = (stations) => {
        const maps = mapsReference.current.maps;
        const map = mapsReference.current.map;
        const lat = props.environment.latitude;
        const lng = props.environment.longitude;

        if (props.environment.latitude && props.environment.longitude && stations.length > 0) {
            GoogleMapStore.resetInmetReferences();

            let radius = null

            if (!refreshRadiusInmetRef.current) {
                radius = new maps.Circle({
                    strokeColor: theme.colors.error[40],
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: theme.colors.error[40],
                    fillOpacity: 0.2,
                    map: map,
                    center: { lat, lng },
                    radius: sessionStore.getRadius(),
                    clickable: false
                });
            }

            stations.forEach(station => {
                const marker_image = {
                    url: PredizaPin,
                    scaledSize: new maps.Size(16, 16),
                    origin: new maps.Point(0, 0),
                    anchor: new maps.Point(8, 8)
                };

                let pin = new maps.Marker({
                    position: { lat: +station.VL_LATITUDE, lng: +station.VL_LONGITUDE },
                    icon: marker_image,
                    zIndex: 3,
                });
                pin.setMap(map);
                onClickStationInmet(pin, station)
                GoogleMapStore.storeInmetReferences(radius, station, pin);
            });
        }
    }

    const onClickStationInmet = (pin, station) => {
        const maps = mapsReference.current.maps;

        maps.event.addListener(pin, 'click', function () {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            const start = sessionStore.getTime().start;
            const end = sessionStore.getTime().end;
            const params = {
                id: station.CD_ESTACAO,
                start,
                end
            }

            InmetStore.getStationData(cancelToken, params, responseGetStationData);
        });
    }

    const responseGetStationData = (response) => {
        tokenList.remove(response.id);

        if (response.data?.measure && response.data?.Station) {
            const measure = response.data.measure.find(obj => obj.measure === sessionStore.getPreference().measure);

            const station = response.data.Station;
            const newStation = {
                objectid: station.objectid,
                latitude: +station.VL_LATITUDE,
                longitude: +station.VL_LONGITUDE,
                description: station.DC_NOME,
                code: station.CD_ESTACAO,
                measure: {
                    value: measure?.stats?.value || null,
                    max: measure?.stats?.max || null,
                    min: measure?.stats?.min || null,
                    stddev: measure?.stats?.indice || null
                }
            }
            const newStationsProps = [...GoogleMapStore.getInmetStationsProps()];

            newStationsProps.push(newStation);
            GoogleMapStore.storeInmetStationsProps(newStationsProps)
            setInmetStationsProps(newStationsProps);

            if (!measure) {
                setErrorResponse('404');
            }
        }

        if (response.status) {
            setErrorResponse(response.status.toString());
        }
    }

    const responseGetDeviceMeasureStats = (response) => {
        setLoadingDevice(false);
        positionEmptyCardRef.current = null;

        if (response.data) {
            const deviceIndex = devicesProps.findIndex((dev) => { return dev.deveui === response.deveui });
            const newDevicesProps = [...devicesProps];

            newDevicesProps[deviceIndex] = GoogleMapStore.updateDeviceMeasures(devicesProps[deviceIndex], response);
            GoogleMapStore.storeDevicesProps(newDevicesProps);
            setDevicesProps(newDevicesProps);

            const openedDeviceCards = newDevicesProps.some(devProps => devProps.show);

            if (openedDeviceCards) {
                GoogleMapStore.handleClickableOnMap('polygons', false);
            }
        } else {
            const indexDevice = devicesProps.findIndex(devprops => devprops.show === false);

            if (indexDevice > -1) {
                const newDevicesProps = [...devicesProps];

                newDevicesProps.splice(indexDevice, 1);
                GoogleMapStore.storeDevicesProps(newDevicesProps);
                setDevicesProps(newDevicesProps);
            }

            setErrorResponse(response.status.toString());
        }
    }

    const refreshDevicesMeasures = (device) => {
        DeviceStore.getDeviceMeasureStats(device.deveui, device.latLng, responseRefreshDevicesMeasures);
    }

    const responseRefreshDevicesMeasures = (response) => {
        if (response?.data) {
            const deviceIndex = devicesProps.findIndex((dev) => { return dev.deveui === response.deveui });

            refreshedDevicesPropsRef.current.push(GoogleMapStore.updateDeviceMeasures(devicesProps[deviceIndex], response));
        } else {
            devicesProps.forEach(devProps => {
                if (!refreshedDevicesPropsRef.current.find(deviceRef => deviceRef.deveui === devProps.deveui)) {
                    const noMeasuresDevice = {
                        ...devProps,
                        measure: {
                            value: null,
                            max: null,
                            min: null,
                            stddev: null
                        }
                    };

                    refreshedDevicesPropsRef.current.push(noMeasuresDevice);
                }
            })

            setErrorResponse(response || '500');
        }

        // Depois que todos os GETs terminarem, atualiza o devicesProps com as novas measures.
        if (counterDevicesPropsRef.current === refreshedDevicesPropsRef.current.length) {
            GoogleMapStore.storeDevicesProps(refreshedDevicesPropsRef.current);
            setDevicesProps(refreshedDevicesPropsRef.current);
            refreshedDevicesPropsRef.current = [];
        }
    }

    //Função que coloca os widgets na interface do google maps
    const attachWidgets = () => {
        let map = mapsReference.current.map;
        let maps = mapsReference.current.maps;

        const widgets = document.getElementById("WidgetsContainer");
        map.controls[maps.ControlPosition.LEFT_TOP].push(widgets);
    }

    //Função que coloca os controles (componentes personalizados) dentro da interface do google maps
    const attachAdvancedMapControls = () => {
        let map = mapsReference.current.map;
        let maps = mapsReference.current.maps;

        //Insere o menu de funcionalidades(features)
        const menu = document.getElementById('MapSideMenu');
        map.controls[maps.ControlPosition.RIGHT_CENTER].push(menu);

        //Insere a TimeLine e a GradientBar no bottom do google maps
        const bottom = document.getElementById('advancedBottom');
        map.controls[maps.ControlPosition.BOTTOM_CENTER].push(bottom);


        attachPersonalizedMapControls(map, maps);

        //Vincula no onClick desses elementos as funções para dar zoom no google maps, e maximizar a tela
        document.getElementById("AdvancedMapControlsZoomIn").addEventListener("click", function () {
            map.setZoom(map.getZoom() + 1);
        });
        document.getElementById("AdvancedMapControlsZoomOut").addEventListener("click", function () {
            map.setZoom(map.getZoom() - 1);
        });

        const fullscreenButton = document.getElementById("AdvancedMapControlsFullscreenButton");
        // const elementToSendFullscreen = map.getDiv().firstChild;
        const elementToSendFullscreen = document.body;

        fullscreenButton.addEventListener("click", function () {
            const menuBarElement = document.getElementById("menu-bar");
            const googleMapsElement = document.getElementById("google-maps");

            if (GoogleMapStore.isFullscreen(elementToSendFullscreen)) {
                GoogleMapStore.exitFullscreen();
                menuBarElement.style.visibility = 'visible'
                googleMapsElement.style.height = 'calc(100vh - 64px)'
                googleMapsElement.style.marginTop = '0px'
            } else {
                GoogleMapStore.requestFullscreen(elementToSendFullscreen);
                menuBarElement.style.visibility = 'hidden'
                googleMapsElement.style.height = '100vh'
                googleMapsElement.style.marginTop = '-64px'
            }
        });
        document.onwebkitfullscreenchange =
            document.onmsfullscreenchange =
            document.onmozfullscreenchange =
            document.onfullscreenchange =
            function () {
                if (GoogleMapStore.isFullscreen(elementToSendFullscreen)) {
                    fullscreenButton.classList.add("is-fullscreen");
                } else {
                    fullscreenButton.classList.remove("is-fullscreen");
                }
            };
    }

    const attachPersonalizedMapControls = (map, maps) => {
        //Insere os componentes de zoomIn e ZoomOut personalizados
        const fullscreenControl = document.getElementById('AdvancedMapControlsFullscreen');
        map.controls[maps.ControlPosition.TOP_RIGHT].push(fullscreenControl);

        const zoomControl = document.getElementById('AdvancedMapControlsZoom');
        map.controls[maps.ControlPosition.RIGHT_BOTTOM].push(zoomControl);
    }

    //Centraliza o mapa de forma que todos os pontos passados por parametro estejam incluidos na Viewport do mapa
    const centerMapBounds = (points) => {
        if (apiLoadedRef.current && points) {
            let bounds = new mapsReference.current.maps.LatLngBounds();
            points.forEach(point => {
                bounds.extend({ lat: point[1], lng: point[0] })
            });
            mapsReference.current.map.fitBounds(bounds)
        }
    }

    const AdvancedMapMenu = () => {
        return (
            <Grid id='MapSideMenu'>
                <MapSideMenu />
            </Grid>
        )
    }

    const AdvancedBottom = () => {
        return (
            <Grid container id='advancedBottom'>
                <Grid item xs={12}>
                    <Grid container justifyContent='center'>
                        {AdvancedMapGradient()}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {AdvancedTimeline()}
                </Grid>
            </Grid>
        )
    }

    const AdvancedMapGradient = () => {
        return (
            <Grid id='AdvancedGradientBar' style={{ width: "1140px" }}>
                <GradientBar indexGradient={gradientSatellite} evapoGradient={evapoGradient} />
            </Grid>
        )
    }

    const AdvancedTimeline = () => {
        return (
            <Grid id='AdvancedTimeline'>
                <Timeline />
            </Grid>
        )
    }

    const AdvancedMapControlsZoom = () => {
        return (
            <ButtonGroup
                id='AdvancedMapControlsZoom'
                orientation="vertical"
                variant="contained"
                size='medium'
                className={classes.zoomControls}
            >

                <IconButton id="AdvancedMapControlsZoomIn">
                    <ZoomInIcon className={classes.controlIcons} />
                </IconButton>
                <IconButton id="AdvancedMapControlsZoomOut">
                    <ZoomOutIcon className={classes.controlIcons} />
                </IconButton>
            </ButtonGroup>
        )
    }

    const AdvancedMapControlsFullscreen = () => {
        return (
            <ButtonGroup
                id="AdvancedMapControlsFullscreen"
                orientation="vertical"
                variant="contained"
                size='medium'
                className={classes.fullscreenControls}
            >
                <IconButton>
                    <FullscreenIcon id="AdvancedMapControlsFullscreenButton" className={classes.controlIcons} />
                </IconButton>
            </ButtonGroup>
        )
    }

    const getWidgets = () => {
        return (
            <Grid id={"WidgetsContainer"} className={classes.widgetsContainer} spacing={2}>
                {props.widgets.forecast &&
                    <ForecastWidget />
                }
                {props.widgets.evapo &&
                    <EvapoWidget />
                }
                {props.widgets.ch &&
                    <ChillHourWidget />
                }
                {props.widgets.ch10 &&
                    <ChillHour10Widget />
                }
                {props.widgets.cold &&
                    <ColdUnitsWidget />
                }
            </Grid>
        )
    }

    //Função que retorna como o mapa vai ser iniciado, as opções dizem se vai ou não ter controle de zoom, fullScreen, se
    //o mapa vai ser com imagem sattelite ou apenas ruas e lotes.
    const mapOptionsCreator = (map) => {
        return {
            disableDefaultUI: props.disableDefaultControls || false,
            mapTypeId: map.MapTypeId.SATELLITE,
            zoomControl: props.disableDefaultControls ? false : true,
            fullscreenControl: props.disableDefaultControls ? false : true,
        };
    }

    //Função invocada pelo Google Maps quando ele terminar de carregar todas as dependências.
    const handleApiLoaded = (map, maps) => {
        mapsReference.current = { map, maps }
        GoogleMapStore.setMapsReferences(map,maps);
        setApiLoaded(true);
        /*  fitBounds(google.maps.LatLngBounds[, padding]) */
    }

    const removeDeviceCard = (device) => {
        const devIndex = GoogleMapStore.getDevicesProps().findIndex(dev => dev.deveui === device.deveui);
        const newDevicesProps = [...GoogleMapStore.getDevicesProps()];

        newDevicesProps.splice(devIndex, 1);
        GoogleMapStore.storeDevicesProps(newDevicesProps);
        setDevicesProps(newDevicesProps);

        const openedDeviceCards = newDevicesProps.some(devProps => devProps.show);

        if (!openedDeviceCards) {
            GoogleMapStore.handleClickableOnMap('polygons', true);
        }
    }

    const removeStationCard = (station) => {
        const stationIndex = GoogleMapStore.getInmetStationsProps().findIndex(stat => stat.objectid === station.objectid);
        const newInmetStationsProps = [...GoogleMapStore.getInmetStationsProps()];

        newInmetStationsProps.splice(stationIndex, 1);
        GoogleMapStore.storeInmetStationsProps(newInmetStationsProps);
        setInmetStationsProps(newInmetStationsProps);
    }

    const removeCropPolygonCard = (polygon) => {
        const polygonIndex = GoogleMapStore.getCropPolygonsProps().findIndex(cropPol => cropPol.objectid === polygon.objectid);
        const newCropPolygonProps = [...GoogleMapStore.getCropPolygonsProps()];

        newCropPolygonProps.splice(polygonIndex, 1);
        GoogleMapStore.storeCropPolygonsProps(newCropPolygonProps);
        setCropPolygonsProps(newCropPolygonProps);

        // Habilita evento de clique nos polígonos e devices
        GoogleMapStore.handleClickableOnMap('polygons', true);
        GoogleMapStore.handleClickableOnMap('devices', true);
    }

    return (
        <Grid className={classes.googleMapsContainer} id='google-maps'>
            <GoogleMapReact
                bootstrapURLKeys={{
                    libraries: ["visualization", "geometry", "drawing"],
                    key: LocalConfig.googleMapsToken,
                }}
                yesIWantToUseGoogleMapApiInternals={true}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                /*  center={defaultProps.center} */
                options={mapOptionsCreator}
                onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
                {/* Renderização dos cards para os devices */}
                {GoogleMapStore.getEnableCards() && devicesProps.map((device, index) => {
                    return (
                        device.show
                            ? <DeviceCard
                                key={index}
                                style={{ transform: `translate(-50%, -110%)` }}
                                lat={device.latitude}
                                lng={device.longitude}
                                device={device}
                                handleClose={removeDeviceCard}
                                handleInfoMeasure={refreshDevicesMeasures}
                            />
                            : <></>
                    );
                })}
                {/* Enquanto carrega o GET, mostra o skeleton */}
                {GoogleMapStore.getEnableCards() && loadingDevice &&
                    <DeviceCard
                        style={{ transform: `translate(-50%, -110%)` }}
                        lat={positionEmptyCardRef.current[1]}
                        lng={positionEmptyCardRef.current[0]}
                    />
                }

                {/* Renderização dos cards para as estações do Inmet */}
                {GoogleMapStore.getEnableCards() && inmetStationsProps.map((station, index) => {
                    return (
                        <DeviceCard
                            key={index}
                            style={{ transform: `translate(-50%, -110%)` }}
                            lat={station.latitude}
                            lng={station.longitude}
                            device={station}
                            handleClose={removeStationCard}
                        />
                    );
                })}

                {/* Renderização dos cards para os talhões */}
                {GoogleMapStore.getEnableCards() && cropPolygonsProps.map((polygon, index) => {
                    return (
                        <CropPolygonCard
                            key={index}
                            style={{ transform: `translate(-50%, -110%)` }}
                            lat={polygon.topPosition[1]}
                            lng={polygon.topPosition[0]}
                            polygon={polygon}
                            handleClose={removeCropPolygonCard}
                        />
                    );
                })}
                {/* Enquanto carrega o GET, mostra o skeleton */}
                {GoogleMapStore.getEnableCards() && loadingPolygon &&
                    <CropPolygonCard
                        style={{ transform: `translate(-50%, -110%)` }}
                        lat={positionEmptyCardRef.current[1]}
                        lng={positionEmptyCardRef.current[0]}
                    />
                }
            </GoogleMapReact>
            {props.advancedMapControls &&
                AdvancedMapMenu()
            }
            {props.advancedMapControls &&
                AdvancedBottom()
            }
            {(props.advancedMapControls || props.customizedMapControls) &&
                AdvancedMapControlsZoom()
            }
            {(props.advancedMapControls || props.customizedMapControls) &&
                AdvancedMapControlsFullscreen()
            }
            {props.widgets &&
                getWidgets()
            }
            <UserFeedback error={errorResponse} setError={setErrorResponse} message={errorMessageResponse} />
            <Backdrop className={classes.backdrop} open={loader} onClick={() => setLoader(false)}>
                <BeatLoader color={theme.colors.onPrimary} sizeUnit={'px'} size={8} />
            </Backdrop>
        </Grid>
    )
}

GoogleMapsV2.propTypes = {
    environment: PropTypes.object.isRequired,
    environmentBounds: PropTypes.array,
    devices: PropTypes.array,
    areas: PropTypes.array,
    polygons: PropTypes.array,
    gateways: PropTypes.array,
    advancedMapControls: PropTypes.bool,
    customizedMapControls: PropTypes.bool,
    configuration: PropTypes.bool,
    disableDefaultControls: PropTypes.bool,
    page: PropTypes.number,
    widgets: PropTypes.shape({
        forecast: PropTypes.bool,
        gdd: PropTypes.bool,
        ch: PropTypes.bool,
        ch10: PropTypes.bool,
        cold: PropTypes.bool,
        et: PropTypes.bool
    }),
};

export default withStyles(styles)(GoogleMapsV2)