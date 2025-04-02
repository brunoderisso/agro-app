import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

//Prediza 
import SessionStore from "../stores/SessionStore"


const values = [{ value: 0, label: "Off" },{ value: 30000, label: "30s" },{ value: 60000, label: "1m" },{ value: 180000, label: "3m" }]

const styles = () => ({
    Input: {
        margin: 5,
        width: "100%"
    }
});

class RefreshPicker extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            filter: {
                time: SessionStore.timeRefresh,
            }
        };
    }

    //Component default methods

    //Event methods

    onChangeInput = (obj, propriety) => event => {
        this.changeState(obj, propriety, event.target.value);
    };

    //Component methods

    changeState = (object, propriety, value) => {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
        SessionStore.timeRefresh = value;
        SessionStore.emitTimer(value)
    };

   

    //Store methods

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <FormControl required className={classes.Input}>
                        <InputLabel htmlFor="timezone">Refresh</InputLabel>
                        <Select
                            value={this.state.filter.time || 0}
                            onChange={this.onChangeInput("filter", "time")}
                            name="timezone"
                        >
                            {values.map((time, index) => {
                                return (<MenuItem key={index} value={time.value}>{time.label}</MenuItem>)
                            })}
                        </Select>
                    </FormControl>
                </Grid>
               
            </Grid>);
    }

}

export default withStyles(styles)(RefreshPicker);