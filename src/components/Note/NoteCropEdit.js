import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField"

import toolsUtils from "../../utils/toolsUtils";
import NoteStore from "../../stores/NoteStore";

import tokens from "../../stores/CancelTokenList";

const style = {
    header: {
        padding: 16,
        marginBottom: 32,
        backgroundColor: "#2196f333"
    },
    card: {
        padding: 0
    },
    bar: {
        paddingRight: 16,
        paddingLeft: 16
    },
    footer: {
        marginTop: 16
    },
    item: {
        marginBottom: 10
    }
};

export default (withStyles(style)(function NoteCropEdit(props) {
    const tokenList = new tokens();
    const { classes } = props;

    const [crop, setCrop] = useState({});

    useEffect(() => {
        init();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        tokenList.clear();
    };

    const init = () => {
        setCrop({
            objectid: props.crop.objectid || "",
            cropobjectid: props.crop.cropobjectid.value || "",
            croparea: props.crop.croparea || 0,
            cropspacing: props.crop.cropspacing || 0
        })
    }

    const submit = () => {
        if (toolsUtils.isNullOrEmpty(crop, "objectid") || toolsUtils.isEmptyString(crop.objectid)) {
            addCrop();
            return
        }

        editCrop();
    }


    const ResponseAddCrop = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data === null) {
            return
        };

        props.toggle()
    }

    const ResponseEditCrop = (resp) => {
        tokenList.remove(resp.id);

        if (resp.data === null) {
            return
        };

        props.toggle()
    }

    const addCrop = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.addNoteCrop(toData(), cancelToken, ResponseAddCrop);
    }

    const editCrop = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.editNoteCrop(toData(), cancelToken, ResponseEditCrop);
    }

    const onChangeInput = event => {
        setCrop({
            ...crop,
            [event.target.id]: event.target.value
        })
    };

    const toData = () => {
        let c = crop;
        c.croparea = parseFloat(c.croparea);
        c.croparea = parseFloat(c.cropspacing);
        return c;
    }

    return (
        <Grid item xs={12}>
            <Grid container>
                {crop !== null && <Grid item xs={12}>
                    <Grid container className={classes.header}>
                        <Grid item xs={10}>
                            <Grid container justifyContent="center">
                                {props.crop.cropobjectid.label}
                            </Grid>
                        </Grid>
                        <Grid item xs={2}>
                            <Grid container justifyContent="flex-end">
                                <Button onClick={submit} color="primary">Salvar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>}
                {crop !== null && <Grid item xs={12}>
                    <Grid conatiner>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-end">
                                <TextField
                                    id="croparea"
                                    label="Área"
                                    margin="normal"
                                    value={crop.croparea}
                                    onChange={onChangeInput}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container justifyContent="flex-start">
                                <TextField
                                    id="cropspacing"
                                    label="Espaçamento"
                                    margin="normal"
                                    value={crop.cropspacing}
                                    onChange={onChangeInput}
                                    className={classes.Input}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                }
            </Grid>
        </Grid>
    )
}))