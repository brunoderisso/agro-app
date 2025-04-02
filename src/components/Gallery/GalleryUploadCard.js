import React, { useRef, useState, useEffect } from 'react';
import GridLoader from 'react-spinners/GridLoader';
import { css } from '@emotion/core';
import EXIF from 'exif-js'

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import UploadIcon from "@material-ui/icons/CloudUpload"

import ImageStore from "../../stores/ImageStore";
import UserFeedback from '../Common/UserFeedback';
import styles from '../../styles/Gallery/GalleryUploadCard'
import { useTranslation } from 'react-i18next';


const override = css`
    display: block;
    margin: 2 auto;
    border-color: red;
`;

export default withStyles(styles)(function GalleryUploadCard(props) {
    const [disabled, setDisabled] = useState(false);
    const [base64, setBase64] = useState("");
    const [error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const dropArea = useRef();

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (dropArea.current) {
            dropArea.current.addEventListener('dragenter', highlight, false);
            dropArea.current.addEventListener('dragleave', unhighlight, false);
            dropArea.current.addEventListener('dragover', highlight, false);
            dropArea.current.addEventListener('drop', handlerFunction, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dropArea.current]);

    const onFileChange = (event) => {
        toBase64(event.target.files[0]);
    };

    const highlight = (e) => {
        dropArea.current.classList.add(classes.highlight);
        e.preventDefault();
        e.stopPropagation();
    }

    const unhighlight = (e) => {
        dropArea.current.classList.remove(classes.highlight);
        e.preventDefault();
        e.stopPropagation();
    }

    const handlerFunction = (e) => {
        dropArea.current.classList.remove(classes.highlight);

        let dt = e.dataTransfer
        let files = dt.files

        if (files) {
            toBase64(files[0]);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    const onClickSend = () => {
        if (base64 !== "") {
            setDisabled(true);
            addImage();
        }
    };

    const onClickCancel = () => {
        setBase64("");
        props.close();
    }

    const toBase64 = (f) => {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                //Converting Binary Data to base 64
                var base64String = window.btoa(binaryData);
                //showing file converted to base64
                setBase64("data:" + f.type + ";base64," + base64String);
                getExif(theFile);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);

    };

    const getExif = (f) => {
        EXIF.getData(f, function () {
            var exifData = EXIF.pretty(this);
            if (exifData) {
                console.log(exifData);
                console.log(EXIF.getTag(this, "Orientation"));
            } else {
                console.log("No EXIF data found in image '" + f.name + "'.");
            }
        });
    }

    const responseAddEnvironmetImage = (response) => {
        if (response?.status === 400) {
            setError(response.status.toString());
            setErrorMessage(t('gallery.invalidImageFormat'));
            setBase64("");
            setDisabled(false);
            return
        }

        if (response !== null && response !== undefined) {
            ImageStore.emit("image_add");
            setBase64("");
            setDisabled(false);
            setError("200");
        }
    };

    const addImage = () => {
        if (props.component === 'polygon') {
            ImageStore.addPolygonImage(base64, props.polygon, responseAddEnvironmetImage);
        } else {
            ImageStore.addEnvironmentImage(base64, responseAddEnvironmetImage);
        }
    };

    return (
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={12}>
                    <Input
                        accept="image/*"
                        className={classes.input}
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={onFileChange}
                    />
                    <label htmlFor="raised-button-file" >
                        <Grid container ref={dropArea} className={classes.label} alignContent="center" justifyContent="center">
                            {base64 === "" ? disabled ? <GridLoader
                                css={override}
                                sizeUnit={"px"}
                                size={20}
                                color={'#36D7B7'}
                                loading={disabled}
                            /> : <UploadIcon /> : <img alt="" src={base64} className={classes.img} />}
                        </Grid>
                    </label>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <Button onClick={onClickCancel}>{t('common.cancelButton')}</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                <Button onClick={onClickSend} disabled={disabled}>{t('common.sandButton')}</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <UserFeedback error={error} message={errorMessage} setError={setError} />
        </Grid>
    );
})