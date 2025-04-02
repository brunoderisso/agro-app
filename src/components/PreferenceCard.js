import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"

//Prediza Components
import PreferenceForm from "../components/PreferenceForm"

const styles = {
    CardContent: {
        paddingTop: 0
    }
};

class PreferenceCard extends Component {
    constructor(props) {
        super(props);

        //Proprieties
        this.props = props;
        this.token = this.props.token;
        this.title = "Preferências";

        //Functions
        this.getTitle = this.getTitle.bind(this);
    }

    //Component methods
    getTitle() {
        return this.title;
    }

    render() {
        const { classes } = this.props;
        let title = this.getTitle();
        return (
            <Card>
                <CardHeader
                    title={title}
                />
                <CardContent className={classes.CardContent}>
                    <PreferenceForm method="POST"/>
                </CardContent>
            </Card>);
    }
}
export default withStyles(styles)(PreferenceCard);
