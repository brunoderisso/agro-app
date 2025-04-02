import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";

// Material UI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//Prediza 
import PoligonStore from "../../stores/PoligonStore";
import PredizaAlertDialog from "../PredizaAlertDialog";
import tokens from "../../stores/CancelTokenList";

const style = () => ({
    Input: {
        margin: 5,
        width: "100%",
    },
    container:{
        marginTop:16
    },
    line:{
        paddingLeft:8
    }
});

export default withStyles(style)(function PoligonAdd(props) {
    const { classes } = props;

    const [message, setMessage] = useState("");
    const [input, setInput] = useState({});

    const tokenList = new tokens();

    useEffect(() => {

        startInputs();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const clearMessage = () => {
        setMessage("");
    };


    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const startInputs = () => {
        const poligon = props.poligon || {};
        setInput(
            {
                name: poligon.name || "",
            }
        );
    }

    const responseAddPoligon = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data === null) {
            setMessage("Ocorreu um erro ao adicionar o polígono");
            return
        };
    }

    const addPoligon = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        PoligonStore.postPoligon(cancelToken, input, responseAddPoligon)
    };


    return (
        <Grid item xs={12}>
            <Grid container className={classes.line}>
                <Grid item xs={8}>
                    <TextField
                        margin="normal"
                        value={input.name || ""}
                        onChange={handleInputChange}
                        className={classes.Input}
                        label="Nome"
                        fullWidth
                        required
                        name= "name"
                    />
                </Grid>
                <Grid item xs={4}>
                    <Grid container justifyContent="flex-end" alignItems="bottom" className={classes.container}>
                        <Button color="primary" onClick={addPoligon}>
                            CRIAR
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <PredizaAlertDialog title={message} open={message.length > 0} close={clearMessage} method="alert" />
        </Grid>
    );


    
})