import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import Modal from '@material-ui/core/Modal';
import Checkbox from '@material-ui/core/Checkbox';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, IconButton, TextField, Zoom } from '@material-ui/core';

import styles from "../../../styles/Board/TaskPage";
import TaskBoard from './TaskBoard';
import PredizaEditor from '../../PredizaEditor';
import PredizaAlertDialog from '../../PredizaAlertDialog';
import NoteStore from '../../../stores/NoteStore';
import cancelToken from '../../../stores/CancelTokenList';
import history from '../../../history';
import SessionStore from '../../../stores/SessionStore';
import TaskSelector from './TaskSelector';
import Canvas from '../../Common/Canvas';
import CommentBox from './CommentBox';
import useKeyPress from '../../../Hook/useKeyPress';
import toolsUtils from '../../../utils/toolsUtils';

import moment from 'moment';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';


/* Color Theme Swatches in Hex */
const gradient = [{ color: "#849696", text: "#000000" }, { color: "#FEFFFB", text: "#000000" }, { color: "#102226", text: "#FFFFFF" },
{ color: "#17384C", text: "#FFFFFF" }, { color: "#E48200", text: "#000000" }]

const tokenList = new cancelToken();

export default withStyles(styles)(function NotebookBoardsPage(props) {
    const mask = "YYYY-MM-DDTHH:mm"

    const [boards, setBoards] = useState([]);
    const [board, setBoard] = useState({});
    const [taskId, setTaskId] = useState("");
    const [task, setTask] = useState({});
    const [backupTask, setBackupTask] = useState({});
    const [polygons, setPolygons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [startedAt, setStartedAt] = useState("");
    const [endedAt, setEndedAt] = useState("");

    const [open, setOpen] = useState(false);
    const [boardFlag, setBoardFlag] = useState(false);
    const [delivered, setDelivered] = useState(false);
    const [editFlag, setEditFlag] = useState(false);

    const [labelOrder, setLabelOrder] = useState([]);
    const [polygonOrder, setPolygonOrder] = useState([]);
    const [usersOrder, setUsersOrder] = useState([]);
    const [imageOrder, setImageOrder] = useState([]);
    const [categoriesOrder, setCategoriesOrder] = useState([]);

    const [newBoard, setNewBoard] = useState({});

    const enter = useKeyPress('Enter');
    const escape = useKeyPress('Escape')

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        getBoards();
        bind();
        let env = SessionStore.getEnvironmentDetail();

        setNewBoard({
            name: env.name,
            environmentObjectid: env.objectid
        })

        setPolygons(SessionStore.getDataLocalStorage("polygons"));
        getUsers();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTaskId(props.taskId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (enter && editFlag) {
            saveTitle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enter]);

    useEffect(() => {
        if (escape && editFlag) {
            setTask({
                ...task,
                title: backupTask.title
            })
            setEditFlag(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escape]);

    useEffect(() => {
        if (taskId.length > 0 && board.objectid) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.getBoardCard(taskId, board.objectid, cancelToken, responseGetCard);

            cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.getCategories(cancelToken, responseGetCategories);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]);

    useEffect(() => {
        if (boards.length > 0) {
            let id = boards[0].objectid;
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.getBoard(id, cancelToken, responseGetBoard);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [boards]);

    const responseGetCard = (response) => {
        tokenList.remove(response.id);
        setTask(response.data);
        setBackupTask(response.data);

        if (response.data.startedat) {
            setStartedAt(moment(response.data.startedat).format(mask));
        }

        if (response.data.endedat) {
            setEndedAt(moment(response.data.endedat).format(mask));
        }

        if (response.data.deliveryat) {
            setDelivered(true);
        }

        setLabelOrder([]);
        setUsersOrder([]);
        setPolygonOrder([]);

        if (response.data.labels !== null) {
            let labels = response.data.labels;
            setLabelOrder(labels);
        }
        if (response.data.polygons !== null) {
            let polygons = response.data.polygons;
            setPolygonOrder(polygons);
        }
        if (response.data.users !== null) {
            let users = response.data.users;
            setUsersOrder(users);
        }
        if (response.data.pictures !== null) {
            let pics = response.data.pictures;

            setImageOrder(pics);
        }
        if (response.data.categories !== null) {
            let ctgs = response.data.categories
            setCategoriesOrder(ctgs);
        }
    }

    const responseGetCategories = (response) => {
        tokenList.remove(response.id);

        if (response.data !== null) {
            setCategories(response.data);
        }
    }

    const bind = () => {
        NoteStore.addListener("add_card", reloadBoard);
        NoteStore.addListener("add_list", reloadBoard);
    }
    const clear = () => {
        NoteStore.removeListener("add_card", reloadBoard);
        NoteStore.removeListener("add_list", reloadBoard);
    }

    const getUsers = () => {
        setUsers(SessionStore.getDataLocalStorage("users") || []);
    }

    const reloadBoard = () => {
        getBoards();
    }

    const getBoards = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.listEnvironmentBoards(cancelToken, responseGetBoards);
    }

    const responseGetBoards = (response) => {
        tokenList.remove(response.id);

        if (response.data !== undefined && response.data.length === 0) {
            setBoardFlag(true);
        }
        setBoards(response.data);
    }

    const responseGetBoard = (response) => {
        tokenList.remove(response.id);

        if (board.objectid) {
            setBoard({});
            setTask({});
            setBoard(response.data);
            history.push("/note/" + SessionStore.getEnvironment() + "/tasks")
        } else {
            setBoard({});
            setBoard(response.data);
            setTaskId("");
            setTaskId(props.taskId);
            setTask({})
            setStartedAt("");
            setEndedAt("");
        }
    }

    const handleClickAway = () => {
        setTask({})
        setStartedAt("");
        setEndedAt("");
        history.push("/note/" + SessionStore.getEnvironment() + "/tasks")
    }

    const handleClickNotify = () => {

    }

    const handleChangeInput = (e) => {
        setTask({
            ...task,
            [e.target.name]: e.target.value
        })
    }
    const saveTitle = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let card = {
            ...task
        }

        NoteStore.updateCard(card, board.objectid, cancelToken, responseUpdateTitle)
    }

    const saveCard = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let lab = labelOrder;
        let pols = polygonOrder;
        let us = usersOrder;
        let imgs = imageOrder;
        let ctgs = categoriesOrder;

        let card = {
            ...task,
            pictures: imgs,
            labels: lab,
            users: us,
            polygons: pols,
            categories: ctgs,
            startedat: moment(startedAt).toISOString(),
            endedat: moment(endedAt).toISOString()
        }

        NoteStore.updateCard(card, board.objectid, cancelToken, responseUpdateCard)
    }

    const deleteCard = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.deleteCard(task, board.objectid, cancelToken, responseDeleteCard)
    }

    const responseDeleteCard = (response) => {
        tokenList.remove(response.id);
        reloadBoard();
    }

    const responseUpdateCard = (response) => {
        tokenList.remove(response.id);
        reloadBoard();
    }

    const responseUpdateTitle = (response) => {
        tokenList.remove(response.id);
        if (response.data !== null) {
            setEditFlag(false);
        }
    }

    const changeLabels = (id) => {

        let index = labelOrder.findIndex((item) => {
            return item === id;
        })

        let newOrder = Array.from(labelOrder);

        if (index === -1) {
            newOrder.push(id);
            setLabelOrder(newOrder);
        } else {
            newOrder.splice(index, 1);
            setLabelOrder(newOrder);
        }

    }

    const changeCategories = (id) => {
        let index = categoriesOrder.findIndex((item) => {
            return item === id;
        })

        let newOrder = Array.from(categoriesOrder);

        if (index === -1) {
            newOrder.push(id);
            setCategoriesOrder(newOrder);
        } else {
            newOrder.splice(index, 1);
            setCategoriesOrder(newOrder);
        }
    }

    const changePolygons = (id) => {
        let index = polygonOrder.findIndex((item) => {
            return item === id;
        })

        let newOrder = Array.from(polygonOrder);

        if (index === -1) {
            newOrder.push(id);
            setPolygonOrder(newOrder);
        } else {
            newOrder.splice(index, 1);
            setPolygonOrder(newOrder);
        }
    }

    const changeUsers = (id) => {
        let index = usersOrder.findIndex((item) => {
            return item === id;
        })

        let newOrder = Array.from(usersOrder);

        if (index === -1) {
            newOrder.push(id);
            setUsersOrder(newOrder);
        } else {
            newOrder.splice(index, 1);
            setUsersOrder(newOrder);
        }
    }

    const createDefaultBoard = () => {
        setOpen(false);

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.addNewBoard(newBoard, cancelToken, responseAddBoard);
    }

    const onUpload = (data) => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.uploadImage({ data: data, environment: SessionStore.getEnvironment() }, cancelToken, responseUploadImage);
    }

    const responseUploadImage = (response) => {
        tokenList.remove(response.id);
        if (response.data !== undefined && response.data.objectid) {
            let pics = Array.from(imageOrder);
            pics.push(response.data.objectid);
            setImageOrder(pics);

            let imgs = "{";
            if (pics.length !== 0) {
                pics.forEach(l => {
                    imgs = imgs + l + ",";
                });
                imgs = imgs.substring(0, imgs.length - 1) + "}";
            } else {
                imgs = imgs + "}";
            }

            let card = {
                ...task,
                pictures: imgs,
            }

            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.updateCard(card, board.objectid, cancelToken, (r) => { tokenList.remove(r.id) });
        }
    }

    const responseAddBoard = (response) => {
        tokenList.remove(response.id);
        setBoardFlag(false);
        reloadBoard();
    }

    const changeDescription = (value) => {
        setTask({
            ...task,
            description: value
        })
    }

    const onChangeDate = (e, t) => {
        if (t === 'I') {
            setStartedAt(e.target.value)
        } if (t === "F") {
            setEndedAt(e.target.value)
        }
    }

    const onClickRemove = (item, type) => {
        if (type === 'labels') {
            let arr = Array.from(labelOrder);
            let result = arr.filter(data => data !== item);
            setLabelOrder(result);
        }
        if (type === 'talhoes') {
            let arr = Array.from(polygonOrder);
            let result = arr.filter(data => data !== item);
            setPolygonOrder(result);
        }
        if (type === 'users') {
            let arr = Array.from(usersOrder);
            let result = arr.filter(data => data !== item);
            setUsersOrder(result);
        }
        if (type === 'categories') {
            let arr = Array.from(categoriesOrder);
            let result = arr.filter(data => data !== item);
            setCategoriesOrder(result);
        }
    }

    const onDelivery = (e) => {
        setDelivered(e.target.checked);

        if (e.target.checked) {
            let t = {
                ...task,
                deliveryat: moment().toISOString()
            }
            setTask(t);
        }
    }

    const hexToRGB = (hex) => {
        if (hex) {
            let h = hex.substring(1, 7);
            let r = parseInt(h.substring(0, 2), 16);
            let g = parseInt(h.substring(2, 4), 16);
            let b = parseInt(h.substring(4, 6), 16);

            return r + "," + g + "," + b;
        }
        return hex;
    }


    const getTaskForm = () => {
        return (
            <Grid container className={classes.containerForm}>
                <IconButton onClick={saveCard} className={classes.saveButton}> <DoneIcon /> </IconButton>
                <IconButton onClick={deleteCard} className={classes.deleteButton}> <DeleteIcon /> </IconButton>
                <IconButton onClick={handleClickNotify} className={classes.notifyButton}> <NotificationsNoneIcon /> </IconButton>
                <IconButton onClick={handleClickAway} className={classes.closeButton}> <CloseIcon /></IconButton>
                <div onClick={() => { setEditFlag(true); }}>
                    <Grid item xs={12} className={classes.titleForm}>
                        {!editFlag && task.title}
                        {editFlag &&
                            <TextField
                                value={task.title}
                                name={"title"}
                                autoFocus
                                onChange={handleChangeInput}
                                InputProps={{
                                    className: classes.editTitle,
                                    disableUnderline: true
                                }}
                            />
                        }
                    </Grid>
                </div>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid className={classes.labels}>
                                        {t('common.description')}
                                    </Grid>
                                    <PredizaEditor onChange={changeDescription} value={task.description} />
                                </Grid>
                                <Grid item xs={12}>
                                    <CommentBox cardObjectid={task.objectid} boardObjectid={board.objectid} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} style={{ paddingLeft: "10px" }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid className={classes.labels}>
                                        {t('common.images')}
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <Grid container>
                                                {imageOrder.length > 0 && imageOrder.map((item) => {
                                                    let url = "https://prediza.io/images/" + newBoard.environmentObjectid + "/" + item + ".jpg";

                                                    return (
                                                        <Grid key={item} item className={classes.imageItem}>
                                                            <img alt='imagem' src={url} width={"60px"}></img>
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <TaskSelector upload={onUpload} list={board.labels} type={'images'} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {board.labels !== null && board.labels !== undefined &&
                                    <Grid item xs={12}>
                                        <Grid className={classes.labels}>
                                            {t('notebook.tasks_markers')}
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={11}>
                                                <Grid container>
                                                    {labelOrder.length > 0 && labelOrder.map((item) => {
                                                        let label = board.labels.find((l) => {
                                                            return item === l.objectid;
                                                        })
                                                        let rgb = hexToRGB(label.color);
                                                        if (rgb) {
                                                            let color = "rgba(" + rgb + ", 0.4)";
                                                            rgb = color;
                                                        }
                                                        return (
                                                            <Grid key={label.objectid} item className={classes.labelItem} style={{ border: "solid 2px " + label.color, position: "relative", backgroundColor: rgb, fontWeight: 600 }}>
                                                                {label.name}
                                                                <div onClick={() => { onClickRemove(item, 'labels') }} className={classes.removeIcon}> <CancelIcon fontSize='small' style={{ color: "red" }} /> </div>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TaskSelector onChange={changeLabels} list={board.labels} type={'labels'} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                                {categories !== null && categories.length > 0 &&
                                    <Grid item xs={12}>
                                        <Grid className={classes.labels}>
                                            {t('notebook.tasks_categories')}
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={11}>
                                                <Grid container>
                                                    {categoriesOrder.length > 0 && categoriesOrder.map((item) => {
                                                        let categorie = categories.find((l) => {
                                                            return item === l.objectid;
                                                        })
                                                        let rgb = hexToRGB(categorie.color);
                                                        if (rgb) {
                                                            let color = "rgba(" + rgb + ", 0.4)";
                                                            rgb = color;
                                                        }
                                                        return (
                                                            <Grid key={categorie.objectid} item xs={5} className={classes.categorieItem} style={{ backgroundColor: rgb }}>
                                                                <Grid container>
                                                                    <Grid item xs={2}>
                                                                        <svg height="20" width="20">
                                                                            <circle cx="10" cy="10" r="7" stroke="black" strokeWidth="1" fill={categorie.color} />
                                                                        </svg>
                                                                    </Grid>
                                                                    <Grid style={{ fontSize: "12px", marginTop: "3px" }} item xs={10}>
                                                                        {categorie.name}
                                                                    </Grid>
                                                                </Grid>
                                                                <div onClick={() => { onClickRemove(item, 'categories') }} className={classes.removeIcon}> <CancelIcon fontSize='small' style={{ color: "red" }} /> </div>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TaskSelector onChange={changeCategories} list={categories} type={'categories'} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                                {polygons !== null && polygons.length > 0 &&
                                    <Grid item xs={12}>
                                        <Grid className={classes.labels}>
                                            {t('common.field')}
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={11}>
                                                <Grid container>
                                                    {polygonOrder.length > 0 && polygonOrder.map((item) => {
                                                        let pol = polygons.find((p) => {
                                                            return item === p.objectid;
                                                        })
                                                        return (
                                                            pol && <Grid key={pol.objectid} item className={classes.polygonItem}>
                                                                <Grid container style={{ position: "relative" }}>
                                                                    <Grid item xs={12} className={classes.ajustPolygon}>
                                                                        <Canvas pts={pol.Points} width="80" height="70" />
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        {pol.name}
                                                                    </Grid>
                                                                    <div onClick={() => { onClickRemove(item, 'talhoes') }} className={classes.removeIcon}> <CancelIcon style={{ color: "red" }} /> </div>

                                                                </Grid>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TaskSelector onChange={changePolygons} list={polygons} type={'polygons'} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                                {users !== null && users.length > 0 &&
                                    <Grid item xs={12}>
                                        <Grid className={classes.labels}>
                                            {t('notebook.tasks_responsibles')}
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={11}>
                                                <Grid container>
                                                    {usersOrder.length > 0 && usersOrder.map((item, i) => {
                                                        let user = users.find((u) => {
                                                            return item === u.uuid;
                                                        })
                                                        let index = i;
                                                        if (index > gradient.length)
                                                            index--;

                                                        return (
                                                            <Grid key={user?.uuid} item className={classes.userItem} style={{ backgroundColor: gradient[index].color, color: gradient[index].text }}>
                                                                {toolsUtils.getAvatar(user)}
                                                                <div onClick={() => { onClickRemove(item, 'users') }} className={classes.removeIcon}> <CancelIcon fontSize='small' style={{ color: "red" }} /> </div>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <TaskSelector onChange={changeUsers} list={users} type={'users'} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                }
                                <Grid item xs={12} className={classes.dates}>
                                    <Grid container>
                                        <Grid item xs={6} md={4} style={{ padding: "5px" }}>
                                            <form className={classes.container} noValidate>
                                                <TextField
                                                    id="datetime-local"
                                                    label={t('common.startDate')}
                                                    fullWidth
                                                    type="datetime-local"
                                                    value={startedAt}
                                                    onChange={(e) => { onChangeDate(e, 'I') }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </form>
                                        </Grid>
                                        <Grid item xs={6} md={4} style={{ padding: "5px" }}>
                                            <form className={classes.container} noValidate>
                                                <TextField
                                                    id="datetime-local"
                                                    label={t('common.endDate')}
                                                    fullWidth
                                                    value={endedAt}
                                                    onChange={(e) => { onChangeDate(e, 'F') }}
                                                    type="datetime-local"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </form>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Grid container>
                                                <Grid item xs={12} style={{ paddingLeft: "8px" }}>
                                                    {t('common.deliveryDate')}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid item xs={2}>
                                                            <Checkbox
                                                                disableRipple
                                                                color="default"
                                                                checked={delivered}
                                                                onChange={onDelivery}
                                                                checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                                                                icon={<span className={classes.icon} />}
                                                                inputProps={{ 'aria-label': 'decorative checkbox' }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={10} style={{ lineHeight: "34px" }}>
                                                            {(task.deliveryat && moment(task.deliveryat).format("DD/MM/YYYY - HH:mm")) || "__-__-__  __:__"}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const body = (
        <Grid className={classes.modalBody}>
            <Grid container>
                <Grid item xs={12} style={{ padding: "5px", fontWeight: "bold" }}>
                    {t('common.name')}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        value={newBoard.name}
                        name={"name"}
                        onChange={(e) => { setNewBoard({ ...newBoard, [e.target.name]: e.target.value }) }}
                        InputProps={{
                            classes: {
                                input: classes.textField
                            },
                            disableUnderline: true
                        }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={10}>

                        </Grid>
                        <Grid item xs={2}>
                            <Button onClick={createDefaultBoard} color="primary" autoFocus>
                                {t('common.ok')}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <Grid id={"backg"}>
            <Modal
                open={open}
                onClose={() => { setOpen(false) }}
            >
                {body}
            </Modal>
            <PredizaAlertDialog title={t('alert.checkTasks')} open={boardFlag} close={() => { setBoardFlag(false) }} submit={() => { setOpen(true); setBoardFlag(false) }} />
            {taskId.length === 0 &&
                <TaskBoard columns={board.lists} id={board.objectid} />
            }
            {task && task.objectid &&
                <Zoom in={task.objectid !== undefined}>
                    <Grid>
                        {getTaskForm()}
                    </Grid>
                </Zoom>
            }
        </Grid>
    )
})