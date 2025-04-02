import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// import FormHelperText from "@material-ui/core/FormHelperText";

//Prediza
import PredizaAlertDialog from "../../PredizaAlertDialog";

import UserStore from '../../../stores/UserStore';
import toolsUtils from '../../../utils/toolsUtils';

import history from '../../../history';
import tokens from "../../../stores/CancelTokenList";

//Others
import ReactPasswordStrength from "react-password-strength/dist/universal";
import 'react-password-strength/dist/style.css';
import '../../../css/Password.css';

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
        width: "100%"
    }
});

export default withStyles(styles)(function UserPasswordForm(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});
    const [check, setCheck] = useState(null);

    const tokenList = new tokens();

    useEffect(() => {
        startFlags();
        startInputs();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const back = () => {
        history.push("/admin/users");
    };

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
    };

    const changeNewpassword = (value) => {
        setInput({
            ...input,
            newpassword: value.password
        })
    };

    const changeConfirm = (value) => {
        setInput({
            ...input,
            confirmpassword: value.password
        })
    };

    const startFlags = () => {
        setCheck(
            {
                equals: false,
                submit: false
            }
        );
    };

    const startInputs = () => {
        setInput(
            {
                newpassword: "",
                confirmpassword: ""
            }
        );
    }

    const toData = () => {

        return {
            ...props.user,
            password: input.newpassword
        }


    }

    const isValid = () => {
        if (toolsUtils.isNullOrEmpty(input, "newpassword") || toolsUtils.isEmptyString(input.newpassword) ||
            toolsUtils.isNullOrEmpty(input, "confirmpassword") || toolsUtils.isEmptyString(input.confirmpassword)
        ) {
            setMessage("Os campos devem ser preenchidos")
            return false
        }

        if (input.newpassword !== input.confirmpassword) {
            setMessage("As senhas devem ser iguais")
        }

        return true
    }

    const updateUserResponse = (resp) => {
        tokenList.remove(resp.id);

        setCheck({
            ...check,
            submit: false
        });

        if (resp.data === undefined) {
            setMessage("Você não possuí permissão");
            return
        };

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao alerar o usuário");
            return
        };

        setMessage("Usuário alterado com sucesso");

    };

    const updateUser = () => {
        if (!toolsUtils.isNullOrEmpty(props, "user.uuid") && !toolsUtils.isEmptyString(props.user.uuid)) {
            if (!isValid()) {
                return
            };

            let cancelToken = {};

            setCheck({
                ...check,
                submit: true
            });
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            UserStore.updateUser(cancelToken, toData(), updateUserResponse);
        };
    };

    return (

        <Grid container>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
            <Grid item xs={12}>
                <ReactPasswordStrength
                    // ref={ref => this.ReactPasswordStrength = ref}
                    minLength={1}
                    inputProps={{ placeholder: "Nova Senha", name: "password_input", autoComplete: "off", className: "form-control" }}
                    changeCallback={changeNewpassword}
                    className={classes.input}
                    scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                    tooShortWord="Muito Curta"
                    minScore={0}
                    name="newpassword"
                />
            </Grid>
            <Grid item xs={12}>
                <ReactPasswordStrength
                    changeCallback={changeConfirm}
                    // ref={ref => this.ReactPasswordStrength = ref}
                    minLength={1}
                    inputProps={{ id: "confirm", placeholder: "Repita a senha" }}
                    className={classes.input}
                    scoreWords={['Fraco', 'Ok', 'Bom', 'Forte', 'Muito Forte']}
                    tooShortWord="Muito Curta"
                    minScore={0}
                    name="confirmpassword"
                />
                {/* <FormHelperText className={classes.aviso} id="confirm">{this.state.isEquals ? "As senhas correspondem" : "As senhas não correspondem"}</FormHelperText> */}
            </Grid>
            <Grid item xs={6} >
                <Grid container justifyContent="flex-start">
                    <Button color="primary" onClick={back} >Voltar</Button>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    {check !== null && <Button onClick={updateUser} className={classes.Button} disabled={check.submit} color="primary">Alterar Senha</Button>}
                </Grid>
            </Grid>
        </Grid>

    )


});