import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import toolsUtils from "../utils/toolsUtils";
import { useTranslation } from 'react-i18next';

const styles = () => ({
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
});

export default withStyles(styles)(function NotePropriety(props) {
    //Component default methods

    //Event methods

    //Component methods

    //Store methods

    const { classes } = props;
    const { t } = useTranslation();
    return (
        <Grid container className={classes.container}>
            <Grid item xs={12}>
                <Typography color="textSecondary" gutterBottom>
                    {t('common.property')}
                </Typography>
            </Grid>
            <Grid item xs={12} className={classes.line}>
                <Grid container justifyContent="flex-end" className={classes.text}>
                    {t('common.registrationNumber')}:
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={5}>
                        <Grid container justifyContent="center">
                        {t('common.producerCompany')}: {!toolsUtils.isNullOrEmpty(props, "env") && props.env}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container justifyContent="center">
                            {t('common.address')}:
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent="center">
                            {t('common.email')}: {!toolsUtils.isNullOrEmpty(props, "owner.email") && props.owner.email}
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justifyContent="flex-end">
                        {t('common.phoneNumber')}: {!toolsUtils.isNullOrEmpty(props, "owner.mobilephone") && props.owner.mobilephone}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );

})
