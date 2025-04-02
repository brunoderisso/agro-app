import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core";
import styles from '../../../styles/AdvancedMap/InfoDrawer'
import React, { useEffect, useState } from "react";

/* SVG IMG */
import { ReactComponent as Comment } from '../../../img/AdvancedMapIcons/Comment.svg'
import { ReactComponent as Document } from '../../../img/AdvancedMapIcons/Document.svg'
import { ReactComponent as Visit } from '../../../img/AdvancedMapIcons/Visit.svg'
import { ReactComponent as AllDoccument } from '../../../img/AdvancedMapIcons/AllDoccument.svg'
import toolsUtils from "../../../utils/toolsUtils";
import clsx from "clsx"

const NewAnnotation = (props) => {
    const [comment, setComment] = useState('');
    const [valueMultiline, setValueMultiline] = useState('Cliente solicitou uma visita em conversa por telefone comigo.⏐');
    const classes = styles();
    const [fileName, setFileName] = useState('');
    // const [file, setFile] = useState(null);

    const handleChangeMenu = (event) => {
        setComment(event.target.value);
    };

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileName]);

    const handleChangeMultiline = (event) => {
        setValueMultiline(event.target.value);
    };

    const handleFileInputChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            handleLoadFile(selectedFiles[0]);
        }
    };

    const handleLoadFile = (file) => {
        if (file) {
            console.log(file)
            console.log(file.name)
            setFileName(file.name);
            // setFile(file);
        }
    }
    const handleFileDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleLoadFile(droppedFiles[0]);
        }
    };

    const getFileInput = () => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        className={clsx(classes.dropArea, {
                            [classes.fileLoaded]: !toolsUtils.isEmptyString(fileName)
                        })}
                        onDrop={handleFileDrop}
                        onDragOver={(event) => event.preventDefault()}
                    >

                        <Grid item xs={12}>
                            <input
                                type="file"
                                id="fileInput"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileInputChange}
                            />
                            <label htmlFor="fileInput">
                                <Grid container justifyContent='center' alignContent='center' alignItems='center'>
                                    <Grid item className={classes.uploadButton}>
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g filter="url(#filter0_ddd_3224_23007)">
                                                <circle cx="24" cy="23" r="19" fill="#0053DB" />
                                            </g>
                                            <path d="M23.25 28.25H24.75V25.1188L25.95 26.3188L27 25.25L24 22.25L21 25.25L22.0688 26.3L23.25 25.1188V28.25ZM19.5 30.5C19.0875 30.5 18.7344 30.3531 18.4406 30.0594C18.1469 29.7656 18 29.4125 18 29V17C18 16.5875 18.1469 16.2344 18.4406 15.9406C18.7344 15.6469 19.0875 15.5 19.5 15.5H25.5L30 20V29C30 29.4125 29.8531 29.7656 29.5594 30.0594C29.2656 30.3531 28.9125 30.5 28.5 30.5H19.5ZM24.75 20.75H28.5L24.75 17V20.75Z" fill="white" />
                                            <defs>
                                                <filter id="filter0_ddd_3224_23007" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_3224_23007" />
                                                    <feOffset dy="3" />
                                                    <feGaussianBlur stdDeviation="0.5" />
                                                    <feComposite in2="hardAlpha" operator="out" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                                                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3224_23007" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dy="2" />
                                                    <feGaussianBlur stdDeviation="1" />
                                                    <feComposite in2="hardAlpha" operator="out" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.14 0" />
                                                    <feBlend mode="normal" in2="effect1_dropShadow_3224_23007" result="effect2_dropShadow_3224_23007" />
                                                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                    <feOffset dy="1" />
                                                    <feGaussianBlur stdDeviation="2.5" />
                                                    <feComposite in2="hardAlpha" operator="out" />
                                                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                                                    <feBlend mode="normal" in2="effect2_dropShadow_3224_23007" result="effect3_dropShadow_3224_23007" />
                                                    <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_3224_23007" result="shape" />
                                                </filter>
                                            </defs>
                                        </svg>

                                    </Grid>
                                </Grid>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='caption'>
                                {!toolsUtils.isEmptyString(fileName) ? fileName : "Arraste e solte ou clique para carregar imagens(Somente arquivos JPG e PNG de até 2 MB)"}
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid>
            <Grid className={classes.boxSubTitleNewAnnotation}>
                <Typography className={classes.subTitleNewAnnotation} variant="Subtitle1">Nova anotação</Typography>

                <FormControl className={classes.formControlAnnotation}>
                    <InputLabel id="demo-simple-select-label">
                        {!comment &&
                            <>
                                <span style={{ marginRight: "4px" }}>
                                    {<Comment />}
                                </span>
                                <span>
                                    Conversa
                                </span>
                            </>
                        }
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={comment}
                        onChange={handleChangeMenu}
                    >
                        <MenuItem value={10}>
                            <span className={classes.menuList}>
                                {<Comment />}
                            </span>
                            Conversa</MenuItem>
                        <MenuItem value={20}>
                            <span className={classes.menuList}>
                                {<Document />}
                            </span>
                            Documento</MenuItem>
                        <MenuItem value={30}>
                            <span className={classes.menuList}>
                                {<Visit />}
                            </span>
                            Visita</MenuItem>
                        <MenuItem value={40}>
                            <span className={classes.menuList}>
                                {<AllDoccument />}
                            </span>
                            Nota Geral</MenuItem>

                    </Select>
                </FormControl>

            </Grid>
            <Grid>
                <Grid className={classes.boxDetailAnnotation}>
                    <TextField
                        className={classes.annotationInputValue}
                        id="outlined-multiline-static"

                        multiline
                        defaultValue="Default Value"
                        variant="outlined"
                        value={valueMultiline}
                        onChange={handleChangeMultiline}
                    />
                </Grid>
            </Grid>
            <Grid className={classes.newAnnotationImg}>
                {getFileInput()}
            </Grid>
            <Grid className={classes.boxDetailButton}>
                <Button onClick={() => props.handleAnnotation("annotation")}>Cancelar</Button>
                <Button onClick={() => props.handleAnnotation("annotation")}>Salvar</Button>
            </Grid>
        </Grid>
    );
};

export default NewAnnotation;