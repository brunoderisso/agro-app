import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import NotebookDiseasePage from './NotebookDiseasePage';
import { ReactComponent as PestIcon } from '../../../img/PestIcon.svg';
import { ReactComponent as DiseaseIcon } from '../../../img/MicroorganismIcon.svg';
import styles from "../../../styles/Notebook/NotebookDisorderPage";
import history from '../../../history';
import SessionStore from '../../../stores/SessionStore';
import NotebookPestPage from './NotebookPestPage';


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

export default withStyles(styles)(function NotebookDisease(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const [value, setValue] = useState(0);

    useEffect(() => {
        if (props.tab === 'disease' || props.tab === '') {
            setValue(0);
        } else {
            setValue(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleChange = (_, newValue) => {
        let env = SessionStore.getEnvironment();
        let tab = '';
        if (newValue === 0) {
            tab = 'disease';
        } else {
            tab = 'pest'
        }
        history.push("/note/" + env + "/disorder/" + tab);
    };

    return (
        <Grid style={{ paddingTop: "15px" }}>
            <div className={classes.rootEvapo}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Tabs classes={{ root: classes.root }} value={value} className={(value === 0 && classes.tabsDisease) || classes.tabsPest}
                        TabIndicatorProps={{
                            style: { display: "none" }
                        }}
                        onChange={handleChange}
                        aria-label="Disorders"
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="inherit"
                        centered>

                        <Tab
                            classes={{
                                wrapper: classes.iconLabelWrapper,
                                root: classes.root
                            }}
                            label={t('notebook.pests_DiseasesTab')}
                            icon={<DiseaseIcon style={{ marginRight: "5px" }} width={"30px"} />}
                            {...a11yProps(0)}
                        />

                        <Tab
                            classes={{
                                wrapper: classes.iconLabelWrapper,
                                root: classes.root
                            }}
                            label={t('notebook.pests_InsectsTab')}
                            icon={<PestIcon style={{ marginRight: "5px" }} width={"24px"} />}
                            {...a11yProps(1)}
                        />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <NotebookDiseasePage />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Grid>
                        <NotebookPestPage />
                    </Grid>
                </TabPanel>
            </div>
        </Grid>
    )

})