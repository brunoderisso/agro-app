import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Grid } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import MapIcon from '@material-ui/icons/Map';
import useStyles from "../../styles/Dashboardv2/DashboardDrawer";
import { useTranslation } from "react-i18next";
function DashboardDrawer(props) {
  const [open, setOpen] = useState(true);
  const [edit, setEdit] = useState(false);
  const classes = useStyles({ open }); // Passando o estado 'open' como prop para os estilos

  const { t } = useTranslation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onClickItem = (name) => {
    if (name === "edit") {
      setEdit(!edit);
    }
    props.onClickItem(name)
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent" // A drawer sempre estará visível
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <IconButton onClick={toggleDrawer} className={classes.toggleButton}>
        <MenuIcon />
      </IconButton>
      <List style={{ height: "100%" }}>
        <Grid container style={{ height: "100%" }}>
          <Grid item xs={12}>
            <ListItem button name="dashboard" className={classes.itens} onClick={() => { onClickItem('dashboard') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={t("dashboard.panel")} className={classes.listItemText} />
            </ListItem>
            <ListItem button className={classes.itens} onClick={() => { onClickItem('graphics') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.charts")} className={classes.listItemText} />
            </ListItem>
            <ListItem button className={classes.itens} onClick={() => { onClickItem('stats') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.statistics")} className={classes.listItemText} />
            </ListItem>
            <ListItem button className={classes.itens} onClick={() => { onClickItem('map') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t("common.map")} className={classes.listItemText} />
            </ListItem>
          </Grid>
          <Grid item xs={12} alignContent="flex-end">
            <ListItem button className={classes.itens} onClick={() => { onClickItem('edit') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary={edit ? t("common.saveButton") : t("common.editButton")} className={classes.listItemText} />
            </ListItem>
            <ListItem button className={classes.itens} onClick={() => { onClickItem('advanced') }}>
              <ListItemIcon className={classes.listItemIcon}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t("services.advanced")} className={classes.listItemText} />
            </ListItem>
          </Grid>
        </Grid>
      </List>
    </Drawer>
  );
}

export default DashboardDrawer;
