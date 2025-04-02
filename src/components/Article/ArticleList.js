import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";

import CreateIcon from "@material-ui/icons/Create";
import DeleteIcon from "@material-ui/icons/Delete";

//Prediza
import ListRow from "../Common/ListRow";
import GroupButton from "../Common/GroupButton";
import PredizaAlertDialog from "../PredizaAlertDialog";

import ArticleStore from "../../stores/ArticleStore";
import toolsUtils from "../../utils/toolsUtils";

import style from "../../styles/Article/ArticleList";
import tokens from "../../stores/CancelTokenList";
import history from "../../history";


export default withStyles(style)(function TresholdList(props) {
    const { classes } = props;
    const [list, setList] = useState([]);
    const [article, setArticle] = useState("");
    const [message, setMessage] = useState("");

    const tokenList = new tokens();
    const labelColunms = ["title"];

    useEffect(() => {
        getArticles();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const goToEditPage = (id) => {
        history.push("/article/" + id);
    };

    const articleToArray = (article) => {
        let cols = labelColunms.map((val) => {
            if (toolsUtils.isNullOrEmpty(article, val)) {
                return "";
            };

            return article[val];

        });

        cols.push(<GroupButton buttons={[
            { value: <CreateIcon className={classes.icon} />, func: () => { goToEditPage(article.objectid) } },
            { value: <DeleteIcon className={classes.icon} />, func: () => { toggleDialog(article.objectid) } }

        ]} />);

        return cols;

    };

    const responseGetArticles = (response) => {
        tokenList.remove(response.id);

        if (!(response.data === null)) {
            setList(response.data);
            return
        };

    };

    const responseDeleteArticle = (response) => {
        toggleDialog();
        tokenList.remove(response.id);
        if (response.data !== null) {
            let lst = list.filter((val) => {
                return val.objectid !== response.data
            });
            setMessage("Artigo deletado com sucesso");
            setList(lst);
            return
        };
        setMessage("Ocorreu um erro ao deletar o artigo");
    };

    const toggleDialog = (id) => {
        let flag = article;
        if (flag.length > 0) {
            setArticle("");
            return
        }
        setArticle(id);
    };

    const closeMessage = () => {
        setMessage("");
    };

    //Store
    const getArticles = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.getArticles(cancelToken, responseGetArticles);
    };

    const deleteArticle = (id) => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        ArticleStore.deleteArticle(id, cancelToken, responseDeleteArticle);
    };


    return (
        <Grid container>
            <Grid item xs={12}>
                <List>
                    <Grid container className={classes.header}>
                        <Grid item xs={12}>
                            <ListRow key={"header"} header={true} edit={true} values={["Artigo", ""]} />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.space}></Grid>
                    <Divider className={classes.divider}/>
                    <Grid container>
                        {list.map((val, id) => {
                            return (<Grid key={id} item xs={12}><ListRow key={id} edit={true} values={articleToArray(val)} /><Divider /></Grid>)
                        })}
                    </Grid>
                </List>
            </Grid>
            <PredizaAlertDialog title="Você deseja deletar o artigo?" open={article.length > 0} close={toggleDialog} submit={() => { deleteArticle(article) }} />
            <PredizaAlertDialog title={message} open={message.length > 0} close={closeMessage} method="alert" />
        </Grid>
    );
});