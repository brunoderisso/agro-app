import React from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';

//Prediza
import ArticleImageUpload from "./ArticleImageUpload";

import style from "../../styles/Article/ArticleImage";

export default withStyles(style)(function ArticleImage(props) {
    const {classes} = props;
    return (
        <Grid container className={classes.container}>
            <ArticleImageUpload article={props.article}/>
        </Grid>
    )
});