import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import NoteStore from "../../stores/NoteStore";
import PoligonStore from "../../stores/PoligonStore";
import NoteCropForm from "./NoteCropForm";
import PredizaTabs from "../Common/PredizaTabs";
import tokens from "../../stores/CancelTokenList";
import history from "../../history"

export default function TresholdEditPage(props) {
    const [envcrop, setEnvcrop] = useState(null);
    const [crops, setCrops] = useState(null);
    const [polygons, setPolygons] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        GetCrops();
        getEnvCrop();
        getPolygons();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };


    const responseGetCrops = (resp) => {
        tokenList.remove(resp.id);
        if (resp.data !== null) {
            const crops = resp.data.map((val) => { return { label: val.name + " " + val.variety, value: val.objectid } })
            setCrops(crops);
        }
    }
    const GetCrops = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getCrops(cancelToken, responseGetCrops);
    };

    const getPolygons = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        PoligonStore.getPolygons(cancelToken, responseGetPolygons)
    }

    const responseGetPolygons = (response) => {
        tokenList.remove(response.id);

        let data = response.data;
        let pol = []
        if (data !== null && data !== undefined) {
            pol = data.map((val) => { return { label: val.name, value: val.objectid } })
        }
        setPolygons(pol)
    }

    const reponseGetEnvCrop = (resp) => {
        tokenList.remove(resp.id);
        if (resp.data !== null) {
            setEnvcrop(resp.data);
        }

    };

    const getEnvCrop = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getEnvNoteCrop(props.id, cancelToken, reponseGetEnvCrop);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                {polygons !== null && envcrop !== null && crops != null && <PredizaTabs data={[{ label: "Alterar Cultivo", component: <NoteCropForm back={() => { history.push('/note/' + props.env + '/crop') }} crops={crops} envcrop={envcrop} polygons={polygons} /> }]} />}
            </Grid>
        </Grid>
    );

};