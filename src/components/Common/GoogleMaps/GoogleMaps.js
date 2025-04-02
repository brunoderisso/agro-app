import React, { useState, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import GoogleMapReact from 'google-map-react';

import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";
import BeatLoader from "react-spinners/BeatLoader"
import Slider from '@material-ui/core/Slider';

import Pin from "../../WeatherForecast/PredizaPin";
import EnvironmentStore from "../../../stores/EnvironmentStore";
import toolsUtils from "../../../utils/toolsUtils";
import SessionStore from "../../../stores/SessionStore";
import EvapoStore from "../../../stores/EvapoStore";
import PoligonStore from "../../../stores/PoligonStore";
import MeasureStore from "../../../stores/MeasureStore";
import ChillHourStore from "../../../stores/ChillHourStore"
import GoogleMapsStore from "../../../stores/GoogleMapsStore";
import DeviceStore from "../../../stores/DeviceStore";
import GeoStore from "../../../stores/GeoStore";
import ValidationStore from "../../../stores/ValidationStore";
import tokens from "../../../stores/CancelTokenList";
import deviceStore from '../../../stores/DeviceStore';
import InmetStore from '../../../stores/InmetStore';
import PredizaAlertDialog from "../../PredizaAlertDialog";
import PredizaPin from "../../../img/pins/BluePin.png";
import history from "../../../history";
import styles from "../../../styles/GoogleMaps/GoogleMaps";
import MeasureWidget from "../../widgets/MeasureWidget";
import UserFeedback from '../UserFeedback';
import PolygonList from './PolygonList';
import { LocalConfig } from '../../../LocalConfig';
import Canvas from '../Canvas';
import theme from '../../../styles/Utils/theme';
import { useTranslation } from 'react-i18next';

import MapSideMenu from './MapSideMenu/MapSideMenu';
import GradientBar from './GradientBar';
import Timeline from './Timeline/Timeline';
import { ButtonGroup, IconButton } from '@material-ui/core';
import { ReactComponent as ZoomInIcon } from '../../../img/AdvancedMapIcons/ZoomInIcon.svg';
import { ReactComponent as ZoomOutIcon } from '../../../img/AdvancedMapIcons/ZoomOutIcon.svg';
import { ReactComponent as FullscreenIcon } from '../../../img/AdvancedMapIcons/FullscreenIcon.svg';
import { ConstantsUtils } from '../../../utils/constantsUtils';


const colors = ConstantsUtils.ColorsPolygon;

export default withStyles(styles)(function GMap(props) {
    const [points, setPoints] = useState([]);
    const [defaultProps, setDefaultProps] = useState(null);
    const [pins, setPins] = useState([]);
    const [flags, setFlags] = useState({});
    const [center, setCenter] = useState({});
    const [polCenter, setPolCenter] = useState({});
    const [polygons, setPolygons] = useState([]);
    const [areas, setAreas] = useState([]);
    const [inter, setInter] = useState(null);
    const [device, setDevice] = useState(null);
    const [devices, setDevices] = useState([]);
    const [ITLoader, setITLoader] = useState(true);
    const [anchorVMenu, setAnchorVMenu] = useState(null);
    const [selectedVisualization, setSelectedVisualization] = useState("");
    const [debugValues, setDebugValues] = useState({});
    const [inmetAreaRadius, setInmetAreaRadius] = useState(1000);
    const [area, setArea] = useState(0);
    const [countRequest, setCountRequest] = useState(0);
    const [showGradientBar, setShowGradientBar] = useState(false);

    const { classes } = props;

    //Auxiliares
    let drawedPolygons = [];
    let paintedPoligon = useRef(null);

    //Listeners
    const [editListener, setEditListener] = useState(null);

    //References
    const references = useRef([]);
    const mapsRef = useRef(null);
    const obj = useRef(null);
    const refHM = useRef(null);
    const refIT = useRef(null);
    const timeoutRef = useRef(null);
    const inmetArea = useRef(null);
    const inmetStations = useRef(null);
    const propertyMarkerRef = useRef(null);

    //Flags
    const ITView = useRef(false);
    const EVView = useRef(false);
    const [error, setError] = useState("");
    const tokenList = new tokens();
    const { t } = useTranslation();

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, "config")) {
            setDefaultProps(props.config);
            setPolCenter(props.config.center);
        } else {
            setDefaultProps({
                ...defaultProps,
                center: {
                    lat: -29.1763437,
                    lng: -51.1537301,
                },
                zoom: 15,
            });
            setPolCenter({
                center: {
                    lat: -29.1763437,
                    lng: -51.1537301,
                }
            })
        }
        setPins(props.pins || []);
        setPolygons(props.polygons || []);
        if (props.environment || props.adminDevice || props.page === "ManagementProperty") {
            setCenter(props.config.center || {});
        }

        setFlags({
            dialogIsOpen: false,
            spherical: false,
            geo: false,
            interpolation: false,
        })

        setDebugValues({
            opacity: 0.775,
            blur: 0
        })

        if (!props.environment) {
            getGeometry()
        }

        if (SessionStore.view === "heatmap") {
            timeoutRef.current = setTimeout(init, 3000);
        } else {
            timeoutRef.current = setTimeout(init, 1000);
        }

        if (props.page === "EVAPO") {
            setSelectedVisualization("ETo");
            ITView.current = true;
        }
        if (props.page !== "Report") {
            setSelectedVisualization(t('advancedmap.advanced_collectorViewInterpolation'));
            ITView.current = true;
        }
        if (props.page === "ManagementPolygons") {
            PoligonStore.addListener("delete_poligon", onDeletePoligon);
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getGeometry = () => {
        let interval = setInterval(() => {
            setFlags({
                ...flags,
                spherical: !toolsUtils.isNullOrEmpty(mapsRef, "current.maps.geometry.spherical"),
            })
        }, 1000);
        setInter(interval);
    }


    const clear = () => {
        MeasureStore.removeListeners();

        EvapoStore.removeListener("polygon.click", (pol) => { recenterMap(pol) });
        EvapoStore.removeListener("polygon.stats", listenerStats);
        PoligonStore.removeListener("editable_polygon", (pol) => { setEditablePoligon(pol) });
        PoligonStore.removeListener("delete_poligon", onDeletePoligon);

        ChillHourStore.removeListener("polygon.gdd", (pol) => {
            let color = getGradient(pol)
            setColor(pol, color)
        })

        clearInterval(inter);
        setInter(null);
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
        }
        tokenList.clear();
    }

    useEffect(() => {
        if (flags.spherical) {
            clearInterval(inter)
            drawPolygons(mapsRef.current.map, mapsRef.current.maps);
            setFlags({
                ...flags,
                spherical: false
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flags.spherical]);

    useEffect(() => {
        setPoints([]);

        if (obj.current) {
            obj.current.setMap(null);
            obj.current = null;
        }

        if (mapsRef.current !== null) {
            drawPolygons(mapsRef.current.map, mapsRef.current.maps);
        }

        if ((props.heatmap || props.page === 'AdvancedMap') && polygons.length > 0) {
            getInterpolation();
        }

        if (polygons.length >= 0) {
            setITLoader(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [polygons]);

    useEffect(() => {
        if (props.polygons && props.polygons.length > 0) {
            setPolygons(props.polygons);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.polygons]);

    useEffect(() => {
        if (props.areas && props.areas.length > 0) {
            setAreas(props.areas);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.areas]);

    useEffect(() => {
        if (mapsRef.current !== null) {
            drawAreas(mapsRef.current.map, mapsRef.current.maps);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [areas]);

    useEffect(() => {
        if (countRequest !== 0) {
            setTimeout(() => {
                setCountRequest(0);
            }, 5000);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countRequest]);

    useEffect(() => {
        setDevices(props.devices);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.devices]);

    useEffect(() => {
        if (props.device !== null && props.device !== undefined) {
            setDevice(props.device);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        setPins(props.pins || []);
        setPolygons(props.polygons || []);

        if (props.environment) {
            setCenter(props.config.center || {});
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    //Adiciona o Listener do click no mapa que adiciona pontos no Array de pontos
    useEffect(() => {
        if (props.onCreatePolygon && mapsRef.current !== null) {
            let e = mapsRef.current.map.addListener("click", (E) => {

                const pt = { latitude: E.latLng.lat(), longitude: E.latLng.lng() };
                setPoints(oldArray => [...oldArray, pt]);
            })
            setEditListener(e);

        } else if (!props.onCreatePolygon) {
            if (editListener !== null) {
                mapsRef.current.maps.event.removeListener(editListener);
                setEditListener(null);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onCreatePolygon]);

    //Adiciona o Listener do click no mapa que adiciona pontos no Array de pontos para o poligono de ambiente
    useEffect(() => {
        if (props.onCreateEnvironmentPolygon && mapsRef.current !== null) {
            let e = mapsRef.current.map.addListener("click", (E) => {

                const pt = { latitude: E.latLng.lat(), longitude: E.latLng.lng() };
                setPoints(oldArray => [...oldArray, pt]);
            })
            setEditListener(e);

        } else if (!props.onCreateEnvironmentPolygon) {
            if (editListener !== null) {
                mapsRef.current.maps.event.removeListener(editListener);
                setEditListener(null);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.onCreateEnvironmentPolygon]);

    //Faz o controle dos pontos, toda vez que for adicionado ele desenha e chama o PUT dos pontos, e redesenha o poligono.
    useEffect(() => {
        draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points]);

    useEffect(() => {
        if (mapsRef.current !== null)
            findStationByRadius(mapsRef.current.map, mapsRef.current.maps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inmetAreaRadius]);

    useEffect(() => {
        if (mapsRef.current !== null) {
            let map = mapsRef.current.map;
            let maps = mapsRef.current.maps;
            let environmentPolygon = references.current[0].ref;

            if (props.toggleLocation) {
                let marker = propertyMarkerRef.current;
                environmentPolygon.setMap(null);
                map.addListener("click", (E) => {
                    marker.setMap(null);
                    marker = createMarker({ map, maps }, { lat: E.latLng.lat(), lng: E.latLng.lng() });
                    marker.setMap(map);
                    setCenter({ lat: E.latLng.lat(), lng: E.latLng.lng() });
                    propertyMarkerRef.current = marker;
                })
            } else {
                maps.event.clearListeners(map, 'click');
                onUpdateLocation();
                environmentPolygon.setMap(map);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.toggleLocation]);

    useEffect(() => {
        if (center.altitude) {
            if (props.environment) {
                getEnvironment();
            }
            if (props.adminDevice) {
                getAdminDevice();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center]);

    const init = () => {
        bind();

        if (props.heatmap) {
            MeasureStore.init("heatmap");
        }
    }

    const onDeletePoligon = (pol) => {
        let reference = references.current.find((r) => { return r.id === pol });
        let polygon = reference.ref;
        polygon.setMap(null);
        SessionStore.deleteStoredPolygon(pol);
    }

    //Função usada na criação de um poligono, atualiza o desenho toda vez que um ponto é inserido, modificado ou removido.
    const draw = () => {
        if (points.length === 1) {
            obj.current = new mapsRef.current.maps.Marker({
                position: { lat: points[0].latitude, lng: points[0].longitude },
                map: mapsRef.current.map,
            });
            obj.current.setMap(mapsRef.current.map);
        } else if (points.length === 2) {
            obj.current.setMap(null);

            let radius = mapsRef.current.maps.geometry.spherical.computeDistanceBetween(getCoord(points[0]), getCoord(points[1])) / 2;

            obj.current = new mapsRef.current.maps.Circle({
                strokeColor: "#2196f3",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#2196f3",
                fillOpacity: 0.25,
                map: mapsRef.current.map,
                center: getCenter(),
                radius: radius,
            });
            calculateCircleArea(radius);

            obj.current.setMap(mapsRef.current.map);
        } else if (points.length > 2) {
            obj.current.setMap(null);

            obj.current = new mapsRef.current.maps.Polygon({
                paths: getPoints(points),
                strokeColor: "#2196f3",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: "#2196f3",
                fillOpacity: 0.35,
                editable: true,
            });

            mapsRef.current.maps.event.addListener(obj.current.getPath(), 'set_at', onDragEnd);
            mapsRef.current.maps.event.addListener(obj.current.getPath(), 'insert_at', onDragEnd);
            obj.current.setMap(mapsRef.current.map);

            calculatePoligonArea(obj.current);
        }
    }

    //Função que retorna o centro de um poligono
    const getCenter = () => {
        let lat = (points[0].latitude + points[1].latitude) / 2;
        let lng = (points[0].longitude + points[1].longitude) / 2;

        return { lat, lng };
    }

    const getCoord = (coord) => {
        if (coord[1] && coord[0]) {
            return new mapsRef.current.maps.LatLng(coord[1], coord[0])
        }

        return new mapsRef.current.maps.LatLng(coord[1], coord[0])
    }

    const getEnvironment = () => {
        EnvironmentStore.getEnvironment(props.envId, responseGetEnvironment);
    }

    const getAdminDevice = () => {
        deviceStore.getDevice(props.devId, responseGetAdminDevice);
    }

    const listenerStats = (pol) => {
        showStats(pol);
    }

    const bind = () => {
        EvapoStore.addListener("polygon.click", (pol) => { recenterMap(pol) });
        EvapoStore.addListener("polygon.stats", listenerStats);

        PoligonStore.addListener("editable_polygon", (pol) => { setEditablePoligon(pol) });

        MeasureStore.addListener("measure_init", () => {
            if (mapsRef.current !== null && mapsRef.current.maps.visualization) {
            }
        });

        ChillHourStore.addListener("polygon.gdd", (pol) => {
            let color = getGradient(pol)
            setColor(pol, color)
        })
    }

    //Função que atualiza o centro do mapa. (ao clicar em um poligono, ao settar o pin de um device, ou a marca de um ambiente)
    const recenterMap = (pol) => {
        if (pol.centroid && pol.centroid[0] !== 0) {
            if (props.window && props.window.width < 600) {
                setPolCenter({
                    lat: pol.centroid[0] + 0.002,
                    lng: pol.centroid[1]
                })
            } else {
                setPolCenter({
                    lat: pol.centroid[0],
                    lng: pol.centroid[1]
                })
            }

            if (props.page === "ManagementPolygons") {
                changeColor(pol, "#00FF00")
            }
            return
        }
        if (pol.Points !== null && pol.Points.length > 0) {
            setPolCenter({
                lat: pol.Points[0].latitude,
                lng: pol.Points[0].longitude
            })
        }
    }

    const responseGetAdminDevice = (response) => {
        let dev = response;

        dev = {
            ...dev,
            latitude: parseFloat(center.lat),
            longitude: parseFloat(center.lng),
            altitude: center.altitude || null
        }

        updateAdminDevice(dev);
    }
    const responseGetEnvironment = (response) => {
        let env = response;
        env = {
            ...env,
            latitude: center.lat,
            longitude: center.lng,
            altitude: center.altitude || null
        }
        updateEnvironment(env);
    }

    const updateAdminDevice = (dev) => {
        setFlags({
            ...flags,
            dialogIsOpen: false,
        })
        deviceStore.updateDevice(dev, () => {
            history.push("/admin/devices");
        });
    }

    const updateEnvironment = (env) => {
        env.latitude = parseFloat(env.latitude);
        env.longitude = parseFloat(env.longitude);
        setFlags({
            ...flags,
            dialogIsOpen: false,
        })
        EnvironmentStore.updateEnvironment(env, () => {
            history.push("/admin/environments");
        });
    }

    //Função que calcula os Bounds (área que inclui todos os pontos) de um poligono.
    const getPolygonBounds = (pol) => {
        let bounds = new mapsRef.current.maps.LatLngBounds();
        let points = pol.Points || [];

        points.forEach(p => {
            bounds.extend({ lat: p.latitude, lng: p.longitude });
        });

        return bounds;
    }

    //Função que adiciona o overlay da imagem de interpolação no mapa centralizada no poligono do ambiente.
    const responseInterpolation = (response) => {
        tokenList.remove(response.id);
        setITLoader(false);

        if (response.data !== null && response.data.url !== null) {
            let bounds = getPolygonBounds(response.pol);

            let interpolationOverlay = new mapsRef.current.maps.GroundOverlay(
                "https://prediza.io" + response.data.url,
                bounds,
                {
                    opacity: debugValues.opacity,
                    zindex: 999
                }
            );

            refIT.current = interpolationOverlay;
            interpolationOverlay.setMap(mapsRef.current.map);

            const interpolationAdminDebug = document.getElementById('AdminControlsDebug');

            mapsRef.current.map.controls[mapsRef.current.maps.ControlPosition.TOP_CENTER].push(interpolationAdminDebug);

        } else {
            if (refHM.current === null)
                getGeodata();
        }
    }

    const responseETOInterpolation = (response) => {
        tokenList.remove(response.id);

        if (response.data !== null && response.data.url !== null) {
            let bounds = getPolygonBounds(response.pol);

            setITLoader(false);

            let interpolationOverlay = new mapsRef.current.maps.GroundOverlay(
                "https://prediza.io" + response.data.url,
                bounds,
                {
                    opacity: debugValues.opacity,
                    zindex: 999
                }
            );

            refIT.current = interpolationOverlay;
            interpolationOverlay.setMap(mapsRef.current.map);

            const interpolationButton = document.getElementById('GMapToggleVisualization');
            const interpolationAdminDebug = document.getElementById('AdminControlsDebug');

            mapsRef.current.map.controls[mapsRef.current.maps.ControlPosition.TOP_RIGHT].push(interpolationButton);
            mapsRef.current.map.controls[mapsRef.current.maps.ControlPosition.TOP_CENTER].push(interpolationAdminDebug);
        }
    }

    const handleClickVisualization = (event) => {
        setAnchorVMenu(event.currentTarget);
    };

    //Alternar entre os tipos de visualização
    const handleClickItemVisualization = (item) => {
        setSelectedVisualization(item);

        if (item === t('advancedmap.advanced_collectorViewInterpolation')) {
            setShowGradientBar(false);
            if (EVView.current)
                clearEvapo();

            if (refIT.current !== null)
                refIT.current.setMap(mapsRef.current.map);

            if (refHM.current !== null)
                refHM.current.setMap(null);

            ITView.current = true;
        }

        if (item === t('advancedmap.advanced_collectorViewIntensity')) {
            setShowGradientBar(false);
            if (EVView.current)
                clearEvapo();

            if (refIT.current !== null)
                refIT.current.setMap(null);

            if (refHM.current === null)
                getGeodata();

            if (refHM.current !== null)
                refHM.current.setMap(mapsRef.current.map);

            ITView.current = false;
        }

        if (item === "Evapo") {
            setShowGradientBar(true);
            if (refHM.current !== null)
                refHM.current.setMap(null);

            if (refIT.current !== null)
                refIT.current.setMap(null);

            getEvapoData();
        }

        setAnchorVMenu(null);
    }

    const onToggleVisualization = () => {
        let f = ITView.current;

        if (f) {
            setSelectedVisualization("ETc");
            if (refIT.current !== null)
                refIT.current.setMap(null);

            resetAllPoligons();

        } else {
            setSelectedVisualization("ETo");
            if (refIT.current !== null)
                refIT.current.setMap(mapsRef.current.map);

            hideAllPoligons();
        }

        ITView.current = !f;
    }

    const hideAllPoligons = () => {
        if (references.current !== null) {
            references.current.map((item) => {
                return item.ref.setOptions({ fillOpacity: 0 });
            })
        }
    }

    const resetAllPoligons = () => {
        if (references.current !== null) {
            polygons.forEach((pol) => {
                if (pol.isvisible) {
                    let ref = references.current.find((ref) => { return ref.name === pol.name });
                    if (ref !== undefined) {
                        ref.ref.setOptions({ fillColor: getGradient(pol), fillOpacity: 0.7 });
                    }
                }
            })
        }
    }

    const handleChangeOpacity = (event, newValue) => {
        setDebugValues({
            ...debugValues,
            opacity: newValue
        })
        refIT.current.setOptions({ opacity: newValue });
    };

    const handleChangeAreaRadius = (event, newValue) => {
        setInmetAreaRadius(newValue);
    };

    const menuAdminControls = () => {
        return (
            <Grid id='AdminControlsDebug' item xs style={{ minWidth: "100px" }}>
                <Slider value={debugValues.opacity} min={0} step={0.025} max={1} onChange={handleChangeOpacity} aria-labelledby="Opacity Slider" />
            </Grid>
        )
    }

    const inmetAreaControl = () => {
        return (
            <Grid id='inmetAreaControl' item xs style={{ minWidth: "100px" }}>
                <Slider value={inmetAreaRadius} min={1000} step={10000} max={100 * 1000} onChange={handleChangeAreaRadius} aria-labelledby="Opacity Slider" />
            </Grid>
        )
    }

    //Componente de troca de visualização (Heatmap, interpolation)
    const menuTypesVisualization = () => {
        return (
            <div>
                <Button id='GMapTypeVisualization' style={{ background: "white", marginTop: "10px", marginRight: "10px" }} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClickVisualization}>
                    {selectedVisualization}
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorVMenu}
                    keepMounted
                    open={Boolean(anchorVMenu)}
                    onClose={() => { setAnchorVMenu(null) }}
                >
                    <MenuItem onClick={() => { handleClickItemVisualization(t('advancedmap.advanced_collectorViewInterpolation')) }}>{t('advancedmap.advanced_collectorViewInterpolation')}</MenuItem>
                    <MenuItem onClick={() => { handleClickItemVisualization(t('advancedmap.advanced_collectorViewIntensity')) }}>{t('advancedmap.advanced_collectorViewIntensity')}</MenuItem>
                    <MenuItem onClick={() => { handleClickItemVisualization("Evapo") }}>{t('measures._ETO')}</MenuItem>
                </Menu>
            </div>
        )
    }

    const AdvancedMapMenu = () => {
        return (
            <Grid id='MapSideMenu'>
                <MapSideMenu />
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
                <IconButton >
                    <FullscreenIcon id="AdvancedMapControlsFullscreenButton" className={classes.controlIcons} />
                </IconButton>
            </ButtonGroup>
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
                <GradientBar />
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

    const buttonToggleVisualization = () => {
        return (
            <Button id='GMapToggleVisualization' style={{ background: "white", marginTop: "10px", marginRight: "10px" }} aria-controls="simple-menu" aria-haspopup="true" onClick={onToggleVisualization}>
                {selectedVisualization}
            </Button>
        )
    }

    //Função para obter a URL da imagem de interpolação pro poligono do ambiente se houver
    const getInterpolation = () => {
        let pol = null;

        if (polygons.length > 0 && polygons[0]) {
            pol = polygons.find(element => element.isenvironment === true);
        } else {
            return
        }

        let count = countRequest;
        count = count + 1;
        setCountRequest(count);
        setITLoader(false);

        if (pol !== undefined) {
            if (countRequest < 1) {
                let cancelToken = {};
                cancelToken.id = tokenList.add();
                cancelToken.token = tokenList.get(cancelToken.id);
                GoogleMapsStore.getURLInterpolation(pol, cancelToken, responseInterpolation);
            }
        }
    }

    const getETOInterpolation = () => {
        let pol = polygons.find(element => element.isenvironment === true);

        if (pol !== undefined) {

            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            GoogleMapsStore.getETO_URLInterpolation(pol, cancelToken, responseETOInterpolation);
        }
    }

    const findStationByRadius = (map, maps) => {
        if (inmetArea.current !== null) {
            inmetArea.current.setMap(null);
        }

        let findArea = new maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: "#FF0000",
            fillOpacity: 0.1,
            map: map,
            center: defaultProps.center,
            radius: inmetAreaRadius,
        });
        map.fitBounds(findArea.getBounds());
        getInmetStations();
        inmetArea.current = findArea;
    }

    const getInmetStations = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let params = {
            latitude: defaultProps.center.lat,
            longitude: defaultProps.center.lng,
            limit: inmetAreaRadius
        }
        InmetStore.getStations(cancelToken, params, responseGetStations);
    }

    const responseGetStations = (response) => {
        tokenList.remove(response.id);

        if (response.data !== null) {
            drawStations(response.data);
        }
    }

    const drawStations = (stations) => {
        if (inmetStations.current !== null) {
            inmetStations.current.forEach(element => {
                element.setMap(null);
            });
        }

        let references = [];

        stations.forEach(station => {

            let marker = new mapsRef.current.maps.Marker({
                position: { lat: parseFloat(station.VL_LATITUDE), lng: parseFloat(station.VL_LONGITUDE) },
                map: mapsRef.current.map,
            });

            mapsRef.current.maps.event.addListener(marker, 'click', function (e) {
                var latLng = e.latLng;
                attachStationInfoWindow(station, latLng);
            });

            references.push(marker);
        });

        inmetStations.current = references;
    }

    const commonContentRightScreen = (map) => {
        const fullscreenControl = document.getElementById('AdvancedMapControlsFullscreen');
        map.controls[mapsRef.current.maps.ControlPosition.TOP_RIGHT].push(fullscreenControl);

        const zoomControl = document.getElementById('AdvancedMapControlsZoom');
        map.controls[mapsRef.current.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControl);

        document.getElementById("AdvancedMapControlsZoomIn").addEventListener("click", function () {
            map.setZoom(map.getZoom() + 1);
        });
        document.getElementById("AdvancedMapControlsZoomOut").addEventListener("click", function () {
            map.setZoom(map.getZoom() - 1);
        });

        const fullscreenButton = document.getElementById("AdvancedMapControlsFullscreenButton");
        const elementToSendFullscreen = map.getDiv().firstChild;

        fullscreenButton.addEventListener("click", function () {
            if (isFullscreen(elementToSendFullscreen)) {
                exitFullscreen();
            } else {
                requestFullscreen(elementToSendFullscreen);
            }
        });
        document.onwebkitfullscreenchange =
            document.onmsfullscreenchange =
            document.onmozfullscreenchange =
            document.onfullscreenchange =
            function () {
                if (isFullscreen(elementToSendFullscreen)) {
                    fullscreenButton.classList.add("is-fullscreen");
                } else {
                    fullscreenButton.classList.remove("is-fullscreen");
                }
            };
    }

    const initializeHeatmap = () => {
        let interval = setInterval(() => {
            if (devices.length > 0) {
                setPinsDevices(mapsRef.current.map, mapsRef.current.maps);
                clearInterval(interval);
            }
        }, 1000);

        const interpolationButton = document.getElementById('GMapTypeVisualization');
        mapsRef.current.map.controls[mapsRef.current.maps.ControlPosition.TOP_RIGHT].push(interpolationButton);

        commonContentRightScreen(mapsRef.current.map);
    }

    const createMarker = ({ map, maps }, position, img) => {
        const image = img || "https://cdn-icons-png.flaticon.com/64/1196/1196783.png";

        let p = position || center;
        let propertyMarker = new maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            icon: image,
            animation: maps.Animation.DROP
        });

        propertyMarker.addListener("click", () => {
            SessionStore.emit("Property_click", polygons[0] || null);
        })

        return propertyMarker;
    }

    const initializePropertyManager = (map, maps) => {
        setTimeout(() => {
            let propertyMarker = createMarker({ map, maps });
            propertyMarker.setMap(map);

            propertyMarkerRef.current = propertyMarker;
        }, 1000);
        if (polygons[0]) {
            let p = polygons[0];
            var bounds = new mapsRef.current.maps.LatLngBounds();

            if (p.Points) {
                p.Points.forEach(point => {
                    bounds.extend({ lat: point.latitude, lng: point.longitude });
                });
                bounds.extend(center);
                mapsRef.current.map.fitBounds(bounds);
            }
        }
    }

    //Equivalente a função Init(), chamada automaticamente peloo google maps quando ele termina de carregar todas as libs necessárias.
    const handleApiLoaded = (map, maps) => {
        mapsRef.current = { map, maps }

        if (device !== null) {
            setPinDevice(device);
        }

        if (props.environment || props.adminDevice) {
            drawEnvironment(map, maps);
        }

        if (props.heatmap) {
            initializeHeatmap();
        }

        if (props.inmet) {
            const inmetAreaControl = document.getElementById('inmetAreaControl');
            map.controls[maps.ControlPosition.TOP_CENTER].push(inmetAreaControl);

            findStationByRadius(map, maps);
        }

        if (props.page === "EVAPO") {
            getETOInterpolation();
        }

        if (props.page === "ManagementProperty") {
            initializePropertyManager(map, maps);
        }

        if (props.widgets) {
            const widget = document.getElementById('MeasureWidget');
            map.controls[mapsRef.current.maps.ControlPosition.RIGHT_CENTER].push(widget);
        }

        if (props.page === "AdvancedMap") {
            setPinsDevices(mapsRef.current.map, mapsRef.current.maps);

            const menu = document.getElementById('MapSideMenu');
            map.controls[mapsRef.current.maps.ControlPosition.RIGHT_CENTER].push(menu);

            const bottomContent = document.getElementById('advancedBottom');
            map.controls[mapsRef.current.maps.ControlPosition.BOTTOM_CENTER].push(bottomContent);

            commonContentRightScreen(map);
        }

    };

    const isFullscreen = (element) => {
        return (
            (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) === element
        );
    }

    const requestFullscreen = (element) => {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullScreen) {
            element.msRequestFullScreen();
        }
    }

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    //Função que adiciona uma marca na edição da localização do ambiente
    const drawEnvironment = (map, maps) => {

        let marker = new maps.Marker({
            position: { lat: center.lat, lng: center.lng },
            map: map,
        });

        map.addListener("click", (E) => {
            marker.setMap(null);
            marker = new maps.Marker({
                position: { lat: E.latLng.lat(), lng: E.latLng.lng() },
                map: map,
            });
            marker.setMap(map);
            setCenter({ lat: E.latLng.lat(), lng: E.latLng.lng() });
        })
    }

    //Função que desenha o pin do device no mapa (usada nos devices)
    const setPinDevice = (device) => {
        let pin = new mapsRef.current.maps.Marker({
            position: { lat: device.latitude, lng: device.longitude },
            map: mapsRef.current.map,
        });
        attachPolygonInfoWindow(device.description || device.tag, pin, mapsRef.current.map, mapsRef.current.maps);
        pin.setMap(mapsRef.current.map);
    }

    const getUnity = (val) => {
        let m = MeasureStore.measures[0];
        let meta = SessionStore.getEnvironmentMeta(m);

        let unity = meta.ylegend || "";

        return val + " " + unity;
    }

    const getStd = (val) => {
        let meta = MeasureStore.getMeasureDetail(MeasureStore.measures[0]);
        meta = meta.meta || null;

        if (meta !== null && meta.precision) {
            return parseFloat(val).toFixed(meta.precision);
        } else {
            return parseFloat(val).toFixed(1);
        }
    }

    //Função que monta o body da tooltip do device no heatmap
    const getInfos = (dev, info) => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="overline">
                        {(dev.description && dev.description.toUpperCase()) || (dev.tag && dev.tag.toUpperCase())}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        {getUnity(info.last) + " ±" + getStd(info.stddev)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="button">
                        {MeasureStore.getMeasureDetail(MeasureStore.measures[0]).meta.title || "Medida"}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        {`${t('common.maximum')}: ` + getUnity(info.max)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        {`${t('common.minimum')}: ` + getUnity(info.min)}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    const getInfoStation = (station) => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="overline">
                        {station.CD_ESTACAO &&
                            station.CD_ESTACAO.toUpperCase()
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle">
                        {station.DC_NOME &&
                            station.DC_NOME.toUpperCase()
                        }
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    //Função que desenha os pins no google maps representando a localização dos Devices (Usada no Heatmap)
    const setPinsDevices = (map, maps) => {
        if (devices !== undefined) {
            devices.forEach(dev => {
                var marker_image = new maps.MarkerImage(
                    PredizaPin,
                    new maps.Size(20, 20),
                    // The origin for my image is 0,0.
                    new maps.Point(0, 0),
                    // The center of the image is 50,50 (my image is a circle with 100,100)
                    new maps.Point(8, 8)
                );
                let pin = new maps.Marker({
                    position: { lat: dev.latitude, lng: dev.longitude },
                    icon: marker_image,
                    map: map,
                });
                pin.setMap(map);

                maps.event.addListener(pin, 'click', function (e) {
                    var latLng = e.latLng;
                    DeviceStore.getDeviceMeasurel(dev.deveui, latLng, responseStats);
                });
            });
        }
    }

    const responseStats = (response) => {
        if (response.status) {
            setError(response.status.toString());

            return;
        }

        let dev = devices.filter((val) => {
            return val.deveui === response.device;
        });

        if (dev.length === 1) {
            dev = dev[0];
        }

        let data = response.data;
        let latLng = response.coord;

        attachDeviceInfoWindow(dev, data, latLng);
    }

    //Função que pega os dados pro Heatmap
    const getGeodata = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        GeoStore.getGeodata(getMeasure(), cancelToken, responseGetGeodata);
    }

    const getEvapoData = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let parameters = SessionStore.getTime();
        EvapoStore.getEvapo(cancelToken, parameters, responseGetEvapoData);
    }

    const responseGetEvapoData = (response) => {
        if (EVView.current === false) {
            if (response.data?.poligonos) {
                let pols = response.data.poligonos;
                pols.forEach(pol => {
                    if (pol.etc === null) {
                        showStats({ ...pol, etc: response.data.eto });
                    } else {
                        showStats(pol);
                    }
                });
                EVView.current = true;
            }
        }
    }

    const clearEvapo = () => {
        polygons.forEach(pol => {
            showStats(pol);
        });

        EVView.current = false;
    }

    const getMeasure = () => {
        return MeasureStore.measures[0];
    };

    const responseGetGeodata = (response) => {
        let pts = [];
        tokenList.remove(response.id);

        if (response !== null && response !== undefined && response.data !== undefined) {
            response.data.forEach(dev => {
                pts.push({ location: new mapsRef.current.maps.LatLng(dev.latitude, dev.longitude), weight: Math.abs(dev.value) });
            });
            drawHeatmap(pts);
        }
    }

    //Função que cria e guarda as referências dos Heatmaps dos devices.
    const drawHeatmap = (points) => {
        if (refHM.current) {
            refHM.current.setMap(null);
        }
        let measure = MeasureStore.measures[0];
        let radius = MeasureStore.getNewRadius(measure);

        //Monta Gradient
        let g = MeasureStore.getNewGradient(measure);
        let gradient = [];
        gradient.push('rgba(' + g[0].r + "," + g[0].g + "," + g[0].b + ", 0)");
        g.forEach(e => {
            gradient.push(e.hex);
        });

        let heatmap = new mapsRef.current.maps.visualization.HeatmapLayer({
            data: points,
            dissipating: true,
            gradient: gradient,
            radius: radius,
        });
        heatmap.setMap(mapsRef.current.map);
        setSelectedVisualization(t('advancedmap.advanced_collectorViewIntensity'));
        refHM.current = heatmap;
    }

    const undoLocation = () => {
        let marker = propertyMarkerRef.current;
        let map = mapsRef.current.map;
        let maps = mapsRef.current.maps;
        marker.setMap(null);
        let environment = SessionStore.getEnvironmentDetail();
        let position = { lat: environment.latitude, lng: environment.longitude };
        marker = createMarker({ map, maps }, position);
        marker.setMap(map);
        setCenter(position);
    }

    const toggleDialog = () => {
        setFlags({ ...flags, dialogIsOpen: false });

        if (refHM.current === null)
            getGeodata();

        if (props.page === "ManagementProperty") {
            undoLocation();
        }

    };

    const onDragEnd = (map) => {
        let pts = obj.current.getPath();
        let result = [];
        for (let i = 0; i < pts.getLength(); i++) {
            result.push({ latitude: pts.getAt(i).lat(), longitude: pts.getAt(i).lng() });
        }
        setPoints(result);
    }

    const onSubmit = () => {
        getAltitude();
    }

    //Função que usa a API Elevation para calcular a altitude de um ponto (Usada no environment admin)
    const getAltitude = () => {
        const elevator = new mapsRef.current.maps.ElevationService();
        const location = new mapsRef.current.maps.LatLng(center.lat, center.lng);
        EnvironmentStore.getEnvironmentAltitude(elevator, location, responseAltitude);

    }

    const responseAltitude = (response) => {
        setCenter({
            ...center,
            altitude: response,
        })
    }

    //Função que adiciona um Tooltip em um ponto de device.
    function attachDeviceInfoWindow(dev, data, latLng) {
        var infoWindow = new mapsRef.current.maps.InfoWindow({
            maxWidth: 220,
            position: latLng,
            content: renderToString(getInfos(dev, data)),
        });

        infoWindow.open(mapsRef.current.map);
    }

    function attachStationInfoWindow(station, latLng) {
        var infoWindow = new mapsRef.current.maps.InfoWindow({
            maxWidth: 220,
            position: latLng,
            content: renderToString(getInfoStation(station)),
        });

        infoWindow.open(mapsRef.current.map);
    }

    //Função que adiciona um Tooltip em um object que é exibido ao clicar no mesmo, no google maps.
    function attachPolygonInfoWindow(content, object, map, maps) {
        var infoWindow = new maps.InfoWindow({
            content: content,
            maxWidth: 220,
        });
        maps.event.addListener(object, 'click', function (e) {
            var latLng = e.latLng;
            infoWindow.setPosition(latLng);
            infoWindow.open(map);
        });
    }

    //Função usada para destacar o poligono, e mostrar as informações do talhão no caderno de campo
    const onClickPol = (pol) => {
        if ((props.page === "Notebook" || props.page === "ManagementProperty" || props.page === "ManagementPolygons") && EVView.current === false) {
            PoligonStore.clickPoligonMap(pol);
            recenterMap(pol);
            changeColor(pol, "#4285F4");
        }

    }

    //Função que pinta o poligono com o resultado da EVAPO
    const showStats = (pol) => {
        if (pol.isenvironment)
            return

        if (references.current !== undefined && references.current.length > 0 && pol.Points !== null && pol.Points.length > 0) {
            let fil = references.current.filter((obj) => {
                return obj.id === pol.objectid
            })
            if (fil.length === 1) {
                if (fil[0].ref.get('fillColor') !== '#FFFFFF') {
                    fil[0].ref.setOptions({ fillColor: "#FFFFFF", fillOpacity: 0.1 });
                } else {
                    fil[0].ref.setOptions({ fillColor: getGradient(pol), fillOpacity: 0.7 });
                }
            }
        }
    }

    //Função que troca a cor de um poligono passado por parametro, e atualiza a referência do poligono pintado
    const changeColor = (pol, color) => {

        if (references.current !== undefined && references.current.length > 0 && pol.Points !== null && pol.Points.length > 0) {
            let fil = references.current.filter((obj) => {
                return obj.id === pol.objectid
            })

            if (fil.length === 1) {
                if (paintedPoligon.current !== null) {
                    paintedPoligon.current.ref.setOptions({ fillColor: "#FFFFFF", fillOpacity: 0.1 });
                    if (paintedPoligon.current.id === fil[0].id) {
                        fil[0].ref.setOptions({ fillColor: "#FFFFFF", fillOpacity: 0.1 })
                        return
                    }
                }

                fil[0].ref.setOptions({ fillColor: color, fillOpacity: 0.7 });
                paintedPoligon.current = fil[0];
            }
        }
    }

    //Setta a cor de um poligono passado por parametro.
    const setColor = (pol, color) => {
        if (references.current !== undefined && references.current.length > 0 && pol.Points !== null && pol.Points.length > 0 && !props.heatmap) {
            let fil = references.current.filter((obj) => {
                return obj.name === pol.name
            })
            if (fil.length === 1) {
                fil[0].ref.setOptions({ fillColor: color, fillOpacity: 0.7 });
            }
        }
    }

    //Função que calcula o Gradiente pra EVAPO e HF
    const getGradient = (pol) => {
        let et = pol.etc || props.info.eto;

        if (props.page !== "HF") {
            if (et === null) {
                return "#7e7e7e";
            }
            //Necessita irrigação
            let indice = Math.round(1.29 + 0.57 * (et) + (-1) * ((0.00741) * (et ** 2)));
            if (indice >= colors.length) {
                return colors[colors.length - 1]
            }

            return colors[indice];
        }

        if (props.page === "HF") {
            let hf = pol.chill || props.info.chill;

            if (hf < 100) {
                return "#e80002";
            }
            else if (hf >= 100 && hf < 200) {
                return "#f49c02";
            }
            else if (hf >= 200 && hf < 300) {
                return "#efff0b";
            }
            else if (hf >= 300 && hf < 400) {
                return "#01eefe";
            }
            else if (hf >= 400 && hf < 500) {
                return "#016eff";
            }
            else if (hf >= 500 && hf < 600) {
                return "#0300ff";
            }
            else if (hf >= 600) {
                return "#02009c";
            }

            return "#afdcff";
        }
    }

    //Função que usa a API Geometry do google maps pra calcular a área de um poligono.
    const calculatePoligonArea = (obj) => {
        if (mapsRef.current) {
            let areaCalc = mapsRef.current.maps.geometry.spherical.computeArea(obj.getPath());

            setArea(areaCalc);
        }
    }

    const calculateCircleArea = (radius) => {
        setArea(Math.PI * Math.pow(radius, 2));
    }

    //Função que retorna pra função save() passada por parametros os pontos e o objectid do poligono circular após as modificações.
    const onEditCircle = (polygon) => {
        let ref = references.current.filter((val) => {
            return val.id === polygon.objectid;
        })

        if (ref.length === 1) {
            let result = [
                { latitude: ref[0].ref.getBounds().getNorthEast().lat(), longitude: ref[0].ref.getBounds().getCenter().lng() },
                { latitude: ref[0].ref.getBounds().getSouthWest().lat(), longitude: ref[0].ref.getBounds().getCenter().lng() }
            ];

            props.save(result, polygon.objectid);
        }
    }

    const pathToPoints = (path) => {
        let pts = path;
        let result = [];

        for (let i = 0; i < pts.getLength(); i++) {
            result.push({ latitude: pts.getAt(i).lat(), longitude: pts.getAt(i).lng() });
        }

        return result;
    }

    //Função que é chamada toda vez que um poligono sofre modificação.
    const onEditPoligon = (polygon) => {
        let ref = references.current.filter((val) => {
            return val.id === polygon.objectid;
        })

        if (ref.length === 1) {
            let path = ref[0].ref.getPath();
            let result = pathToPoints(path);

            props.save(result, polygon.objectid);
        }
    }

    const attachPolygonListener = (polygon, pol) => {
        if (props.page === "ManagementProperty") {
            mapsRef.current.maps.event.addListener(polygon, "mouseover", function (e, latLng) {
                if (!polygon.getEditable()) {
                    polygon.setOptions({ fillColor: "#008800", fillOpacity: .4 });
                }
            });

            mapsRef.current.maps.event.addListener(polygon, "mouseout", function () {
                polygon.setOptions({ fillColor: "#FFFFFF", fillOpacity: .1 });
            });

        }
    }

    const drawAreas = (map, maps) => {
        if (areas !== undefined && areas[0] !== undefined && areas[0].objectid) {
            areas.forEach((a, index) => {
                var polygon = null;
                var points = PoligonStore.stringToArray(a.bounds);
                if (points) {
                    polygon = new maps.Polygon({
                        paths: getPoints(points),
                        strokeColor: "#FF0000",
                        strokeOpacity: 0.5,
                        strokeWeight: 4,
                        fillColor: "#FFFFFF",
                        fillOpacity: .1,
                        indexID: index,
                    });
                    polygon.setMap(map);
                }
            });
        }
    }

    const cleanReferences = (refs) => {
        refs.forEach(obj => {
            if (obj.ref) {
                obj.ref.setMap(null);
            }
        })

    }

    //Função que desenha a lista de poligonos passados por props.
    const drawPolygons = (map, maps) => {
        const oldReferences = [...references.current];
        references.current = [];

        if (polygons) {
            polygons.forEach((pol, index) => {
                let polygon = null;

                if (pol.polygon) {
                    if (pol.polygon.length > 2) {
                        if (pol.isenvironment) {
                            polygon = new maps.Polygon({
                                paths: getPoints(pol.polygon),
                                strokeColor: "#0053DB",
                                strokeOpacity: 0.5,
                                strokeWeight: 4,
                                fillColor: "#FFFFFF",
                                fillOpacity: .2,
                                clickable: props.page !== "ManagementPolygons",
                                indexID: index,
                                zIndex: 0
                            });

                            attachPolygonListener(polygon, pol);

                        } else {
                            polygon = new maps.Polygon({
                                paths: getPoints(pol.polygon),
                                strokeColor: "#005293",
                                strokeOpacity: 0.8,
                                strokeWeight: 3,
                                fillColor: "#FFFFFF",
                                fillOpacity: 0,
                                clickable: true,
                                indexID: index,
                                zIndex: 1
                            });
                        }
                        polygon.setMap(map);

                        if (props.page === "ManagementPolygons" && pol.isenvironment) {

                        } else {
                            maps.event.addListener(polygon, 'click', () => { onClickPol(pol) });
                        }
                    } else if (pol.polygon.length === 2) {
                        const lat = (pol.polygon[0][1] + pol.polygon[1][1]) / 2;
                        const lng = (pol.polygon[0][0] + pol.polygon[1][0]) / 2;

                        polygon = new maps.Circle({
                            strokeColor: "#005293",
                            strokeOpacity: 0.8,
                            strokeWeight: 4,
                            fillColor: "#FFFFFF",
                            fillOpacity: 0.1,
                            map: map,
                            center: { lat, lng },
                            radius: mapsRef.current.maps.geometry.spherical.computeDistanceBetween(getCoord(pol.polygon[0]), getCoord(pol.polygon[1])) / 2,
                        });
                        polygon.setMap(map);
                        maps.event.addListener(polygon, 'click', () => { onClickPol(pol) });
                    }
                }

                if (pol.polygon?.length === 2) {
                    polygon.addListener('radius_changed', () => { onEditCircle(pol) });
                    polygon.addListener('center_changed', () => { onEditCircle(pol) });
                }

                if (pol.polygon?.length > 2) {
                    mapsRef.current.maps.event.addListener(polygon.getPath(), 'set_at', () => { onEditPoligon(pol) });
                    mapsRef.current.maps.event.addListener(polygon.getPath(), 'insert_at', () => { onEditPoligon(pol) });
                }

                drawedPolygons.push({ id: pol.objectid, name: pol.name, ref: polygon });
            });
        }

        cleanReferences(oldReferences);
        references.current = drawedPolygons;
    }

    const setEditablePoligon = (polygon) => {
        let ref = references.current.filter((val) => {
            return val.id === polygon.objectid;
        })

        if (ref.length === 1 && ref[0].ref !== null) {
            let f = ref[0].ref.getEditable();
            ref[0].ref.setEditable(!f);

            if (f && !ref[0].ref.radius) {
                let newPolygon = polygon;
                newPolygon.Points = pathToPoints(ref[0].ref.getPath());
                if (polygon.objectid === "environmentPolygon") {
                    SessionStore.updateEnvironmentPolygon(newPolygon);
                } else {
                    SessionStore.updateStoredPolygon(newPolygon);
                }
            }
        }
    }

    const onChange = ({ center, zoom }) => {
        if (device !== null && mapsRef.current !== null) {
            setPolCenter({})
            setPolCenter({
                lat: device.latitude,
                lng: device.longitude,
            })
        }
    }

    const getPoints = (pts) => {
        let arr = [];

        arr = pts.map(pp => {
            return { lat: pp[1], lng: pp[0] }
        })

        return arr;
    }

    const onUpdateLocation = () => {
        setFlags({ ...flags, dialogIsOpen: true });
    }

    const mapOptionsCreator = (map) => {
        return {
            disableDefaultUI: props.noControl || false,
            mapTypeId: map.MapTypeId.SATELLITE,
            zoomControl: false,
            fullscreenControl: false
        };
    }

    return (
        // Important! Always set the container height explicitly
        <Grid container className={classes.boxMap} >
            <Grid container className={props.classMap || classes.GMap}>
                {defaultProps !== null &&
                    <Grid item xs={12}>
                        {props.page === "Property" &&
                            <Grid id="MeasureWidget">
                                <MeasureWidget />
                            </Grid>
                        }
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                libraries: ["visualization", "geometry"],
                                key: LocalConfig.googleMapsToken
                            }}
                            yesIWantToUseGoogleMapApiInternals={true}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                            center={polCenter || defaultProps.center}
                            options={mapOptionsCreator}
                            onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                            onChange={onChange}
                        >

                            {pins.length > 0 && pins !== null && pins !== undefined &&

                                pins.map(function (pin) {
                                    return (
                                        <Pin
                                            lat={defaultProps.center.lat}
                                            lng={defaultProps.center.lng}
                                            icon={pin}
                                            details={props.details}
                                        />

                                    );
                                })
                            }
                        </GoogleMapReact>
                        {showGradientBar &&
                            <Grid className={classes.gradientBarProp}>
                                <Canvas barscale={1} width="50" height="300" style={{ borderRadius: "1em 0px 0px 1em" }} />
                            </Grid>
                        }
                        <PredizaAlertDialog title="Deseja Atualizar a localização ?" open={flags.dialogIsOpen} close={toggleDialog} submit={onSubmit} />
                        {props.heatmap && ITLoader === true &&
                            <Grid style={{ position: "fixed", top: "50%", left: "50%" }}>
                                <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={"px"} size={12} />
                            </Grid>
                        }
                        {props.heatmap &&
                            menuTypesVisualization()
                        }
                        {props.heatmap && ValidationStore.isAdmin() &&
                            menuAdminControls()
                        }
                        {props.inmet &&
                            inmetAreaControl()
                        }
                        {props.page === "Notebook" &&
                            buttonToggleVisualization()
                        }
                        {((props.page === "ManagementPolygons" && polygons !== null) || (props.page === "ManagementProperty" && props.objectId !== null)) &&
                            <PolygonList area={area} points={points} onCreatePolygon={props.onCreatePolygon} onCreateEnvironmentPolygon={props.onCreateEnvironmentPolygon} flag={Boolean(editListener)} open={props.openList} polygons={polygons} />
                        }
                        {props.page === "AdvancedMap" &&
                            AdvancedMapMenu()
                        }
                        {props.page === "AdvancedMap" &&
                            AdvancedBottom()
                        }
                        {(props.page === "AdvancedMap" || props.heatmap) &&
                            AdvancedMapControlsZoom()
                        }
                        {(props.page === "AdvancedMap" || props.heatmap) &&
                            AdvancedMapControlsFullscreen()
                        }


                    </Grid>
                }
            </Grid>
            {(props.environment || props.adminDevice) && props.page !== "Rastreability" &&
                <Button onClick={onUpdateLocation} className={classes.Button} color="primary">Salvar</Button>
            }
            <UserFeedback error={error} setError={setError} />
        </Grid >
    )
})