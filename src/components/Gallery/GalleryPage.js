import React, { useState, useEffect } from 'react';

import Grid from "@material-ui/core/Grid";

import GalleryCard from "./GalleryCard"
import ImageStore from "../../stores/ImageStore";
import SessionStore from "../../stores/SessionStore";


export default function GalleryPage() {
    const [images, setImages] = useState([]);

    const [isRecived, setIsRecived] = useState(false);
    const [globalAdmin, setGlobalAdmin] = useState(false);

    useEffect(() => {
        let preference = SessionStore.getPreference()
        setGlobalAdmin(preference.globaladmin);
        bind();
        getEnvironmentImages();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.addListener("environment.change", reload);
        ImageStore.addListener("image_add", reload);
    }

    const clear = () => {
        SessionStore.removeListener("environment.change", reload);
        ImageStore.removeListener("image_add", reload);
    }

    const reload = () => {
        getEnvironmentImages();
    }

    const resultGetEnvironmentImages = (value) => {
        setImages(value);
        setIsRecived(true);
    };

    const getEnvironmentImages = () => {
        ImageStore.getEnvironmentImages(resultGetEnvironmentImages);
    };

    const onReload = (id) =>{
        let result = Array.from(images);
        let index = result.findIndex((obj)=>{ return obj.objectid === id});
        result.splice(index, 1);
        setImages(result);
    }

    return (
        <Grid container>
            {isRecived &&
                images.map((v, id) => {
                    return (<GalleryCard image={v} onReload={onReload} admin={globalAdmin} key={id} />);
                })
            }
        </Grid>
    );
}