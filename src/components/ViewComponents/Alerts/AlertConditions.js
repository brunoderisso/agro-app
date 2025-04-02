import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";

import styles from "../../../styles/ViewComponents/AlertConditions";
import { Button, Grid, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ConditionFormComponent from "./ConditionForm";
import MoreVertIcon from '@material-ui/icons/MoreVert';

import tokens from "../../../stores/CancelTokenList";

import { ReactComponent as WarningIcon } from "../../../img/WarningIcon.svg";
import { ReactComponent as CriticalIcon } from "../../../img/CriticalIcon.svg";
import AlertStore from "../../../stores/AlertStore";


const AlertConditions = (props) => {
  const classes = styles();
  const tokenList = new tokens();
  const { t } = useTranslation();

  const [addCondition, setAddCondition] = useState(false);
  const [conditions, setConditions] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [conditionId, setConditionId] = useState(null);
  // const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {
    setConditions(props.conditions || []);
  }, [props.conditions])

  useEffect(() => {
    if (props.onChange) {
      props.onChange(conditions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions])

  const onClickNewCondition = () => {
    setAddCondition(true);
  }

  const onAddCondition = (condition) => {
    if (props.alert && props.alert.objectid) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      if (condition.objectid) {
        AlertStore.updateAlertCondition(cancelToken, props.alert.objectid, condition, responseUpdateCondition);
      } else {
        AlertStore.addAlertCondition(cancelToken, props.alert.objectid, condition, responseAddCondition);
      }
    } else {
      setConditions((prev) => ([...prev, condition]));
      setAddCondition(false);
    }
  }

  const cancelCondition = () => {
    setAddCondition(false);
    const c = [...conditions];
    for (var i = 0; i < c.length; i++) {
      c[i] = { ...c[i], editable: false };
    }
    setConditions(c);
  }

  const responseAddCondition = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      setConditions((prev) => ([...prev, { objectid: response.data.objectid, ...response.condition }]));
      setAddCondition(false);
    }
  }

  const responseUpdateCondition = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      const c = [...conditions];
      c[conditionId] = {
        ...response.condition,
        editable: false
      };
      setConditions(c);
      setConditionId(null);
    }
  }

  const getSymbol = (value) => {
    const symbolMap = {
      '>': '>',
      '<': '<',
      '==': '=',
      '>=': '≥',
      '<=': '≤'
    };

    return symbolMap[value] || value;
  }

  const onClickMenu = (event, id) => {
    setConditionId(id);
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
    setConditionId(null);
  }

  const onClickRemove = () => {
    const c = [...conditions];

    if (props.alert && props.alert.objectid) {
      let cancelToken = {};
      cancelToken.id = tokenList.add();
      cancelToken.token = tokenList.get(cancelToken.id);

      AlertStore.removeAlertCondition(cancelToken, props.alert.objectid, c[conditionId].objectid, responseRemoveCondition);
    } else {
      c.splice(conditionId, 1);
      setConditions(c);
      handleClose();
    }
  }

  const responseRemoveCondition = (response) => {
    tokenList.remove(response.id);
    if (response.data) {
      const c = [...conditions];
      c.splice(conditionId, 1);
      setConditions(c);
      handleClose();
    }
  }

  const onClickEdit = () => {
    const c = [...conditions];
    c[conditionId] = {
      ...c[conditionId],
      editable: true
    }
    setConditions(c);
    setAnchorEl(null);
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <TableContainer style={{ overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableCell}>
                  <Typography variant="subtitle2">{t("common.measure")}</Typography>
                </TableCell>
                <TableCell className={classes.tableCell}>
                </TableCell>
                <TableCell>
                  <WarningIcon />
                </TableCell>
                <TableCell>
                  <CriticalIcon />
                </TableCell>
                <TableCell className={classes.tableCell}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conditions.map((condition, i) => {
                return (
                  <>
                    <TableRow>
                      <TableCell className={classes.tableCell}>
                        <Typography variant="body2">
                          {t("measures." + condition.measure)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {getSymbol(condition.condition)}
                      </TableCell>
                      <TableCell align="center">
                        {condition.warning}
                      </TableCell>
                      <TableCell align="center">
                        {condition.critical}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <IconButton size="small" onClick={(e) => { onClickMenu(e, i) }}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {condition.editable &&
                      <Grid style={{ width: "150%" }}>
                        <ConditionFormComponent condition={condition} cancelCondition={cancelCondition} onAddCondition={onAddCondition} />
                      </Grid>
                    }
                  </>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
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
      </Grid>
      {addCondition &&
        <ConditionFormComponent cancelCondition={cancelCondition} onAddCondition={onAddCondition} />
      }
      <Grid item xs={12}>
        <Button
          className={classes.buttonColor}
          size="small"
          onClick={onClickNewCondition}
          startIcon={<AddIcon />}
        >
          {t("alertPage.addCondition")}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AlertConditions
