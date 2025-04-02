import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
    Card,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Typography,
    Grid,
    TablePagination
} from '@material-ui/core';

import useStyles from '../../../../../styles/Billing/user/managementAccount/couponUser/TableCoupons';
import EmptyTable from '../../../../Common/EmptyTable';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import history from '../../../../../history';
import BillingStore from '../../../../../stores/BillingStore';
import { useTranslation } from 'react-i18next';


function TableCoupons(props) {
    const classes = useStyles();

    const [coupons, setCoupons] = useState([]);
    const [totalrows, setTotalRows] = useState(0);
    const [flagReloadPage, setFlagReloadPage] = useState(false);
    const [page, setPage] = useState(props.search
        ? +props.search.split('&')[0].split('=')[1]
        : 0
    );
    const [rowsPerPage, setRowsPerPage] = useState(props.search.length > 8
        ? +props.search.split('&')[1].split('=')[1]
        : ConstantsUtils.RowsPerPage
    );

    const { t } = useTranslation();

    useEffect(() => {
        setCoupons(props.couponsList);
        setTotalRows(props.totalItemsPag);
    }, [props.couponsList, props.totalItemsPag]);

    useEffect(() => {
        setPage(+props.search.split('&')[0].split('=')[1]);
        setRowsPerPage(+props.search.split('&')[1].split('=')[1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.search]);

    useEffect(() => {
        if (flagReloadPage) {
            history.push('/management/coupon?page=' + (page + 1) + '&limit=' + rowsPerPage);
            BillingStore.emit('coupons.reload');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage]);

    const handleChangePage = (_, newPage) => {
        setFlagReloadPage(true);
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event) => {
        setFlagReloadPage(true);
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <Card className={classes.wrapperCard}>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography className={clsx(classes.titleTable, classes.textTable)}>{t("common.codeTitle")}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.discount')}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.applicationDate')}</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography className={clsx(classes.titleTable, classes.textTable)}>{t('common.recurringTitle')}</Typography>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {coupons.map((coupon, index) => {
                            return (
                                <TableRow key={index} className={classes.rowTable}>
                                    <TableCell>
                                        <Typography className={clsx(classes.commonText, classes.textTable)}>
                                            {coupon.name || ConstantsUtils.NullFieldMask}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.commonText, classes.textTable)}>
                                            {coupon.discount || ConstantsUtils.NullFieldMask}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.commonText, classes.textTable)}>
                                            {coupon.created_at || ConstantsUtils.NullFieldMask}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className={clsx(classes.commonText, classes.textTable)}>
                                            {coupon.recurrent}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        {props.isEmptyState && <EmptyTable colspan={5} />}
                    </TableBody>
                </Table>
            </TableContainer>
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
        </Card>
    );
}

TableCoupons.propTypes = {
    coupons: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            discount: PropTypes.number.isRequired,
            created_at: PropTypes.string.isRequired,
            recurrent: PropTypes.bool
        })
    ),
    isEmptyState: PropTypes.bool.isRequired,
    search: PropTypes.string,
    totalItemsPag: PropTypes.number.isRequired
};

export default TableCoupons;