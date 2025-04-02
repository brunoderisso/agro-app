import React, { useEffect } from "react"
import { useParams } from 'react-router-dom';

import Grid from "@material-ui/core/Grid"

import View from "../../components/PredizaView";
import ArticleEditPage from "../../components/Article/ArticleEditPage";
import MenuBar from "../../components/ViewComponents/MenuBar";

export default function Article() {
    const { id } = useParams();
    useEffect(() => {
        document.title = "Prediza | Artigo";
    }, [])

    return (
        <View>
            <Grid container >
                <MenuBar />
                <ArticleEditPage id={id}/>
            </Grid>
        </View>
    )
}