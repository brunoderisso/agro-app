import React, { useState, useEffect } from 'react';




//Material UI
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookNutritionalTable";
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function NotebookNutritionalTable(props) {

    const [nutritional, setNutritional] = useState([]);
    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        setNutritional(props.nutritional);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Grid className={classes.container}>
            <Grid container className={classes.margin}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid container>
                                <Grid item xs={12} className={classes.title}>
                                    {t('notebook.tags_rastreabilityNutritionalInformation')}
                                </Grid>
                                <Grid item xs={12} className={classes.title} style={{ marginTop: "10px" }}>
                                {t('notebook.tag.rastreability.quantityPer100g')}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={4}>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Grid container className={classes.text}>
                                {nutritional.length > 0 &&
                                    nutritional.map((obj) => {
                                        return (
                                            <Grid key={obj.objectid} item xs={12} className={classes.linename}>
                                                {obj.name}
                                            </Grid>
                                        )
                                    })}
                            </Grid>
                        </Grid>
                        <Grid item xs={1}>
                            <Divider style={{ height: (nutritional.length * 17.333333).toString() + "px" }} orientation="vertical" flexItem className={classes.dividerv} />
                        </Grid>
                        <Grid item xs={3}>
                            {nutritional.map((obj) => {
                                return (
                                    <Grid key={obj.objectid} item xs={12} className={classes.linename}>
                                        {obj.value}{obj.unit}
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                <Grid item xs={12} className={classes.dailyText}>
                    (*) {t('notebook.tags_rastreabilityDailyValuesBasedOn')}
                </Grid>
            </Grid>
        </Grid>
    )

})