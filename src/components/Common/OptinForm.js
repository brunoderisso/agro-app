import React, { useState } from 'react';

import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';

import SessionStore from '../../stores/SessionStore';

const styles = {
    link: {
        marginLeft: 5
    }
};

export default withStyles(styles)(function OptinForm(props) {
    const { classes } = props;

    const [isDisabled, setIsDisabled] = useState(true);
    const [option, setOption] = useState(false);

    const onChangeOption = () => {
        changeState("option", !option);
    };

    const onSubmit = () => {
        if (option) {
            SessionStore.putOption(option, callbackOption);
        };
    };

    const callbackOption = (status) => {
        changeState("isDisabled", true);
        if (status === "sent") {
            props.close();
        }
    };

    const changeState = (object, value) => {
        if (object === 'option') {
            setOption(value);
            setIsDisabled(!value);
        } else {
            setIsDisabled(value);
        }
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={option}
                                value="status"
                                onChange={() => onChangeOption()}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body1">  Aceito a
                                <a className={classes.link}
                                    href="https://prediza.io/politica-de-privacidade"
                                    target="blank"
                                >
                                    Política de Utilização.
                                </a>
                            </Typography>
                        }
                    />
                </Grid>
                <Grid container justifyContent="flex-end">
                    <Button onClick={onSubmit} className={classes.Button} disabled={isDisabled} color="primary">Confirmar</Button>
                </Grid>
            </Grid>
        </div>
    );
})