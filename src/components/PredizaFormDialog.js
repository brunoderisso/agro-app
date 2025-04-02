import React, { useState } from 'react';

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


export default function PredizaFormDialog(props) {
    const [val, setVal] = useState(props.default);

    const onChange = (e) => {
        setVal(e.target.value);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Dialog open={props.open} onClose={props.close} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{props.description}</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            fullWidth
                            value={val}
                            onChange={onChange}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid conatiner >
                                        <Button onClick={props.close} color="primary">
                                            Voltar
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container justifyContent="flex-end">
                                        <Button onClick={() => { props.submit(val) }} color="primary">
                                            Salvar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    );
}