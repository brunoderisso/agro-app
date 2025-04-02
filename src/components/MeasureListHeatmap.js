import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Prediza
import MeasureList from '../components/MeasureList';
import GeoStore from "../stores/GeoStore";
import MeasureStore from "../stores/MeasureStore";

const styles = {};

class MeasureListHeatmap extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.getGeodataCallback = this.getGeodataCallback.bind(this);
        this.getGeodata = this.getGeodata.bind(this);
        this.getMeasure = this.getMeasure.bind(this);
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
        MeasureStore.on("change.measure", () => {
            if(!this.open){
                return 
            }
            this.getGeodata();
        });
    }
    //Component methods
    getGeodataCallback() { }

    //Store methods
    getGeodata() {
        GeoStore.getGeodata(this.getMeasure(), this.getGeodataCallback);
    };

    getMeasure(){
        return MeasureStore.measures[0];
    };

    render() {
        return (
            <MeasureList app="HEATMAP"/>
        );
    };

}

export default withStyles(styles)(MeasureListHeatmap);