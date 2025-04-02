import React from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';

import CameraIcon from "@material-ui/icons/CameraAlt";

//Prediza
import ArticleImageUploadModal from "./ArticleImageUploadModal";
import useToggle from "../../Hook/useToggle";

import style from "../../styles/Article/ArticleImageFooter";

export default withStyles(style)(function ArticleImageFooter(props) {
    const { classes } = props;
    const { isShowing, toggle } = useToggle();

    return (
        <Grid container className={classes.container} justifyContent="center" alignItems="center" onClick={toggle}>
            <CameraIcon className={classes.icon} />
            <ArticleImageUploadModal open={isShowing} onClose={toggle} article={props.article}/>
        </Grid>
    )
});