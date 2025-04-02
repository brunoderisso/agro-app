import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import NoteDashboard from "../components/NoteDashboard";
import TaskStore from "../stores/TaskStore";
import MangementModal from "../components/MangementModal";
import toolsUtils from "../utils/toolsUtils"

const styles = () => ({


});


class PredizaMangement extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            task: null,
            name: ""
        };
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount() {
        this.open = true
        TaskStore.on("change_task", (task) => {
            if(!this.open){
                return 
            }
            if (toolsUtils.isNullOrEmpty(task, "name")) {
                this.setState({ task: task }, this.setState({ name: "" }))
            } else {
                this.setState({ name: task.name }, this.setState({ task: {} }))

            }
        });

        if (!toolsUtils.isEmptyString(this.props.id)) {
            if (this.props.id === "new") {
                this.setState({ task: {} });        
            } else {
                this.getTask();
            }

        }
    }

    //Event methods

    //Component methods
    getTaskResponse = (task) =>{
        this.setState({ task: task });
    }

    //Store methods
    getTask = () =>{
        TaskStore.getTask(this.props.id,this.getTaskResponse);
    }
    render() {
        // const { classes } = this.props;
        return (
            <Grid item xs={12}>
                <NoteDashboard />
                <MangementModal open={this.state.task !== null} task={this.state.task} name={this.state.name} />
            </Grid>
        );
    }

}

export default withStyles(styles)(PredizaMangement);