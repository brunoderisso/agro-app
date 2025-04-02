import React, { useState, useEffect } from 'react';

//Material UI
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookPageGenerator";
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';


//Prediza
import Canvas from "../../Common/Canvas";
import SessionStore from "../../../stores/SessionStore";
import PoligonStore from "../../../stores/PoligonStore";
import tokens from "../../../stores/CancelTokenList";
import PredizaAlertDialog from "../../PredizaAlertDialog";
import { ReactComponent as GenerateIcon } from '../../../img/GeneratesMoreIcon.svg';
import history from "../../../history";
import { useTranslation } from 'react-i18next';

export default withStyles(styles)(function NotebookEnvironments(props) {

    const { classes } = props;

    const [polygons, setPolygons] = useState([]);

    const [polSelect, setPolSelect] = useState("");
    const [cropSelect, setCropSelect] = useState("");

    const { t } = useTranslation();

    const [alert, setAlert] = useState(false);

    const tokenList = new tokens();


    useEffect(() => {
        getPolygons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const selectPol = (pol) => {
        setPolSelect(pol.objectid);
        setCropSelect(pol.cropobjectid)
    }



    const getPolygons = (objectid) => {
        if (objectid === null || objectid === undefined) {
            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);
            PoligonStore.getPolygons(cancelToken, responseGetPolygons);
        }
        if (objectid) {
            PoligonStore.getEnvironmentPolygons(objectid, responseGetPolygons);
        }
    }

    const responseGetPolygons = (response) => {
        tokenList.remove(response.id);
        if (response !== null && response !== undefined) {
            setPolygons([]);
            setPolygons(response);
        }
    }

    const getPolygonButton = (p) => {
        return (
            <Grow in={polygons.length > 0}>
                <Grid item className={classes.Fcontainer}>
                    <Button onClick={() => { selectPol(p) }} style={p.objectid === polSelect ? { border: "1px solid #1455BE" } : {}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Canvas pts={p.Points} color={p.color} width="100" height="80" />
                            </Grid>
                            <Grid item xs={12} className={classes.envName}>
                                {p.name}
                            </Grid>
                        </Grid>
                    </Button>
                </Grid>
            </Grow>
        )
    }

    const onClickButtons = (val) => {
        if (val === "page" && cropSelect !== "") {
            history.push("/notebook/" + SessionStore.getEnvironment() + "/rastreability/" + cropSelect);
        }
    }

    return (
        <Grid className={classes.container}>
            <Grid container>
                <Grid item xs={12} className={classes.title}>
                    {t('common.generate')}
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12} className={classes.subtitle}>
                                    {t("common.field")}
                                </Grid>
                                <Grid item xs={12} className={classes.envRoll}>
                                    <Grid container>
                                        {polygons.length > 0 &&
                                            polygons.map((p) => {
                                                return (
                                                    getPolygonButton(p)
                                                )
                                            })
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <PredizaAlertDialog title={t('notebook.tags_rastreabilityFieldNotAssociated')} open={alert} close={() => { setAlert(false) }} method={"alert"} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} className={classes.containerGenerator}>
                            <Grid className={classes.cardGenerator}>
                                <Grid container>
                                    <Grid item xs={12} className={classes.titleGenerator}>
                                        {t('notebook.tags_rastreabilityGenerateTraceabilityPage')}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button onClick={() => { onClickButtons("page") }} variant="contained" color="primary" className={classes.buttonGenerator}>
                                            <GenerateIcon style={{ transform: "rotate(90deg)" }} />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

})