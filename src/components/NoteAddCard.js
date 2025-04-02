import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";


// Material UI
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//Prediza 
import TaskStore from "../stores/TaskStore";

//Others

const styles = () => ({
    item: {
        margin: 10
    },
    card: {
        padding: 5,

    },
    colorBar: {
        height: 7,
        marginBottom: 10
    },
    header: {
        paddingRight: 16,
        paddingLeft: 16,
        marginBottom: 10
    },
    event: {
        paddingRight: 16,
        paddingLeft: 16,
        fontSize: 22,
        fontWeigth: 500
    },
    status: {
        width: 20,
        height: 20,
        marginLeft: 2
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            task: { status: this.props.status}
        };
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount(){
        this.open = true
        TaskStore.on("add_task",()=>{
            if(!this.open){
                return 
            }
            this.changeState("task", "name", "");
        })
    }

    //Event methods

    //Component methods


    onChangeInput = propriety => event => {
        this.changeState("task", propriety, event.target.value);
    };
    
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };
    //Store methods

    addTask = () => {
        TaskStore.addTask(this.state.task);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={12} className={classes.item}>
                <Card onClick={this.onClick}>
                    <CardContent className={classes.card}>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={7}>
                                    <TextField
                                        value={this.state.task.name || ""}
                                        onChange={this.onChangeInput("name")}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <Button color="primary" onClick={this.addTask}>ADICIONAR</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    }

}

export default withStyles(styles)(FilterQuick);