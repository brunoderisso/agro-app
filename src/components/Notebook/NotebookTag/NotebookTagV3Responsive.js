import React, { useEffect } from 'react';
import QR from 'qrcode.react';

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagPage3R";
import Button from '@material-ui/core/Button';

import * as htmlToImage from 'html-to-image';
import downloadjs from "downloadjs";


export default withStyles(styles)(function NotebookTagPage(props) {


    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const { classes } = props;

    const tagDownload = () => {

        htmlToImage.toPng(document.getElementById('tracerTagV3download' + props.tag.objectid))
            .then(function (dataUrl) {
                downloadjs(dataUrl, 'etiqueta_rastreabilidade.png');
            });
    }

    return (
        <Grid>
            <div id={'tracerTagV3downloada' + props.tag.objectid} >
                <Grid container className={classes.containerTag}>
                    <Grid item xs={11}>
                        <QR value={"https://prediza.io/rastreabilidade/" + props.crop.name.replace("ç", "c") + "-" + props.crop.variety + "/?tag=" + props.tag.objectid} style={{ width: 200, height: 200, marginBottom: 10, marginTop: 10 }}></QR>
                    </Grid>
                    <Grid item xs={1} className={classes.verticalText}>
                        {props.tag.batch.toUpperCase()}
                    </Grid>
                </Grid>
            </div >
            <Grid container className={classes.downloadButton}>
                <Button variant="contained" color="primary" onClick={tagDownload}>
                    Download
                </Button>
            </Grid>
        </Grid >
    )
})