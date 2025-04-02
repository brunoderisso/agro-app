import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import MeasureStore from "../stores/MeasureStore";
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";

const styles = {};
class MeasureList extends Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.props = props;

        this.state = {
            flags: {
                isSent: false
            },
            measures: {
                environmentId: this.props.id || SessionStore.getEnvironment(),
                measurements: [],
                measure: MeasureStore.measures
            },
            preference: {}
        };

        this.app = this.props.app;
        this.onSubmit = this.onSubmit.bind(this);
        this.pushMeasure = this.pushMeasure.bind(this);
        this.onChange = this.onChange.bind(this);
        this.changeState = this.changeState.bind(this);
        this.changeMeasure = this.changeMeasure.bind(this);
        this.getEnvironmentMeasurementsCallback = this.getEnvironmentMeasurementsCallback.bind(this);
        this.getEnvironmentMeasurements = this.getEnvironmentMeasurements.bind(this);
        this.getPreference = this.getPreference.bind(this);
        this.getPreferenceCallBack = this.getPreferenceCallBack.bind(this);
        this.setMeasure = this.setMeasure.bind(this);
        this.getMeasure = this.getMeasure.bind(this);
        this.pushPreferenceCallBack = this.pushPreferenceCallBack.bind(this);
        this.changepreference = false;
        this.open = false
    }

    //Component default methods
    componentWillUnmount() {
        this.open = false
    }
    componentDidMount(){
        this.open = true
    }
    componentWillMount() {
       
        if (this.props.push === undefined) {
            this.push = () => { }
        } else {
            this.push = this.props.push.bind(this)
        };

        this.setState({ measure: MeasureStore.measures });
        this.setState({ measure: MeasureStore.measures });

        this.mounted = true;
        SessionStore.on("environment.change", (response) => {
            if(!this.open){
                return 
            }
            this.getEnvironmentMeasurements();
            this.getPreference();
        });
        if (SessionStore.getEnvironment() !== null) {
            this.getEnvironmentMeasurements();
        };
        this.getPreference();
    };


    //Event methods
    onChange = event => {
        this.changeMeasure(event.target.value);
    };

    onSubmit() {
        this.pushMeasure();
    };

    //Component methods
    pushPreferenceCallBack(response) {
        if (response === "sent") {
            SessionStore.setPreference(this.state.preference);
        }
        this.changeState("flags", "isSent", false);
    };

    changeState(object, propriety, value) {
        let actv = this.state[object];
        if (value === null || value === undefined) {
            actv = propriety;
        } else {
            actv[propriety] = value;
        }
        this.setState({ [object]: actv });
    };

    changeMeasure(value) {
        this.changeState("measures", "measure", value);
        if (this.app === "HEATMAP") {
            this.setMeasure(value);
        } else if (this.app === "PREFERENCE") {
            let preference = this.state.preference;
            preference.measure = value;
            this.changeState("preference", "measure", value);
        }
    }

    getEnvironmentMeasurementsCallback(response) {
        this.changeState("measures", "measurements", response);
        this.changeState("measures", "measure", MeasureStore.measures);
    };

    getPreferenceCallBack(value) {
        this.changeState("preference", value);
        this.changeState("measures", "environmentId", value.environment);
        if (this.app === "PREFERENCE") {
            this.changeState("measures", "measure", value.measure);
            this.setMeasure(value.measure);
        };
    };

    //Store methods
    getEnvironmentMeasurements() {
        if (this.state.measures !== undefined && this.state.measures.environmentId.environmentId !== undefined) {
            let measures = SessionStore.getEnvironmentMeasurements(this.state.measures.environmentId);
            if (measures.length !== 0) {
                this.changeState("measures", "measurements", measures);
                this.changeState("measures", "measure", MeasureStore.measures);
            };
        };
    };

    getPreference() {
        let preference = SessionStore.getPreference();
        this.getPreferenceCallBack(preference);
    };

    setMeasure(value) {
        MeasureStore.setMeasure(value);
        this.changeState("measures", "measure", value);
    };

    pushMeasure() {
        this.changeState("flags", "isSent", true);
        this.push(this.state.preference, this.pushPreferenceCallBack);
    };

    getMeasure() { }

    render() {
        const classes = this.props;
        return (
            <List component="nav" className={classes.form}>
                <Grid container >
                    <Grid item xs={12}>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <RadioGroup
                                aria-label="Measurements"
                                name="measurements"
                                className={classes.group}
                                value={this.state.measures.measure}
                                onChange={this.onChange}
                            >
                                {this.state.measures.measurements.map((measure, index) => {
                                    if (!measure.name.includes("_")) {
                                        return (<FormControlLabel
                                            value={measure.name}
                                            control={<Radio color="primary" />}
                                            key={index}
                                            label={(!toolsUtils.isNullOrEmpty(measure,"meta.title") && !toolsUtils.isEmptyString(measure.meta.title)) ? measure.meta.title : measure.name}
                                        />)
                                    }else{
                                        return ""
                                    }

                                })
                                }
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end">
                            {this.app === "PREFERENCE" ? <Button color="primary" disabled={this.state.flags.isSent} onClick={this.onSubmit}>Salvar</Button> : null}
                        </Grid>
                    </Grid>
                </Grid>
            </List>
        );
    };
};

export default withStyles(styles)(MeasureList);