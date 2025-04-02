import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import WidgetStore from '../../stores/WidgetStore';
import SessionStore from "../../stores/SessionStore";
// External weather icons
import '../../css/weather-icons.css';

const styles = theme => ({
    root:{
        height:"100%",
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

class Moon extends Component {
    constructor(props){
        super(props);
        this.state = {
          data : {},
          environment : null,
        };
        this.mounted = null;
        this.dataUpdate = this.dataUpdate.bind(this);
        this.environmentUpdate = this.environmentUpdate.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        SessionStore.on("environment.change", () => {
            this.environmentUpdate();
        });
        if (SessionStore.getEnvironment() !== null){
            this.environmentUpdate();
        };
        if (this.state.environment !== null) {
            this.updateData(this.state.environment);
        };
    };

    componentWillUnmount(){
        this.mounted = false;
    };

    environmentUpdate(){
        if (this.mounted){
            this.setState({
                environment : SessionStore.getEnvironmentDetail(),
            });
        };
    };

    updateData(environment){
        if (this.mounted){
            let parameters = {};
            parameters.latitude = environment.latitude;
            parameters.longitude = environment.longitude;
            
            WidgetStore.getAstronomical((sundata, moondata) => {
                this.setState({
                    data: moondata,
                });
            });
        };
    };

    render() {
        const { classes } = this.props;
        let environment = {};
        if (this.state.environment !== null && typeof this.state.environment !== 'undefined') {
            environment = this.state.environment;
        };
        let data = {};
        if (Object.keys(this.state.data).length !== 0) {
          data = this.state.data;   
        }
        return (
            <Card className={classes.widgetCard} classes={{ root: classes.root }}>
                <CardContent>
                    <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                        {(environment.name) ? environment.name : "meu ambiente"}
                    </Typography>
                    <div className={classes.icon}>
                    <i className="wi wi-moon-full"></i>
                    </div>
                    <Typography variant="h5" component="h2">
                        {data.phase}
                    </Typography>
                    <Typography className={classes.widgetPos} color="textSecondary">
                        Fase lunar
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

Moon.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Moon);
