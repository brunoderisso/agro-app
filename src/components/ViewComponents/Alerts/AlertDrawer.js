import React, { useState, useEffect } from "react";

import { Drawer } from "@material-ui/core";

import styles from "../../../styles/ViewComponents/AlertDrawer";
import tokens from "../../../stores/CancelTokenList";
import AlertStore from "../../../stores/AlertStore";
import AlertsList from "./AlertsList";
import AlertForm from "./AlertForm";


function AlertDrawer(props) {
  const classes = styles();
  const tokenList = new tokens();

  const [page, setPage] = useState(1);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoad, setAlertsLoad] = useState(false);
  const [open, setOpen] = useState(false);

  const [objectid, setObjectid] = useState(null);

  useEffect(() => {
    const bind = () => {
      AlertStore.addListener("alerts_change", getAlerts);
    }
    const clear = () => {
      AlertStore.removeListener("alerts_change", getAlerts);
    }
    bind();

    return clear;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (objectid) {
      setPage(2);
    }
  }, [objectid])

  useEffect(() => {
    setOpen(props.open);

    if (props.open) {
      getAlerts();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const getAlerts = () => {
    let cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);
    setAlertsLoad(true);
    setAlerts([]);
    AlertStore.getAlerts(cancelToken, responseGetAlerts);
  }

  const responseGetAlerts = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      setAlertsLoad(false);
      setAlerts(response.data);
    }
  }

  const onClickNew = () => {
    setPage(2);
  }

  const onClickBack = () => {
    getAlerts();
    setObjectid(null);
    setPage(1);
  }

  const onClose = () => {
    props.onClose();
  }

  const onClickEdit = (objectid) => {
    setObjectid(objectid);
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={open}
      onClose={props.onClose}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      {page === 1 &&
        <AlertsList alerts={alerts} load={alertsLoad} onClickEdit={onClickEdit} onClickNew={onClickNew} onClose={onClose} />
      }

      {page === 2 &&
        <AlertForm onClickBack={onClickBack} objectid={objectid} />
      }

    </Drawer>
  )
}

export default AlertDrawer;