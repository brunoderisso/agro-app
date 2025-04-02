import React, { useState, useEffect, useRef } from "react";
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import Tooltip from '@material-ui/core/Tooltip';


//Prediza components
import SessionStore from "../stores/SessionStore"
import tokens from "../stores/CancelTokenList";
import PredizaAlertDialog from '../components/PredizaAlertDialog';

//Others
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import TelegramLogin from "./Common/TelegramLogin";
import { AnalitycsEvent } from "../LocalConfig";

const Style = {
    textField: {
        width: '100%',
    },
    grid: {
        padding: 5,
    },
    Button: {
        margin: 5
    },
    formControl: {
        padding: 15
    },
    container: {
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: "#c9c9c9",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px"
    }
};

export default withStyles(Style)(function PreferenceForm(props) {
    const { classes } = props;

    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [surname, setSurname] = useState(null)
    const [telegram_userid, setTelegram_userid] = useState(null)
    const [mobilephone, setMobilephone] = useState(null)
    const [sms, setSms] = useState(null)
    const [notify, setNotify] = useState(null)
    const [heatmapblur, setHeatmapblur] = useState(null)
    const [heatmapradius, setHeatmapradius] = useState(null)
    const [heatmapzoom, setHeatmapzoom] = useState(null)
    const [message, setMessage] = useState("");

    //flags
    const [sent, setSent] = useState(false)

    const drawer = useRef(props.method === "PUT" || props.isRegister || false)
    const emailRef = useRef('');

    const tokenList = new tokens();

    useEffect(() => {

        // init();

        return clear

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.preference])

    const clear = () => {
        tokenList.clear()
    }

    const init = () => {
        const preference = (props.preference || SessionStore.getPreference()) || {};

        setName(preference.name || "")
        setEmail(preference.email || "")
        setSurname(preference.surname || "")
        setTelegram_userid(preference.telegram_userid || null);
        setMobilephone(preference.mobilephone || "")
        setSms(preference.sms || false)
        setNotify(preference.notify || false)

        emailRef.current = preference.email;

        if (preference.heatmapblur === null || preference.heatmapblur === "" || preference.heatmapblur === undefined || isNaN(parseFloat(preference.heatmapblur))) {
            setHeatmapblur(undefined)
        }

        if (preference.heatmapblur !== null && preference.heatmapblur !== "" && preference.heatmapblur !== undefined && !isNaN(parseFloat(preference.heatmapblur))) {
            setHeatmapblur((preference.heatmapblur.toString() || "").replace(".", ","))
        }

        if (preference.heatmapradius !== null && preference.heatmapradius !== "" && preference.heatmapradius !== undefined && !isNaN(parseFloat(preference.heatmapradius))) {
            setHeatmapradius((preference.heatmapradius.toString() || "").replace(".", ","))
        }

        if (preference.heatmapradius === null || preference.heatmapradius === "" || preference.heatmapradius === undefined || isNaN(parseFloat(preference.heatmapradius))) {
            setHeatmapradius(undefined)
        }

        if (preference.heatmapzoom !== null && preference.heatmapzoom !== "" && preference.heatmapzoom !== undefined && !isNaN(parseFloat(preference.heatmapzoom))) {
            setHeatmapzoom((preference.heatmapzoom.toString() || "").replace(".", ","))
        }

        if (preference.heatmapzoom === null || preference.heatmapzoom === "" || preference.heatmapzoom === undefined || isNaN(parseFloat(preference.heatmapzoom))) {
            setHeatmapzoom(undefined)
        }
    }

    const getPreference = (user) => {
        let novo = { ...props.preference };

        if (user) {
            novo = {
                name: name || user.first_name,
                surname: surname || user.last_name,
                email: emailRef.current,
                mobilephone: mobilephone || "",
                sms: sms || false,
                notify: notify || false,
                telegram_userid: user.id
            }
        } else {
            novo = {
                name: name || "",
                surname: surname || "",
                email: emailRef.current,
                mobilephone: mobilephone || "",
                sms: sms || false,
                notify: notify || false,
            }
        }

        if (heatmapblur !== null && heatmapblur !== "" && heatmapblur !== undefined && !isNaN(parseFloat(heatmapblur))) {
            novo.heatmapblur = parseFloat(heatmapblur.replace(",", "."))
        }

        if (heatmapradius !== null && heatmapradius !== "" && heatmapradius !== undefined && !isNaN(parseFloat(heatmapradius))) {
            novo.heatmapradius = parseFloat(heatmapradius.replace(",", "."))
        }

        if (heatmapzoom !== null && heatmapzoom !== "" && heatmapzoom !== undefined && !isNaN(parseFloat(heatmapzoom))) {
            novo.heatmapzoom = parseFloat(heatmapzoom.replace(",", "."))
        }
        return novo;
    }

    const clearMessage = () => {
        setMessage("")
        setSent(false)
    }

    const changeSMS = () => {
        const old = sms
        setSms(!old)
    }

    const changeNotify = () => {
        const old = notify
        setNotify(!old)
    }

    const isValidPreference = () => {
        if (heatmapblur !== null && heatmapblur !== "" && heatmapblur !== undefined && ((heatmapblur.includes(".") && !heatmapblur.includes(",")) || isNaN(parseFloat(heatmapblur.replace(",", "."))))) {
            setMessage("O campo blur deve ser decimal utilizando a ,")
            return false;
        }

        if (heatmapradius !== null && heatmapradius !== "" && heatmapradius !== undefined && ((heatmapradius.includes(".") && !heatmapradius.includes(",")) || isNaN(parseFloat(heatmapradius.replace(",", "."))))) {
            setMessage("O campo raio deve ser decimal utilizando a ,")
            return false;
        }

        if (heatmapzoom !== null && heatmapzoom !== "" && heatmapzoom !== undefined && ((heatmapzoom.includes(".") && !heatmapzoom.includes(",")) || isNaN(parseFloat(heatmapzoom.replace(",", "."))))) {
            setMessage("O campo zoom deve ser decimal utilizando a ,")
            return false;
        }

        return true
    }

    const addPreference = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        setSent(true)
        SessionStore.addPreference(cancelToken, getPreference(), responseAddPreference)
    }

    const responseAddPreference = (response) => {
        tokenList.remove(response.id);
        setSent(false)
        if (response.data === null) {
            setMessage("Ocorreu um erro ao inserir a preferência")
            return
        }
        setMessage("Preferência inserida com sucesso")
    }

    const updatePreference = () => {
        let cancelToken = {}
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        setSent(true)
        SessionStore.pushPreference_WT(cancelToken, getPreference(), responseUpdatePreference)
    }

    const responseUpdatePreference = (response) => {
        tokenList.remove(response.id);
        setSent(false)
        if (response.data === null) {
            setMessage("Ocorreu um erro ao alterar a preferência")
            return
        }
        setMessage("Preferência alterada com sucesso")
    }

    const handleTelegramResponse = (user) => {

        if (user && user.id) {
            let cancelToken = {}
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            setSent(true)

            SessionStore.pushPreference_WT(cancelToken, getPreference(user), responseUpdatePreference)
        }
    }

    const submit = () => {
        AnalitycsEvent('navigation', '/click/menu/preference/account');

        if (!isValidPreference()) {
            return
        }

        if (props.method === "POST") {
            addPreference();
            return
        }

        if (props.method === "PUT") {
            updatePreference();
            return
        }
    };

    if (name === null ||
        surname === null ||
        mobilephone === null ||
        sms === null ||
        notify === null ||
        heatmapblur === null ||
        heatmapradius === null ||
        heatmapzoom === null
    ) {
        return <Grid container></Grid>
    }

    return (
        <form className={classes.formControl} noValidate autoComplete="off">
            <Grid container>
                <Grid item xs={12}>
                    <Grid container className={classes.container}>
                        <Grid item xs={12}>

                            <Typography color="textSecondary" gutterBottom>
                                Conta
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome"
                                className={classes.textField}
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Sobrenome"
                                className={classes.textField}
                                value={surname}
                                onChange={(e) => { setSurname(e.target.value) }}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} hidden={drawer.current}>
                            <TextField
                                label="Email"
                                className={classes.textField}
                                margin="normal"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                disabled={drawer.current}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <PhoneInput
                                country="BR"
                                label="Telefone celular"
                                className={classes.textField}
                                value={mobilephone}
                                onChange={setMobilephone}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} className={classes.container}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Typography color="textSecondary" gutterBottom>
                                        Vincular Telegram
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    {telegram_userid &&
                                        <CheckCircleIcon />
                                    }
                                    {!telegram_userid &&
                                        <HighlightOffOutlinedIcon />
                                    }
                                </Grid>
                                <Grid item>
                                    <Tooltip title="Permite que o bot da prediza envie dados e alertas para seu telegram">
                                        <HelpOutlineIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12}>
                            <TelegramLogin usePic={false} dataOnauth={handleTelegramResponse} botName="PredizaBot" />
                        </Grid>
                    </Grid>
                </Grid>

                <FormGroup row className={classes.container}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={notify}
                                onChange={changeNotify}
                                value="notify"
                                color="primary"
                            />
                        }
                        label="Email"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={sms}
                                onChange={changeSMS}
                                value="sms"
                                color="primary"
                            />
                        }
                        label="SMS"
                    />
                </FormGroup>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Button color="primary" disabled={sent} onClick={submit}>Salvar</Button>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </form>
    )
})