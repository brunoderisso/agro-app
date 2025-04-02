import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

import { Droppable } from "react-beautiful-dnd"


import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import NoteAssignmentCard from "../components/NoteAssignmentCard";
import NoteAddCard from "../components/NoteAddCard";
import toolsUtils from "../utils/toolsUtils";
import StatusStore from "../stores/StatusStore";
import TaskStore from "../stores/TaskStore";


const styles = {
    conatiner: {
        width: 272,
        margin: "0 4px",
        height: "100%",
        boxSizing: "border-box",
        display: "inline-block",
        verticalAlign: "top",
        whiteSpace: "nowrap"
    },
    title: {
        weight: 500,
        fontSize: "1,2rem"
    }
}


class NoteDashBoardContainer extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            status: null,
            add: false
        }
        this.open = false
    }
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount() {
        this.open = true
        this.getStatus();
        TaskStore.on("add_task",()=>{
            if(!this.open){
                return 
            }
            this.setState({ add: false })
            
        })
    }

    onClick = () => {
        this.setState({ add: true })
    }

    responseGetStatus = (response) => {
        this.setState({ status: response });
    }

    getStatus = () => {
        StatusStore.getStaus(this.props.id, this.responseGetStatus)
    }

    render() {
        const { classes } = this.props;
        if (toolsUtils.isNullOrEmpty(this.props, "tasks") ||
            toolsUtils.isNullOrEmpty(this.state, "status")) {
            return null
        }
        return (
            <Card className={classes.conatiner}>
                <CardHeader
                    title={this.state.status.name.toUpperCase()}
                    className={classes.title}
                >
                </CardHeader>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <Droppable droppableId={this.props.id} key={this.props.id}>
                                {(provided) => {
                                    return (
                                        <div {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                padding: 4,
                                                width: 250,
                                                minHeight: 500,
                                                background: "#d3eafd",
                                                borderRadius: 5
                                            }}

                                        >
                                            {this.props.tasks.map((item, index) => {
                                                return (<NoteAssignmentCard item={item} index={index} key={item.id} />)
                                            })}

                                            {provided.placeholder}


                                        </div>)
                                }}

                            </Droppable>
                           
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent="center">
                            {this.state.add && <NoteAddCard status={this.state.status.objectid} />}
                            {!this.state.add && <Button color="primary" onClick={this.onClick}>ADICIONAR</Button>}
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }

}
export default withStyles(styles)(NoteDashBoardContainer)