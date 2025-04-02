import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import NoteCropForm from "./NoteCropForm";
import PredizaTabs from "../Common/PredizaTabs";

import NoteStore from "../../stores/NoteStore";
import PoligonStore from "../../stores/PoligonStore";

import tokens from "../../stores/CancelTokenList";

import history from "../../history"

export default function NoteCropAddPage(props) {
    const [crops, setCrops] = useState(null);
    const [polygons, setPolygons] = useState(null)
    const tokenList = new tokens();

    useEffect(() => {
        GetCrops();
        getPolygons();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        let pol = []
        let data = response.data
        if (data !== null && data !== undefined) {
            pol = data.map((val) => { return { label: val.name, value: val.objectid } })
        }
        setPolygons(pol)
    }

    const clear = () => {
        tokenList.clear();
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                {crops !== null && polygons !== null && <PredizaTabs data={[{ label: "Novo Cultivo", component: <NoteCropForm back={() => { history.push('/note/' + props.id + '/crop') }} crops={crops} polygons={polygons} /> }]} />}
            </Grid>
        </Grid>
    );

};