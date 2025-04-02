import React from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//Prediza
import ArticleList from "./ArticleList";
import history from "../../history";
import style from "../../styles/Article/ArticlePage";

export default withStyles(style) (function TresholdPage(props) {
    const {classes} = props;

    const goToAddPage = () => {
        history.push("/article/new");
    };
    return (
        <Grid container>
            <Grid item xs={12} >
                <Grid container className={classes.header} justifyContent="flex-end" >
                    <Button onClick={goToAddPage} color="primary">Adicionar Artigo</Button>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ArticleList />
            </Grid>
        </Grid>
    );
});