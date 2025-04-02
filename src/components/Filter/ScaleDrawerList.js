import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core";

//Material UI
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

//Prediza
import SessionStore from "../../stores/SessionStore";
import tokens from "../../stores/CancelTokenList";

//Others
import { useTranslation } from 'react-i18next';
import { AnalitycsEvent } from '../../LocalConfig';

const style = () => ({
    conatiner: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 8,
        margin: 7,
        maxWidth: "95%",
        cursor: "pointer"
    },
    icon: {
        fontSize: 20
    },
    button: {
        minWidth: 15
    },
    font: {
        fontSize: "1.1rem"
    },
    text: {
        paddingTop: 8
    }
});

export default withStyles(style)(function ScaleDrawerList(props) {
    const [list, setList] = useState([]);
    const [scale, setScale] = useState("");

    const { t } = useTranslation();

    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getScale();
        getScales();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getScale);
        SessionStore.on("scale.change", getScale);
        SessionStore.on("change.meta", getScale);
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getScale);
        SessionStore.removeListener("scale.change", getScale);
        SessionStore.removeListener("change.meta", getScale);
        tokenList.clear();
    };

    const onSelectButtonClick = (s) => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/environment/' + s.value, 'Change Scale');

        SessionStore.setScale(s.value)
        props.onClose()
    }

    const Row = (s) => {
        const { classes } = props;

        return (
            <Grid key={"scaleDrawerList" + s.value} container className={classes.conatiner} style={{ backgroundColor: s.value === scale ? "#2196f31c" : "" }} onClick={() => { onSelectButtonClick(s) }}>
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">
                            {t("common." + (s.value === "auto" ? "automatic" : s.value))}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //Store
    const getScales = () => {
        setList(SessionStore.scales);
    };

    const getScale = () => {
        setScale(SessionStore.scale);
    }

    return (
        <Grid container>
            {list.map((val) => {
                return Row(val)
            })}
        </Grid>
    );
});