import React, { useState, useEffect } from "react";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

//Prediza
import Style from '../../styles/Login/AccessPage'
import SessionStore from "../../stores/SessionStore";
import { useTranslation } from "react-i18next";


export default withStyles(Style)(function AcessPage(props) {

    const [page, setPage] = useState("");
    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        setPage(props.page);
        SessionStore.setView("error");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <Grid className={classes.containerNotFound}>
            <Grid container>
                <Grid className={classes.codeError} item xs={12}>
                    404
                </Grid>
                <Grid item xs={12} className={classes.textError}>
                    {t('login.page') + {page} + t('login.notFound')}
                </Grid>
            </Grid>
        </Grid>
    );

})