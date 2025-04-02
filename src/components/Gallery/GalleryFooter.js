import React from "react";

import { withStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import CameraIcon from "@material-ui/icons/CameraAlt";
import Fab from '@material-ui/core/Fab';

import GalleryScanModal from "./GalleryScanModal";
import useToggle from "../../Hook/useToggle";
import style from "../../styles/Gallery/GalleryFooter";

export default withStyles(style)(function GalleryFooter(props) {
    const { classes } = props;
    const { isShowing, toggle } = useToggle();

    return (
        <Grid container>
            <Fab className={classes.container} color="primary" aria-label="add" onClick={toggle}>
                <CameraIcon className={classes.icon} />
            </Fab>
            <GalleryScanModal open={isShowing} onClose={toggle} />
        </Grid>

    )
});