import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SessionStore from "../../stores/SessionStore";
import WidgetStore from '../../stores/WidgetStore';
import MeasureStore from '../../stores/MeasureStore';
// External weather icons
import '../../css/weather-icons.css';

const styles = theme => ({
    root:{
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
        height:"100%",
    },
    widgetIcon: {
            fontSize: "7vh"
    }
});

class Pressure extends Component {
    constructor(){
        super();
        this.state = {
          data : {},
          environment : null,
          parameters: {
            measure: "AtmosphericPressure",
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
            if(this.state.environment !== null){
                this.dataUpdate(this.state.parameters);
            };
        });
        if (SessionStore.getEnvironment() !== null){
            this.environmentUpdate();
        };
        SessionStore.on("time.change", () => {
            this.dataUpdate(this.state.parameters);
        });
        this.dataUpdate(this.state.parameters);
    };

    componentDidMount() {
        this.mounted = true;
        SessionStore.on("environment.change", () => {
            this.environmentUpdate();
            if(this.state.environment !== null){
                this.dataUpdate(this.state.parameters);
            };
        });
        if (SessionStore.getEnvironment() !== null){
            this.environmentUpdate();
        };
        SessionStore.on("time.change", () => {
            this.dataUpdate(this.state.parameters);
        });
        this.dataUpdate(this.state.parameters);
    };
    componentWillUnmount(){
        this.mounted = false;
    };

    dataUpdate(parameters){
        if (this.mounted){
            WidgetStore.getMeasure(parameters, (retrievedata) => {
                if (retrievedata.min !== undefined && retrievedata.max !== undefined && retrievedata.mean !== undefined) {
                    let t = MeasureStore.getGradientColor("AtmosphericPressure", retrievedata.min, retrievedata.max, retrievedata.mean)
                    
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

    environmentUpdate(){
        if (this.mounted){
            this.setState({
                environment : SessionStore.getEnvironmentDetail(),
            });
        };
    };

    render() {
        const { classes } = this.props;
        let environment = null;
        if (this.state.environment !== null && typeof this.state.environment !== 'undefined') {
            environment = this.state.environment;
        };
        let data = {};
        if (Object.keys(this.state.data).length !== 0) {
          data = this.state.data;   
        };
        return (
            <Card className={classes.widgetCard} classes={{ root: classes.root }}  style={{backgroundColor:this.state.color}}>
                <CardContent >
                    <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                        {(environment.name) ? environment.name : "meu ambiente"}
                    </Typography>
                    <div className={classes.widgetIcon}>
                    <i className="wi wi-barometer"></i>
                    </div>
                    <Typography variant="h5" component="h2">
                      {(data.last) ? parseFloat(data.last).toFixed(1) : "NaN"} mbar
                    </Typography>
                    <Typography className={classes.widgetPos} color="textSecondary">
                        Pressão Atmosférica
                    </Typography>
                    <Typography component="p">
                        Máxima: {(data.max) ? parseFloat(data.max).toFixed(1) : "NaN"} mbar
                        <br />
                        Mínima: {(data.min) ? parseFloat(data.min).toFixed(1) : "NaN"} mbar
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

Pressure.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Pressure);