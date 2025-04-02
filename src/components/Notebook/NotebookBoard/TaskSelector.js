import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';

import Grid from '@material-ui/core/Grid';
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";
import { Button, ClickAwayListener, Divider } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';

import styles from "../../../styles/Board/TaskSelector";
import stringsUtils from '../../../utils/stringsUtils';

import classNames from "classnames";
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function NotebookTask(props) {
    const [list, setList] = useState([]);
    const [data, setData] = useState("");
    const [open, setOpen] = useState(false);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        setList(props.list || []);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(data !== ""){
            if(typeof props.upload === "function")
            props.upload(data);
            setData("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onFileChange = event => {
        toBase64(event.target.files[0]);
    };

    const handleClick = (e) => {
        setOpen(true);
    }

    const handleSelect = (id) => {
        if (typeof props.onChange === 'function') {
            props.onChange(id);
        }
    }

    const toBase64 = (f) => {
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                //Converting Binary Data to base 64
                var base64String = window.btoa(binaryData);
                //showing file converted to base64

                setData("data:image/jpg;base64," + base64String);
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
    };

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }

    return (
        <Grid container>
            <Grid item xs={12} style={{ position: "relative" }}>
                <Grid container>
                    {props.type !== 'images' &&
                        <Button onClick={handleClick} variant="contained" className={classNames(classes.addButton, classes.effectCursor)} > + </Button>
                    }
                    {props.type === 'images' &&
                        <Grid item xs={12}>
                            <Input
                                accept="image/jpeg"
                                className={classes.input}
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={onFileChange}

                            />
                            <label htmlFor="raised-button-file" >
                                <Grid variant="contained" className={classNames(classes.addButton, classes.effectCursor)} style={{ minWidth: "43px", maxWidth: "43px", textAlign: "center",lineHeight: "48px" }} > + </Grid>
                            </label>
                        </Grid>
                    }
                </Grid>
                <Grow in={open} unmountOnExit timeout={500}>
                    <Grid className={classes.list}>
                        <ClickAwayListener onClickAway={() => { setOpen(false) }}>
                            <Grid container >
                                <Grid item xs={12} style={{ textAlign: "center", fontWeight: "bold" }}>
                                    {t('common.select')}
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12} style={{ marginBottom: "10px" }}>
                                            <Divider />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container >
                                                <Scrollbars style={{ width: "120px", height: "35vh" }} renderThumbVertical={thumb}>

                                                    {list.map((item, i) => {
                                                        return (
                                                            <Grid item xs={12} key={item.objectid + i}>
                                                                <div onClick={() => { handleSelect(item.objectid || item.uuid) }}>
                                                                    {props.type === 'labels' &&
                                                                        <Grid className={classNames(classes.labelItem, classes.effectCursor)} style={{ border: "solid 1px " + item.color }}>
                                                                            {item.name}
                                                                        </Grid>
                                                                    }
                                                                    {props.type === 'polygons' &&
                                                                        <Grid className={classNames(classes.labelItem, classes.effectCursor)} style={{ border: "solid 1px black" }}>
                                                                            {item.name}
                                                                        </Grid>
                                                                    }
                                                                    {props.type === 'users' && (item.name || item.surname) &&
                                                                        <Grid key={item.uuid} className={classNames(classes.labelItem, classes.effectCursor)} style={{ border: "solid 1px black" }}>
                                                                            {stringsUtils.mapUserNameSurname(item)}
                                                                        </Grid>
                                                                    }
                                                                    {props.type === 'categories' &&
                                                                        <Grid className={classNames(classes.labelItem, classes.effectCursor)} style={{ border: "solid 1px black" }}>
                                                                            {item.name}
                                                                        </Grid>
                                                                    }
                                                                </div>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Scrollbars>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ClickAwayListener>
                    </Grid>
                </Grow>
            </Grid>
        </Grid >
    )

})