import React, { useState, useEffect } from 'react';


import { withStyles } from "@material-ui/core/styles";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import { Grid, MuiThemeProvider, Typography } from '@material-ui/core';

import PropertyPage from './property/PropertyPage';
import styles from "../../styles/Billing/BillingPage";
import PlansPage from './plans/PlansPage';
import CustomerPage from './customer/CustomerPage';
import PaymentPage from './payment/PaymentPage';
import ResumePage from './cart/ResumePage';
import SuccessPage from './cart/SuccessPage';
import theme from '../../styles/Utils/theme';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function BillingPage(props) {

    const [index, setIndex] = useState("");
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(1);

    const steps = ["Login", t('subscription.selectPlan'), t('common.billingTitle'), t('common.propertyInformation'), t('subscription.reviewAndConfirm'), t('common.payment')];
    const messages = ["", t('subscription.choosePlan'), t('common.billingTitle'), t('common.propertyInformation'), t('subscription.reviewYourPurchase'), t('subscription.paymentInformation')];

    useEffect(() => {
        let page = props.id;
        setIndex(page);
        setStepper(page);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const { classes } = props;

    function PredizaStepIcon(props) {

        const { active, completed, icon } = props;

        return (
            <div
                className={clsx(classes.root, {
                    [classes.active]: active,
                })}
            >
                {completed ? <div className={classes.circle}><Check className={classes.completed} /></div> :
                    active ? <div className={classes.circle}><div className={classes.activeStep}>{activeStep + 1}</div></div> :
                        <div className={classes.circleInactive}><div className={classes.activeStep}>{icon}</div></div>
                }
            </div>
        )
    }

    const setStepper = (page) => {
        switch (page) {
            case "NaN":
                setActiveStep(1)
                break;
            case "customer":
                setActiveStep(2)
                break;
            case "property":
                setActiveStep(3)
                break;
            case "resume":
                setActiveStep(4)
                break;
            case "pay":
                setActiveStep(5)
                break;
            case "success":
                setActiveStep(6)
                break;

            default:
                break;
        }
    }
    return (
        <Grid container className={classes.primaryContainer}>
            <Grid item xs={12}>
                <MuiThemeProvider theme={theme}>
                    <Stepper activeStep={activeStep} className={classes.stepperBackground}>
                        {steps.map((label, index) => {

                            return (
                                <Step key={label}>
                                    <StepLabel StepIconComponent={PredizaStepIcon} >
                                        <Typography variant='caption' className={index < activeStep + 1 ? classes.labelColor : ""}>
                                            {label}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </MuiThemeProvider>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h4' className={classes.messageColor}>
                    {index === "success" ? t('alert.subscriptionSuccessful') : messages[activeStep]}
                </Typography>
            </Grid>
            {index === "NaN" &&
                <PlansPage />
            }
            {index === "customer" &&
                <CustomerPage />
            }
            {index === "property" &&
                <PropertyPage />
            }
            {index === "resume" &&
                <ResumePage />
            }
            {index === "pay" &&
                <PaymentPage />
            }
            {index === "success" &&
                <SuccessPage />
            }
        </Grid>
    )
});