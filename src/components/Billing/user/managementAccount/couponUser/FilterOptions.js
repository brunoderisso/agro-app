import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";

import moment from "moment";
import clsx from "clsx";

import {
  Grid,
  OutlinedInput,
  InputAdornment,
  FormControl,
  Button,
  Typography,
  Menu,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import useStyles from "../../../../../styles/Billing/user/managementAccount/couponUser/FilterOptions";
import { ReactComponent as FilterIcon } from "../../../../../img/FilterIcon.svg";
import { ReactComponent as SearchIcon } from "../../../../../img/SearchIcon.svg";
import CloseIcon from "@material-ui/icons/Close";
import BillingStore from "../../../../../stores/BillingStore";
import stringsUtils from "../../../../../utils/stringsUtils";
import CustomRadio from "../../../../Common/CustomRadio";
import CustomCheckBox from "../../../../Common/CustomCheckBox";
import { useTranslation } from "react-i18next";
import theme from "../../../../../styles/Utils/theme";

const delayFilter = 500;

function FilterOptions() {
  const classes = useStyles();

  const [codeCoupon, setCodeCoupon] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [filtersSelected, setFiltersSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [valueRecurrentFilter, setValueRecurrentFilter] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [optionCheckBox, setOptionCheckBox] = useState({
    currentMonth: false,
    lastMonth: false,
    currentYear: false,
    pastYears: false,
  });

  const { currentMonth, lastMonth, currentYear, pastYears } = optionCheckBox;
  const dateMask = "99/99/9999";

  const { t } = useTranslation();

  useEffect(() => {
    const updateTable = () => {
      setDisabled(true);

      setTimeout(() => {
        setDisabled(false);

        if (codeCoupon.length > 0) {
          const newFilter = { código: codeCoupon, isRange: false };

          checkToUpdateLabel([...filtersSelected], newFilter);
        }

        if (minDiscount.length > 0 && maxDiscount.length === 0) {
          const newFilter = { desconto: minDiscount, isRange: false };

          checkToUpdateLabel([...filtersSelected], newFilter);
        } else if (maxDiscount.length > 0 && minDiscount.length === 0) {
          const newFilter = { desconto: maxDiscount, isRange: false };

          checkToUpdateLabel([...filtersSelected], newFilter);
        } else if (minDiscount.length > 0 && maxDiscount.length > 0) {
          const newFilter = {
            desconto: `${minDiscount} ${t('common.to')} ${maxDiscount}`,
            isRange: true,
          };

          checkToUpdateLabel([...filtersSelected], newFilter);
        }
      }, delayFilter);
    };

    const timerId = setTimeout(() => {
      updateTable();
    }, delayFilter);

    // Usa o return do useEffect pra limpar o delay anterior
    // e fazer tudo denovo caso o usuário mude o filtro antes do tempo do delay
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeCoupon, minDiscount, maxDiscount]);

  useEffect(() => {
    if (valueRecurrentFilter.length > 0) {
      const newFilter = { recorrente: valueRecurrentFilter, isRange: false };

      checkToUpdateLabel([...filtersSelected], newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueRecurrentFilter]);

  useEffect(() => {
    if (
      startDate.replaceAll("_", "").length === 10 &&
      endDate.replaceAll("_", "").length < 10
    ) {
      const newFilter = { "data de aplicação": startDate, isRange: false };

      checkToUpdateLabel([...filtersSelected], newFilter);
    } else if (
      endDate.replaceAll("_", "").length === 10 &&
      startDate.replaceAll("_", "").length < 10
    ) {
      const newFilter = { "data de aplicação": endDate, isRange: false };

      checkToUpdateLabel([...filtersSelected], newFilter);
    } else if (
      endDate.replaceAll("_", "").length === 10 &&
      startDate.replaceAll("_", "").length === 10
    ) {
      const newFilter = {
        "data de aplicação": `${startDate} ${t('common.at')} ${endDate}`,
        isRange: true,
      };

      checkToUpdateLabel([...filtersSelected], newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  useEffect(() => {
    BillingStore.emit("coupons.filter", filtersSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersSelected]);

  useEffect(() => {
    const initMonth = "01/" + moment().format("MM/YYYY");
    const today = moment().format("DD/MM/YYYY");
    const newFilter = {
      "data de aplicação": `${initMonth} ${t('common.at')} ${today}`,
      isRange: true,
      isCheckbox: true,
      check: 1,
    };

    if (currentMonth) {
      checkToUpdateLabel([...filtersSelected], newFilter);
      setStartDate("");
      setEndDate("");
    } else if (!currentMonth && filtersSelected.length > 0) {
      removeLabelFilter(newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  useEffect(() => {
    let lastDayOfMonth = "01/" + moment().format("MM/YYYY");
    lastDayOfMonth = moment(lastDayOfMonth, "DD MM YYYY")
      .subtract(1, "day")
      .format("DD");

    const initLastMonth =
      "01/" + moment().subtract(1, "month").format("MM/YYYY");
    const endMonth =
      lastDayOfMonth + moment().subtract(1, "month").format("/MM/YYYY");
    const newFilter = {
      "data de aplicação": `${initLastMonth} ${t('common.to')} ${endMonth}`,
      isRange: true,
      isCheckbox: true,
      check: 2,
    };

    if (lastMonth) {
      checkToUpdateLabel([...filtersSelected], newFilter);
      setStartDate("");
      setEndDate("");
    } else if (!lastMonth && filtersSelected.length > 0) {
      removeLabelFilter(newFilter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMonth]);

  useEffect(() => {
    const initYear = "01/01/" + moment().format("YYYY");
    const endYear = "31/12/" + moment().format("YYYY");
    const newFilter = {
      "data de aplicação": `${initYear} ${t('common.to')} ${endYear}`,
      isRange: true,
      isCheckbox: true,
      check: 3,
    };

    if (currentYear) {
      checkToUpdateLabel([...filtersSelected], newFilter);
      setStartDate("");
      setEndDate("");
    } else if (!currentYear && filtersSelected.length > 0) {
      removeLabelFilter(newFilter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentYear]);

  useEffect(() => {
    const newFilter = {
      "data de aplicação": "anos passados",
      isLessThan: true,
      isCheckbox: true,
      check: 4,
    };

    if (pastYears) {
      checkToUpdateLabel([...filtersSelected], newFilter);
      setStartDate("");
      setEndDate("");
    } else if (!currentYear && filtersSelected.length > 0) {
      removeLabelFilter(newFilter);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastYears]);

  const removeLabelFilter = (filterToRemove) => {
    const totalFilters = [...filtersSelected];
    const indexCurrentMonth = totalFilters.findIndex(
      (filter) => Object.values(filter)[0] === Object.values(filterToRemove)[0]
    );

    totalFilters.splice(indexCurrentMonth, 1);
    setFiltersSelected(totalFilters);
  };

  const handleChangeCoupon = (event) => {
    const code = event.target.value;

    if (code.length > 0) {
      setCodeCoupon(code);
    } else {
      cleanLabelFilter({ código: codeCoupon });
    }
  };

  const handleChangeCheckboxes = (event) => {
    setOptionCheckBox({
      ...optionCheckBox,
      [event.target.name]: event.target.checked,
    });
  };

  const handleChangeDiscount = (event) => {
    if (event.target.name === "maxDiscountInput") {
      setMaxDiscount(event.target.value);
    } else {
      setMinDiscount(event.target.value);
    }
  };

  const handleChangeDate = (event) => {
    if (event.target.name === "startDateInput") {
      setStartDate(event.target.value);
    } else {
      setEndDate(event.target.value);
    }
  };

  const checkToUpdateLabel = (filters, newFilter) => {
    let isReplaceFilter = false;
    const newFiltersSelected = filters;

    // Não deve substituir a label, a partir do segundo checkBox de data clicado
    if (
      !newFilter.isCheckbox ||
      (newFilter.isCheckbox &&
        newFiltersSelected.filter((filter) => filter.isCheckbox).length === 0)
    ) {
      // Caso a label seja repetida, substitui a antiga pela nova
      newFiltersSelected.forEach((filter, index) => {
        if (Object.keys(filter)[0] === Object.keys(newFilter)[0]) {
          newFiltersSelected.splice(index, 1, newFilter);
          isReplaceFilter = true;

          return;
        }
      });
    }

    if (!isReplaceFilter) {
      newFiltersSelected.push(newFilter);
    }

    setFiltersSelected(newFiltersSelected);
  };

  const cleanButtonFilter = (func, height) => {
    return (
      <Button
        color="primary"
        className={classes.btnClean}
        style={{ height: height || "auto" }}
        onClick={func}
      >
        <Typography
          className={clsx(classes.textBtnCommon, classes.textBtnClean)}
        >
          {t("common.clearButton")}
        </Typography>
      </Button>
    );
  };

  const cleanLabelFilter = (selectedFilter) => {
    let isCheckBoxFilter = false;

    if (Object.keys(selectedFilter)[0] === "código") {
      setCodeCoupon("");
    } else if (Object.keys(selectedFilter)[0] === "recorrente") {
      setValueRecurrentFilter("");
    } else if (Object.keys(selectedFilter)[0] === "data de aplicação") {
      if (!selectedFilter.isCheckbox) {
        setStartDate("");
        setEndDate("");
      } else if (selectedFilter.check) {
        isCheckBoxFilter = true;

        switch (selectedFilter.check) {
          case 1:
            setOptionCheckBox({
              currentMonth: false,
              lastMonth,
              currentYear,
              pastYears,
            });

            break;
          case 2:
            setOptionCheckBox({
              currentMonth,
              lastMonth: false,
              currentYear,
              pastYears,
            });

            break;
          case 3:
            setOptionCheckBox({
              currentMonth,
              lastMonth,
              currentYear: false,
              pastYears,
            });

            break;
          case 4:
            setOptionCheckBox({
              currentMonth,
              lastMonth,
              currentYear,
              pastYears: false,
            });

            break;
          default:
            break;
        }
      }
    } else if (Object.keys(selectedFilter)[0] === "desconto") {
      setMinDiscount("");
      setMaxDiscount("");
    }

    if (!isCheckBoxFilter) {
      setTimeout(() => {
        filtersSelected.forEach((filter, index) => {
          const filterKey = Object.keys(filter)[0];

          if (filterKey.includes(Object.keys(selectedFilter)[0])) {
            const newFiltersSelected = Array.from(filtersSelected);

            newFiltersSelected.splice(index, 1);
            setFiltersSelected(newFiltersSelected);

            return;
          }
        });
      }, delayFilter);
    }
  };

  const cleanAllTextFilter = () => {
    setFiltersSelected([]);
    setCodeCoupon("");
    setValueRecurrentFilter("");
    setMinDiscount("");
    setMaxDiscount("");
    setStartDate("");
    setEndDate("");
    setOptionCheckBox({
      currentMonth: false,
      lastMonth: false,
      currentYear: false,
      pastYears: false,
    });
  };

  const handleCloseSelectFilter = () => {
    setAnchorEl(null);
  };

  const handleClickSelectFilter = (event) => {
    setAnchorEl(event.currentTarget);
    setCurrentFilter(event.currentTarget.name);
  };

  const handleChangeRecurrentFilter = (event) => {
    setValueRecurrentFilter(event.target.value);
  };

  const handleClickRecurrentFilter = () => {
    handleCloseSelectFilter();
  };

  const recurrentFilterContent = () => {
    return (
      <RadioGroup
        aria-label="recurrent"
        name="recurrent"
        value={valueRecurrentFilter}
        onChange={handleChangeRecurrentFilter}
      >
        <FormControlLabel
          value="sim"
          control={
            <CustomRadio size="small" onClick={handleClickRecurrentFilter} color={theme.colors.onPrimaryContainer} />
          }
          label={
            <MenuItem
              onClick={handleClickRecurrentFilter}
              className={classes.itemLabelFilter}
            >
              <Typography className={classes.textInsideFilter}>{t('common.yesButton')}</Typography>
            </MenuItem>
          }
          className={classes.wrapperLabelSelectFilter}
        />
        <FormControlLabel
          value="não"
          control={
            <CustomRadio size="small" onClick={handleClickRecurrentFilter} color={theme.colors.onPrimaryContainer} />
          }
          label={
            <MenuItem
              onClick={handleClickRecurrentFilter}
              className={classes.itemLabelFilter}
            >
              <Typography className={classes.textInsideFilter}>{t('common.noButton')}</Typography>
            </MenuItem>
          }
          className={classes.wrapperLabelSelectFilter}
        />
      </RadioGroup>
    );
  };

  const discountFilterContent = () => {
    return (
      <Grid>
        <Typography className={classes.titleInsideFilter}>{t('common.interval').toUpperCase()}</Typography>
        <Grid className={classes.wrapperLabelInputFilter}>
          <FormControl fullWidth>
            <TextField
              name="minDiscountInput"
              InputLabelProps={{
                shrink: true,
              }}
              className={classes.inputs}
              value={minDiscount}
              onChange={handleChangeDiscount}
              label={t("common.minimumValue")}
              variant="outlined"
              size="small"
              type="number"
            />
          </FormControl>
        </Grid>
        <Grid className={classes.wrapperLabelInputFilter}>
          <FormControl fullWidth>
            <TextField
              name="maxDiscountInput"
              InputLabelProps={{
                shrink: true,
              }}
              className={classes.inputs}
              value={maxDiscount}
              onChange={handleChangeDiscount}
              label={t("common.maximumValue")}
              variant="outlined"
              size="small"
              type="number"
            />
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  const createdAtFilterContent = () => {
    return (
      <Grid>
        <Grid className={classes.wrapperLabelInputFilter}>
          <FormControl
            fullWidth
            className={clsx({
              [classes.inputPlaceholder]: startDate.length === 0,
            })}
          >
            <InputMask
              mask={dateMask}
              placeholder="DD/MM/AAAA"
              name="startDateInput"
              value={startDate}
              onChange={handleChangeDate}
              size="small"
              className={classes.inputs}
              disabled={currentMonth || lastMonth || currentYear || pastYears}
            >
              {(inputProps) => (
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label={t('common.start')}
                  variant="outlined"
                  {...inputProps}
                />
              )}
            </InputMask>
          </FormControl>
        </Grid>
        <Grid className={classes.wrapperLabelInputFilter}>
          <FormControl
            fullWidth
            className={clsx({
              [classes.inputPlaceholder]: endDate.length === 0,
            })}
          >
            <InputMask
              mask={dateMask}
              placeholder="DD/MM/AAAA"
              name="endDateInput"
              value={endDate}
              onChange={handleChangeDate}
              size="small"
              className={classes.inputs}
              disabled={currentMonth || lastMonth || currentYear || pastYears}
            >
              {(inputProps) => (
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label={t('common.end')}
                  variant="outlined"
                  {...inputProps}
                />
              )}
            </InputMask>
          </FormControl>
        </Grid>
        <Typography className={classes.titleInsideFilter}>{t("common.application")}</Typography>
        <Grid container className={classes.wrapperDateFilters}>
          <FormControlLabel
            control={
              <CustomCheckBox
                checked={currentMonth}
                onChange={handleChangeCheckboxes}
                name="currentMonth"
                color={theme.colors.onPrimaryContainer}
              />
            }
            label={
              <MenuItem className={classes.itemLabelFilter}>
                <Typography className={classes.textInsideFilter}>
                  {t("management.coupons_currentMonth")}
                </Typography>
              </MenuItem>
            }
            className={clsx(
              classes.wrapperLabelSelectFilter,
              classes.fullWidth
            )}
          />
          <FormControlLabel
            control={
              <CustomCheckBox
                checked={lastMonth}
                onChange={handleChangeCheckboxes}
                name="lastMonth"
                color={theme.colors.onPrimaryContainer}
              />
            }
            label={
              <MenuItem className={classes.itemLabelFilter}>
                <Typography className={classes.textInsideFilter}>
                  {t("management.coupons_lastMonth")}
                </Typography>
              </MenuItem>
            }
            className={clsx(
              classes.wrapperLabelSelectFilter,
              classes.fullWidth
            )}
          />
          <FormControlLabel
            control={
              <CustomCheckBox
                checked={currentYear}
                onChange={handleChangeCheckboxes}
                name="currentYear"
                color={theme.colors.onPrimaryContainer}
              />
            }
            label={
              <MenuItem className={classes.itemLabelFilter}>
                <Typography className={classes.textInsideFilter}>
                  {t("management.coupons_currentYear")}
                </Typography>
              </MenuItem>
            }
            className={clsx(
              classes.wrapperLabelSelectFilter,
              classes.fullWidth
            )}
          />
          <FormControlLabel
            control={
              <CustomCheckBox
                checked={pastYears}
                onChange={handleChangeCheckboxes}
                name="pastYears"
                color={theme.colors.onPrimaryContainer}
              />
            }
            label={
              <MenuItem className={classes.itemLabelFilter}>
                <Typography className={classes.textInsideFilter}>
                  {t("management.coupons_pastYears")}
                </Typography>
              </MenuItem>
            }
            className={clsx(
              classes.wrapperLabelSelectFilter,
              classes.fullWidth
            )}
          />
        </Grid>
      </Grid>
    );
  };

  const childrenFilter = () => {
    return (
      <Grid>
        {currentFilter === "btnRecurrent" && recurrentFilterContent()}
        {currentFilter === "btnDiscount" && discountFilterContent()}
        {currentFilter === "btnCreatedAt" && createdAtFilterContent()}
      </Grid>
    );
  };

  return (
    <Grid>
      <Grid className={classes.wrapperFilters}>
        <Grid
          className={clsx({
            [classes.iconFilledFilter]: filtersSelected.length > 0,
            [classes.iconEmptyFilter]: filtersSelected.length === 0,
          })}
        >
          <FilterIcon />
        </Grid>
        <FormControl
          variant="outlined"
          className={clsx(classes.inputs, {
            [classes.inputPlaceholder]: codeCoupon.length === 0,
            [classes.inputFocus]: codeCoupon.length > 0,
          })}
          size="small"
          style={{ width: 243 }}
        >
          <OutlinedInput
            id="code"
            value={codeCoupon}
            onChange={handleChangeCoupon}
            placeholder={t("management.coupons_searchCouponCode")}
            endAdornment={
              <InputAdornment position="end">
                {codeCoupon.length === 0 && <SearchIcon />}
                {codeCoupon.length > 0 &&
                  cleanButtonFilter(
                    () => cleanLabelFilter({ código: codeCoupon }),
                    24
                  )}
              </InputAdornment>
            }
            inputProps={{
              "aria-label": "coupon",
            }}
            labelWidth={0}
            disabled={disabled}
          />
        </FormControl>
        <Button
          name="btnDiscount"
          variant="outlined"
          color="primary"
          className={classes.filterBtn}
          onClick={handleClickSelectFilter}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <Typography
            className={clsx(classes.textBtnCommon, classes.filterTextBtn)}
          >
            {t("common.discount")}
          </Typography>
          <ExpandMoreIcon fontSize="small" />
        </Button>
        <Button
          name="btnCreatedAt"
          variant="outlined"
          color="primary"
          className={classes.filterBtn}
          onClick={handleClickSelectFilter}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <Typography
            className={clsx(classes.textBtnCommon, classes.filterTextBtn)}
          >
            {t("common.applicationDate")}
          </Typography>
          <ExpandMoreIcon fontSize="small" />
        </Button>
        <Button
          name="btnRecurrent"
          variant="outlined"
          color="primary"
          className={classes.filterBtn}
          onClick={handleClickSelectFilter}
          aria-controls="filter-menu"
          aria-haspopup="true"
        >
          <Typography
            className={clsx(classes.textBtnCommon, classes.filterTextBtn)}
          >
            {t("common.recurringTitle")}
          </Typography>
          <ExpandMoreIcon fontSize="small" />
        </Button>

        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          elevation={4}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseSelectFilter}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {childrenFilter()}
        </Menu>
      </Grid>
      {filtersSelected.length > 0 && (
        <Grid className={classes.wrapperLabelsFilter}>
          {filtersSelected.map((filter, index) => {
            return (
              <Grid key={index} className={classes.labelFilter}>
                <Typography className={classes.textLabelFilter}>
                  {`${stringsUtils.toCapitalize(Object.keys(filter)[0]) === "Recorrente" ?
                    t('common.recurringTitle')
                    :
                    stringsUtils.toCapitalize(Object.keys(filter)[0]) === "Data De Aplicação" ?
                      t('common.applicationDate')
                      :
                      stringsUtils.toCapitalize(Object.keys(filter)[0]) === "Desconto" ?
                        t('common.discount')
                        :
                        stringsUtils.toCapitalize(Object.keys(filter)[0])
                    }:`}
                </Typography>
                <Typography className={classes.boldTextLabelFilter}>
                  {Object.values(filter)[0] === "sim"
                    ? t('common.yesButton')
                    : Object.values(filter)[0] === "não"
                      ? t('common.noButton')
                      : Object.values(filter)[0] === "anos passados"
                        ? t('management.coupons_pastYears')
                        : Object.values(filter)[0]
                  }
                </Typography>
                <Button
                  className={classes.iconButton}
                  onClick={() => cleanLabelFilter(filter)}
                >
                  <CloseIcon fontSize="small" className={classes.iconProp} />
                </Button>
              </Grid>
            );
          })}
          {cleanButtonFilter(cleanAllTextFilter)}
        </Grid>
      )}
    </Grid>
  );
}

export default FilterOptions;
