import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {Helmet} from "react-helmet";

// Material UI
import Grid from "@material-ui/core/Grid"

//Prediza Components
import PreferenceCard from "../../components/PreferenceCard"

const styles = {};
class Preference extends Component {
    constructor(props) {
        super(props);

        //Proprieties
        this.props = props;
        this.mounted = null;

        //Functions
        this.getDocumentTitle = this.getDocumentTitle.bind(this);

    }

    //Component state methods
    componentWillMount() {
        this.mounted = true;
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    //Component methods
    getDocumentTitle() {
        return this.title;
    };

    render() {
        return (
            <Grid container justifyContent="center">

                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Prediza | Preference</title>
                    <meta name="description" content="Preferences" />
                </Helmet>
                <Grid item xs={6} lg={4}>
                    <PreferenceCard />
                </Grid>
            </Grid>
        );
    };
}
export default withStyles(styles)(withRouter(Preference));