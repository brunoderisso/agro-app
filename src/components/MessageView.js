import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

//Prediza
import sessionStore from "../stores/SessionStore";

const styles = theme => ({
    body: {
        marginTop: "4%",
        paddingTop: "4%",
        marginBottom: "4%",
        paddingBottom: "4%",
        backgroundColor: '#e7e7e7',
        borderRadius: "1px",
        [theme.breakpoints.between('xs', 'md')]: {
            height: "40vh"
        },
        [theme.breakpoints.between('md', 'xl')]: {
            height: "25vh"
        }
    },
    bodyText: {
        padding: "4%"
    },
});

class MessageView extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
        this.callBackDeleteMessage = this.callBackDeleteMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
    }

    //Events methods
    onDeleteButtonClick(){
        this.deleteMessage();
    }

    //Component Methods
    callBackDeleteMessage(response){
        if(response === "sent"){
            this.props.click("del");
        }
    }

    //Store methods
    deleteMessage() {
        sessionStore.deleteMessage(this.props.message.objectid,this.callBackDeleteMessage);
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        {this.props.message.subject}
                    </Typography>
                </Grid>
                <Grid item xs={12} className={classes.body}>
                    <Typography variant="body1" className={classes.bodyText}>
                        {this.props.message.body}
                    </Typography>
                </Grid>
                <Grid item xs={6} >
                    <Grid container justifyContent="flex-start" >
                        <Button onClick={this.props.click}  color="primary">Voltar</Button>
                    </Grid>
                </Grid>
                <Grid item xs={6} >
                    <Grid container justifyContent="flex-end">
                        <Button onClick={this.onDeleteButtonClick} color="primary" >Deletar</Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
export default withStyles(styles)(MessageView);