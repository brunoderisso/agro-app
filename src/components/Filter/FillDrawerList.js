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

export default withStyles(style)(function FillDrawerList(props) {
    const [list, setList] = useState([]);
    const [fill, setFill] = useState("");

    const { t } = useTranslation();

    const tokenList = new tokens();

    useEffect(() => {
        bind();
        getFill();
        getFills();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("environment.change", getFill);
        SessionStore.on("fill.change", getFill)
        SessionStore.on("change.meta", getFill)
    };

    const clear = () => {
        SessionStore.removeListener("environment.change", getFill);
        SessionStore.removeListener("fill.change", getFill)
        SessionStore.removeListener("change.meta", getFill)
        tokenList.clear();
    };

    const onSelectButtonClick = (f) => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/fill/' + f.value, 'Change Fill');

        SessionStore.setFill(f.value);
        props.onClose();
    }

    const Row = (f) => {
        const { classes } = props;
        return (
            <Grid key={"fillDrawerList" + f.label} container className={classes.conatiner} style={{ backgroundColor: f.value === fill ? "#2196f31c" : "" }} onClick={() => { onSelectButtonClick(f) }}>
                <Grid item xs={8} className={classes.text}>
                    <Grid container alignItems="flex-end">
                        <Typography className={classes.font} variant="button">{t("common." + f.value)}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    //Store
    const getFills = () => {
        setList(SessionStore.fills);
    };

    const getFill = () => {
        setFill(SessionStore.fill);
    }

    return (
        <Grid container>
            {list.map((val) => {
                return Row(val)
            })}
        </Grid>
    );
});