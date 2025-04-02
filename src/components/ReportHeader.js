import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";

//Prediza
import SessionStore from "../stores/SessionStore";
import toolsUtils from "../utils/toolsUtils";

//Others
import Select from 'react-select';
import moment from 'moment';
import 'moment/locale/es';

moment.locale(navigator.language);

const styles = () => ({
    grid: {
        border: "black",
        borderStyle: "solid",
        borderWidth: "0.5px",
        padding: 15
    },
    border: {
        border: "black",
        borderStyle: "solid",
        borderWidth: "0.5px"
    },
    inner: {
        minHeight: "100%"
    }
});


class ReportHeader extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            header: {
                environment: {},
                measures: [],
                measure: this.props.measure,
                option: { label: props.name, value: props.name }
            },
            flags: {
                isRecivedEnv: false,
                isRecivedMeasure: false,
            }
        };
    }

    //Component default methods
    componentDidMount() {
        this.getEnvironment();
        this.getMeasure();
        this.getOption()
    }

    componentDidUpdate(props) {
        if (props.measure !== this.state.header.option.value) {
            this.getOption()
        }



    }
    //Event methods
    onChangeMeasure = selectedOption => {
        this.props.change("parameters", "measure", selectedOption.value);

    };

    //Component methods
    changeState = (object, propriety, value) => {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    getOptions = () => {
        let options = [];
        this.state.header.measures.forEach((measure, index) => {
            if (measure.name[0] !== '_') {
                let option = { value: measure.name, label: measure.name }
                if (!toolsUtils.isNullOrEmpty(measure, "meta.title")) {
                    option.label = measure.meta.title;
                }
                options.push(option);
            }
        });
        return options;
    }

    getOption = () => {
        let measure = SessionStore.getMeasure(this.props.measure);
        if (measure !== null && measure !== undefined) {
            let option = { value: this.props.measure, label: this.props.measure }
            if (!toolsUtils.isNullOrEmpty(measure, "meta.title")) {
                option.label = measure.meta.title;
            }
            this.changeState("header", "option", option)
        }


    }

    getPeriod = () => {
        let months;
        let dates = SessionStore.getTime();
        let start = new Date(dates.start);
        let end = new Date(dates.end);

        months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth() + 1;
        months += end.getMonth();

        if (months > 0) {
            return moment(end).subtract(months, 'months').format("MMM/YYYY") + " - " + moment(end).format("MMM/YYYY")
        } else {
            return moment(end).format("MMM/YYYY")
        }

    }

    //Store methods
    getEnvironment = () => {
        this.changeState("header", "environment", SessionStore.getEnvironmentDetail())
        this.changeState("flags", "isRecivedEnv", true);
    }

    getMeasure = () => {
        this.changeState("header", "measures", SessionStore.getEnvironmentMeasurements(SessionStore.getEnvironment()));
        this.changeState("flags", "isRecivedMeasure", true);
    }



    render() {
        const { classes } = this.props;
        return (<div>{this.state.flags.isRecivedEnv && this.state.flags.isRecivedMeasure ?
            <Grid container className={classes.border}>

                <Grid item xs={12} >
                    <Grid container >
                        <Grid item xs={12} md={8} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                <Grid item xs={12}>{"AMBIENTE: " + this.state.header.environment.name.toUpperCase()}</Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                <Grid item xs={3}>MEDIDA: </Grid>
                                <Grid item xs={9}>
                                    <Select
                                        value={this.state.header.option}
                                        onChange={this.onChangeMeasure}
                                        name="measure"
                                        options={this.getOptions()}
                                    >

                                    </Select>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} md={3} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                {"MÊS DE REFERÊNCIA: " + this.getPeriod().toUpperCase()}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={3} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                {this.state.header.environment.seasonal !== undefined ? "PERÍODO SAZONAL: " + this.state.header.environment.seasonal.toUpperCase() : "PERÍODO SAZONAL: "}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={3} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                LOCAL:
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={3} className={classes.grid}>
                            <Grid container className={classes.inner} alignItems="center">
                                {"DATA :" + moment().format("DD/MM/YYYY").toUpperCase()}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> : ""}</div>
        );
    };
};

export default withStyles(styles)(ReportHeader);