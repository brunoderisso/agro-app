import React, { useState, useEffect } from "react";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza

import ArticleForm from "./ArticleForm";
import ArticleImage from "./ArticleImage";
import ArticleImageUploadPage from "./ArticleImageUploadPage";
import PredizaTabs from "../Common/PredizaTabs";

import ArticleStore from "../../stores/ArticleStore";

import tokens from "../../stores/CancelTokenList";

export default function ArticleEditPage(props) {
    const [article, setArticle] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        getArticle();
        
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const reponseGetArticle = (resp) => {
        tokenList.remove(resp.id);

        if(resp.data !== null){
            setArticle(resp.data);
        }
        
    };

    const getArticle = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.getArticle(props.id, cancelToken, reponseGetArticle);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs fixed={64} disabled={true} data={[{label:"Artigo",component:<Grid/>}]}/>
            </Grid>
            <Grid item xs={12}>
                {article !== null && <PredizaTabs fixed={112}  data={[{ label: "Edição" , component: <ArticleForm article={article} /> }, { label: "Imagens" , component: <ArticleImage article={article.objectid} /> },{ label: "Upload" , component: <ArticleImageUploadPage article={article.objectid} /> }]} />}
            </Grid>
        </Grid>
    );

};