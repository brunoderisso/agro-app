import React, { useState, useEffect } from 'react';
import QRCodeSVG from 'qrcode.react';

//material ui
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import styles from "../../../styles/Notebook/NotebookTagPage2";


import { ReactComponent as Baseboard } from '../../../img/TagBaseboardIcon.svg';
import moment from "moment";

import toolsUtils from "../../../utils/toolsUtils";
import SessionStore from "../../../stores/SessionStore";
import { useTranslation } from 'react-i18next';

export default withStyles(styles)(function NotebookTagPage(props) {

    const [environment, setEnvironment] = useState({});
    const [crop, setCrop] = useState({});
    const [environmentPreference, setEnvironmentPreference] = useState({});

    useEffect(() => {
        setCrop(props.crop);
        setEnvironment(SessionStore.getEnvironment(props.tag.environmentobjectid));
        setEnvironmentPreference(props.preference);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { t } = useTranslation();

    const { classes } = props;

    return (
        <Grid>
            <div id={"tracerTagV2download" + props.tag.objectid}>
                {!toolsUtils.isNullOrEmpty(environment, "objectid") && !toolsUtils.isNullOrEmpty(crop, "objectid") && !toolsUtils.isNullOrEmpty(environmentPreference, "objectid") &&
                    <Grid container className={classes.containerTag}>
                        <Grid item xs={12} className={classes.varietyTitle}>
                            {crop.name.toUpperCase() + " " + crop.variety.toUpperCase()}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={5} className={classes.weightText}>
                                                    {t('notebook.tags_netWeight')}:
                                                </Grid>
                                                <Grid item xs={3} className={classes.weightSize}>
                                                    {(props.tag && props.tag.netweight && props.tag.netweight + " g") || "0 g"}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container className={classes.localText}>
                                                <Grid item xs={12}>
                                                    {t('notebook.tags_producedBy')}:
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {environment.name.toUpperCase()}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {!toolsUtils.isNullOrEmpty(environmentPreference, "taxid") &&
                                                        environmentPreference.taxid
                                                    }
                                                    {!toolsUtils.isNullOrEmpty(environmentPreference, "ein") &&
                                                        environmentPreference.ein
                                                    }
                                                    {toolsUtils.isNullOrEmpty(environmentPreference, "taxid") &&
                                                        t('notebook.tags_unregisteredCPFCNPJ')
                                                    }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {environmentPreference.city}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container className={classes.dateText}>
                                                <Grid item xs={12}>
                                                    {(props.tag && props.tag.producedat && `${t('notebook.tags_manufacturedIn')}: ` + moment(props.tag.producedat).format("DD/MM/YY")) ||
                                                        `${t('notebook.tags_manufacturedIn')}: 10/01/2022`}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {(props.tag && props.tag.validuntil && `${t('notebook.tags_validUntil')}: ` + moment(props.tag.validuntil).format("DD/MM/YY")) ||
                                                        `${t('notebook.tags_validUntil')}: 10/02/2022`}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {(props.tag && props.tag.batch && `${t('notebook.tags_lot')}: ` + props.tag.batch) || `${t('notebook.tags_lot')}: 00000000`}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <QRCodeSVG value={"https://prediza.io/rastreabilidade/" + props.crop.name.replace("ç", "c") + "-" + props.crop.variety + "/?tag=" + props.tag.objectid} size={215}></QRCodeSVG>
                                                </Grid>
                                                <Grid item xs={12} className={classes.codeText}>
                                                    {props.tag.batch.toUpperCase()}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} className={classes.infoText}>
                                            {t('notebook.tags_checkWithQRCodeOrAt')}
                                        </Grid>
                                        <Grid item xs={12} className={classes.developText}>
                                            {t('notebook.tags_developedBy')}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.baseboard}>
                            <Baseboard className={classes.svg} />
                            <Grid className={classes.tracer}>
                                {t('notebook.tags_trackedOriginProduct').toUpperCase()}
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </div>
        </Grid>
    )
})