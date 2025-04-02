import React from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";

//Prediza 

import NoteCrops from "../../components/Note/NoteCrop";

const style = {
    header: {
        padding: 16,
        marginBottom: 32,
        backgroundColor: "#2196f333"
    },
    cardcontainer:{
        width:"100%"
    },
    card: {
        padding: 0
    },
    bar: {
        paddingRight: 16,
        paddingLeft: 16
    },
    footer: {
        marginTop: 16
    },
    item: {
        marginBottom: 10
    }
};

export default (withStyles(style)(function NoteCrop(props) {
    const { classes } = props;

    return (
        <Grid container>
            <Card className={classes.cardcontainer}>
                <CardContent className={classes.card}>
                    <NoteCrops crop={props.crop} />
                </CardContent>
            </Card>
        </Grid>
    )
}))