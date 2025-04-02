import React, { useEffect } from 'react';

import theme from '../../styles/Utils/theme';
import styles from "../../styles/Soils/SoilsPage";
import { Card, Grid, Grow, Typography, withStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles(() => ({
    head: {
        backgroundColor: theme.colors.primary[95],
        color: theme.colors.onPrimaryContainer,
    },
    body: {
        fontSize: 12,
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.colors.background,
        },
    },
}))(TableRow);

export default function SoilTable(props) {

    const classes = styles();


    useEffect(() => {
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    return (
        <Grid className={classes.chartContainer}>
            <Grow in={true}>
                <Card elevation={1} className={classes.cardContainer}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h5' className={classes.tableTitle}>
                                {!props.invert ? "Desperdício de fertilizantes em solos ácidos" : "Investimento em calcário x Recuperação líquida de investimento"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant='body2' className={classes.textColor}>
                                        {!props.invert ? "Fórmula do fertilizante: 20-05-20" : "Calcário Dolomítico"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='body2' className={classes.textColor}>
                                        {!props.invert ? "Valor: R$ 5.500,00 / ton." : "Valor: R$ 200,00 (produto + frete) / ton."}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            {props.headers.map((header, i) => {
                                                if (i === 0) {
                                                    return (<StyledTableCell>{header.toUpperCase()}</StyledTableCell>)
                                                } else {
                                                    return (<StyledTableCell align="left">{header.toUpperCase()}</StyledTableCell>)
                                                }

                                            })}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!props.invert && props.data.map((row, i) => (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.ph}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.assimilation}</StyledTableCell>
                                                <StyledTableCell align="left">{row.lose}</StyledTableCell>
                                                <StyledTableCell align="left">{"R$ " + row.value}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                        {props.invert && props.data.map((row, i) => (
                                            <StyledTableRow key={i}>
                                                <StyledTableCell component="th" scope="row">
                                                    {row.ph}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.ndc}</StyledTableCell>
                                                <StyledTableCell align="left">{"R$ " + row.idc}</StyledTableCell>
                                                <StyledTableCell align="left">{"R$ " + row.rdi}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Card>
            </Grow>
        </Grid>
    )
};