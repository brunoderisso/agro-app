import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import InputAdornment from '@material-ui/core/InputAdornment';

//Prediza 
import GatewayStore from "../../../stores/GatewayStore";
import PredizaAlertDialog from '../../PredizaAlertDialog';

//Other
const styles = () => ({
    Input: {
        margin: 5,
        width: "100%"
    }
});

export default withStyles(styles)(function GatewayForm(props) {

    const [gateway, setGateway] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setGateway(props.gateway);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //Event methods
    const onChangeInput = (event) => {
        setGateway({
            ...gateway,
            [event.target.name]: event.target.value
        })
    };

    const onChangeSwitch = (event) => {
        setGateway({
            ...gateway,
            enable: event.target.checked
        })
    };

    const onSubmit = () => {
        if (props.method === "POST") {
            addGateway();
        } else if (props.method === "PUT") {
            updateGateway();
        }
    }

    const responseUpdateGateway = (response) => {
        setLoading(false);
        setMessage("Gateway Atualizado!")
    };

    const responseAddGateway = (response) => {
        setLoading(false);
        if (response === "inserted") {
            setMessage("Gateway adicionado com sucesso!");
            props.close();
        }
    };

    //Store methods
    const addGateway = () => {
        setLoading(true);
        const gw = {
            ...gateway,
            latitude: parseFloat(gateway?.latitude),
            longitude: parseFloat(gateway?.longitude),
            radius: parseInt(gateway?.radius)
        }
        GatewayStore.addGateway(gw, responseAddGateway);
    };

    const updateGateway = () => {
        setLoading(true);
        const gw = {
            ...gateway,
            latitude: parseFloat(gateway?.latitude),
            longitude: parseFloat(gateway?.longitude),
            radius: parseInt(gateway?.radius)
        }
        GatewayStore.updateGateway(gw, responseUpdateGateway);
    };

    const { classes } = props;

    return (
        <>
            <form className={classes.formControl} noValidate autoComplete="off">
                <Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            label="Descrição"
                            margin="normal"
                            name={"description"}
                            value={gateway?.description || ""}
                            onChange={onChangeInput}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="name"
                            label="Nome"
                            margin="normal"
                            name={"name"}
                            value={gateway?.name || ""}
                            onChange={onChangeInput}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={props.method === "GET"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="mac"
                            label="Endereço MAC"
                            margin="normal"
                            name={"mac"}
                            value={gateway?.mac || ""}
                            onChange={onChangeInput}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled={props.method !== "POST"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <TextField
                                    id="latitude"
                                    label="Latitude"
                                    margin="normal"
                                    type='number'
                                    name={"latitude"}
                                    value={gateway?.latitude || ""}
                                    onChange={onChangeInput}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="longitude"
                                    label="Longitude"
                                    margin="normal"
                                    type='number'
                                    name={"longitude"}
                                    value={gateway?.longitude || ""}
                                    onChange={onChangeInput}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={props.method === "GET"}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="radius"
                                    label="Raio"
                                    margin="normal"
                                    type='number'
                                    name={"radius"}
                                    value={gateway?.radius || ""}
                                    onChange={onChangeInput}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                    disabled={props.method === "GET"}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="start">m</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={gateway?.enable}
                                        onChange={onChangeSwitch}
                                        value="enable"
                                        color="primary"
                                        disabled={props.method === "GET"}
                                    />
                                }
                                label="Ativo"
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-start">
                                    <Button onClick={props.close} className={classes.Button} color="primary">Cancelar</Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container justifyContent="flex-end">
                                    {props.method !== "GET" ?
                                        <Button onClick={onSubmit} className={classes.Button} disabled={loading} color="primary">Salvar</Button>
                                        : ""}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            <PredizaAlertDialog title={message} open={message.length > 0} labelSubmit={"Ok"} submit={() => { setMessage(""); props.close() }} />
        </>
    );
})

