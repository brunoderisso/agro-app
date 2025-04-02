import React, { Component } from 'react';

// Material UI
import { withStyles } from "@material-ui/core/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HomeIcon from "@material-ui/icons/Home";
import SettingsIcon from '@material-ui/icons/Settings';

//Prediza
import EnvironmentDrawer from "../../components/Filter/EnvironmentDrawer"
import toolsUtils from "../../utils/toolsUtils"
import SessionStore from "../../stores/SessionStore"
import theme from "../../theme"
import history from "../../history"

//Others
import moment from "moment";


const drawerWidth = 60;
const styles = () => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowY: "auto",
    overflowX: "hidden",
    height: "100%"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  warning: {
    fontSize: 24,
    color: "#ffa700",
  },
});

class NoteVerticalBar extends Component {
  constructor(props) {
    super(props);

    this.props = props;

    this.state = {
      ...SessionStore.verticalBar,
      diff: 0
    };
    this.selected = null

  }

  //Component default methods
  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
    SessionStore.on("time.change", this.setDiff);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  };
  //Event methods


  //Component methods
  redirect = () => {
    history.push("/note/" + SessionStore.getEnvironment() + "/environment");
  }

  toggleDrawer = (e) => {
    if (e !== null && e !== undefined && typeof e.persist === "function") {
      e.persist();
    }
    let open = this.state;
    //Abrir o drawer

    if (!toolsUtils.isNullOrEmpty(e.target, "dataset.drawer") && !toolsUtils.isEmptyString(e.target.dataset.drawer)) {
      Object.keys(open).forEach((key) => {
        if (key !== e.target.dataset.drawer) {
          open[key] = false;
        }
      })
      open[e.target.dataset.drawer] = !this.state[e.target.dataset.drawer]
      if (toolsUtils.isNullOrEmpty(this.state, e.target.dataset.drawer)) {
        open[e.target.dataset.drawer] = true;
      }
      this.selected = e.target.dataset.drawer
      this.setState(open)
      SessionStore.setVerticalBar(e.target.dataset.drawer, open[e.target.dataset.drawer]);
      return
    }

    if (typeof e === "object" && !toolsUtils.isNullOrEmpty(e.target, "parentElement.dataset.drawer") && !toolsUtils.isEmptyString(e.target.parentElement.dataset.drawer)) {
      Object.keys(open).forEach((key) => {
        if (key !== e.target.parentElement.dataset.drawer) {
          open[key] = false;
        }
      })
      open[e.target.parentElement.dataset.drawer] = !this.state[e.target.parentElement.dataset.drawer]
      if (toolsUtils.isNullOrEmpty(this.state, e.target.parentElement.dataset.drawer)) {
        open[e.target.parentElement.dataset.drawer] = true;
      }
      this.selected = e.target.parentElement.dataset.drawer
      this.setState(open);
      SessionStore.setVerticalBar(e.target.parentElement.dataset.drawer, open[e.target.parentElement.dataset.drawer]);
      return
    }

    //Fechar o drawer
    if (!toolsUtils.isEmptyString(e) && typeof e === "string") {
      Object.keys(open).forEach((key) => {
        if (key !== e) {
          open[key] = false;
        }
      })
      this.selected = e
      open[e] = true;
      if (!toolsUtils.isNullOrEmpty(this.state, e)) {
        open[e] = !this.state[e]
      }
      this.setState(open);
      SessionStore.setVerticalBar(e, open[e]);
    }

  }

  _handleKeyDown = (event) => {

    if (event.keyCode === 27) {
      this.toggleDrawer(this.selected)
    }
  }

  onClickUpdate = () => {
    let diff = SessionStore.getTimeDiff() / 3600000
    SessionStore.setTime(diff)
  }

  setDiff = () => {
    this.setState({ diff: moment.duration(moment(new Date()).diff(moment(new Date(SessionStore.time.end)))).asMinutes() })
  }

  //Store methods

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <List>
            <Grid container alignItems="center">
              <Grid item xs={12} data-drawer="environment">
                <ListItem button onClick={this.toggleDrawer} data-drawer="environment">
                  <ListItemIcon data-drawer="environment">
                    <HomeIcon data-drawer="environment" />
                  </ListItemIcon>
                </ListItem>
              </Grid>
              <Grid item xs={12}>
                <ListItem button onClick={this.redirect}>
                  <ListItemIcon>
                    <SettingsIcon/>
                  </ListItemIcon>
                </ListItem>
              </Grid>
            </Grid>
          </List>
        </Drawer>
        {this.state.environment && <EnvironmentDrawer open={this.state.environment} name="environment" onClose={() => { this.toggleDrawer("environment") }} />}
      </Grid>
    );
  }

}

export default withStyles(styles)(NoteVerticalBar);