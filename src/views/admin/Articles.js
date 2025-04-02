import React, { useEffect } from "react"
import {Helmet} from "react-helmet"
import Grid from "@material-ui/core/Grid"

import View from "../../components/PredizaView";
import ArticlePage from "../../components/Article/ArticlePage";
import MenuBar from "../../components/ViewComponents/MenuBar";

export default function Article() {
    useEffect(() => {

    }, [])

    return (
        <View>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Prediza | Artigos</title>
                <meta name="description" content="Prediza Artigos" />
            </Helmet>
            <Grid container >
                <MenuBar />
                <ArticlePage />
            </Grid>
        </View>
    )
}