import React, { useEffect } from 'react';
import QRCodeSVG from 'qrcode.react';

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagPage1";
import Button from '@material-ui/core/Button';

import * as htmlToImage from 'html-to-image';
import downloadjs from "downloadjs";

import moment from "moment";
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function NotebookTagPage(props) {


    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { classes } = props;

    const { t } = useTranslation();

    const tagDownload = () => {

        htmlToImage.toPng(document.getElementById('tracerTagV1download' + props.tag.objectid))
            .then(function (dataUrl) {
                downloadjs(dataUrl, 'etiqueta_rastreabilidade.png');
            });
    }

    return (
        <Grid>

            <div id={'tracerTagV1download' + props.tag.objectid} >
                <Grid container className={classes.containerTag}>
                    <Grid item xs={1} className={classes.verticalText}>
                        {(props.tag && props.tag.producedat &&
                            (`${t('notebook.tags_manufacture')}: ` + moment(props.tag.producedat).format("DD/MM/YY") + ` - ${t('notebook.tags_expiration')}: ` + moment(props.tag.validuntil).format("DD/MM/YY") + ` - ${t('notebook.tags_lot')}: ` + (props.tag.batch || '000000')))
                            || `${t('notebook.tags_manufacture')}: 10/01/22    -    ${t('notebook.tags_expiration')}: 20/01/22    -   ${t('notebook.tags_lot')}: 0101011`}
                    </Grid>
                    <Grid item xs={11}>
                        <Grid container>
                            <Grid item xs={12} className={classes.titleText}>
                                {t('notebook.tags_trackedOriginProduct').toUpperCase()}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <QRCodeSVG value={"https://prediza.io/rastreabilidade/" + props.crop.name.replace("ç", "c") + "-" + props.crop.variety + "/?tag=" + props.tag.objectid} size={215}></QRCodeSVG>
                                    </Grid>
                                    <Grid item xs={12} className={classes.codeText}>
                                        {props.tag.batch.toUpperCase()}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} className={classes.infoText}>
                                {t('notebook.tags_checkWithQRCodeOrAt').toUpperCase()}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <Grid container className={classes.downloadButton}>
                <Button variant="contained" color="primary" onClick={tagDownload}>
                    Download
                </Button>
            </Grid>
        </Grid>
    )
})