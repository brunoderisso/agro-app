import React from 'react';

import PropTypes from 'prop-types';

import { TableRow, TableCell, Typography } from '@material-ui/core';

import useStyles from '../../styles/Common/EmptyTable';


function EmptyTable(props) {
    const classes = useStyles();

    return (
        <TableRow className={classes.rowTable}>
            <TableCell colSpan={props.colspan}>
                <Typography className={classes.textTable}>
                    Nenhum resultado encontrado
                </Typography>
            </TableCell>
        </TableRow>
    );
}

EmptyTable.propTypes = {
    colspan: PropTypes.number,
};

export default EmptyTable;