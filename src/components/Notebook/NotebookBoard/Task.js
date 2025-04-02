import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MapIcon from '@material-ui/icons/Map';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Divider from '@material-ui/core/Divider';

import styles from "../../../styles/Board/Task";
import history from '../../../history';
import SessionStore from '../../../stores/SessionStore';
import toolsUtils from '../../../utils/toolsUtils';


const gradient = [
    { color: "#849696", text: "#000000" },
    { color: "#E8E8E8", text: "#000000" },
    { color: "#102226", text: "#FFFFFF" },
    { color: "#17384C", text: "#FFFFFF" },
    { color: "#E48200", text: "#000000" },
];

export default withStyles(styles)(function NotebookTask(props) {
    const mask = "DD/MM/YYYY HH:mm"

    const [usersOrder, setUsersOrder] = useState([]);
    const [users, setUsers] = useState([]);

    const { classes } = props;

    useEffect(() => {
        setUsers(SessionStore.getDataLocalStorage("users"));
        setUsersOrder(toolsUtils.decodeArrayString(props.task.users));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickCard = () => {

        history.push("tasks/" + props.task.objectid);

    }

    return (
        <Draggable draggableId={props.task.objectid} index={props.index}>
            {(prov, snapshot) => (
                <Grid container
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    innerRef={prov.innerRef}
                >
                    <Card className={classes.containerCard} onDoubleClick={onClickCard} style={snapshot.isDragging ? { border: "solid 2px #abd9ff", transform: "rotate(5deg)" } : {}} >
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12} className={classes.cardTitle}>
                                    {props.task.title}
                                </Grid>
                                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <MapIcon />
                                        </Grid>
                                        <Grid item xs={10}>
                                            {SessionStore.getEnvironmentDetail().name}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <RecentActorsIcon />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Grid container>
                                                {usersOrder.length > 0 && usersOrder.map((item, i) => {
                                                    let user = users.find((u) => {
                                                        return item === u.uuid;
                                                    })
                                                    let index = i;
                                                    if (index > gradient.length)
                                                        index--;

                                                    if(user === undefined)
                                                    return "";

                                                    return (
                                                        <Grid key={user.uuid} item xs={2} className={classes.userItem} style={{ backgroundColor: gradient[index].color, color: gradient[index].text }}>
                                                            {toolsUtils.getAvatar(user)}
                                                        </Grid>
                                                    )
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <DateRangeIcon />
                                        </Grid>
                                        <Grid item xs={10} style={{marginTop: "2px"}}>
                                            {(props.task.endedat && moment(props.task.endedat).format(mask)) || " - "}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                </Grid>
            )}

        </Draggable>
    )
})