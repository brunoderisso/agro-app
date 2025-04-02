import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import ReactPasswordStrength from "react-password-strength/dist/universal";
import SessionStore from '../stores/SessionStore';
import UserStore from '../stores/UserStore';
import history from '../history';

import 'react-password-strength/dist/style.css';
import '../css/Password.css';

const styles = () => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    grid: {
        padding: 5,
    },
    input: {
        width: '100%',
        margin: 6,
    },
    Button: {
        margin: 5
    },
    aviso: {
        margin: 5,
        width: '100%'
    },
    formControl: {
        padding: 15,
        width:"100%"
    }
});

class PasswordForm extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.password = {};
        this.token = this.props.token;
        this.state = {
            isEquals: false,
            isDisabled: false
        }

        this.setnewPassword = this.setnewPassword.bind(this);
        this.setconfirmPassword = this.setconfirmPassword.bind(this);
        this.onClick = this.onClick.bind(this);
        this.userUpdate = this.userUpdate.bind(this);
    };



    passwordUpdate(password) {
        let isSession = false;
        let token = "";
        if (this.props.token === "" || this.props.token === undefined || this.props.token === null) {
            token = SessionStore.getToken();
            if (token !== null) {
                isSession = true;
                this.token = token;
            } else {
                history.push("/login");
            };
        };
        SessionStore.password(this.token, password, (status) => {
            
            if (status === "sent" && window.localStorage.environment !== undefined && window.localStorage.environment !== "" && window.localStorage.environment !== null){
                if (isSession) {
                    history.push("/");
                } else {
                    history.push("/dashboard");
                }

            } else if(status === "fail"){
                history.push("/login");
            };
        });
    };

    userUpdate(password) {
        let user = this.props.user;
        user.password = password;
        user.enable = true;
        UserStore.updateUser(user, () => {
            this.setState({ isDisabled: false });
        })
    };


    setnewPassword(response) {
        this.password.newpassword = response.password;
    };

    setconfirmPassword(response) {
        this.password.confirmpassword = response.password;
        this.setState({ isEquals: this.password.newpassword === this.password.confirmpassword });
    };

    onClick() {
        if (this.state.isEquals) {
            this.setState({ isDisabled: true });
            if (this.props.method === "POST") {
                this.passwordUpdate({ Password: this.password.newpassword }, () => {
                    this.setState({ isDisabled: false });
                });
            }
            if (this.props.method === "PUT") {
                this.userUpdate(this.password.newpassword);
            }
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <form className={classes.formControl} noValidate autoComplete="off">
                <Grid>
                    <Grid item xs={12}>
                        <ReactPasswordStrength
                            ref={ref => this.ReactPasswordStrength = ref}
                            minLength={1}
                            inputProps={{ placeholder: "Nova Senha", name: "password_input", autoComplete: "off", className: "form-control" }}
                            changeCallback={this.setnewPassword}
                            className={classes.input}
                            scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                            tooShortWord="Muito Curta"
                            minScore={0}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ReactPasswordStrength
                            changeCallback={this.setconfirmPassword}
                            ref={ref => this.ReactPasswordStrength = ref}
                            minLength={1}
                            inputProps={{ id: "confirm", placeholder: "Repita a senha" }}
                            className={classes.input}
                            scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                            tooShortWord="Muito Curta"
                            minScore={0}
                        />
                        <FormHelperText className={classes.aviso} id="confirm">{this.state.isEquals ? "As senhas correspondem" : "As senhas não correspondem"}</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                {this.props.method === "PUT" ?
                                    <Grid container justifyContent="flex-start">
                                        <Button onClick={this.props.close} className={classes.Button} color="primary">Cancelar</Button>
                                    </Grid>
                                    : ""}
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-end">
                                    <Button onClick={this.onClick} className={classes.Button} disabled={this.state.isDisabled} color="primary">Alterar Senha</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>

        );
    };
};

export default withStyles(styles)(PasswordForm);