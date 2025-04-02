import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import toolsUtils from "../utils/toolsUtils";

const style = {
    container: {
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: "#c9c9c9",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px",
        paddingBottom: "15px",
        backgroundColor: "white"
    },
    line: {
        marginBottom: 10
    },
    text: {
        fontSize: 18
    }
};

export default withStyles(style)(function NoteResponsible(props) {
    const { classes } = props;

    const getName = () => {
        if (!toolsUtils.isNullOrEmpty(props, "technical.name")) {
            if (!toolsUtils.isNullOrEmpty(props, "technical.surname")) {
                return props.technical.name + " " + props.technical.surname
            }
            return props.technical.name
        }
        return ""
    }
    return (<Grid container className={classes.container}>
        <Grid item xs={12}>
            <Typography color="textSecondary" gutterBottom>
                Responsável
                </Typography>
        </Grid>
        <Grid item xs={12} className={classes.line}>
            <Grid container justifyContent="flex-end" className={classes.text}>
                CREA:
                </Grid>
        </Grid>
        <Grid item xs={12}>
            <Grid container>
                <Grid item xs={5}>
                    <Grid container justifyContent="center">
                        Responsável: {getName()}
                        </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Grid container justifyContent="center">
                        Endereço:
                        </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Grid container justifyContent="center">
                        Email: {!toolsUtils.isNullOrEmpty(props, "technical.email") && props.technical.email}
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Grid container justifyContent="flex-end">
                        Telefone: {!toolsUtils.isNullOrEmpty(props, "technical.mobilephone") && props.technical.mobilephone}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>);

})
