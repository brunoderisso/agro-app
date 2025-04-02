import React, { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';

import {
    Grid,
    Card,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Button,
    Typography,
    TablePagination,
    Link
} from '@material-ui/core';

import useStyles from '../../../../../styles/Billing/user/managementAccount/reportUser/BillingHistoryPage';
import theme from '../../../../../styles/Utils/theme';
import { ReactComponent as DownloadIcon } from '../../../../../img/DownloadIcon.svg';
import { ReactComponent as PreviewIcon } from '../../../../../img/PreviewIcon.svg';
import { ReactComponent as PixIcon } from '../../../../../img/PixIcon.svg';
import { ReactComponent as DisabledPixIcon } from '../../../../../img/DisabledPixIcon.svg';
import CustomTooltip from '../../../../Common/CustomTooltip';
import BillingStore from '../../../../../stores/BillingStore';
import TokenList from '../../../../../stores/CancelTokenList';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import masksUtils from '../../../../../utils/masksUtils';
import UserFeedback from '../../../../Common/UserFeedback';
import history from '../../../../../history';
import EmptyTable from '../../../../Common/EmptyTable';
import stringsUtils from '../../../../../utils/stringsUtils';
import { useTranslation } from 'react-i18next';
import PixModal from './PixModal';



function BillingHistoryPage(props) {
    const classes = useStyles();

    const [page, setPage] = useState(props.search
        ? +props.search.split('&')[0].split('=')[1]
        : 0
    );
    const [rowsPerPage, setRowsPerPage] = useState(props.search.length > 8
        ? +props.search.split('&')[1].split('=')[1]
        : ConstantsUtils.RowsPerPage
    );
    const [totalrows, setTotalRows] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [loader, setLoader] = useState(false);
    const [invoicesList, setInvoicesList] = useState([]);
    const [errorStatusResponse, setErrorStatusResponse] = useState('');
    const [isEmptyState, setIsEmptyState] = useState(false);
    const [flagReloadPage, setFlagReloadPage] = useState(false);
    const [invoiceClicked, setInvoiceClicked] = useState({})


    const tokenList = new TokenList();

    const { t } = useTranslation();

    useEffect(() => {
        getInvoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(totalrows)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalrows]);

    useEffect(() => {
        setRowsPerPage(+props.search.split('&')[1].split('=')[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.search]);

    useEffect(() => {
        if (flagReloadPage) {
            getInvoices();
            history.push('/management/billing-history?start=' + totalItems + '&limit=' + rowsPerPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage]);

    const getInvoices = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        const pagination = {
            start: totalItems,
            limit: rowsPerPage
        }

        setLoader(true);
        BillingStore.getInvoicesList(cancelToken, pagination, responseInvoices);
    }

    const responseInvoices = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data) {
            setTotalRows(response.data.totalItens);

            console.log(response.data.itens)
            const invoicesPerPage = response.data.itens.map(item => {
                return {
                    date: item.due_date ? moment(item.due_date).format('DD/MM/YYYY') : null,
                    plan: stringsUtils.toCapitalize(item.plan_name),
                    value: masksUtils.currencyFormatToReal(item.total_cents || 0),
                    status: item.status
                        ? ConstantsUtils.MapInvoiceStatus.filter(status => status.value === item.status.toLowerCase())[0].label
                        : '',
                    qrCode: item.pix?.qrcode || '#',
                    invoiceUrl: item.secure_url || '#',
                    qrcode_text: item.pix?.qrcode_text,
                    due_date: item.due_date
                };
            });

            setInvoicesList(invoicesPerPage);
        }

        if (response.status === 404) {
            setIsEmptyState(true);
        }

        if (response.status) {
            setErrorStatusResponse(response.status.toString());
        }
    }

    const handleChangePage = (_, newPage) => {
        if (newPage > page) {
            setTotalItems(totalItems + rowsPerPage);
        } else if (newPage < page) {
            setTotalItems(totalItems - rowsPerPage);
        }

        setFlagReloadPage(true);
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setFlagReloadPage(true);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        setTotalItems(0);
    }

    const handleModal = (invoice) => {
        console.log(invoice)
        setInvoiceClicked(invoice)
    }

    const handleClosePixModal = () => {
        setInvoiceClicked({})
    }

    return (
        <Grid className={classes.content}>

            <Typography variant='h4' className={classes.subtitle}>{t("management.myInvoices_title")}</Typography>

            {!loader &&
                <Card className={classes.wrapperCard}>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell >
                                        <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.dateText')}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.plansText')}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.valueText')}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.statusText')}</Typography>
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                                {invoicesList.map((invoice, index) => {
                                    return (
                                        <TableRow key={index} className={classes.rowTable}>
                                            <TableCell>
                                                <Typography className={clsx(classes.commonText, classes.textTable)}>{invoice.date}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={clsx(classes.commonText, classes.textTable)}>{invoice.plan}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={clsx(classes.commonText, classes.textTable)}>{invoice.value}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography className={clsx(classes.commonText, classes.textTable)}>
                                                    {invoice.status}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Grid container className={classes.containerBtn}>
                                                    <CustomTooltip title={
                                                        <React.Fragment>
                                                            <Typography className={classes.commonText}>
                                                                {t('management.viewInvoice')}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }>
                                                        <Link href={invoice.invoiceUrl} target='_blank' rel='noreferrer'>
                                                            <Button className={classes.iconButton} onClick={() => { }}>
                                                                <PreviewIcon />
                                                            </Button>
                                                        </Link>
                                                    </CustomTooltip>
                                                    <CustomTooltip title={
                                                        <React.Fragment>
                                                            <Typography className={classes.commonText}>
                                                                {t('management.downloadInvoice')}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }>
                                                        <Button
                                                            className={clsx(classes.iconButton, classes.disableDownloadIcon)}
                                                            onClick={() => { }}
                                                            disabled
                                                        >
                                                            <DownloadIcon />
                                                        </Button>
                                                    </CustomTooltip>
                                                    <CustomTooltip title={
                                                        <React.Fragment>
                                                            <Typography className={classes.commonText}>
                                                                {t('management.payInvoice')}
                                                            </Typography>
                                                        </React.Fragment>
                                                    }>
                                                        {/* <Link href={invoice.qrCode} target='_blank' rel='noreferrer'> */}
                                                        <Button
                                                            className={classes.iconButton}
                                                            onClick={() => handleModal(invoice)}
                                                            disabled={invoice.status === 'Pago'}
                                                        >
                                                            {invoice.status === 'Pago' ? <DisabledPixIcon /> : <PixIcon />}
                                                        </Button>
                                                        {/*   <PixModal /> */}

                                                        {/*  </Link> */}
                                                    </CustomTooltip>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {isEmptyState && <EmptyTable colspan={5} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {(totalrows > ConstantsUtils.RowsPerPage || !isEmptyState) &&
                        <Grid className={classes.wrapperPagination}>
                            <TablePagination
                                component='div'
                                className={clsx(classes.commonText, classes.textTable)}
                                count={totalrows}
                                page={!totalrows || totalrows <= 0 ? 0 : page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={`${t('common.itemsPerPage')}:`}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} ${t('common.of')} ${count !== -1 ? count : `${t('common.greaterThan')} ${to}}`}`
                                }
                            />
                        </Grid>
                    }
                </Card>
            }
            {loader &&
                <Grid container justifyContent='center' alignItems='center'>
                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                </Grid>
            }
            <UserFeedback error={errorStatusResponse} setError={setErrorStatusResponse} />

            <PixModal
                open={Boolean(invoiceClicked.plan)}
                handleClose={handleClosePixModal}
                invoice={invoiceClicked}
            />
            
        </Grid>
    );
}

BillingHistoryPage.propTypes = {
    search: PropTypes.string,
};

export default BillingHistoryPage;