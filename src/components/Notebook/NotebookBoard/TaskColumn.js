import React, { useState, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { TwitterPicker } from 'react-color';
import { Droppable, Draggable } from 'react-beautiful-dnd';


import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ClickAwayListener, Grow } from '@material-ui/core';

import useKeyPress from "../../../Hook/useKeyPress";
import styles from "../../../styles/Board/TaskColumn";
import Task from "./Task";
import cancelToken from '../../../stores/CancelTokenList';
import NoteStore from '../../../stores/NoteStore';
import UserFeedback from '../../Common/UserFeedback';
import { useTranslation } from 'react-i18next';


const tokenList = new cancelToken();

export default withStyles(styles)(function NotebookTaskColumn(props) {

    const [column, setColumn] = useState({});
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [addFlag, setAddFlag] = useState(false);
    const [color, setColor] = useState("#7d7d7d");
    const [anchorEl, setAnchorEl] = useState(null);

    const [editColumn, setEditColumn] = useState(false);
    const [error, setError] = useState("");

    const enter = useKeyPress('Enter');
    const escape = useKeyPress('Escape');

    const { t } = useTranslation();

    const input = useRef();

    const { classes } = props;

    useEffect(() => {
        setColumn(props.column);
        setTasks(props.tasks);
        if (props.column.color) {
            setColor(props.column.color)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (input.current !== undefined && input.current !== null) {
            input.current.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, editColumn]);

    useEffect(() => {

        if (props.column !== undefined) {
            setTasks(props.tasks)
            setAddFlag(false);
            setTitle("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.column]);

    useEffect(() => {
        if (enter && title.length > 0 && !editColumn) {
            onAddNewCard();
            return
        }
        if (enter && title.length > 0 && editColumn) {
            onEditListName();
            return
        }
        if (enter && editColumn) {

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enter]);

    useEffect(() => {
        if (escape) {
            setTitle("");
            setAddFlag(false);
            setEditColumn(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escape]);

    const addNewCard = () => {
        setAddFlag(true);
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const responseDeleteList = (response) => {
        tokenList.remove(response.id);
        NoteStore.emit("add_list");
    }

    const handleDelete = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.deleteList(props.column, props.id, cancelToken, responseDeleteList);
        setAnchorEl(null);
    };

    const colorComponent = () => {
        return (
            <Grid container style={{ position: "absolute", top: "12vh" }}>
                {editColumn &&
                    <Grid item xs={12}>
                        <TwitterPicker
                            color={color}
                            onChangeComplete={handleChangeComplete}
                            styles={{ maxWidth: '100px' }}
                        />
                    </Grid>
                }
            </Grid>
        )
    }

    const handleChangeComplete = (color, event) => {
        setColor(color.hex);

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let col = props.column;

        col = {
            ...col,
            color: color.hex
        }

        NoteStore.updateList(col, props.id, cancelToken, responseUpdateList)
    };

    const responseUpdateList = (response) => {
        tokenList.remove(response.id);
        if (response.data) {
            if (response.data.status === 200) {
                if (title !== "") {
                    setColumn({
                        ...column,
                        name: title
                    })
                    setTitle("");
                    setEditColumn(false);
                }
                setError("200");
            }
        }
    }

    const onEditListName = () => {
        let col = {
            ...column,
            name: title
        }

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.updateList(col, props.id, cancelToken, responseUpdateList)

    }

    const handleSetColumnEnd = () => {
        let f = column.autoclosetask;
        if (f === null) {
            f = false;
        }
        let col = {
            ...column,
            autoclosetask: !f,
        }

        setColumn(col);
        setAnchorEl(null);
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.updateList(col, props.id, cancelToken, responseUpdateList);
    }

    const onAddNewCard = () => {
        let card = {
            title: title,
            listobjectid: props.column.objectid
        }
        if (tasks.length === 0) {
            card = {
                ...card,
                position: 1
            }
        } else {
            card = {
                ...card,
                position: tasks[tasks.length - 1].position + 1
            }
        }


        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.addNewCard(card, props.id, cancelToken, responseAddNewCard)
    }

    const responseAddNewCard = (response) => {
        tokenList.remove(response.id);
        NoteStore.emit("add_card");
    }

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }


    const handleClickAway = () => {
        setEditColumn(false);
        setAnchorEl(null);
    }

    const keyPressed = (k) => {

    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Grid style={{ position: "relative" }}>
                <Draggable draggableId={props.column.objectid} index={props.index}>
                    {prov => (
                        <Grid container
                            {...prov.draggableProps}
                            innerRef={prov.innerRef}
                            className={classes.backgroundColumn}>
                            <Grid item xs={12} style={{ backgroundColor: color }} className={classes.topTitle}
                                {...prov.dragHandleProps}
                            >
                                <Grid container>
                                    <Grid item xs={11}>
                                        {!editColumn && column.name}
                                        {editColumn &&
                                            <Grid className={classes.editColumn}>
                                                <TextField inputRef={input} fullWidth value={title} onChange={onChangeTitle} InputProps={{
                                                    classes: {
                                                        input: classes.resizeColumn,
                                                        style: { textAlign: 'center' }
                                                    }
                                                }} />
                                            </Grid>
                                        }
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton aria-label="delete" size="small" onClick={handleClick} style={{ color: "white", right: "5px" }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Grid>
                                    {column.autoclosetask &&
                                        <Grid className={classes.autoCloseColumn}>
                                            <ScheduleIcon fontSize='small' />
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                            <Droppable droppableId={props.column.objectid} type="task">
                                {(prov) => (
                                    <Grid
                                        className={classes.taskList}
                                        innerRef={prov.innerRef}
                                        {...prov.droppableProps}>
                                        <Scrollbars style={{ width: "100%", height: "63vh" }} renderThumbVertical={thumb}>
                                            <Grow in={tasks.length > 0} timeout={1500}>
                                                <Grid>
                                                    {tasks.length > 0 && tasks.map((t, i) => {
                                                        return <Task key={t.objectid} task={t} index={i} />
                                                    })}
                                                </Grid>
                                            </Grow>

                                            {addFlag &&
                                                <Card className={classes.newCard}>
                                                    <TextField autoFocus id="standard-basic" placeholder={t('common.insertTitle')} multiline fullWidth onKeyDown={keyPressed} value={title} onChange={onChangeTitle} InputProps={{
                                                        classes: {
                                                            input: classes.resize,
                                                            style: { textAlign: 'center' }
                                                        },
                                                    }} />
                                                </Card>
                                            }
                                        </Scrollbars>
                                        {prov.placeholder}
                                    </Grid>
                                )}
                            </Droppable>
                            <Grid item xs={12} className={classes.fading}></Grid>
                            <Grid item xs={12} className={classes.containeraddButton}>
                                <div onClick={addNewCard} className={classes.addButton}>
                                    <AddIcon />
                                </div>
                            </Grid>
                        </Grid>
                    )
                    }
                </Draggable>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={Boolean(anchorEl)}
                    onClose={() => { setAnchorEl(null) }}
                >
                    <MenuItem onClick={handleSetColumnEnd}>{t('notebook.tasks_setAsClosingList')}</MenuItem>
                    <MenuItem onClick={() => { setEditColumn(true); setAnchorEl(null); setTitle(column.name) }}>{t('common.editButton')}</MenuItem>
                    <MenuItem onClick={handleDelete}>{t('common.deleteButton')}</MenuItem>
                </Menu>
                {colorComponent()}
                <UserFeedback error={error} setError={setError} />
            </Grid>
        </ClickAwayListener>
    )
})