import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button, Grid, IconButton, Menu, MenuItem, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Skeleton } from "@material-ui/lab";

import styles from "../../../styles/ViewComponents/AlertDrawer";
import PredizaScrollBar from "../../Common/PredizaScrollBar";
import tokens from "../../../stores/CancelTokenList";
import AlertStore from "../../../stores/AlertStore";
import stringsUtils from "../../../utils/stringsUtils";


const statusColor = [
  { color: "#76BE26", label: "common.ok" },
  { color: "#FFB900", label: "common.alertText" },
  { color: "#E81218", label: "common.critical" },
  { color: "#C5C6D0", label: "common.noData" }
];

function AlertsList(props) {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [alerts, setAlerts] = useState([]);
  const [alertsLoad, setAlertsLoad] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const [disable, setDisable] = useState(false);

  useEffect(() => {
    setAlerts(props.alerts);
    setAlertsLoad(props.load);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const ColorStatusComponent = (props) => {
    return (
      <Grid className={classes.status} style={{ backgroundColor: props.color }}></Grid>
    )
  }

  const getColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "#E81218"
      case "WARNING":
        return "#FFB900"
      case "OK":
        return "#76BE26"
      default:
        return "#C5C6D0"
    }
  }

  const onChangeEnable = (event, objectid) => {
    const checked = event.target.checked;

    setDisable(true);
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    AlertStore.updateAlert(cancelToken, { objectid, enable: checked }, responseChangeEnable);
  }

  const responseChangeEnable = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      let alert = response.data;
      let a = [...alerts];
      let i = a.findIndex((item) => { return item.objectid === alert.objectid });
      if (i >= 0) {
        a[i] = alert;
      }
      setAlerts(a);
    }

    setDisable(false);
  }

  const onClickMenu = (event, alert) => {
    setMenuId(alert.objectid);
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const onClickRemove = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    AlertStore.removeAlert(cancelToken, menuId, responseRemove);
  }

  const onClickEdit = () => {
    props.onClickEdit(menuId);
  }

  const responseRemove = (response) => {
    tokenList.remove(response.id);
    if (response.data) {
      AlertStore.emit("alerts_change");
      handleClose();
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <IconButton
              onClick={props.onClose}
              className={classes.textColor}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
          <Grid item>
            <Typography variant="h5" className={classes.title}>
              {stringsUtils.toCapitalize(t("common.alerts"))}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          className={classes.buttonColor}
          variant="outlined"
          fullWidth
          size="small"
          startIcon={<AddIcon />}
          onClick={props.onClickNew}
        >
          {t("alertPage.createAlert")}
        </Button>
      </Grid>
      <PredizaScrollBar customHeight={"400px"}>
        <Grid item xs={12} >
          <TableContainer style={{ overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left"><Typography variant="subtitle2" className={classes.textColor}>{t("common.name")}</Typography> </TableCell>
                  <TableCell align="left"><Typography variant="subtitle2" className={classes.textColor}>{t("common.active")}</Typography> </TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alertsLoad &&
                  <TableRow>
                    <TableCell align="center">
                      <Skeleton variant="rect" width={16} height={16} />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="text" width={90} />
                    </TableCell>
                    <TableCell align="left">
                      <Skeleton variant="rect" width={32} height={16} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rect" width={16} height={24} />
                    </TableCell>
                  </TableRow>
                }
                {alerts.map((alert) => {
                  return (
                    <TableRow>
                      <TableCell align="center">
                        <ColorStatusComponent color={getColor(alert.status)} />
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body2" className={classes.textColor}>
                          {alert.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Switch
                          classes={{
                            root: classes.root,
                            switchBase: classes.switchBase,
                            checked: classes.checked,
                            track: classes.track,
                          }}
                          disable={disable}
                          onChange={(e) => { onChangeEnable(e, alert.objectid) }}
                          name="active"
                          checked={alert.enable}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => { onClickMenu(e, alert) }} className={classes.textColor} size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={onClickEdit}>
            <Typography className={classes.menuButton} variant="caption">
              {t("common.editButton")}
            </Typography>
          </MenuItem>
          <MenuItem onClick={onClickRemove}>
            <Typography className={classes.removeButton} variant="caption">
              {t("common.remove")}
            </Typography>
          </MenuItem>
        </Menu>
      </PredizaScrollBar>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className={classes.label}>
              {t("common.statusText").toUpperCase()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent="space-between">
              {statusColor.map((color, index) => {
                return (
                  <Grid item key={index}>
                    <Grid container alignItems="center">
                      <Grid item style={{ marginRight: "4px" }}>
                        <ColorStatusComponent color={color.color} />
                      </Grid>
                      <Grid item>
                        <Typography variant="caption">
                          {t(color.label)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  )
}

export default AlertsList;