import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

// Material UI
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import DeleteIcon from "@material-ui/icons/Delete";

//Prediza 
import PoligonStore from "../../stores/PoligonStore";
import tokens from "../../stores/CancelTokenList";

const style= () => ({
    icon: {
        fontSize: 20
    },
    button: {
        minWidth: 15,
    },
    container: {
        marginTop: 16
    },
    Input: {
        paddingLeft: 8,
        paddingRight: 8,
        maxWidth: "100%"
    },
    
});


export default withStyles(style)(function PoligonPointsListRow(props) {
    const { classes } = props;
    const tokenList = new tokens();

    const [input,setInput] = useState({})

    useEffect(() => {
        startInputs();
        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    const startInputs = () => {
        const point = props.point || {}
        setInput({
            ...input,
            objectid: point.objectid,
            latitude: point.latitude || "",
            longitude: point.longitude || ""
        })
    }

     

    const responseDeletePoint = (resp) => {
        tokenList.remove(resp.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
   

    const deletePoint = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        PoligonStore.deletePoligonPoint(cancelToken, input ,responseDeletePoint);
    };

    return (
        <Grid container>
          
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={5}>
                        <TextField
                            margin="normal"
                            value={input.latitude || ""}
                            onChange={handleInputChange}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled
                            name="latitude"
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            margin="normal"
                            value={input.longitude || ""}
                            onChange={handleInputChange}
                            className={classes.Input}
                            fullWidth
                            required
                            disabled
                            name="longitude"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent="center" className={classes.container}>
                            <Button onClick={deletePoint} className={classes.button}>
                                <DeleteIcon className={classes.icon} />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
})