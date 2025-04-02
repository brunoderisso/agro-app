import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import UploadIcon from "@material-ui/icons/CloudUpload"

import PredizaAlertDialog from "../PredizaAlertDialog";

import ArticleStore from "../../stores/ArticleStore";

import style from "../../styles/Article/ArticleImageCard";
import tokens from "../../stores/CancelTokenList";

//Other
import { css } from '@emotion/core';
import GridLoader from 'react-spinners/GridLoader';
const override = css`
    display: block;
    margin: 2 auto;
    border-color: red;
`;

export default withStyles(style)(function ArticleImageUpload(props) {
    const { classes } = props;
    const [disabled, setDisabled] = useState(false)
    const [message, setMessage] = useState("");
    const [data, setData] = useState("");

    const tokenList = new tokens();

    useEffect(() => {

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const closeMessage = () => {
        setMessage("");
    };

    const onFileChange = event => {
        toBase64(event.target.files[0]);
    };

    const onClickSend = () => {
        if (data !== "") {
            setDisabled(true);
            setData("");
            addMedia();
        }
    };

    const onClickCancel = () => {
        setData("")
    }

    const toMedia = () => {
        return { data: data }
    }

    const responseAddImage = (resp) => {
        setDisabled(false);
        setData("");
        tokenList.remove(resp.id);
        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar a imagem");
            return
        };
        setMessage("Imagem adicionada com sucesso");

    }

    const responseAddMedia = (resp) => {
        tokenList.remove(resp.id);
        addImage(resp.data)
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

                setData("data:image/jpg;base64," + base64String);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
    };

    const addMedia = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.addArticleMediaImage(props.article, toMedia(), cancelToken, responseAddMedia)
    }

    const addImage = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.addArticleImage(props.article, { articleobjectid: props.article, imageobjectid: id }, cancelToken, responseAddImage)
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Input
                    accept="image/jpeg"
                    className={classes.input}
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={onFileChange}

                />
                <label htmlFor="raised-button-file" >
                    <Grid container className={classes.label} alignContent="center" justifyContent="center">
                        {data === "" ? disabled ? <GridLoader
                            css={override}
                            sizeUnit={"px"}
                            size={20}
                            color={'#36D7B7'}
                            loading={disabled}
                        /> : <UploadIcon /> : <img alt="" src={data} className={classes.img} />}
                    </Grid>
                </label>
            </Grid>

            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={onClickCancel} color={"primary"}>Cancelar</Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="flex-end">
                            <Button onClick={onClickSend} color={"primary"} disabled={disabled}>Enviar</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    )
})