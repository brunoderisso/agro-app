import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI 
import Grid from "@material-ui/core/Grid";

//Prediza
import ArticleImageCard from "./ArticleImageCard";
import ArticleStore from "../../stores/ArticleStore";

import style from "../../styles/Article/ArticleList";
import tokens from "../../stores/CancelTokenList";


export default withStyles(style)(function TresholdList(props) {
    const [list, setList] = useState([]);

    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getArticles();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        ArticleStore.removeListener("del_article_image",removeImage);
        tokenList.clear();
    };

    const bind = () =>{
        ArticleStore.on("del_article_image",removeImage);
    }

    const removeImage = (id) =>{
        const lst = list.filter((val) => {
            return val.objectid !== id
        });
        setList(lst)
    }

    const responseGetArticles = (response) => {
        tokenList.remove(response.id);
        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    //Store
    const getArticles = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.getArticlesImages(props.article, cancelToken, responseGetArticles);
    };

    return (
        <Grid container>
            {list.map((val, id) => {
                return (<Grid key={id} item xs={12} md={3}><ArticleImageCard image={val}/></Grid>)
            })}
        </Grid>
    );
});