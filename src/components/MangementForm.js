import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import Description from '@material-ui/icons/Description';
import { Link } from "react-router-dom";

//Prediza 
import TaskStore from "../stores/TaskStore";
import history from '../history';

//Others
import moment from "moment"

const styles = () => ({
    underline: {
        "&&&:before": {
            borderBottom: "none!important"
        },
        "&&:after": {
            borderBottom: "none!important"
        }
    },
    title: {
        marginTop: 7
    },
    description: {
        marginTop: 3
    },
    tydescription: {

        fontWeight: 500,
        marginBottom: 5
    },
    icon: {
        fontSize: "1.2rem"
    }
});

class MangementForm extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            task: this.props.task || {},
            eventEdit: false,
            descriptionEdit: false
        };
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount = () => {
        this.open = true
        TaskStore.on("update_task", () => {
            if(!this.open){
                return 
            }
            this.props.close();
        })
        TaskStore.on("add_task", () => {
            if(!this.open){
                return 
            }
            this.props.close();
        })
    }
    //Event methods
    onkeyPress = (e) => {
        if (e.which === 13) {
            e.preventDefault()
            this.onSubmit();
        } else if (e.which === 27) {
            e.preventDefault()
            this.props.close();
        }
    }

    onChangeInput = propriety => event => {
        this.changeState("task", propriety, event.target.value);
    };

    onClickEvent = () => {
        this.setState({ eventEdit: true });
    }

    onBlurEvent = () => {
        this.setState({ eventEdit: false });
    }

    onClickDescription = () => {
        this.setState({ descriptionEdit: true });
    }

    onBlurDescription = () => {
        this.setState({ descriptionEdit: false });
    }

    onSubmit = () => {

        if (this.props.name.length === 0) {
            this.putTask(this.putResponse);
        } else {
            this.addTask()
        }

    }

    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseAddTask = ()=>{
        history.push("/mangement");
    }

    responsePutTask = () => {
        history.push("/mangement");
    }

    //Store methods
    putTask() {
        TaskStore.putTask(this.state.task,this.responsePutTask);
    }

    addTask = () => {
        let task = this.state.task;
        task.data = moment().format("DD/MM/YYYY").toString()
        task.id = new Date().getTime() + Math.random().toString()
        TaskStore.addTask({name:this.props.name, task:task},this.responseAddTask);
    }

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.formControl} noValidate autoComplete="off" onKeyPress={this.onkeyPress}>
                <Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            margin="normal"
                            value={this.state.task.name || ""}
                            onChange={this.onChangeInput("name")}
                            InputProps={{ classes }}
                            onClick={this.onClickEvent}
                            fullWidth
                            required
                            variant={"outlined"}
                            onBlur={this.onBlurEvent}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.title}>
                        <Grid container alignItems="center">
                            <Grid item xs={1}>
                                <Description className={classes.icon} />
                            </Grid>
                            <Grid item xs={11}>
                                <Typography className={classes.tydescription}>Descrição</Typography>
                            </Grid>
                        </Grid>


                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            margin="normal"
                            value={this.state.task.description || ""}
                            onChange={this.onChangeInput("description")}
                            onClick={this.onClickDescription}
                            fullWidth
                            required
                            variant={"outlined"}
                            onBlur={this.onBlurDescription}
                            multiline
                            rows="6"
                            className={classes.description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-start">
                                    <Link
                                        to="/mangement"
                                    >
                                        <Button className={classes.Button} color="primary">Cancelar</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-end">
                                    <Button onClick={this.onSubmit} className={classes.Button} color="primary">Salvar</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );
    }

}

export default withStyles(styles)(MangementForm);