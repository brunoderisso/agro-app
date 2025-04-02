import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EqualizerIcon from '@material-ui/icons/Equalizer';

import styles from "../../styles/Notebook/InmetPage";
import PropTypes from 'prop-types';
import ManagerContextMenu from '../Common/ManagerContextMenu';
import InmetDasboard from './InmetDasboard';
import InmetCharts from './InmetCharts';
import history from '../../history';
import InmetEvapo from './InmetEvapo';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function NotebookInmetPage(props) {
    const [value, setValue] = useState(-1);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        if (props.tab === "dashboard" && value !== 0) {
            setValue(0);
        } else if (props.tab === "charts" && value !== 1) {
            setValue(1);
        } else if (props.tab === "evapo" && value !== 2) {
            setValue(2);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

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

    const handleChange = (_, newValue) => {
        if (newValue === 0) {
            history.push("/inmet/dashboard");
        } else if (newValue === 1) {
            history.push("/inmet/charts");
        } else if(newValue === 2) {
            history.push("/inmet/evapo")
        }
    };

    const getClassNames = (value) => {
        if (value === 0) {
            return classes.tabsDashboard;
        }
        if (value === 1) {
            return classes.tabsChart;
        }
        if (value === 2) {
            return classes.tabsEvapo;
        }
    }

    return (
        <Grid container style={{ marginLeft: "-60px", width: "109%" }}>
            <Grid item xs={12} sm={12}>
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
                        }} label="Evapo" icon={<EqualizerIcon style={{ marginRight: "5px" }} width={"24px"} />} {...a11yProps(2)} />

                    </Tabs>
                </AppBar>
                <ManagerContextMenu context={"inmet"} inmetTab={value}>
                    <TabPanel value={value} index={0}>
                        {value === 0 &&
                            <Grid style={{ marginBottom: "50px" }}>
                                <InmetDasboard value={value} />
                            </Grid>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {value === 1 &&
                            <Grid>
                                <InmetCharts value={value} />
                            </Grid>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        {value === 2 &&
                            <Grid>
                                <InmetEvapo value={value} />
                            </Grid>
                        }
                    </TabPanel>
                </ManagerContextMenu>
            </Grid>
        </Grid>
    )

})