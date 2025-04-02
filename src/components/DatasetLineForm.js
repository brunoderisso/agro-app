import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//Prediza 
import DatasetTableStore from "../stores/DatasetTableStore";

//Other

const styles = () => ({
    Input: {
        margin: 5,
        width: "100%"
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isDisabled: false
            },
            row: this.props.row || {}
        };

        this.changeState = this.changeState.bind(this);
        this.addRow = this.addRow.bind(this);
        this.responseAddRow = this.responseAddRow.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    //Component default methods

    //Event methods
    onChangeInput = propriety => event => {
        this.changeState("row", propriety, event.target.value);
    };

    onSubmit() {
            this.addRow();
    };


    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    responseAddRow(response) {
        this.changeState("flags", "isDisabled", false);
        if (response === "inserted") {
            this.props.close();
        }
    };



    //Store methods
    addRow() {
        this.changeState("flags", "isDisabled", true);
        let row = {};

        this.props.keys.forEach((key) => {
            row[key.label] = parseFloat(this.state.row[key.label]);
        });

        row.type = this.props.type;
        
        DatasetTableStore.addTableRow(this.props.type, row, this.responseAddRow);
    }

    render() {
        const { classes, t } = this.props;
        return (
            <form className={classes.formControl} noValidate autoComplete="off">
                <Grid>
                    {this.props.keys.map((value)=>{
                        
                        return (
                        <Grid item xs={12}>
                            <TextField
                                id={value.label}
                                label={value.label}
                                margin="normal"
                                value={this.state.row[value.label] || ""}
                                onChange={this.onChangeInput(value.label)}
                                className={classes.Input}
                                fullWidth
                                required
                                disabled={this.props.method === "GET"}
                            />
                        </Grid>)
                    })}
                    
                  
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-start">
                                    <Button onClick={this.props.close} className={classes.Button} color="primary">{t("common.cancelButton")}</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-end">
                                    {this.props.method !== "GET" ?
                                        <Button onClick={this.onSubmit} className={classes.Button} disabled={this.state.flags.isDisabled} color="primary">{t("common.saveButton")}</Button>
                                        : ""}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>);
    }

}

export default withStyles(styles)(withTranslation()(FilterQuick));