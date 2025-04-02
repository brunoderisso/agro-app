import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Grid, Grow, Typography, withStyles } from '@material-ui/core';
import BeatLoader from 'react-spinners/BeatLoader';

import styles from "../../../styles/Notebook/NotebookDiseasePage";
import DisorderStore from '../../../stores/DisorderStore';
import tokens from "../../../stores/CancelTokenList";
import SessionStore from "../../../stores/SessionStore";
import NotebookDiseaseCard from './NotebookDiseaseCard';


export default withStyles(styles)(function NotebookDisease(props) {
    const { classes } = props;
    const tokenList = new tokens();
    const { t } = useTranslation();

    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(false);

    const caption = [
        { name: t("notebook.pests_noRisk"), color: "#007eff" },
        { name: t("notebook.pests_lowRisk"), color: "#ffff00" },
        { name: t("notebook.pests_averageRisk"), color: "#ff7200" },
        { name: t("notebook.pests_highRisk"), color: "#ff0000" },
    ]

    useEffect(() => {
        getDiseases();
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clear = () => {
        SessionStore.removeListener("time.change", getDiseases);
    }

    const bind = () => {
        SessionStore.addListener("time.change", getDiseases);
    }

    const getDiseases = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        let time = SessionStore.getTime();

        setLoading(true);
        DisorderStore.getEnvironmentDisease(cancelToken, time, responseGetDiseases);
    }

    const responseGetDiseases = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setDiseases(response.data);
        }
        setLoading(false);
    }

    return (
        <Grid>
            {diseases.length === 0 && !loading &&
                <Grid container className={classes.alignLoading}>
                    <Typography variant="caption">{t("common.noData")}</Typography>
                </Grid>
            }
            {loading &&
                <Grid container className={classes.alignLoading}>
                    <BeatLoader color={"#959595"} sizeUnit={'px'} size={8} />
                </Grid>
            }
            {!loading &&
                <Grid className={classes.containerDisease}>
                    {diseases.length > 0 &&
                        <Grow in={diseases.length > 0}>
                            <Grid container spacing={3}>
                                {
                                    diseases.map((disease) => {
                                        return (
                                            <Grid item xs={12} md={4} xl={3} key={disease.cropobjectid + disease.environmentcrop}>
                                                <NotebookDiseaseCard disease={disease} />
                                            </Grid>
                                        )
                                    })
                                }
                                <Grid container>
                                    <Card className={classes.containerCaption} elevation={0}>
                                        <Grid style={{ marginBottom: "10px" }}>
                                            <Typography variant="caption" className={classes.titleCaption}>{t("common.statusText")}</Typography>
                                        </Grid>
                                        <Grid container spacing={3}>
                                            {caption.map(item => (
                                                <Grid item key={item.name} className={classes.containerItemCaption}>
                                                    <Card className={classes.captionBlock} style={{ backgroundColor: item.color }} elevation={0} />
                                                    <Typography variant="caption" className={classes.itemCaption}>{item.name}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grow>
                    }
                </Grid>
            }
        </Grid>
    )
})