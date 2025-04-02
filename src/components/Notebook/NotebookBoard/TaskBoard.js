import React, { useState, useEffect } from 'react';

//Material-UI
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Board/TaskBoard";
import { Grow, TextField } from '@material-ui/core';


import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from "./TaskColumn";
import moment from 'moment';

//prediza
import NoteStore from "../../../stores/NoteStore";
import cancelToken from '../../../stores/CancelTokenList';
import useKeyPress from '../../../Hook/useKeyPress';

import { Scrollbars } from 'react-custom-scrollbars';
import useResize from '../../../Hook/useResize';
import { useTranslation } from 'react-i18next';


const tokenList = new cancelToken();


export default withStyles(styles)(function TaskBoard(props) {

    const [columnOrder, setColumnOrder] = useState(null);
    const [columns, setColumns] = useState([]);
    const [addFlag, setAddFlag] = useState(false);
    const [title, setTitle] = useState("");
    const { classes } = props;

    const enter = useKeyPress('Enter');
    const escape = useKeyPress('Escape')

    const { t } = useTranslation();

    const window = useResize();

    useEffect(() => {
        if (props.columns !== undefined) {
            initialize();
            setAddFlag(false);
            setTitle("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.columns]);

    useEffect(() => {
        if (enter && addFlag && title.length > 0) {
            onAddNewColumn();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enter]);

    useEffect(() => {
        if (escape) {
            setTitle("");
            setAddFlag(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [escape]);


    const initialize = () => {
        setColumns(props.columns);
        let order = [];
        props.columns.forEach(e => {
            order.push(e.objectid);
        });
        setColumnOrder(order);
    }

    const onAddNewColumn = () => {
        let col = {};

        if (columnOrder.length > 0) {
            const last = columns.find((c) => {
                return c.objectid === columnOrder[columnOrder.length - 1]
            })

            col = {
                name: title,
                position: last.position + 1
            }
        }else{
            col = {
                name: title,
                position: 1
            } 
        }

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.addNewList(col, props.id, cancelToken, responseAddNewList);
    }

    const responseAddNewList = (response) =>{
        tokenList.remove(response.id);
        NoteStore.emit("add_list");
    }

    const moveList = (source, destination, draggableId) => {
        let cols = Array.from(columnOrder);
        cols.splice(source.index, 1);

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);


        if (destination.index === 0) {

            let second = columns.find((c) => {
                return c.objectid === cols[0];
            })
            let first = columns.find((c) => {
                return c.objectid === draggableId;
            })
            let firstindex = columns.findIndex((c) => {
                return c.objectid === draggableId;
            })

            first = {
                ...first,
                position: second.position / 2
            }

            let newColumns = columns;
            newColumns[firstindex] = first;
            setColumns(newColumns);

            NoteStore.updateList(first, props.id, cancelToken, responseUpdateList)
        } else if (destination.index === cols.length) {
            let blast = columns.find((c) => {
                return c.objectid === cols[cols.length - 1];
            })

            let last = columns.find((c) => {
                return c.objectid === draggableId;
            })
            let lastIndex = columns.findIndex((c) => {
                return c.objectid === draggableId;
            })

            last = {
                ...last,
                position: blast.position + 1
            }
            let newColumns = columns;
            newColumns[lastIndex] = last;
            setColumns(newColumns);

            NoteStore.updateList(last, props.id, cancelToken, responseUpdateList)
        } else {

            let one = columns.find((c) => {
                return c.objectid === cols[destination.index]
            })
            let two = columns.find((c) => {
                return c.objectid === cols[destination.index - 1]
            })
           
            let inter = columns.find((c) => {
                return c.objectid === draggableId
            })
            let interIndex = columns.findIndex((c) => {
                return c.objectid === draggableId
            })

            inter = {
                ...inter,
                position: (one.position + two.position) / 2
            }
            let newColumns = columns;
            newColumns[interIndex] = inter;
            setColumns(newColumns);
            NoteStore.updateList(inter, props.id, cancelToken, responseUpdateList)

        }

        cols.splice(destination.index, 0, draggableId);
        setColumnOrder(cols);

    }

    const moveTask = (home, draggableId, source, destination) => {
        let tasks = home.cards;

        const t = tasks.find((t) => {
            return t.objectid === draggableId;
        })

        tasks.splice(source.index, 1);

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        if (destination.index === 0) {
            let second = tasks[0];
            let first = {
                ...t,
                position: second.position / 2
            }
            tasks.splice(destination.index, 0, first);
            //NoteStore.updateCard(first, props.id, cancelToken, responseUpdateCard);
        } else if (destination.index === tasks.length) {
            let blast = tasks[tasks.length - 1];

            let last = {
                ...t,
                position: blast.position + 1
            }
            tasks.splice(destination.index, 0, last);
            //NoteStore.updateCard(last, props.id, cancelToken, responseUpdateCard);
        } else {
            let one = tasks[destination.index];
            let two = tasks[destination.index - 1];
           
            let inter = {
                ...t,
                position: (one.position + two.position) / 2
            }
            tasks.splice(destination.index, 0, inter);
            NoteStore.updateCard(inter, props.id, cancelToken, responseUpdateCard);
        }

        const newHome = {
            ...home,
            cards: tasks
        }
        let cols = columns;

        cols.forEach((col, index) => {
            if (col.objectid === newHome.objectid) {
                cols[index] = newHome;
            }
        });

        setColumns(cols);
    }

    const moveTaskList = (home, foreign, draggableId, source, destination) => {

        //Pega as tarefas da lista de origem
        let tasks = home.cards;

        //Pega a tarefa que esta sendo movida
        let t = tasks.find((t) => {
            return t.objectid === draggableId;
        })


        if(foreign.autoclosetask){
            t['deliveryat'] = moment().toISOString();
        }

        //Remove a tarefa da lista de origem
        tasks.splice(source.index, 1);

        //Pega as tarefas da lista de destino
        let tasksF = foreign.cards;

        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        if (destination.index === 0) {
            let second = {};
            if(tasksF.length === 0){
                second = {position: 2}
            }else{
                second = tasksF[0];
            }
            let first = {
                ...t,
                position: second.position / 2,
                listObjectid: foreign.objectid
            }
            //Coloca na lista de origem a tarefa na posição destino
            tasksF.splice(destination.index, 0, first);
            NoteStore.updateCard(first, props.id, cancelToken, responseUpdateCard);
        } else if (destination.index === tasksF.length) {
            let blast = tasksF[tasksF.length - 1];

            let last = {
                ...t,
                position: blast.position + 1,
                listObjectid: foreign.objectid
            }
            //Coloca na lista de origem a tarefa na posição destino
            tasksF.splice(destination.index, 0, last);
            NoteStore.updateCard(last, props.id, cancelToken, responseUpdateCard);
        } else {
            let one = tasksF[destination.index];
            let two = tasksF[destination.index - 1];

            let inter = {
                ...t,
                position: (one.position + two.position) / 2,
                listObjectid: foreign.objectid
            }
            //Coloca na lista de origem a tarefa na posição destino
            tasksF.splice(destination.index, 0, inter);
            NoteStore.updateCard(inter, props.id, cancelToken, responseUpdateCard);
        }

        const newHome = {
            ...home,
            cards: tasks
        }
        const newForeign = {
            ...foreign,
            cards: tasksF
        }


        //Persiste
        let cols = columns;

        cols.forEach((col, index) => {
            if (col.objectid === newHome.objectid) {
                cols[index] = newHome;
            }
            if (col.objectid === newForeign.objectid) {
                cols[index] = newForeign;
            }
        });

        setColumns(cols);
    }

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }

    const onDragEnd = (result) => {

        //Não tem destino (Pegou e soltou)
        if (!result.destination) {
            return
        }

        const { source, destination, draggableId, type } = result;

        //Pegou, arrastou e soltou no mesmo lugar
        if (source.droppableId === destination.droppableId && destination.index === source.index) {
            return
        }


        //Se for uma lista
        if (type === 'column') {
           


            moveList(source, destination, draggableId);

            return

        }

        //Se for uma tarefa

        //Pega as listas de origem e destino
        const home = columns.find((c) => {
            return c.objectid === source.droppableId;
        })

        const foreign = columns.find((c) => {
            return c.objectid === destination.droppableId;
        })

        //Se for uma tarefa, e for movida dentro da mesma lista
        if (home.objectid === foreign.objectid) {

            moveTask(home, draggableId, source, destination);

            return
        }

        //Se for uma tarefa e for movida entre listas

        moveTaskList(home, foreign, draggableId, source, destination);

    }

    const responseUpdateList = (response) => {
        tokenList.remove(response.id);
    }

    const responseUpdateCard = (response) => {
        tokenList.remove(response.id);
    }

    const addList = () => {
        setAddFlag(true);
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    return (
        <Grid>
            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <Droppable droppableId='all-columns' direction='horizontal' type='column'>
                    {(provided) => (
                        <Grid container
                            {...provided.droppableProps}
                            innerRef={provided.innerRef}
                        >
                            <Grow in={columnOrder !== null} mountOnEnter>
                                <Scrollbars style={{ width: (window.width < 600 && "100vw") || ("93vw"), height: "87vh" }} renderThumbVertical={thumb} className={classes.scrollList}>

                                    {columnOrder !== null && columnOrder.map((id, i) => {
                                        const column = columns.find((c) => {
                                            return c.objectid === id;
                                        })

                                        let tasks = column.cards || [];
                                        return <Grid item className={classes.containerColumn} key={column.objectid}> <Column column={column} id={props.id} tasks={tasks} index={i} /> </Grid>

                                    })}
                                    {addFlag &&
                                        <Grid className={classes.newList}>
                                            <TextField autoFocus id="standard-basic" placeholder={t('common.insertTitle')} multiline fullWidth value={title} onChange={onChangeTitle} InputProps={{
                                                classes: {
                                                    input: classes.resize,
                                                },
                                            }} />
                                        </Grid>}
                                    {provided.placeholder}
                                    <Grid item>
                                        <div onClick={addList} className={classes.addButton}>
                                            {t('notebook.tasks_addNewList')} <b>+</b>
                                        </div>
                                    </Grid>
                                </Scrollbars>
                            </Grow>
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>
        </Grid>
    )
})