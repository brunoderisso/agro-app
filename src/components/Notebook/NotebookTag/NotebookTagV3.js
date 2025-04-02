import React, { useEffect } from 'react';
import QRCodeSVG from 'qrcode.react';

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagPage3";
import Button from '@material-ui/core/Button';

import * as htmlToImage from 'html-to-image';
import downloadjs from "downloadjs";


export default withStyles(styles)(function NotebookTagPage(props) {


    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const { classes } = props;

    const tagDownload = () => {

        htmlToImage.toSvg(document.getElementById('tracerTagV3download' + props.tag.objectid), { pixelRatio: 1 })
            .then(function (dataUrl) {
                downloadjs(dataUrl, 'etiqueta_rastreabilidade.png');
            });
    }

    return (
        <Grid>

            <div id={'tracerTagV3download' + props.tag.objectid} style={{ height: "420px", width: "435px" }}>
                <Grid container className={classes.containerTag}>
                    <Grid item xs={11}>
                        <QRCodeSVG value={"https://prediza.io/rastreabilidade/" + props.crop.name.replace("ç", "c") + "-" + props.crop.variety + "/?tag=" + props.tag.objectid} size={360} ></QRCodeSVG>
                    </Grid>
                    <Grid item xs={1} className={classes.verticalText}>
                        <svg height={500}>
                            <text x="17" y="15" fontSize="45" fontWeight="bold" fill="black">{props.tag.batch.toUpperCase()}</text>
                        </svg>
                    </Grid>
                    {/* <Grid item xs={1} className={classes.verticalText}>
                        {props.tag.batch.toUpperCase()}
                    </Grid> */}
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