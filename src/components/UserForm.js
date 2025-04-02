import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography"

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//Prediza 
import UserStore from "../stores/UserStore";
import MeasureStore from "../stores/MeasureStore";
import EnvironmentStore from "../stores/EnvironmentStore";

//Other
import PasswordGenerator from 'generate-password';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const styles = () => ({
    Input: {
        margin: 5,
        width: "100%"
    },
    container: {
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: "#c9c9c9",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px"
    }
});

class FilterQuick extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            flags: {
                isDisabled: false,
                isRecived: false
            },
            user: this.props.user || {},
            preference: {},
            measures: { measures: [], selected: "" },
            environments: { environments: [] }
        };

        this.changeState = this.changeState.bind(this);
        this.setRandomPassword = this.setRandomPassword.bind(this);
        this.responseUpdateUser = this.responseUpdateUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.responseAddUser = this.responseAddUser.bind(this);
        this.addUser = this.addUser.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onChangeSwitch = this.onChangeSwitch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        if (this.props.method === "POST") {
            this.setRandomPassword();
        }
    }

    //Component default methods
    componentWillMount() {
        this.getPreferenceUser()
        this.getEnvironmets()
    }


    //Event methods
    onChangePhone(fone) {
        this.changeState("preference", "mobilephone", fone);
    }

    onChangeInput = (obj, propriety) => event => {
        this.changeState(obj, propriety, event.target.value);
        if (propriety === "environment") {
            this.getMeasures()
        }
    };

    onChangeSwitch = (obj, propriety) => event => {
        this.changeState(obj, propriety, !this.state[obj][propriety]);
    };

    onSubmit() {
        if (this.props.method === "POST") {
            this.addUser();
        } else if (this.props.method === "PUT") {
            this.updateUser();
        }

        this.updatePreference()
    }
    //Component methods
    changeState(object, propriety, value) {
        let actv = this.state[object];
        actv[propriety] = value;
        this.setState({ [object]: actv });
    };

    setRandomPassword() {
        let password = PasswordGenerator.generateMultiple(1, {
            length: 6,
            uppercase: false,
            symbols: true
        });

        this.changeState("user", "password", password[0]);
    };

    responseUpdateUser(response) {
        this.changeState("flags", "isDisabled", false);
    };

    responseAddUser(response) {
        this.changeState("flags", "isDisabled", false);
        if (response === "inserted") {
            this.props.close();
        }

    };

    responseGetPreferenceUsers = (response) => {
        this.setState({ preference: response });
        this.changeState("flags", "isRecived", true);
    };

    responseGetMeasures = (response) => {
        this.changeState("measures", "measures", response)
    }

    responseGetEnvironments = (response) => {
        this.changeState("environments", "environments", response)
        this.getMeasures()
    }


    responseSetPreference = (response) => {
        if (response === "notfound") {
            this.addPreference()
        }
    }
    //Store methods


    addUser() {
        this.changeState("flags", "isDisabled", true);
        UserStore.addUser(this.state.user, this.responseAddUser);
    }

    updateUser() {
        this.changeState("flags", "isDisabled", true);
        UserStore.updateUser(this.state.user, this.responseUpdateUser);
    }

    getPreferenceUser = () => {
        this.changeState("flags", "isRecived", false);
        if (this.props.user !== undefined) {
            UserStore.getUserPreference(this.props.user.uuid, this.responseGetPreferenceUsers);
        }
    };

    getMeasures = () => {
        MeasureStore.getEnvironmentMeasurements(this.state.preference.environment, this.responseGetMeasures)
    }

    getEnvironmets = () => {
        EnvironmentStore.getEnvironments(this.responseGetEnvironments)
    }

    updatePreference = () => {
        UserStore.updateUserPreference(this.state.user.uuid, this.state.preference, this.responseAddUser)
    }

    addPreference = () => {
        UserStore.addUserPreference(this.state.user.uuid, this.state.preference, this.responseAddUser)
    }
    render() {
        const { classes } = this.props;
        return (
            <form className={classes.formControl} noValidate autoComplete="off">
                <Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            label="Nome"
                            margin="normal"
                            value={this.state.user.name || ""}
                            onChange={this.onChangeInput("user", "name")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="surname"
                            label="Sobrenome"
                            margin="normal"
                            value={this.state.user.surname || ""}
                            onChange={this.onChangeInput("user", "surname")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="username"
                            label="Usuário"
                            margin="normal"
                            value={this.state.user.username || ""}
                            onChange={this.onChangeInput("user", "username")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method !== "POST"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="email"
                            label="Email"
                            margin="normal"
                            value={this.state.user.email || ""}
                            onChange={this.onChangeInput("user", "email")}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={this.props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.user.globaladmin}
                                        onChange={this.onChangeSwitch("user", 'globaladmin')}
                                        value="globaladmin"
                                        color="primary"
                                        disabled={this.props.method === "GET"}
                                    />
                                }
                                label="Administrador"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.user.enable}
                                        onChange={this.onChangeSwitch("user", 'enable')}
                                        value="enable"
                                        color="primary"
                                        disabled={this.props.method === "GET"}
                                    />
                                }
                                label="Ativo"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        { this.state.flags.isRecived ?
                        <Grid container className={classes.container}>
                            <Grid item xs={12}>

                                <Typography color="textSecondary" gutterBottom>
                                    Preferência
                                    </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl className={classes.Input}>
                                    <InputLabel shrink htmlFor="age-label-placeholder">
                                        Ambiente
                                    </InputLabel>
                                    <Select
                                        value={this.state.preference.environment || ""}
                                        onChange={this.onChangeInput("preference", "environment")}
                                        inputProps={{
                                            name: 'age',
                                            id: 'age-label-placeholder',
                                        }}
                                        displayEmpty
                                        name="age"
                                        disabled={this.props.method === "GET"}
                                    >
                                        {this.state.environments.environments.map((v) => {
                                            if (v.name[0] !== '_') {
                                                return (<MenuItem value={v.objectid} key={v.objectid}>{v.name}</MenuItem>)
                                            } else return ""
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={classes.Input}>
                                    <InputLabel shrink htmlFor="age-label-placeholder">
                                        Medida
                                        </InputLabel>
                                    <Select
                                        value={this.state.preference.measure || ""}
                                        onChange={this.onChangeInput("preference", "measure")}
                                        inputProps={{
                                            name: 'age',
                                            id: 'age-label-placeholder',
                                        }}
                                        displayEmpty
                                        name="age"
                                        disabled={this.props.method === "GET"}
                                    >
                                        {this.state.measures.measures.map((v) => {
                                            if (v.name[0] !== '_') {
                                                return (<MenuItem value={v.name} key={v.name}>{v.name}</MenuItem>)
                                            } else return ""
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <PhoneInput
                                    label="Telefone celular"
                                    className={classes.Input}
                                    value={this.state.preference.mobilephone}
                                    onChange={this.onChangePhone}
                                    margin="normal"
                                    required
                                    disabled={this.props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="blur"
                                    label="Blur"
                                    margin="normal"
                                    value={this.state.preference.heatmapblur || ""}
                                    onChange={this.onChangeInput("preference", "heatmapblur")}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={this.props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="radius"
                                    label="Raio"
                                    margin="normal"
                                    value={this.state.preference.heatmapradius || ""}
                                    onChange={this.onChangeInput("preference", "heatmapradius")}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={this.props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    id="zoom"
                                    label="Zoom"
                                    margin="normal"
                                    value={this.state.preference.heatmapzoom || ""}
                                    onChange={this.onChangeInput("preference", "heatmapzoom")}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={this.props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.preference.sms}
                                                onChange={this.onChangeSwitch("preference", 'sms')}
                                                value="sms"
                                                color="primary"
                                                disabled={this.props.method === "GET"}
                                            />
                                        }
                                        label="SMS"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.preference.notify}
                                                onChange={this.onChangeSwitch("preference", 'notify')}
                                                value="notify"
                                                color="primary"
                                                disabled={this.props.method === "GET"}
                                            />
                                        }
                                        label="Email"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        :""}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <Button onClick={this.props.close} className={classes.Button} color="primary">Cancelar</Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                {this.props.method !== "GET" ?
                                    <Button onClick={this.onSubmit} className={classes.Button} disabled={this.state.flags.isDisabled} color="primary">Salvar</Button>
                                    : ""}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form >);
    }

}

export default withStyles(styles)(FilterQuick);