import React from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CreateIcon from "@material-ui/icons/Create";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import useSize from "../../Hook/useSize";

import history from "../../history";

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
        marginLeft: 5,
        marginRight: 5
    },
    item: {
        marginBottom: 10
    },
    title: {
        marginRigth: 2
    },
    value: {
        fontWeight: 400
    },
    icon:{
        fontSize:17
    }
};

export default (withStyles(style)(function NoteCrop(props) {
    const { classes } = props;

    const [size] = useSize();

    const edit = () => {
        history.push("/note/" + SessionStore.getEnvironment() + "/crop/" + props.crop.objectid)
    };

    const getAreaJustify = () => {
        if(size === "xs"){
            return "flex-start";
        }
        if(size === "sm"){
            return "flex-end";
        }
        return "center"
    }

    const getTitle = () => {
        if (!toolsUtils.isNullOrEmpty(props, "crop.cropname") && !toolsUtils.isNullOrEmpty(props, "crop.cropvariety") && !toolsUtils.isEmptyString(props.crop.cropname) && !toolsUtils.isEmptyString(props.crop.cropvariety)) {
            return (props.crop.cropname + " " + props.crop.cropvariety).toUpperCase();
        }

        if (!toolsUtils.isNullOrEmpty(props, "crop.cropname") && !toolsUtils.isEmptyString(props.crop.cropname)) {
            return props.crop.cropname.toUpperCase();
        }

        return "";
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container className={classes.header}>
                    <Grid item xs={11}>
                        <Grid container justifyContent="center">
                            <Typography variant="button" display="block" gutterBottom>
                                {getTitle()}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}>
                        <Grid container justifyContent="flex-end">
                            <Button onClick={edit}><CreateIcon className={classes.icon}/></Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} style={{ padding: 50 }}></Grid>
            <Grid item xs={12} className={classes.footer}>
                <Grid container>
                    <Grid xs={12} md={6}>
                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <Grid container justifyContent="flex-start">
                                    <Typography className={classes.title} variant="button" display="block" gutterBottom>
                                        {"Número de Plantas: "}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.cropnumberofplants || " - ")}
                                    </Typography>

                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Grid container justifyContent={size === "xs" ? "flex-start" : "center"}>
                                    <Typography className={classes.title} variant="button" display="block" gutterBottom>
                                        {"Espaçamento: "}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.cropspacing || " - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Grid container justifyContent={getAreaJustify()}>
                                    <Typography variant="button" className={classes.title} display="block" gutterBottom>
                                        {"Área:"}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.croparea || " - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {(size !== "xs" && size !== "sm") && <Grid xs={12} md={6}>
                        <Grid container>
                            <Grid item xs={4}>
                                <Grid container justifyContent="center">
                                    <Typography variant="button" className={classes.title} display="block" gutterBottom>
                                        {"Solo:"}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.cropsoil || " - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justifyContent={"center"}>
                                    <Typography className={classes.title} variant="button" display="block" gutterBottom>
                                        {"Tipo: "}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.croptype || " - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Grid container justifyContent={size === "xs" ? "flex-start" : "flex-end"}>
                                    <Typography className={classes.title} variant="button" display="block" gutterBottom>
                                        {"Porta Enxerto: "}
                                    </Typography>
                                    <Typography className={classes.value} variant="button" display="block" gutterBottom>
                                        {(props.crop.croprootstock || " - ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>}
                </Grid>
            </Grid>
        </Grid>
    )
}))