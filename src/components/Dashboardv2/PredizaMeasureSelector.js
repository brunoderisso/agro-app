import React, { useState, useEffect } from "react";
import useStyles from "../../styles/Dashboardv2/MeasureSelector";
import { FormControlLabel, Grid, MenuItem, Typography } from "@material-ui/core";
import PredizaScrollbar from "../Common/PredizaScrollBar";
import CustomCheckBox from "../Common/CustomCheckBox";
import AdvancedConfigurationStore from "../../stores/AdvancedConfigurationStore";
import theme from "../../styles/Utils/theme";
import { useTranslation } from "react-i18next";

function MeasureSelector(props) {
  const [measures] = useState(AdvancedConfigurationStore.measuresList);
  const [allChecked, setAllChecked] = useState(true);
  const [checkboxes, setCheckboxes] = useState({});
  const classes = useStyles();

  const { t } = useTranslation()

  useEffect(() => {
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Inicializar checkboxes somente se ainda não estiverem configurados
    if (measures.length > 0 && Object.keys(checkboxes).length === 0) {
      let checks = {};
      measures.forEach(m => {
        checks[m.name] = true;
      });
      setCheckboxes(checks);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measures]);

  useEffect(() => {
    if (checkboxes) {
      setAllChecked(Object.values(checkboxes).every((item) => item));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkboxes]);

  const handleChangeCheckBox = (event) => {
    AdvancedConfigurationStore.checkMeasure(event.target.name);
    setCheckboxes({ ...checkboxes, [event.target.name]: event.target.checked });
  };

  const handleChangeAll = (e) => {
    setAllChecked(e.target.checked);
    AdvancedConfigurationStore.checkMeasure("all");
    if (e.target.checked) {
      const newCheckboxes = { ...checkboxes };

      Object.keys(newCheckboxes).forEach((measure) => {
        newCheckboxes[measure] = true;
      });

      setCheckboxes(newCheckboxes);
    } else {
      clearAllCheckboxes();
    }
  }

  const clearAllCheckboxes = () => {
    if (checkboxes) {
      const newCheckboxes = Object.keys(checkboxes).reduce((acc, measure) => {
        acc[measure] = false;
        return acc;
      }, {});

      setCheckboxes(newCheckboxes);
    }
  };

  

  return (
    <Grid container className={classes.container}>
      <PredizaScrollbar customHeight={"144px"}>
        {checkboxes && (
          <Grid container>
            <Grid item xs={6} key={"all-0"}>
              <Grid container>
                <MenuItem value={"all"}>
                  <FormControlLabel
                    label={<Typography variant="caption">{t("common.allText")}</Typography>}
                    control={
                      <CustomCheckBox
                        color={theme.colors.primary[40]}
                        className={classes.containerFilterCheckBox}
                        checked={allChecked || false}
                        onChange={handleChangeAll}
                        name={"all"}
                      />
                    }
                  />
                </MenuItem>
              </Grid>
            </Grid>
            {measures.map((measure, index) => (
              <Grid item xs={6} key={index}>
                <Grid container>
                  <MenuItem value={measure.name}>
                    <FormControlLabel
                      label={<Typography variant="caption">{t("measures." + measure.name)}</Typography>}
                      control={
                        <CustomCheckBox
                          color={theme.colors.primary[40]}
                          className={classes.containerFilterCheckBox}
                          checked={checkboxes[measure.name] || false}
                          onChange={handleChangeCheckBox}
                          name={measure.name}
                        />
                      }
                    />
                  </MenuItem>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}
      </PredizaScrollbar>
    </Grid>
  );
}

export default MeasureSelector;
