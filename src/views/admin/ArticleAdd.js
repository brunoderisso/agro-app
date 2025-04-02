import React, { useEffect } from "react"

import Grid from "@material-ui/core/Grid"

import View from "../../components/PredizaView";
import ArticleAddPage from "../../components/Article/ArticleAddPage";
import MenuBar from "../../components/ViewComponents/MenuBar";

export default function Article() {
    useEffect(() => {
        document.title = "Prediza | Artigo";
    }, [])

    return (
        <View>
            <Grid container >
                <MenuBar />
                <ArticleAddPage />
            </Grid>
        </View>
    )
}