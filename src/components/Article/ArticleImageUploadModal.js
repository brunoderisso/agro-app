import React from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Modal from "@material-ui/core/Modal";

//Prediza
import ArticleImageUpload from "./ArticleImageUpload";

import style from "../../styles/Article/ArticleImageScanModal";

export default withStyles(style) (function ArticleImageScanModal(props) {
    const { classes } = props;
    const getModalStyle = () => {
        const top = 50;
        const left = 50;
    
        return {    
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
            overflow: 'scroll',
            maxWidth: '100%',
            zIndex:'5000'
        };
    };
    
    return (
        <div>
            {props.children}
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={props.open}
                onClose={props.close}
                onBackdropClick = {(e)=>e.stopPropagation()} 
                keepMounted
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <ArticleImageUpload close={props.onClose} article={props.article}/>
                </div>
            </Modal>
        </div>
    );
});