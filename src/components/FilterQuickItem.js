import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import SessionStore from "../stores/SessionStore";
import theme from "../styles/Utils/theme";
import { useTranslation } from 'react-i18next';
import { AnalitycsEvent } from '../LocalConfig';


const styles = {
    conatiner: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 1,
        marginLeft: 5,
        marginRight: 5,
        maxWidth: "95%",
        cursor: "pointer"
    },
    text: {
        paddingTop: 8
    },
    item: {
        paddingTop: 0,
        "&:hover": {
            backgroundColor: "white"
        },
        "&:focus": {
            backgroundColor: "white"
        }
    },
    line: {
        width: "100%",
        "& span": {
            [theme.breakpoints.between('xs', 'md')]: {
                paddingLeft: "20vw",
                fontSize: "7vw",
                paddingTop: "4vw",
                paddingBottom: "4vw"
            },
            [theme.breakpoints.between('lg', 'xl')]: {
                fontSize: "1.25vw",
                paddingLeft: "2.3vw"
            },

        }
    },
    font: {
        fontSize: "1.1rem"
    },

};

export default withStyles(styles)(function FilterQuickItem(props) {
    const [diff, setDiff] = useState(0);
    const [text, setText] = useState("");

    const { classes } = props;

    const { t } = useTranslation();
    useEffect(() => {

        setDiff(Math.round(SessionStore.getTimeDiff() / (1000 * 3600)));

        let h = props.hour === 1 ? t("common.hour") : t("common.hours");

        if (props.hour <= 36) {
            setText(t("common.lastFeminine") + props.hour + h);
        } else {
            setText(t("common.lastMasculine") + props.hour / 24 + t("common.days"));
        }

        bind();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const bind = () => {
        SessionStore.on("time.change", () => {
            setDiff(Math.round(SessionStore.getTimeDiff() / (1000 * 3600)));
        });
    }

    const onClickListHour = () => {
        AnalitycsEvent('Tool Bar', 'click/toolbar/time/' + props.hour, 'Change Time');

        SessionStore.setTime(props.hour);
        props.onClose();
    };

    return (
        <Grid container className={classes.conatiner} style={diff === props.hour ? { backgroundColor: "#2196f31c" } : {}} onClick={onClickListHour} justifyContent="center">
            <Grid item xs={12} className={classes.text}>
                <Grid container alignItems="flex-end">
                    <Typography className={classes.font} variant="button">{text}</Typography>
                </Grid>
            </Grid>
        </Grid>
    )

})