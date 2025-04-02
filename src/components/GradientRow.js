import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

//Prediza

//Others

const style = {
    row: {
        margin: 5
    },
    input: {
        width: "100%",
    },
    button: {
        width: "100%",
        minWidth: "100%",
        minHeight: "3vh",
        marginTop:"6px"
    },
    deleteButton:{
        width: "100%",
        minWidth: "100%",
        minHeight: "3vh",
       
    },
    icon:{
        fontSize:"3vh"
    }
};
class GradientRow extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.onChangeInput = this.onChangeInput.bind(this);
    }

    //Event methods
    onChangeInput = event => {
        this.props.click(this.props.i)
        this.props.change("keys", this.props.i, event.target.value);
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid item xs={12} className={classes.row}>
                <Grid container>
                    <Grid item xs={8}>
                        <Grid container justifyContent="flex-end">
                            <Input
                                value={this.props.value}
                                onChange={this.onChangeInput}
                                className={classes.input}
                                disabled={this.props.method === "GET"}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent="center">
                            <Button
                                style={{ backgroundColor: this.props.color || "white" }}
                                className={classes.button}
                                onClick={() => { this.props.click(this.props.i) }}
                                disabled={this.props.method === "GET"}
                            >

                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent="center">
                            <Button
                                className={classes.deleteButton}
                                onClick={() => { this.props.delete(this.props.i) }}
                            >
                                <DeleteIcon style={{ display: this.props.method === "GET" ? "none" : "" }} className={classes.icon} />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}
export default withStyles(style)(GradientRow)