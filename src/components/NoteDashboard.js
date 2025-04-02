import React from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { DragDropContext } from "react-beautiful-dnd"


import NoteDashboardContainer from "../components/NoteDashboardContainer";
import TextField from "@material-ui/core/TextField";
import NoteComponent from "../components/NoteDashboardComponent";
import toolsUtils from "../utils/toolsUtils"

const styles = {

}

class NoteDashboard extends NoteComponent {

    render() {
        const { classes } = this.props;
        if (toolsUtils.isNullOrEmpty(this.state, "tasks")) {
            return null;
        }
        const tasks = this.state.tasks;
        return (
            <Grid container className={classes.board}>
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <TextField
                            value={this.state.status.name || ""}
                            onChange={this.onChangeInput("name")}
                        />
                        <Button onClick={this.addStatus} color="primary">Criar Lista</Button>
                    </Grid>
                </Grid>
                <DragDropContext onDragEnd={(result) => this.onDragEnd(result)}>
                    <Grid item xs={12}>
                        <Grid container>

                            {Object.entries(tasks).map(([id, tasks]) => {
                                return (<NoteDashboardContainer id={id} tasks={tasks} />)
                            })}

                        </Grid>
                    </Grid>
                </DragDropContext>
            </Grid>
        )

    }
}

export default withStyles(styles)(NoteDashboard);