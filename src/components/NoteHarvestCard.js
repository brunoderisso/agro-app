import React, { Component } from 'react';

// Material UI
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";

//Prediza 
import NoteCrop from "../components/Note/NoteCrop";
import NoteCropEdit from "../components/Note/NoteCropEdit";
const styles = () => ({
    header: {
        padding: 16,
        marginBottom: 32,
        backgroundColor: "#2196f333"
    },
    card: {
        padding: 0
    },
    bar: {
        paddingRight: 16,
        paddingLeft: 16
    },
    footer:{
        marginTop: 16
    },
    item:{
        marginBottom:10
    }
});

class NoteHarvestCard extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
        };
    }

    //Component default methods

    //Event methods

    //Component methods

    //Store methods

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.item}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent className={classes.card}>
                          
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

}

export default withStyles(styles)(NoteHarvestCard);