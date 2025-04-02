
import React, { Component } from 'react';
import HeatmapOverlay from "./heatmapjs/HeatMapOverlay";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default class HeatmapLayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      markerId: 0,
    }

    this.props = props;
    this.map = {}

    this.heatmapLayer = {}
    this.markerGroup = {}
    this.environmentMarker = {}
    this.poligonsGroup = {}
    this.poligonsPoints = {}

    //map configurtions
    this.center = props.center;
    this.zoom = props.zoom;

    //heatmap overlay configurations
    this.data = props.data;
    this.radius = props.radius;
    this.blur = props.blur;
    this.scaleRadius = props.scaleRadius;
    this.maxOpacity = props.maxOpacity;
    this.useLocalExtrema = props.useLocalExtrema;
    this.latField = props.latField;
    this.lngField = props.lngField;
    this.valueField = props.valueField;
    this.gradient = props.gradient;
    this.environment = props.environment
    this.poligons = props.poligons

    //methods
    this.createBaseLayer = this.createBaseLayer.bind(this);
    this.createMap = this.createMap.bind(this);
    this.generateConfiguration = this.generateConfiguration.bind(this);
    this.createMarker = this.createMarker.bind(this);
    this.onClickMap = this.onClickMap.bind(this);
    this.onClickMarker = this.onClickMarker.bind(this);
  };

  componentDidUpdate(p) {
    if (this.heatmapLayer) {
      this.heatmapLayer.remove();
    };

    if (typeof this.props.delete === "function") {
      this.props.delete();
    }


    this.data = p.data;
    this.radius = p.radius;
    this.blur = p.blur;
    this.scaleRadius = p.scaleRadius;
    this.maxOpacity = p.maxOpacity;
    this.useLocalExtrema = p.useLocalExtrema;
    this.latField = p.latField;
    this.lngField = p.lngField;
    this.valueField = p.valueField;
    this.gradient = p.gradient;
    this.environment = p.environment;
    this.center = p.center;
    this.poligons = p.poligons


    this.map.removeLayer(this.heatmapLayer);
    this.heatmapLayer = new HeatmapOverlay(this.generateConfiguration());
    this.heatmapLayer.setData(this.props.data);
    if (this.props.marker || this.props.points) {
      this.props.data.data.forEach(element => {
        this.createMarker({ lat: element.lat, lng: element.lng }, element.device);
      });
    };

    this.map.removeLayer(this.environmentMarker);
    if (this.environment !== undefined && this.environment !== null && this.environment !== {}) {
      this.environmentMarker = L.marker([this.environment.coordinate.lat, this.environment.coordinate.lng]).bindPopup(this.environment.name);
      this.environmentMarker.addTo(this.map)
      // this.map.panTo(new L.LatLng(this.environment.coordinate.lat, this.environment.coordinate.lng));
    }

    this.map.removeLayer(this.poligonsGroup)
    this.poligonsGroup = L.layerGroup()
    if (this.props.poligons !== undefined && this.props.poligons !== null && this.props.poligons.length > 0) {
      this.props.poligons[0].forEach((val) => {
        this.createPoligon(val)
      })
      this.poligonsGroup.addTo(this.map)
    }

    this.map.removeLayer(this.poligonsPoints)
    if (this.props.poligonPoint && this.props.poligons[0][0].points.length > 0) {
      this.poligonsPoints = L.layerGroup();
      this.props.poligons[0][0].points.forEach((val) => {
        L.marker(val).addTo(this.poligonsPoints)
      })
      this.poligonsPoints.addTo(this.map)
      this.map.panTo(new L.LatLng(this.props.poligons[0][0].points[0][0], this.props.poligons[0][0].points[0][1]));
    }

    this.heatmapLayer.addTo(this.map);

  }

  averageGeolocation = (coords) => {
    if (coords.length === 1) {
      return coords[0];
    }
    let x = 0.0;
    let y = 0.0;
    let z = 0.0;

    coords.forEach((coord) => {
      let latitude = coord[0] * Math.PI / 180;
      let longitude = coord[1] * Math.PI / 180;

      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    })

    let total = coords.length;

    x = x / total;
    y = y / total;
    z = z / total;

    let centralLongitude = Math.atan2(y, x);
    let centralSquareRoot = Math.sqrt(x * x + y * y);
    let centralLatitude = Math.atan2(z, centralSquareRoot);

    return [centralLatitude * 180 / Math.PI, centralLongitude * 180 / Math.PI];
  }
  getLatLongdistance = (x, y) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (y[0] - x[0]) * Math.PI / 180;
    var dLon = (y[1] - x[1]) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(x[0] * Math.PI / 180) * Math.cos(y[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return Math.round(d * 1000);
  }

  onClickMarker(e) {
    this.setState({ markerId: e.sourceTarget._leaflet_id })
    if (typeof this.props.markerClick === "function") {
      this.props.markerClick(e.latlng)
    };
  };

  onClickMap(e) {
    if (this.props.poligonPoint && typeof this.props.addPoint === "function") {
      this.props.addPoint(e.latlng)
    }
    if (this.props.marker) {
      this.createMarker(e.latlng);
    }
  };

  createPoligon = (points) => {
    if (points.points.length < 2) {
      return
    }
    if (points.points.length > 2) {
      L.polygon(points.points, {fillColor: points.color, fillOpacity: 0.2, opacity: 0.1 }).addTo(this.poligonsGroup)
      return
    }

    let dist = this.getLatLongdistance(points.points[0], points.points[1]);
    let center = this.averageGeolocation(points.points);
    L.circle(center, dist / 2, {fillColor: points.color, fillOpacity: 0.2, opacity: 0.1 }).addTo(this.poligonsGroup)
  }

  createMarker(latlng, device) {
    var markerParams = {
      radius: 5,
      fillColor: '#2196f3',
      color: '#fff',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };
    L.circleMarker([latlng.lat, latlng.lng], markerParams).addTo(this.markerGroup).on('click', this.onClickMarker).bindPopup(this.props.data.measurements[device], { closeOnClick: false, autoClose: false });
    if (typeof this.props.add === "function") {
      this.props.add(latlng);
    }
  }

  //Return a L.title layer for using in map
  createBaseLayer() {
    return L.tileLayer(
      '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '...',
    }
    );
  };

  //Create an final map
  createMap() {
    //map proprieties
    let center = this.props.center || [-29.1682336, -51.1942409];
    let zoom = this.props.zoom || 4;

    //layers
    let baseLayer = this.createBaseLayer();
    this.heatmapLayer = new HeatmapOverlay(this.generateConfiguration());

    //create map
    this.map = new L.Map('map-canvas', {
      center: center,
      zoom: zoom,
      layers: [baseLayer]
    });

    this.markerGroup = L.layerGroup().addTo(this.map);
    this.poligonsGroup = L.layerGroup().addTo(this.map);
    this.poligonsPoints = L.layerGroup().addTo(this.map);

    this.heatmapLayer.addTo(this.map);

    //Insert markers on data point
    if (this.props.marker || this.props.points) {
      this.props.data.data.forEach(element => {
        this.createMarker({ lat: element.lat, lng: element.lng }, element.device);
      });
    };

    this.map.removeLayer(this.poligonsGroup)
    //Insert poligons
    if (this.props.poligons !== undefined && this.props.poligons !== null && this.props.poligons.length > 0) {
      this.props.poligons[0].forEach((val) => {
        this.createPoligon(val)

      })
      this.poligonsGroup.addTo(this.map)
    }

    //Insert point on environment
    if (this.environment !== undefined && this.environment !== null && this.environment.coordinate !== null && this.environment.coordinate !== undefined) {
      this.environmentMarker = L.marker([this.environment.coordinate.lat, this.environment.coordinate.lng]).bindPopup(this.environment.name, { closeOnClick: false, autoClose: false });
      this.environmentMarker.addTo(this.map)
    }

    //add data
    this.heatmapLayer.setData(this.props.data);


    this.map.on('click', this.onClickMap);
  };

  //Return the heatmaplayer configuration using the proprieties recived or defaults
  generateConfiguration() {
    var cfg = {
      radius: this.props.radius || 40,
      blur: this.props.blur || 0.85,
      maxOpacity: this.props.maxOpacity || 0.8,
      scaleRadius: this.scaleRadius || false,
      useLocalExtrema: false,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count',
    };
    if (this.gradient) {
      cfg["gradient"] = this.gradient;
    };

    return cfg;
  };

  componentDidMount() {
    this.createMap();
  };

  render() {
    return (<div style={{ width: "100%", height: "100%" }} id="map-canvas"></div>);
  };
};