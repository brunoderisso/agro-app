import React, { useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';

import moment from "moment";
import 'moment/locale/pt';
import 'moment/locale/es';
import classNames from "classnames";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import MeasureStore from "../../stores/MeasureStore";
import toolsUtils from "../../utils/toolsUtils";
import SessionStore from "../../stores/SessionStore";
import styles from "../../styles/Report/ReportList";
import useResize from '../../Hook/useResize';
import { ConstantsUtils } from '../../utils/constantsUtils';


export default withStyles(styles)(function ReportItem(props) {
    const { classes } = props;
    const window = useResize();

    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState({ objectid: "" });
    const { t, i18n: { language } } = useTranslation();

    useEffect(() => {
        setReports(props.reports);
        moment.locale(language.toLowerCase());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setReports([]);
        setReports(props.reports);
    }, [props]);

    useEffect(() => {
        props.onSelect(selectedReport);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedReport]);

    useEffect(() => {
        if (props.page === "") {
            setSelectedReport({ objectid: "" })
        }
    }, [props.page]);

    const getFunctionName = (name) => {
        let functions = SessionStore.functions;

        if (functions === null) {
            return
        }

        let f = functions.find((obj) => { return obj.value === name.toUpperCase() });

        if (f !== undefined) {
            return t(f.label);
        } else {
            return name.toUpperCase();
        }
    }

    const handleClick = (obj) => {
        if (obj.objectid === selectedReport.objectid) {
            setSelectedReport({ objectid: "" });
        } else {
            setSelectedReport(obj);
        }
    }

    const row = (obj) => {
        if ((window.width < 600 && selectedReport.objectid === "") || window.width > 600) {
            return (
                <Grid
                    key={obj.objectid + "TagList"}
                    item
                    xs={12}
                    className={classNames(classes.tableRow, classes.reportItem)}
                    style={obj.objectid === selectedReport.objectid ? { border: "3px solid #0084F8", fontWeight: "bold" } : {}}
                >
                    <div onClick={() => { handleClick(obj) }}>
                        <Grid container>
                            <Grid item xs={3}>
                                {toolsUtils.getMeasureName(MeasureStore.getMeasureDetail(obj.measure))}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {getFunctionName(obj.function)}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {`${t('common.every')} ` + ((obj.interval / 86400) < 0 ? obj.interval / 3600 + ` ${t('common.hours')}` : obj.interval / 86400 + ` ${t('common.days')}`)}
                            </Grid>
                            <Grid item xs={3} className={classes.tableLabel}>
                                {obj.submittedat ? moment(obj.submittedat).format("DD/MM/YY") : ConstantsUtils.NullFieldMask}
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            )
        } else if (window.width < 600 && selectedReport.objectid !== "") {
            if (obj.objectid === selectedReport.objectid) {
                return (
                    <Grid
                        key={obj.objectid + "ReportListList"}
                        item
                        xs={12}
                        className={classes.tableRow}
                        style={obj.objectid === selectedReport.objectid ? { border: "3px solid #0084F8", fontWeight: "bold" } : {}}
                    >
                        <div onClick={() => { handleClick(obj) }}>
                            <Grid container>
                                <Grid item xs={3}>
                                    {toolsUtils.getMeasureName(MeasureStore.getMeasureDetail(obj.measure))}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {getFunctionName(obj.function)}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {`${t('common.every')} ` + ((obj.interval / 86400) < 0 ? obj.interval / 3600 + ` ${t('common.hours')}` : obj.interval / 86400 + ` ${t('common.days')}`)}
                                </Grid>
                                <Grid item xs={3} className={classes.tableLabel}>
                                    {obj.submittedat ? moment(obj.submittedat).format("DD/MM/YY") : ConstantsUtils.NullFieldMask}
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                )
            }
        }
    }

    const thumb = () => {
        return (
            <Grid className={classes.thumb}>
            </Grid>
        )
    }

    return (
        <Grid container>
            {((window.width < 600 && selectedReport.objectid === "") || window.width > 600) &&
                <Grid item xs={12} className={classes.tableHeader}>
                    <Grid container>
                        {props.header.map((obj, i) => {
                            return (
                                <Grid key={obj + "ReportListList"} item xs={3} style={i === 0 ? {} : { textAlign: "center" }}>
                                    {obj}
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            }
            <Grid item xs={12}>
                {reports.length > 0 &&
                    <Grid container className={classes.scrollContainer}>
                        <Scrollbars style={{ width: "100%", height: window.width > 600 ? "55vh" : (window.width < 600 && selectedReport.objectid !== "") ? "12vh" : "50vh" }} renderThumbVertical={thumb}>
                            {
                                reports.map(obj => {
                                    return (
                                        row(obj)
                                    )
                                })
                            }
                        </Scrollbars>
                    </Grid>
                }
            </Grid>
        </Grid>
    )
})