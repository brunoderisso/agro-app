import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SurroundSound from '@material-ui/icons/SurroundSound';
import SessionStore from "../../stores/SessionStore";
import WidgetStore from '../../stores/WidgetStore';
import MeasureStore from '../../stores/MeasureStore';

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

class Noise extends Component {
    constructor(){
        super();
        this.state = {
          data : {},
          environment : null, 
          parameters: {
            measure : "Noise",
          },
          color:"#fafafa"
        };
        this.mounted = null;
        this.environmentUpdate = this.environmentUpdate.bind(this);
        this.dataUpdate = this.dataUpdate.bind(this);
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

    dataUpdate() {
        if (this.mounted){
            WidgetStore.getNoise((retrievedata) => {
                let t = MeasureStore.getLaeqColor(retrievedata.value);
                    if(t !== ""){
                        this.setState({color:t})
                    }
                this.setState({
                    data: retrievedata, 
                });
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
                <CardContent>
                    <Typography className={classes.widgetTitle} color="textSecondary" gutterBottom>
                        {(environment.name) ? environment.name : "meu ambiente"}
                    </Typography>
                    <SurroundSound className={classes.widgetIcon}/>
                    <Typography variant="h5" component="h2">
                        {(data.value) ? parseFloat(data.value).toFixed(1) : "NaN"} db
                    </Typography>
                    <Typography className={classes.widgetPos} color="textSecondary">
                        laeq
                    </Typography>
                    <Typography component="p">
                        
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}

Noise.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Noise);