import React, { useEffect, useState } from 'react';
import { withStyles } from "@material-ui/core";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete"

import PredizaAlertDialog from "../PredizaAlertDialog";

import ArticleStore from "../../stores/ArticleStore";

import style from "../../styles/Article/ArticleImageCard";
import tokens from "../../stores/CancelTokenList";

export default withStyles(style)(function TresholdImageCard(props) {
    const { classes } = props;
    const tokenList = new tokens();
    const [image, setImage] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const toggleDialog = (id) => {
        let flag = image;
        if (flag.length > 0) {
            setImage("");
            return
        }
        setImage(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    const responseDeleteArticleImage = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            deleteMediaArticleImage(response.data)
            return
        };
        setMessage("Ocorreu um erro ao deletar a imagem");
        
    };

    const responseDeleteArticleMediaImage = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            setMessage("Imagem excluída com sucesso");

            return
        };
        setMessage("Ocorreu um erro ao deletar a imagem");
    };

    const deleteArticleImage = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.deleteArticleImage(props.image.articleobjectid, props.image.objectid, cancelToken, responseDeleteArticleImage);
    };

    const deleteMediaArticleImage = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.deleteArticleMediaImage(props.image.articleobjectid, props.image.imageobjectid, cancelToken, responseDeleteArticleMediaImage);
    };

    return (
        <Grid container>
            <Card className={classes.card}>
                <CardContent>
                    <Grid container justifyContent="center">
                        <img alt="" src={"https://prediza.io/images/article/" + props.image.articleobjectid + "/" + props.image.imageobjectid + ".jpg"} className={classes.img} />
                    </Grid>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <Grid container justifyContent="flex-end">
                    <IconButton onClick={()=>toggleDialog(props.image.imageobjectid)}>
                        <DeleteIcon />
                    </IconButton>
                    </Grid>
                </CardActions>
            </Card>
            <PredizaAlertDialog title="Você deseja deletar a imagem?" open={image.length > 0} close={toggleDialog} submit={deleteArticleImage} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid >
    )
})