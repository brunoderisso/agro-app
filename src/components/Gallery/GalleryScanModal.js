import React from "react";

import { withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import DeviceCardScan from "./GalleryUploadCard";
import style from "../../styles/Gallery/GalleryScanModal";


export default withStyles(style)(function GalleryScanModal(props) {
    const { classes } = props;

    return (
        <div>
            {props.children}
            <Dialog
                fullWidth={true}
                className={classes.paper}
                aria-labelledby="prediza-modal"
                aria-describedby="simple-modal-description"
                open={props.open}
                onClose={props.close}
            >
                <DialogContent  id="cardcontent">
                    <DeviceCardScan component={props.component} polygon={props.polygon} close={props.onClose} />
                </DialogContent>
            </Dialog>
        </div>
    );
});