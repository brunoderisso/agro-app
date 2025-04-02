import React, { Component } from "react";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import SessionStorage from '../stores/SessionStore'

import { withStyles } from "@material-ui/core/styles";

const styles = {
}

class EmailRecovery extends Component {

    

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            email: {},
            isSent: false,
            isDisabled : false
        };

        this.onClose = props.onClose.bind(this);
        this.onOpen = props.onOpen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setEmail = this.setEmail.bind(this);
    };

    componentWillUnmount() {
        this.open=false;
    }

    setEmail(e) {
        if (e.target.value !== null) {
            this.setState({
                email: {
                    to: e.target.value,
                }
            });
        } else {
            this.setState({
                email: {
                    to: ""
                }
            });
        };
    };

    onSubmit() {
        this.setState({ isDisabled: true });
        if (this.state.email.to !== "" && this.state.email.to !== undefined) {
            SessionStorage.forgot(this.state.email, (response) => {
                this.setState({ isSent: response === "sent" });
                this.setState({ isDisabled: false });
            });
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.isOpen}
                    onClose={this.clear}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Esqueci a senha</DialogTitle>
                    <DialogContent>
                        {this.state.isSent ? "Email enviado para a conta solicitada." :
                            <TextField
                                autoFocus
                                margin="dense"
                                id="email"
                                label="Informe o email"
                                type="email"
                                onChange={this.setEmail}
                                fullWidth
                                required
                            />
                        }
                    </DialogContent>
                    <DialogActions>
                        <Grid item xs={this.state.isSent ? 12 : 5}>
                            <Grid container justifyContent={this.state.isSent ? "flex-end" : "flex-start"} className={this.props.classes.formControl} alignContent="center">
                                <Button onClick={this.onClose} color="primary" >
                                    <span data-modal={this.props.modal}>{this.state.isSent ? "Voltar" : "Cancelar"}</span>
                                </Button>
                            </Grid>
                        </Grid>
                        {this.state.isSent ? "" :
                            <Grid item xs={7}>
                                <Grid container justifyContent="flex-end" className={this.props.classes.formControl}  >
                                    <Button onClick={this.onSubmit} color="primary" disabled={this.state.isDisabled}>
                                        Enviar
                                        </Button>
                                </Grid>
                            </Grid>}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}



export default withStyles(styles)(EmailRecovery);