import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import EyeIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

//Prediza 
import PoligonStore from "../stores/PoligonStore"

const styles = () => ({
    conatiner: {
        padding: 10,
        margin: 7,
        maxWidth: "95%"
    },
    icon: {
        fontSize: 20
    },
    button: {
        minWidth: 15
    },
    font:{
        fontSize: "1.1rem"
    }
});

class PoligonListRow extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            view: true
        };
    }

    //Component default methods

    //Event methods

    onViewButtonClick = () => {
        if (this.state.view) {
            this.setState({ view: false }, () => {
                PoligonStore.deletePoligon(this.props.poligon.objectid)
            })
            return
        }

        this.setState({ view: true }, () => {
            PoligonStore.viewPoligon(this.props.poligon)
        })
    }

    onEditClick = () => {
        this.setState({ view: true }, () => {
            PoligonStore.editPoligon(this.props.poligon)
        })
    }

    //Component methods

    //Store methods

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.conatiner}>
               
                <Grid item xs={8}>
                    <Grid container alignItems="center">
                        <Typography className={classes.font} variant="button">{this.props.poligon.name.toUpperCase()}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Button onClick={this.onEditClick} className={classes.button}>
                        <EditIcon className={classes.icon} />
                    </Button>
                    <Button onClick={this.onViewButtonClick} className={classes.button}>
                        <EyeIcon className={classes.icon} style={{ color: this.state.view ? "" : "gray" }} />
                    </Button>
                </Grid>
            </Grid>
        );
    }

}

export default withStyles(styles)(PoligonListRow);