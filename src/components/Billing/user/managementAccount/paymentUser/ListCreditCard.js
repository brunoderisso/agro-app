import React, { useEffect, useState } from 'react';

import {
    Card,
    Typography,
    TableContainer,
    Table,
    TableBody,
    Button,
    Grid,
    FormControl,
    TextField
} from '@material-ui/core';

import theme from '../../../../../styles/Utils/theme';
import { useStyles } from '../../../../../styles/Billing/user/managementAccount/paymentUser/ListCreditCard';
import { ReactComponent as AddIcon } from '../../../../../img/AddIcon.svg';
import BillingStore from '../../../../../stores/BillingStore';
import PredizaModal from '../../../../Common/PredizaModal';
import ItemCreditCard from './ItemCreditCard';
import TokenList from '../../../../../stores/CancelTokenList';
import { useTranslation } from 'react-i18next';


function ListCreditCard(props) {
    const classes = useStyles(props);

    const tokenList = new TokenList();

    const { t } = useTranslation();

    const modalButtons = [
        { label: t('common.cancelButton'), action: (status, title) => { handleModal(status, title); } },
        { label: t('common.deleteButton'), action: () => deleteCreditCard(), color: theme.colors.error[40] },
        { label: t('common.saveButton'), action: () => editCreditCard() }
    ];

    const [listCards, setListCards] = useState([]);
    const [infoCcSelect, setInfoCcSelect] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [typeModal, setTypeModal] = useState('');
    const [newDescriptionCc, setNewDescriptionCc] = useState('');

    useEffect(() => {
        setListCards(props.listCards);
    }, [props.listCards]);

    const editCreditCard = () => {
        if (newDescriptionCc) {
            const cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            const cc = {
                ...infoCcSelect,
                description: newDescriptionCc
            }

            BillingStore.emit('method_payment.process', true);
            BillingStore.updateUserPayment(cc, cancelToken, responseUpdateUserPayment);
        }
    }

    const responseUpdateUserPayment = (response) => {
        tokenList.remove(response.id);
        BillingStore.emit('method_payment.process', false);

        if (response.data?.status === 200) {
            BillingStore.emit('credit_card.reload');
            setOpenModal(false);
            BillingStore.emit(
                'method_payment.error',
                [
                    response.data.status.toString(),
                    t('management.payment_cardNicknameEdited')
                ]
            );
        }

        if (response.status) {
            BillingStore.emit(
                'method_payment.error',
                [response.status.toString()]
            );
        }
    }

    const deleteCreditCard = () => {
        setOpenModal(false);
        BillingStore.emit('method_payment.process', true);

        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        BillingStore.deleteUserPayment(infoCcSelect.objectid, cancelToken, responseDeleteCreditCard);
    }

    const responseDeleteCreditCard = (response) => {
        tokenList.remove(response.id);
        BillingStore.emit('method_payment.process', false);

        if (response.data?.status === 200) {
            BillingStore.emit('credit_card.reload');
            BillingStore.emit(
                'method_payment.error',
                [
                    response.data.status.toString(),
                    t('management.payment_cardDeletedSuccessfully')
                ]
            );
        } else if (response.status === 403 || response.status === 422) {
            BillingStore.emit(
                'method_payment.error',
                [
                    response.status.toString(),
                    t('management.payment_cannotDeleteDefaultCard')
                ]
            );
        } else {
            BillingStore.emit(
                'method_payment.error',
                [
                    response.status.toString(),
                    t('alert.systemError')
                ]
            );
        }
    }

    const handleModal = (status, type, infoCc) => {
        setOpenModal(status);
        setTypeModal(type);

        if (infoCc) {
            setInfoCcSelect(infoCc);
        }

        if (type === 'Excluir') {
            setTitleModal(`${t('management.payment_deleteCard')}`);
        } else if (type === 'Editar') {
            setTitleModal(`${t('management.payment_editNickname')}`);
        }
    }

    const handleChangeNicknameCc = (event) => {
        setNewDescriptionCc(event.target.value);
    }

    const addCreditCard = () => {
        props.addNewCreditCard(true);
    }

    const bodyModal = () => {
        return (
            <Grid>
                <Typography className={classes.textModal}>
                    {typeModal === 'Excluir' &&
                        <span>{t('management.payment_confirmCardDeletion')}</span>
                    }
                    {typeModal === 'Editar' &&
                        <span>{t('management.payment_cardNamePrompt')}</span>
                    }
                    <span className={classes.highlightText}> {infoCcSelect?.data.brand} {infoCcSelect?.data.display_number.replaceAll('X', '*').replaceAll('-', ' ')} </span>
                    {t('management.payment_dueDatePreposition')}
                    <span className={classes.highlightText}> {BillingStore.formatValidityDateCc(infoCcSelect?.data.month.toString(), infoCcSelect?.data.year.toString())}</span>?
                </Typography>
                {typeModal === 'Editar' &&
                    <FormControl fullWidth className={classes.modalInput}>
                        <TextField
                            id='newNickname'
                            placeholder={t('management.payment_insertCardNickname')}
                            name='newNickname'
                            value={newDescriptionCc}
                            onChange={handleChangeNicknameCc}
                            className={classes.inputs}
                            size='small'
                            variant='outlined'
                        />
                    </FormControl>
                }
            </Grid>
        );
    }

    return (
        <Grid>
            <Card elevation={1} className={classes.wrapper}>
                <Typography className={classes.title}>{t('management.payment_creditCards')}</Typography>

                <TableContainer className={classes.wrapperTable}>
                    <Table>
                        <TableBody>
                            {listCards.map((card, index) => {
                                return (
                                    <ItemCreditCard card={card} callback={handleModal} key={index} />
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button color="primary" className={classes.btPrimary} onClick={addCreditCard}>
                    <AddIcon />
                    <Typography className={classes.txtBtAdd}>
                        {t('management.payment_addCreditCard')}
                    </Typography>
                </Button>
            </Card>

            <PredizaModal
                open={openModal}
                dispense={modalButtons[0]}
                confirm={typeModal === 'Excluir' ? modalButtons[1] : modalButtons[2]}
                title={titleModal}
                size={typeModal === 'Excluir' ? 'medium' : 'small'}
            >
                {bodyModal()}
            </PredizaModal>
        </Grid>
    );
}

export default ListCreditCard;