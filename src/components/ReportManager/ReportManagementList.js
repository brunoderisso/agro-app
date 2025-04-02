import React, { useState, useEffect } from 'react';

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import AddIcon from '@material-ui/icons/Add';

import Style from "../../styles/Report/ReportManager";
import ReportStore from '../../stores/ReportStore';
import TokenList from "../../stores/CancelTokenList";
import ReportList from './ReportList';
import history from '../../history';
import sessionStore from '../../stores/SessionStore';
import ReportManagerForm from './ReportManagerForm';
import { useTranslation } from 'react-i18next';

const tokenList = new TokenList();

export default withStyles(Style)(function ReportManagementList(props) {

    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState({ objectid: "" });
    const [message, setMessage] = useState("");

    const [page, setPage] = useState("");
    const [open, setOpen] = useState(false);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        getReports();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.page !== page) {
            setPage(props.page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (page === "new") {
            setOpen(true);
        }

        if (page === "") {
            setSelectedReport({ objectid: '' })
            setOpen(false);
        }

        if (page !== "" && page !== "new" && reports.length > 0) {
            let r = getLocalReport(page);

            if (r !== undefined) {
                setSelectedReport(r);
                setOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (reports.length > 0 && (page !== "" && page !== "new")) {
            let r = getLocalReport(page);

            if (r !== undefined) {
                setSelectedReport(r);
                setOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reports]);

    const onCloseForm = () => {
        history.push("/report/" + sessionStore.getEnvironment())
    }

    const getReports = () => {
        let cancelToken = {}

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        ReportStore.getReports(cancelToken, responseGetReports);
    }

    const responseGetReports = (response) => {
        tokenList.remove(response.id);

        setReports([]);
        setTimeout(() => {
            setReports(response.data);
        }, 500);
    }

    const att = () => {
        getReports();
    }

    const onClickAddReport = () => {

        history.push(sessionStore.getEnvironment() + "/new");
    }

    const getLocalReport = (objectid) => {
        let result = reports.find((obj) => { return obj.objectid === objectid });

        if (result === undefined) {
            setMessage(t('alert.alertNotFound'));
            history.push("/report/" + sessionStore.getEnvironment());
        }

        return result;
    }

    const onSelectReport = (report) => {
        if (report.objectid !== '') {
            setSelectedReport(report);
            history.push(sessionStore.getEnvironment() + "/" + report.objectid);
        }
    }

    return (
        <Grid container style={{ paddingRight: "65px" }}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12} className={classes.alignCenter}>
                        <Button
                            variant="contained"
                            className={classes.addButton}
                            startIcon={<AddIcon />}
                            onClick={() => { onClickAddReport() }}
                        >
                            {t('report.addReport')}
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        {reports.length !== 0 &&
                            <Collapse in={reports.length > 0} unmountOnExit mountOnEnter timeout={700} >
                                <ReportList onSelect={onSelectReport} page={page} reports={reports} header={[t('common.measure'), t('common.function'), t('common.period'), t('common.dateText')]} />
                            </Collapse>
                        }
                    </Grid>
                    <Grid>
                        <ReportManagerForm att={att} message={message} selected={selectedReport} close={onCloseForm} open={open} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );


})
