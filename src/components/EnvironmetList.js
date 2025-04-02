import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import MeasureList from '../components/MeasureList'
import Checkbox from "@material-ui/core/Checkbox"
import Grid from "@material-ui/core/Grid"
import SessionStore from "../stores/SessionStore"
import MeasureStore from "../stores/MeasureStore"
import { AnalitycsEvent } from "../LocalConfig"


const styles = {
    Button: {
        margin: 5
    }, ExpansionPanelDetails: {
        padding: '15px 35px 15px 35px'
    }
};

class EnvironmentList extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            preference: props.preference,
            isDisabled: false
        }

        this.setFavoriteEnvironment = this.setFavoriteEnvironment.bind(this);

    }

    setFavoriteEnvironment(e, objectId) {
        AnalitycsEvent('navigation', '/click/menu/preference/favorite');

        e.stopPropagation();
        let p = this.state.preference;
        p.environment = objectId;
        this.setState({ preference: p });
        this.setState({ isDisabled: true });
        this.props.push(this.state.preference, (result) => {
            SessionStore.setPreference(this.state.preference)
            this.setState({ isDisabled: false });
            MeasureStore.getEnvironmentMeasurements(objectId, (response) => {
                MeasureStore.setMeasure(response[0].name);
                MeasureStore.setMeasurements(response);
            });
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {this.props.environments.map((environment) => (

                    <ExpansionPanel key={"environment" + environment.objectid + environment.name} className={classes.ExpansionPanel} disabled={this.state.isDisabled}>

                        <ExpansionPanelSummary expandIcon={this.state.preference.environment === environment.objectid ? <ExpandMoreIcon /> : null} className={classes.ExpansionPanelSummary}>
                            <div>
                                <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />}
                                    checked={this.state.preference.environment === environment.objectid}
                                    onClick={e => this.setFavoriteEnvironment(e, environment.objectid)}
                                    color="primary"
                                />

                                {environment.name}
                            </div>
                        </ExpansionPanelSummary>
                        {this.state.preference.environment === environment.objectid ?
                            <ExpansionPanelDetails className={classes.ExpansionPanelDetails}>

                                <Grid container>
                                    <Grid item xs={12}>
                                        <MeasureList id={environment.objectid} preference={this.state.preference} push={this.props.push} className={classes.ExpansionPanel} app="PREFERENCE" />
                                    </Grid>
                                </Grid>

                            </ExpansionPanelDetails> : null}
                    </ExpansionPanel>

                ))}
            </div>
        );
    }
}
export default withStyles(styles)(EnvironmentList);