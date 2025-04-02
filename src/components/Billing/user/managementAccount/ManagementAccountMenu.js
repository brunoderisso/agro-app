import React, { useEffect, useState } from 'react';

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { Typography, Tabs, Tab } from '@material-ui/core';

import styles from '../../../../styles/Billing/user/managementAccount/ManagementAccountMenu'
import { useTranslation } from 'react-i18next';


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function ManagementAccountMenu(props) {
    const { classes } = props;

    const { t } = useTranslation();

    const [value, setValue] = useState(0);

    useEffect(() => {
        if (props.page) {
            setValue(props.page);
        }
    }, [props.page])

    const handleChange = (_, newValue) => {
        props.onChange(newValue);
        setValue(newValue);
    };

    return (
        <div className={classes.leftMenu}>
            <Typography className={classes.label}>{t("management.accountManagement")}</Typography>
            <Tabs
                orientation='vertical'
                value={value}
                onChange={handleChange}
                aria-label='Vertical tabs account'
                classes={{ indicator: classes.indicatorSelectedTab }}
            >
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("management.myPlan_title")} {...a11yProps(0)} />
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("management.myProperties_title")} {...a11yProps(1)} />
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("common.billingTitle")} {...a11yProps(2)} />
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("management.payment_title")} {...a11yProps(3)} />
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("management.myInvoices_title")} {...a11yProps(4)} />
                <Tab className={classes.tabMenu} classes={{ selected: classes.selectedTab }} label={t("management.coupons_title")} {...a11yProps(5)} />
            </Tabs>
        </div>
    );
}

ManagementAccountMenu.propTypes = {
    onChange: PropTypes.func,
    page: PropTypes.number
};

export default withStyles(styles)(ManagementAccountMenu);