import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import WidgetStore from '../../stores/WidgetStore';
import SessionStore from "../../stores/SessionStore";
import MeasureStore from '../../stores/MeasureStore';

// External weather icons
import '../../css/weather-icons.css';

const styles = theme => ({
    root: {
        height: "100%",
        [theme.breakpoints.between('xs', 'sm')]: {
            maxHeight: "42vh",
            minHeight: "42vh"
        },
        [theme.breakpoints.between('sm', 'md')]: {
            maxHeight: "32vh",
            minHeight: "32vh"
        },
        [theme.breakpoints.between('md', 'xl')]: {
            maxHeight: "37vh",
            minHeight: "37vh"
        },
    },
    widgetIcon: {
        fontSize: "7vh"
    }
});
class Temperature extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            environment: null,
            parameters: {
                measure: "AirTemperature",
            },
            color:"#fafafa"
        };
        this.mounted = null;
        this.dataUpdate = this.dataUpdate.bind(this);
        this.environmentUpdate = this.environmentUpdate.bind(this);
    };

    componentWillMount() {
        this.mounted = true;
        SessionStore.on("environment.change", () => {
            this.environmentUpdate();
            if (this.state.environment !== null) {
                this.dataUpdate(this.state.parameters);
            };
        });
        if (SessionStore.getEnvironment() !== null) {
            this.environmentUpdate();
        };
        SessionStore.on("time.change", () => {
            this.dataUpdate(this.state.parameters);
        });
        this.dataUpdate(this.state.parameters);
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    dataUpdate(parameters) {
        if (this.mounted) {
            WidgetStore.getMeasure(parameters, (retrievedata) => {
                if (retrievedata.min !== undefined && retrievedata.max !== undefined && retrievedata.mean !== undefined) {
                    let t = MeasureStore.getGradientColor("AirTemperature", retrievedata.min, retrievedata.max, retrievedata.mean)
                    if(t !== ""){
                        this.setState({color:t})
                    }
                }
                this.setState({
                    data: retrievedata,
                });
            });
        };
    };

    environmentUpdate() {
        if (this.mounted) {
            this.setState({
                environment: SessionStore.getEnvironmentDetail(),
            });
        };
    };

    render() {
        const { classes } = this.props;
        let environment = null;
        if (this.state.environment !== null) {
            environment = this.state.environment;
        };
        let data = {};
        if (Object.keys(this.state.data).length !== 0) {
            data = this.state.data;
        };
        return (
            <Card className={classes.widgetCard} classes={{ root: classes.root }} style={{backgroundColor:this.state.color}}>
                <CardContent>
                    <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                        {(environment.name) ? environment.name : "meu ambiente"}
                    </Typography>
                    <div className={classes.widgetIcon}>
                        <i className="wi wi-thermometer"></i>
                    </div>
                    <Typography variant="h5" component="h2">
                        {(data.last) ? parseFloat(data.last).toFixed(1) : "NaN"} ºC
                    </Typography>
                    <Typography className={classes.widgetPos} color="textSecondary">
                        Temperatura do ar
                    </Typography>
                    <Typography component="p">
                        Máxima: {(data.max) ? parseFloat(data.max).toFixed(1) : "NaN"} ºC
                        <br />
                        Mínima: {(data.min) ? parseFloat(data.min).toFixed(1) : "NaN"} ºC
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

Temperature.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Temperature);