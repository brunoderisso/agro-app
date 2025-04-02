import React, { useEffect, useState } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import Control from 'react-leaflet-control';

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button"
import Gps from "@material-ui/icons/GpsFixed"

import styles from '../../styles/Common/PinMap'

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default withStyles(styles)(function PinMap(props) {
    const { classes } = props;

    const [position, setPosition] = useState(0);

    useEffect(() => {
        if (props.change) {
            props.change(position);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    const addMarker = (e) => {
        if (props.method !== "GET") {
            setPosition(e.latlng);
        }
    }

    return (
        <Map
            center={{ lat: props.latitude || -23.54892, lng: props.longitude || -46.72001 }}
            onClick={addMarker}
            zoom={props.zoom || 13}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
                url='//{s}.tile.osm.org/{z}/{x}/{y}.png'
            />

            <Marker key={`marker-0`} position={{ lat: props.latitude || -23.54892, lng: props.longitude || -46.72001 }}>
                <Popup>
                    {props.message || ""}
                </Popup>
            </Marker>

            <Control position="topleft" >
                <Button className={classes.reset}>
                    <Gps />
                </Button>
            </Control>
        </Map>
    );
})
