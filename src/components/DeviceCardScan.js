import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

//Prediza 
import AccountStore from "../stores/AccountStore";
import PredizaAlertDialog from "../components/PredizaAlertDialog"

//Other
import QrReader from 'react-qr-reader';
import style from "../styles/Device/DevicePage";
const styles = {
    ...style,
    card: {
        margin: 5,
        // [theme.breakpoints.between('xs', 'sm')]: {
        //     minHeight: "60vh",
        //     maxHeight: "60vh"
        // },
        // [theme.breakpoints.between('sm', 'xl')]: {
        //     minHeight: "55vh",
        //     maxHeight: "55vh"
        // }

    },
    input: {
        display: "none"
    },
    label: {
        width: "100%",
        minHeight: "30vh",
        backgroundColor: "#2196f34d",
        marginTop: "30px",
        marginBottom: "12vh",
    },
    img: {
        maxWidth: "100%",
        maxHeight: "30vh",
        minHeight: "30vh"
    }
};

class DeviceUploadCard extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isDisabled: false,
                dialogIsOpen: false,
                dialogErrorIsOpen: false,
                isLoaded: false
            },
            qr: {
                result: "",
                environments: [],
                selectedEnvironment: "",
            }

        };

        this.onScanChange = this.onScanChange.bind(this);
        this.onEnvironmentChange = this.onEnvironmentChange.bind(this);
        this.onClickSend = this.onClickSend.bind(this);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.changeState = this.changeState.bind(this);
        this.associateDevice = this.associateDevice.bind(this);
        this.resultAssociateDevice = this.resultAssociateDevice.bind(this);

    }

    //Component default methods

    //Event methods

    onClickCancel() {
        this.changeState("qr", "result", "");
    };

    onScanChange = data => {
        if (data) {
            this.changeState("qr", "result", data);
            if (!this.state.flags.isLoaded) {
                this.changeState("flags", "isLoaded", true);
            };
        };
    };

    onEnvironmentChange = data => {
        this.changeState("qr", "selectedEnvironment", data);
    };

    onClickSend() {
        if (this.state.qr.result !== "") {
            this.associateDevice();
        };
    };

    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    resultAssociateDevice(value) {
        if (value === null) {
            this.toogleDialog("dialogErrorIsOpen");
        } else {
            this.props.close()
            this.changeState("qr", "result", "");
            this.changeState("flags", "isLoaded", false);
        };
        this.toogleDialog("dialogIsOpen");
    };

    toogleDialog = (dialog) => {
        let toogle = this.state.flags[dialog];
        this.changeState("flags", dialog, !toogle);
    };

    onChangeInput = propriety => event => {
        this.changeState("qr", propriety, event.target.value);
    };


    //Store methods
    associateDevice() {
        AccountStore.associateDevice({ tag: this.state.qr.result }, this.resultAssociateDevice);
    };

    render() {
        const { classes } = this.props;
        return (
            <Grid container >
                <Grid item xs={12} >
                    <Grid container className={classes.paper}>

                        <Grid item xs={12}>Escaneie o dispositivo aqui:</Grid>
                        <Grid item xs={12}>
                            <QrReader
                                delay={200}
                                onError={(err) => { console.log(err) }}
                                onScan={this.onScanChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="tag"
                                label="Tag"
                                margin="normal"
                                value={this.state.qr.result || ""}
                                onChange={this.onChangeInput("result")}
                                className={classes.Input}
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.container}>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container justifyContent={"flex-start"}>
                                        <Button color="primary" onClick={this.props.close}>Voltar</Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justifyContent={"flex-end"}>
                                        <Button color={"primary"} onClick={() => { this.toogleDialog("dialogIsOpen") }}>Associar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <PredizaAlertDialog open={this.state.flags.dialogIsOpen} submit={this.associateDevice} title={"Você deseja associar o dispositivo " + this.state.qr.result + "?"} close={() => this.toogleDialog("dialogIsOpen")} />
                            <PredizaAlertDialog open={this.state.flags.dialogErrorIsOpen} close={() => this.toogleDialog("dialogErrorIsOpen")} title={"Ocorreu um erro"} method="alert" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}

export default withStyles(styles)(DeviceUploadCard);