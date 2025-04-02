import React, { useState, useEffect, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import { IconButton, TextField, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import styles from "../../../styles/Board/CommentBox";
import useKeyPress from '../../../Hook/useKeyPress';
import SessionStore from '../../../stores/SessionStore';
import NoteStore from '../../../stores/NoteStore';
import TokenList from '../../../stores/CancelTokenList';
import toolsUtils from '../../../utils/toolsUtils';
import stringsUtils from '../../../utils/stringsUtils';

const mask = "DD/MM/YY - HH:mm";
const tokenList = new TokenList();

export default withStyles(styles)(function CommentBox(props) {
    const [commentValue, setCommentValue] = useState("");
    const [commentLines, setCommentLines] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});

    const scroll = useRef(null);

    const { classes } = props;

    const enter = useKeyPress('Enter');

    useEffect(() => {
        setUsers(SessionStore.getDataLocalStorage("users"));
        getComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (scroll.current) {
            scroll.current.scrollToBottom();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentLines]);

    useEffect(() => {
        if (enter && commentValue !== "") {
            onSend();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enter]);

    useEffect(() => {
        if (users.length > 0) {
            getUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users]);

    const postComment = (comment) => {
        let cancelToken = {}

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.addComment(comment, cancelToken, responsePostComment);
    }

    const responsePostComment = (response) =>{
        tokenList.remove(response.id);
        if(response.data !== null){
            getComments();
        }
    }

    const getUser = () => {
        let conf = SessionStore.getDecodedToken();
        let user = users.find((u) => {
            return u.uuid === conf.UUID
        })

        if (user !== undefined) {
            setUser(user);
        }
    }

    const getComments = () =>{
        let cancelToken = {}

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.getComments(props.boardObjectid, props.cardObjectid, cancelToken, responseGetComments);
    }

    const responseGetComments = (response) =>{
        tokenList.remove(response.id);

        setCommentLines(response.data);
    }

    const handleChange = (e) => {
        setCommentValue(e.target.value);
    }

    const onSend = () => {
        let value = {
            uuid: user.uuid,
            description: commentValue,
            cardObjectid: props.cardObjectid,
            environmentObjectid: SessionStore.getEnvironment(),
            boardObjectid: props.boardObjectid
        }

        postComment(value);
        setCommentValue("");
    }

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }

    return (
        <Grid container>
            <Grid item xs={12} className={classes.commentContainer}>
                <Grid container>
                    <Grid item xs={12}>
                        <Scrollbars ref={scroll} style={{ width: "100%", height: "40vh" }} renderThumbVertical={thumb} className={classes.scrollList}>

                            {commentLines.map((line) => {
                                let user = users.find((u) => {
                                    return u.uuid === line.uuid
                                })
                                return (
                                    <Grid container key={line.objectid}>
                                        <Grid item>
                                            <Grid item className={classes.userItem} style={{ backgroundColor: "#1455BE", color: "white" }}>
                                                {toolsUtils.getAvatar(user)}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={10} style={{ marginTop: "10px" }}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item style={{ fontWeight: "bold", fontSize: "10px", marginLeft: "5px" }}>
                                                            {stringsUtils.mapUserNameSurname(user)}
                                                        </Grid>
                                                        <Grid item style={{ fontSize: "8px", marginLeft: "5px", color:"#5e6c84", marginTop:"2px" }}>
                                                            {moment(line.createdat).format(mask)}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography className={classes.commentBox} variant='body2'>{line.description}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </Scrollbars>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginTop: "10px" }}>
                <Grid container>
                    <Grid item xs={2} md={1} style={{ margin: "auto" }}>
                        <Grid item className={classes.userItem} style={{ backgroundColor: "#1455BE", color: "white" }}>
                            {toolsUtils.getAvatar(user)}
                        </Grid>
                    </Grid>
                    <Grid item  xs={9} md={10} style={{ margin: "auto" }}>
                        <TextField
                            value={commentValue}
                            name={"commentValue"}
                            onChange={handleChange}
                            InputProps={{
                                classes: {
                                    input: classes.textField
                                },
                                disableUnderline: true
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton onClick={onSend} aria-label="delete" disabled={commentValue === ""}>
                            <SendIcon fontSize="large" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
})