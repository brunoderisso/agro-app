import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import NotesIcon from '@material-ui/icons/Notes';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import NotebookDashboard from './NotebookDashboard';
import styles from "../../../styles/Notebook/NotebookDashboardPage";
import SessionStore from '../../../stores/SessionStore';
import Chart from '../../Common/Chart/Chart';
import PredizaStats from '../../PredizaStats/PredizaReport';
import history from '../../../history';
import ManagerContextMenu from '../../Common/ManagerContextMenu';
import { useTranslation } from 'react-i18next';


const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Grid item xs={12}>
                    {children}
                </Grid>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default withStyles(styles)(function NotebookDashboardPage(props) {
    const [value, setValue] = useState(0);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (props.tab === "stats") {
            setValue(2);
        }
        if (props.tab === "cards") {
            setValue(0);
        }
        if (props.tab === "charts") {
            setValue(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleChange = (event, newValue) => {
        let env = SessionStore.getEnvironment();
        let tab = '';

        if (newValue === 0) {
            tab = 'cards';
        } else if (newValue === 1) {
            tab = 'charts'
        } else {
            tab = 'stats'
        }

        history.push("/note/" + env + "/dashboard/" + tab);
    };

    const getClassNames = (value) => {
        if (value === 0) {
            return classes.tabsDashboard
        }
        if (value === 1) {
            return classes.tabsChart
        }
        if (value === 2) {
            return classes.tabsStats
        }
    }

    return (
        <Grid container style={{ marginBottom: "50px" }}>
            <AppBar position="fixed" className={classes.appBar}>
                <Tabs classes={{ root: classes.root }} value={value} className={getClassNames(value)}
                    TabIndicatorProps={{
                        style: { display: "none" }
                    }}
                    onChange={handleChange}
                    aria-label="Dashboard"
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="inherit"
                    centered>

                    <Tab classes={{
                        wrapper: classes.iconLabelWrapper,
                        root: classes.root
                    }} label="Dashboard" icon={<DashboardIcon style={{ marginRight: "5px" }} width={"30px"} />} {...a11yProps(0)} />

                    <Tab classes={{
                        wrapper: classes.iconLabelWrapper,
                        root: classes.root
                    }} label={t('common.charts')} icon={<EqualizerIcon style={{ marginRight: "5px" }} width={"24px"} />} {...a11yProps(1)} />

                    <Tab classes={{
                        wrapper: classes.iconLabelWrapper,
                        root: classes.root
                    }} label={t('common.statistics')} icon={<NotesIcon style={{ marginRight: "5px" }} width={"24px"} />} {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <ManagerContextMenu context={"dashboard"}>
                <TabPanel value={value} index={0}>
                    <NotebookDashboard />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Chart />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <PredizaStats />
                </TabPanel>
            </ManagerContextMenu>
        </Grid>
    );
});