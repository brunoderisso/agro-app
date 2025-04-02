import React, { useEffect, useState } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"

//Prediza Components
import SessionStore from '../../stores/SessionStore';
import PredizaAlertDialog from "../PredizaAlertDialog";
import tokens from "../../stores/CancelTokenList";
import history from '../../history';
import { useTranslation } from "react-i18next";

//Others components
import ReactPasswordStrength from "react-password-strength/dist/universal";

//css
import 'react-password-strength/dist/style.css';
import '../../css/Password.css';

const styles = {
    Input: {
        margin: 5,
        width: "100%"
    }
}

export default withStyles(styles)(function ActiveForm(props) {
    const { classes } = props;

    const [username, setUsername] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [disabled, setDisabled] = useState(false);

    const tokenList = new tokens();

    const {t} = useTranslation();

    useEffect(() => {

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeUsername = (e) => {
        let name = e.target.value.toLowerCase();
        setUsername(name)
    }

    const register = () => {
        if (username === "" || username === null || username === undefined) {
            setMessage(t('login.usernameRequired'))
            return
        }

        if (newpassword.password === confirmpassword.password && newpassword !== "") {
            activeUser();
            return
        }

        setMessage(t('login.passwordsMustMatch'))
    }

    const clear = () => {
        tokenList.clear();
    };

    const activeUser = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        setDisabled(true);
        SessionStore.activeUser(cancelToken, props.token, { username: username, password: newpassword.password }, responsePutUser)
    }

    const login = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        SessionStore.login({ username: username, password: newpassword.password }, cancelToken, responseLogin)
    }

    const responseLogin = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data !== null) {
            history.push('/');
            return
        }

        history.push('/login');

    }

    const responsePutUser = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data !== null) {
            login();
            return
        }

        setDisabled(false);
        setMessage(t('login.errorRegisteringUser'))
    }

    const clearMessage = () => {
        setMessage("");
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                    <TextField
                        id="username"
                        label={t('common.user')}
                        value={username}
                        onChange={changeUsername}
                        margin="normal"
                        className={classes.Input}
                        fullWidth
                        required
                    />
            </Grid>

            <Grid item xs={12}>
                <ReactPasswordStrength
                    minLength={1}
                    inputProps={{ placeholder: "Senha", name: "password_input", autoComplete: "off", className: "form-control" }}
                    changeCallback={setNewPassword}
                    className={classes.Input}
                    scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                    tooShortWord="Muito Curta"
                    minScore={0}
                />
            </Grid>
            <Grid item xs={12}>
                <ReactPasswordStrength
                    changeCallback={setConfirmPassword}
                    minLength={1}
                    inputProps={{ id: "confirm", placeholder: "Repita a senha" }}
                    className={classes.Input}
                    scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                    tooShortWord="Muito Curta"
                    minScore={0}
                />
            </Grid>
            <Grid container justifyContent="flex-end">
                <Button onClick={register} className={classes.Button} disabled={disabled} color="primary">{t('common.saveButton')}</Button>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    )
})