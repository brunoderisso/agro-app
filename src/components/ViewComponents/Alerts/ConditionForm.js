import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";

import { FormControl, Grid, IconButton, MenuItem, TextField } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import styles from "../../../styles/ViewComponents/AlertConditions";
import measureStore from "../../../stores/MeasureStore";
import toolsUtils from "../../../utils/toolsUtils";


const functions = [
  { name: "MEDIAN", label: "common.median" },
  { name: "MEAN", label: "common.mean" },
  { name: "SUM", label: "common.sum" },
  { name: "MIN", label: "common.minimum" },
  { name: "MAX", label: "common.maximum" },
  { name: "COUNT", label: "common.count" },
  { name: "FIRST", label: "common.first" },
  { name: "LAST", label: "common.last" }
];

const operations = [
  { label: "common.greater", value: ">" },
  { label: "common.lesser", value: "<" },
  { label: "common.equal", value: "==" },
  { label: "common.greaterOrEqual", value: ">=" },
  { label: "common.lesserOrEqual", value: "<=" }
];

const ConditionFormComponent = (props) => {
  const classes = styles();
  const { t } = useTranslation();

  const [condition, setCondition] = useState({ measure: "", function: "", operation: "" });
  const [measures, setMeasures] = useState([]);

  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setMeasures(measureStore.getMeasures());
  }, [])

  useEffect(() => {
    setCondition(props.condition || { measure: "", function: "", operation: "" });
  }, [props])

  useEffect(() => {
    setError(false);
  }, [condition]);

  const handleChangeMeasure = (e) => {
    setCondition((prev) => ({ ...prev, measure: e.target.value }));
  }

  const handleChangeCondition = (e) => {
    setCondition((prev) => ({ ...prev, condition: e.target.value }));
  }

  const handleChangeFunction = (e) => {
    setCondition((prev) => ({ ...prev, function: e.target.value }));
  }

  const onChange = (e) => {
    setCondition(
      {
        ...condition,
        [e.target.name]: parseFloat(e.target.value)
      }
    );
  }

  const onClickConfirm = () => {
    if (toolsUtils.isNullOrEmpty(condition, "condition")
      || toolsUtils.isNullOrEmpty(condition, "measure")
      || toolsUtils.isNullOrEmpty(condition, "function")
      || toolsUtils.isNullOrEmpty(condition, "critical")
      || toolsUtils.isNullOrEmpty(condition, "warning")) {
      setError(true);
      return
    }
    props.onAddCondition(condition);
    setDisabled(true);
  }

  const onClickCancel = () => {
    props.cancelCondition();
  }

  return (
    <Grid container>
      <FormControl fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t("common.measure")}
              error={error}
              disabled={disabled}
              select
              classes={{ root: classes.textFieldRoot }}
              SelectProps={{
                classes: {
                  select: classes.selectRoot,
                  icon: condition.measure ? classes.iconFocused : classes.icon, // Muda a cor do ícone
                },
                IconComponent: ExpandMoreIcon, // Ícone customizado
              }}
              value={condition.measure || ""}
              onChange={handleChangeMeasure}>
              {measures.map((measure) => {
                return (
                  <MenuItem key={measure.name} value={measure.name}>
                    {measure ? t("measures." + measure.name) : ""}
                  </MenuItem>
                )
              })}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t("common.function")}
              error={error}
              disabled={disabled}
              select
              classes={{ root: classes.textFieldRoot }}
              SelectProps={{
                classes: {
                  select: classes.selectRoot,
                  icon: condition.function ? classes.iconFocused : classes.icon, // Muda a cor do ícone
                },
                IconComponent: ExpandMoreIcon, // Ícone customizado
              }}
              value={condition.function || ""}
              onChange={handleChangeFunction}>
              {functions.map((func) => {
                return (
                  <MenuItem key={func.name} value={func.name}>
                    {t(func.label)}
                  </MenuItem>
                )
              })}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              error={error}
              disabled={disabled}
              label={t("common.operation")}
              classes={{ root: classes.textFieldRoot }}
              SelectProps={{
                classes: {
                  select: classes.selectRoot,
                  icon: condition.condition ? classes.iconFocused : classes.icon, // Muda a cor do ícone
                },
                IconComponent: ExpandMoreIcon, // Ícone customizado
              }}
              select
              value={condition.condition || ""}
              onChange={handleChangeCondition}>
              {operations.map((op) => {
                return (
                  <MenuItem key={op.value} value={op.value}>
                    {t(op.label)}
                  </MenuItem>
                )
              })}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={error}
              disabled={disabled}
              classes={{ root: classes.textFieldRoot }}
              id="standard-multiline-flexible"
              label={t("common.alertText")}
              name="warning"
              type="number"
              value={condition.warning}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={error}
              disabled={disabled}
              classes={{ root: classes.textFieldRoot }}
              name={"critical"}
              label={t("common.critical")}
              type="number"
              value={condition.critical}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <IconButton
                  onClick={onClickCancel}
                  disabled={disabled}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  className={classes.confirmButton}
                  size="small"
                  disabled={disabled}
                  onClick={onClickConfirm}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </FormControl>
    </Grid>
  )
}

export default ConditionFormComponent;