import React from "react";
import { useTranslation } from "react-i18next";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import toolsUtils from "../../../utils/toolsUtils";
import styles from "../../../styles/Common/Chart/ExpandHeader"


export default withStyles(styles)(function ExpandHeader(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const label = props.measure.name;

    return (
        <Grid container>
            <Grid item xs={12} md={9}>
                <Typography className={classes.measure} key={"measure" + props.device.deveui + props.measure.name}>
                    {t("measures." + label)}
                </Typography>
            </Grid>
            <Grid item xs={12} md={3} className={classes.xs}>
                <Grid container justifyContent="flex-end" >
                    <Typography className={classes.device} key={"device" + props.device.deveui}>
                        {toolsUtils.getCompleteDeviceName(props.device)}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12} md={3} className={classes.md}>
                <Grid container justifyContent="flex-start">
                    <Typography className={classes.device} key={"device" + props.device.deveui}>
                        {toolsUtils.getCompleteDeviceName(props.device)}
                    </Typography>
                </Grid>
            </Grid>

        </Grid>
    );
})