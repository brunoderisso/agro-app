import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccessTime from '@material-ui/icons/AccessTime';
import BarChart from '@material-ui/icons/BarChart';
import Home from '@material-ui/icons/Home';
import AppBar from '@material-ui/core/AppBar';
import PredizaNoteFilter from './PredizaNoteFilterPicker';
import EventNote from "@material-ui/icons/EventNote";
import { withStyles } from "@material-ui/core/styles";

// CSS of Calendar
import 'react-datepicker/dist/react-datepicker.css';
import { AnalitycsEvent } from '../LocalConfig';


const styles = theme => ({
  grow: {
    flexGrow: 1,
  },
  grid: {
    padding: 10,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    margin: 0,
    padding: '10px',
    left: 0,
    rigth: 0,
  },
  xs: {
    [theme.breakpoints.between('xs', 'md')]: {
      display: 'none'
    },
  },
  md: {
    [theme.breakpoints.between('md', 'xl')]: {
      display: 'none'
    },
  }
});

class PredizaNoteFooter extends React.Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      value: this.props.tab,
      showDrawer: false
    };
  };

  toggleDrawer = (show) => () => {
    AnalitycsEvent('navigation', '/click/filters');

    this.setState({
      showDrawer: show
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Tabs
            value={this.state.value}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            centered
          >

            <Tab icon={<Home />} className={classes.md} component={Link} to="/note" />
            <Tab icon={<EventNote />} className={classes.md} component={Link} to="/mangement" />
            <Tab icon={<BarChart />} className={classes.md} component={Link} to="/note" />
            <Tab icon={<AccessTime />} className={classes.md} onClick={this.toggleDrawer(true)} />
            <Tab icon={<Home />} label="Propriedade" className={classes.xs} component={Link} to="/note" />
            <Tab icon={<EventNote />} label="Manejo" className={classes.xs} component={Link} to="/mangement" />
            <Tab icon={<BarChart />} label="Relatórios" className={classes.xs} component={Link} to="/note" />
            <Tab icon={<AccessTime />} label="Filtros" className={classes.xs} onClick={this.toggleDrawer(true)} />
          </Tabs>
        </AppBar>
        <PredizaNoteFilter open={this.state.showDrawer} onClose={this.toggleDrawer(false)} />
      </div>
    );
  }
}

PredizaNoteFooter.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PredizaNoteFooter);