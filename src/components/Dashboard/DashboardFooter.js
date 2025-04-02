import React, { useState } from 'react';
import { Link } from "react-router-dom";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BarChart from '@material-ui/icons/BarChart';
import Dashboard from '@material-ui/icons/Dashboard';
import Notes from '@material-ui/icons/Notes';
import Map from '@material-ui/icons/Map';
import AppBar from '@material-ui/core/AppBar';
import useStyles from '../../styles/Dashboard/DashboardFooter'

import PredizaFilter from '../PredizaFilter';
import { useTranslation } from 'react-i18next';
import { AnalitycsEvent } from '../../LocalConfig';


function DashboardFooter(props) {
  const classes = useStyles();

  const [showDrawer, setShowDrawer] = useState(false);

  const { t } = useTranslation();

  const toggleDrawer = (show) => () => {
    AnalitycsEvent('navigation', 'click/filters');

    setShowDrawer(show);
  };

  return (
    <div>
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Tabs
          value={props.tab}
          variant="fullWidth"
          textColor="primary"
          centered
        >
          <Tab icon={<Dashboard />} className={classes.md} component={Link} to="/dashboard" />
          <Tab icon={<Map />} className={classes.md} component={Link} to="/map" />
          <Tab icon={<BarChart />} className={classes.md} component={Link} to="/chart" />
          <Tab icon={<Notes />} className={classes.md} component={Link} to="/stats" />
          <Tab icon={<Dashboard />} label="Dashboard" className={props.tab === 0 ? classes.selectedxs : classes.xs} component={Link} to="/dashboard" />
          <Tab icon={<Map />} label={t('common.map')} className={props.tab === 1 ? classes.selectedxs : classes.xs} component={Link} to="/map" />
          <Tab icon={<BarChart />} label={t('common.charts')} className={props.tab === 2 ? classes.selectedxs : classes.xs} component={Link} to="/chart" />
          <Tab icon={<Notes />} label={t('common.statistics')} className={props.tab === 3 ? classes.selectedxs : classes.xs} component={Link} to="/stats" />
        </Tabs>
      </AppBar>
      <PredizaFilter open={showDrawer} onClose={toggleDrawer(false)} />
    </div>
  );
}

export default DashboardFooter;