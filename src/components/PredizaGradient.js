import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";

//Prediza
import GradientRow from "../components/GradientRow";

//Others
import { SketchPicker } from 'react-color';

const style = {
    label: {
        marginLeft: 5,
        marginRight: 5
    },
    sketch: {
        paddingTop: "17vh",
        paddingRight: "10px",
        paddingLeft: "10px"
    },
    row: {
        margin: 5
    },
    input: {
        width: "100%",
    },
    button: {
        width: "100%",
        minWidth: "100%",
        minHeight: "3vh"
    }
};
class PredizaGradient extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            picker: {
                values: [],
                keys: [],
                selectedIndex: undefined,
                newValue: "",
                newColor: "#DCDBD7",
            }
        }

        this.onChangeGradient = this.onChangeGradient.bind(this);
        this.onClickColorButton = this.onClickColorButton.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onClickAdd = this.onClickAdd.bind(this);
        this.onDeleteRow = this.onDeleteRow.bind(this);
        this.changeState = this.changeState.bind(this);
        this.slice = this.slice.bind(this);
    };

    //Component Default methods
    componentDidMount() {
        if (this.props.gradient !== "" && this.props.gradient !== null && this.props.gradient !== undefined) {
            let gradient = JSON.parse(this.props.gradient || "");
            this.changeState("picker", "values", Object.values(gradient));
            this.changeState("picker", "keys", Object.keys(gradient));
        }
    };

    //Event methods
    onChangeGradient(array, index, value) {
        let arr;

        if (array === "keys") {
            arr = this.state.picker.keys;
        } else if (array === "values") {
            arr = this.state.picker.values;
        }

        arr[index] = value;

        this.changeState("picker", array, arr);
        this.props.change(this.state.picker.values, this.state.picker.keys);
    };

    onColorChange = ({ hex }) => {
        if (this.state.picker.selectedIndex !== undefined) {
            if (this.state.picker.selectedIndex === -1) {
                this.changeState("picker", "newColor", hex);
            } else {
                this.onChangeGradient("values", this.state.picker.selectedIndex, hex);
            }

        }
    };

    onDeleteRow(index) {
        let keys = this.state.picker.keys;
        let values = this.state.picker.values;
        if (index === 0) {
            keys.shift();
            values.shift();
        } else if (index === this.state.picker.keys.length - 1) {
            keys.pop();
            values.pop();
        } else {
            keys.splice(index,1);
            values.splice(index,1);
        }

        this.changeState("picker", "keys", keys);
        this.changeState("picker", "values", values);
    };

    onClickColorButton(index) {
        this.changeState("picker", "selectedIndex", index)
    };

    onChangeInput = propriety => event => {
        this.onClickColorButton(-1)
        this.changeState("picker", propriety, event.target.value);
    };

    onClickAdd() {
        if (this.state.picker.newValue !== null && this.state.picker.newValue !== "" &&
            this.state.picker.newColor !== null && this.state.picker.newColor) {

            let indice = parseFloat(this.state.picker.newValue);

            if (indice >= 0 && indice <= 1) {
                let keys = this.state.picker.keys;
                let values = this.state.picker.values;

                if ((keys.length === 0 && values.length === 0) || (this.state.picker.newValue > keys[keys.length - 1])) {
                    keys.push(this.state.picker.newValue);
                    values.push(this.state.picker.newColor);
                } else {
                    let sliceIndex = 0;
                    let push = true;

                    keys.forEach((value, index) => {

                        if (indice >= keys[index] && indice <= keys[index + 1]) {
                            if (push) {
                                sliceIndex = index
                                push = false;
                            }

                        };
                    });

                    let sliceKey = this.slice(keys, sliceIndex);
                    let sliceValue = this.slice(values, sliceIndex);

                    sliceKey[0].push(this.state.picker.newValue);
                    keys = sliceKey[0].concat(sliceKey[1]);

                    sliceValue[0].push(this.state.picker.newColor);
                    values = sliceValue[0].concat(sliceValue[1]);

                }

                this.changeState("picker", "keys", keys);
                this.changeState("picker", "values", values);
                this.changeState("picker", "newColor", "#DCDBD7");
                this.changeState("picker", "newValue", "");
                this.props.change(this.state.picker.values, this.state.picker.keys);

            }
        }
    }

    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    slice(array, index) {
        let before = [];
        let after = [];

        //First or last element
        if (index === 0 || index === array.length - 1) {
            if (array.length === 0) {
                before = array;
            } else {
                before = [];
                after = array;
            }

        } else {
            before = array.slice(0, index + 1);
            after = array.slice(index + 1, array.length);
        };

        return [before, after];
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <FormHelperText className={classes.label} disabled={this.props.method === "GET"}>Gradiente*</FormHelperText>
                </Grid>
                <Grid item xs={12} className={classes.row} style={{ display: this.props.method === "GET" ? "none" : "" }}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid container justifyContent="flex-end">
                                <Input
                                    value={this.state.picker.newValue}
                                    onChange={this.onChangeInput("newValue")}
                                    className={classes.input}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>
                            <Grid container justifyContent="center">
                                <Button
                                    style={{ backgroundColor: this.state.picker.newColor || "#DCDBD7" }}
                                    className={classes.button}
                                    onClick={() => { this.onClickColorButton(-1) }}
                                >

                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                onClick={this.onClickAdd}
                            >
                                Inserir
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{ display: this.state.picker.keys.length > 0 ? "none" : "" }}>
                    <FormHelperText className={classes.label} disabled={this.props.method === "GET"}>Gradiente não cadastrado</FormHelperText>
                </Grid>
                <Grid item xs={this.props.method === "GET" ? 12 : 6} >
                    {
                        this.state.picker.values.map((value, index) => {
                            return (<GradientRow key={index} color={value} value={this.state.picker.keys[index]} i={index} change={this.onChangeGradient} click={this.onClickColorButton} delete={this.onDeleteRow} method={this.props.method} style={{ display: this.state.picker.keys.length === 0 ? "none" : "" }}/>)
                        })
                    }
                </Grid>
                <Grid item xs={6} className={classes.sketch} style={{ display: this.props.method === "GET" ? "none" : "" }}>
                    <SketchPicker
                        color={this.state.picker.selectedIndex === -1 ? this.state.picker.newColor : this.state.picker.values[this.state.picker.selectedIndex] || "#2196f3"}
                        onChangeComplete={this.onColorChange}
                    />
                </Grid>
            </Grid >
        );
    };
};
export default withStyles(style)(PredizaGradient); 