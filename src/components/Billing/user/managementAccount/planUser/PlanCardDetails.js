import React from 'react';

import clsx from 'clsx';
import PropTypes from "prop-types";

import Card from '@material-ui/core/Card';
import { Typography, Grid, TableContainer, Table, TableBody, TableRow, TableCell, Button } from '@material-ui/core';

import useStyles from "../../../../../styles/Billing/user/managementAccount/planUser/PlanCardDetails";
import BillingStore from '../../../../../stores/BillingStore';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import { useTranslation } from 'react-i18next';



function PlanCardDetails(props) {
    const classes = useStyles();

    const { t } = useTranslation();

    const redirectMyInvoices = () => {
        BillingStore.emit('tab_menu_account.change', 4);
    }

    const openSuspendModal = (objectid) => {
        if (typeof props.openModal === "function") {
            props.openModal(true, objectid);
        }
    }

    // const changePaymentMethod = () => {
    //     if (typeof props.changePaymentMethod === "function") {
    //         props.changePaymentMethod();
    //     }
    // }

    return (
        <Card elevation={1} className={classes.content}>
            <Grid className={classes.containerCard}>
                {props.infoType === 'plan'
                    ? <Grid>
                        <Typography className={clsx(classes.itemTitle, classes.defaultText)}>
                            {props.contentInfo[0].identifier}
                        </Typography>
                        <Grid container style={{ gap: '220px' }}>
                            <Typography className={clsx(classes.costValue, classes.defaultText)}>
                                {props.contentInfo[0].value}
                            </Typography>
                            <Typography className={classes.textOutline}>* {t('management.myPlan_monthlyBilling')}</Typography>
                        </Grid>
                    </Grid>
                    : <Grid>
                        <Typography className={clsx(classes.topText, classes.defaultText)}>{t('management.myPlan_billingDetails')}</Typography>
                    </Grid>
                }
                <TableContainer className={clsx({
                    [classes.wrapperTable]: props.infoType === 'plan',
                    [classes.wrapperTableAlt]: props.infoType === 'credCard',
                    [classes.credCardPlan]: props.infoType === 'credCard',
                })}>
                    <Table>
                        <TableBody>
                            {props.contentInfo.map((row, index) => {
                                return (
                                    <TableRow key={index} className={classes.rowTable}>
                                        <TableCell>
                                            <Typography
                                                className={clsx(classes.defaultText, classes.rowText)}
                                            >
                                                {row.item}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Grid container>
                                                <Typography
                                                    className={clsx(
                                                        {
                                                            [classes.columnBold]: props.infoType === 'plan',
                                                            [classes.columnExtraBold]: props.infoType === 'credCard' &&
                                                                props.contentInfo.length - 1 === index,
                                                            [classes.highlight]: (props.infoType === 'plan' &&
                                                                props.contentInfo.length - 1 === index) ||
                                                                (index === 0 && props.status),
                                                            [classes.textSuspendError]: index === 0 && !props.status &&
                                                                props.infoType === 'credCard',
                                                            [classes.defaultText]: props.infoType === 'credCard',
                                                        },
                                                        classes.rowText
                                                    )}
                                                >{row.value || ConstantsUtils.NullFieldMask}</Typography>
                                                {row.valueHa &&
                                                    <Typography className={clsx(classes.defaultText, classes.rowText)}>
                                                        &nbsp;{row.valueHa || ConstantsUtils.NullFieldMask}
                                                    </Typography>
                                                }
                                            </Grid>
                                            {row.append &&
                                                <Typography className={clsx(classes.highlight, classes.rowText)}>
                                                    {row.append || ConstantsUtils.NullFieldMask}
                                                </Typography>
                                            }
                                            {row.card && row.numberCard &&
                                                <Grid container>
                                                    <Typography className={clsx(classes.defaultText, classes.rowText)}>
                                                        {row.card}
                                                    </Typography>
                                                    <Typography className={clsx(
                                                        classes.defaultText,
                                                        classes.columnExtraBold,
                                                        classes.rowText
                                                    )}>
                                                        &nbsp;&nbsp;{row.numberCard}
                                                    </Typography>
                                                </Grid>
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {props.infoType === 'plan' &&
                    <Grid className={classes.mgBottomPrice}>
                        <Typography className={clsx(classes.defaultText, classes.topText)}>
                            Total
                        </Typography>
                        <Typography className={clsx(classes.defaultText, classes.columnBold, classes.displayPrice)}>
                            {props.total}
                        </Typography>
                    </Grid>
                }
                {props.infoType === 'plan' &&
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Button
                                color='secondary'
                                onClick={() => { openSuspendModal(props.objectid) }}
                                className={clsx(classes.btCommon, classes.btError)}
                                fullWidth
                            >
                                <Typography className={clsx(classes.textBtCommon, classes.textSuspendError)}>
                                    {t('common.suspendButton')}
                                </Typography>
                            </Button>
                        </Grid>
                        {/* TODO: Descomentar para fase 2
                        <Grid item xs={9}>
                            <Button
                                variant='outlined'
                                color='primary'
                                className={classNames(classes.btCommon, classes.btPrimary)}
                                classes={{outlinedPrimary: classes.outlinedPrimaryBt}}
                                fullWidth
                            >
                                <Typography className={classNames(classes.textBtCommon, classes.textBtConfirm)}>
                                    Alterar plano
                                </Typography>
                            </Button>
                        </Grid> */}
                    </Grid>
                }
                {props.infoType === 'credCard' &&
                    <Grid container justifyContent="center" style={{ marginTop: '40px' }}>
                        <Button
                            color="primary"
                            className={clsx(classes.btCommon, classes.btPrimary)}
                            onClick={redirectMyInvoices}
                        >
                            <Typography className={clsx(classes.textBtCommon, classes.textBtConfirm)}>
                                {t('management.myInvoices_title')}
                            </Typography>
                        </Button>
                    </Grid>
                }
            </Grid>
        </Card>
    );
}

PlanCardDetails.propTypes = {
    contentInfo: PropTypes.arrayOf(
        PropTypes.shape({
            item: PropTypes.string.isRequired,
            value: PropTypes.string,
            valueHa: PropTypes.string,
            append: PropTypes.string,
            card: PropTypes.string,
            numberCard: PropTypes.string,
            identifier: PropTypes.string
        }),
    ),
    infoType: PropTypes.string.isRequired,
    openModal: PropTypes.func,
    changePaymentMethod: PropTypes.func,
    objectid: PropTypes.string,
    status: PropTypes.bool,
};

export default PlanCardDetails;