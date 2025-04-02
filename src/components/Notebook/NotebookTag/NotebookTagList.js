import React, { useState, useEffect } from 'react';


import { Scrollbars } from 'react-custom-scrollbars';

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagList";

import moment from "moment";

import useResize from '../../../Hook/useResize';



export default withStyles(styles)(function NotebookTagList(props) {

    const [tags, setTags] = useState([]);

    const [selectedTag, setSelectedTag] = useState({ objectid: "" });

    const { classes } = props;

    const window = useResize();

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTags(props.tags);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tags]);

    const handleClick = (obj) => {
        if (obj.objectid === selectedTag.objectid) {
            setSelectedTag({objectid: ""});
            props.onChange({});
        } else {
            setSelectedTag(obj);
            props.onChange(obj);
        }
    }

    const row = (obj, i) => {
        if ((window.width < 600 && selectedTag.objectid === "") || window.width > 600) {
            return (
                <Grid key={obj.objectid + "TagList"} item xs={12} className={classes.tableRow} style={obj.objectid === selectedTag.objectid ? { border: "3px solid #0084F8", fontWeight: "bold" } : {}}>
                    <div onClick={() => { handleClick(obj) }}>
                        <Grid container>
                            <Grid item xs={3}>
                                {obj.polygon_name || "-"}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {obj.crop_name.toUpperCase() + " " + obj.crop_variety.toUpperCase() || "-"}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {obj.batch || ""}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {(obj.producedat &&
                                    moment(obj.producedat).format("DD/MM/YY")) || "-"}
                            </Grid>
                        </Grid>
                    </div>
                </Grid>

            )
        } else if (window.width < 600 && selectedTag.objectid !== "") {
            if (obj.objectid === selectedTag.objectid) {
                return (
                    <Grid key={obj.objectid + "TagList"} item xs={12} className={classes.tableRow} style={obj.objectid === selectedTag.objectid ? { border: "3px solid #0084F8", fontWeight: "bold" } : {}}>
                        <div onClick={() => { handleClick(obj) }}>
                            <Grid container>
                                <Grid item xs={3}>
                                    {obj.polygon_name || "-"}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {obj.crop_name.toUpperCase() + " " + obj.crop_variety.toUpperCase() || "-"}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {obj.batch || ""}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {(obj.producedat &&
                                        moment(obj.producedat).format("DD/MM/YY")) || "-"}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                )
            }
        }
    }

    const thumb = () => {
        return (
            <Grid className={classes.thumb}>
            </Grid>
        )
    }


    return (
        <Grid container>
            {((window.width < 600 && selectedTag.objectid === "") || window.width > 600) &&
            <Grid item xs={12} className={classes.tableHeader}>
                <Grid container>
                    {props.header.map((obj, i) => {
                        return (
                            <Grid key={obj + "TagList"} item xs={3} style={i === 0 ? {} : { textAlign: "center" }}>
                                {obj}
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>
            }
            <Grid item xs={12}>
                {tags.length > 0 &&
                    <Grid container className={classes.scrollContainer}>
                        <Scrollbars style={{ width: "100%", height: window.width > 600 ? "55vh" : (window.width < 600 && selectedTag.objectid !== "") ? "12vh" : "50vh"}} renderThumbVertical={thumb}>
                            {
                                tags.map((obj, i) => {
                                    return (
                                        row(obj, i)
                                    )
                                })
                            }
                        </Scrollbars>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
})