import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

import { Typography, TableRow, TableCell, Grid, IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import BillingStore from '../../../../../stores/BillingStore';
import { useStyles } from '../../../../../styles/Billing/user/managementAccount/paymentUser/ItemCreditCard';
import theme from '../../../../../styles/Utils/theme';
import mastercard from '../../../../../img/mastercard.png'
import visa from '../../../../../img/visa.png'
import cielo from '../../../../../img/cielo.png'
import TokenList from '../../../../../stores/CancelTokenList';
import { useTranslation } from 'react-i18next';


function ItemCreditCard(props) {
    const classes = useStyles(props);

    const { t } = useTranslation();

    const tokenList = new TokenList();

    const optionCardMenu = [
        { text: 'Editar' },
        { text: 'Tornar Padrão' },
        { text: 'Excluir', color: theme.colors.error[40] },
    ];

    const [anchorEl, setAnchorEl] = useState(null);
    const [creditCard, setCreditCard] = useState(null);

    useEffect(() => {
        setCreditCard(props.card);
    }, [props.card]);

    const handleClickBt = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuItem = (text) => {
        handleCloseMenu();

        if (typeof text === 'string' && text !== 'Tornar Padrão') {
            props.callback(true, text, creditCard);
        } else if (text === 'Tornar Padrão') {
            setAsDefaultCc();
        }
    }

    const setAsDefaultCc = () => {
        const cancelToken = {};

        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        BillingStore.setAsDefaultPayment(creditCard.objectid, cancelToken, responseSetAsDefaultCc);
    }

    const responseSetAsDefaultCc = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            BillingStore.emit('credit_card.reload');
        }
    }

    const selectBrand = () => {
        let brand = '';

        switch (creditCard?.data.brand) {
            case 'Master': {
                brand = mastercard;
                break;
            }
            case 'Visa': {
                brand = visa;
                break;
            }
            case 'Cielo': {
                brand = cielo;
                break;
            }
            default: break;
        }

        return brand;
    }

    const MenuOption = () => {
        return (
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                elevation={4}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                {optionCardMenu.map((item, index) => {
                    return (
                        <MenuItem key={index} onClick={() => { handleMenuItem(item.text) }}>
                            <Typography className={classes.textItemMenu} style={{ color: item.color }}>
                                {
                                    item.text === 'Editar' ? t('common.editButton') :
                                        item.text === 'Tornar Padrão' ? t('common.makeDefaultButton') :
                                            item.text === 'Excluir' ? t('common.deleteButton') :
                                                null
                                }
                            </Typography>
                        </MenuItem>
                    );
                })
                }
            </Menu>
        );
    }

    return (
        <TableRow>
            <TableCell>
                <Grid container className={classes.contentCel}>
                    <Grid item className={classes.centerContent}>
                        <img
                            className={classes.brand}
                            alt="Bandeira"
                            src={selectBrand()}
                        />
                    </Grid>
                    <Grid item className={classes.infoCard}>
                        <Typography className={classes.nameCard}>{creditCard?.description}</Typography>
                        <Typography className={classes.numberCard}>
                            {creditCard?.data.display_number.replaceAll('X', '*').replaceAll('-', ' ')}
                        </Typography>
                        <Typography className={classes.validityCard}>
                            {`${t('management.payment_expirationDate')}: ${BillingStore.formatValidityDateCc(creditCard?.data.month.toString(), creditCard?.data.year.toString())}`}
                        </Typography>
                    </Grid>
                    {creditCard?.is_default === 'true' &&
                        <Grid item className={classes.centerContent}>
                            <Typography className={classes.title}>{t("common.default")}</Typography>
                        </Grid>
                    }
                    <Grid item className={classes.centerContent}>
                        <IconButton
                            aria-label="option"
                            size='small'
                            color='inherit'
                            className={classes.btOptions}
                            onClick={(e) => handleClickBt(e, creditCard)}
                        >
                            <MoreVertIcon fontSize='small' />
                        </IconButton>
                        {MenuOption()}
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    );
}

ItemCreditCard.propTypes = {
    card: PropTypes.shape({
        data: PropTypes.shape({
            holder_name: PropTypes.string.isRequired,
            display_number: PropTypes.string.isRequired,
            month: PropTypes.number.isRequired,
            year: PropTypes.number.isRequired,
        }),
        is_default: PropTypes.string,
    })
}

export default ItemCreditCard;