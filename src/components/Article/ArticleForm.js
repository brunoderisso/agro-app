import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

//material ui
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";

import Button from "@material-ui/core/Button";

//Prediza
import PredizaAlertDialog from "../PredizaAlertDialog";
import PredizaEditor from "../PredizaEditor";

import toolsUtils from "../../utils/toolsUtils";
import ArticleStore from "../../stores/ArticleStore";

import tokens from "../../stores/CancelTokenList";
import style from "../../styles/Article/ArticleForm";
import history from "../../history";

//others

export default withStyles(style)(function TresholdForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);
    const [valid, setValid] = useState(false);

    const tokenList = new tokens();

    useEffect(() => {

        startFlags();
        startInputs();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toData = () => {
        const article = props.article || {};
        return {
            objectid: article.objectid || "",
            title: input.title,
            body: input.body,
            headline: input.headline
        }
    };

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(input, "title") || toolsUtils.isEmptyString(input.title) ||
            toolsUtils.isNullOrEmpty(input, "body") || toolsUtils.isEmptyString(input.body) ||
            toolsUtils.isNullOrEmpty(input, "headline") || toolsUtils.isEmptyString(input.headline)
        ) {
            setMessage("Todos os campos devem ser preenchidos")
            setValid(false);
            return false;
        };

        setValid(true);
        return true;
    };

    const back = () => {
        history.push("/article");
    };

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
        if (valid && toolsUtils.isNullOrEmpty(props, "article")) {
            history.push("/article/" + input.objectid);
        }

    };

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const change = (val) => {
        setInput({
            ...input,
            body: val
        });
    }

    const startFlags = () => {
        setCheck(
            {
                submit: false
            }
        );
    };

    const startInputs = () => {
        const article = props.article || {};
        setInput(
            {
                objectid: "",
                title: article.title || "",
                body: article.body || "",
                headline: article.headline || ""
            }
        );
    }

    //Stores
    const addArticleResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar o artigo");
            return
        };

        setInput({
            ...input,
            objectid: resp.data.objectid
        });

        setMessage("Artigo adicionado com sucesso");
    };

    const updateArticleResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alterar o artigo");
            return
        };

        setMessage("Artigo atualizado com sucesso");
    };

    const addArticle = () => {
        if (!isValid()) {
            return
        };

        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.addArticle(toData(), cancelToken, addArticleResponse);
    };

    const updateArticle = () => {
        let cancelToken = {};
        setCheck({
            ...check,
            submit: true
        });
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.updateArticle(toData(), cancelToken, updateArticleResponse);
    };

    return (
        <Grid container className={!toolsUtils.isNullOrEmpty(props, "article") && classes.page}>
            <Grid item xs={12}>
                <TextField
                    label="Título"
                    className={classes.textInput}
                    value={input.title}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    name="title"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Manchete"
                    className={classes.textInput}
                    value={input.headline}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                    name="headline"
                />
            </Grid>
            <Grid item xs={12} className={classes.editor}>
                <Grid container>
                    <Grid item xs={12} >
                        <FormLabel>Conteúdo</FormLabel>
                    </Grid>
                </Grid>
                <Grid item xs={12} >
                    {input.body !== null && input.body !== undefined && <PredizaEditor onChange={change} value={input.body} />}
                </Grid>
            </Grid>
            <Grid item xs={6} >
                <Grid container justifyContent="flex-start">
                    <Button color="primary" onClick={back} >Voltar</Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container className={classes.container} justifyContent="flex-end">
                    {toolsUtils.isNullOrEmpty(props, "article") && check !== null && <Button color="primary" name="submit" onClick={addArticle} disabled={check.submit}>Criar</Button>}
                    {!toolsUtils.isNullOrEmpty(props, "article") && check !== null && <Button color="primary" name="submit" onClick={updateArticle} disabled={check.submit}>Salvar</Button>}
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );
});