import React, { useState, useEffect } from 'react';
import { withStyles } from "@material-ui/core/styles";


import styles from "../styles/Report/MUITable";
//Material UI
import Grid from "@material-ui/core/Grid";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Others
import moment from 'moment';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function MUIReportTable(props) {

    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {

        if(props.data !== null && props.data !==undefined && props.data.length > 0){
            setHeaders(generateHeaders(Object.keys(props.data[0])));
            setData(props.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const { classes } = props;

    const generateHeaders = (keys) => {
        let headers = [];

        keys.forEach(title => {
            if(title === 'time'){
                headers.push(t('common.dateText').toUpperCase());
            }else if(title === 'value'){
                headers.push(t('common.valueText').toUpperCase());
            }else if(title==='l90'){
                headers.push('P90');
            }else if(title==='l10'){
                headers.push('P10');
            }
            else{
                headers.push(title.toUpperCase());
            }
        });

        return headers;
    }

    return (
        <Grid>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="Devices">
                    <TableHead>
                        <TableRow key={"TableHeader123"}>
                            {headers.map((h, i) => {

                                if(i===0){
                                    return(
                                        <TableCell key={"Headers"+i}>{h}</TableCell>
                                        )
                                }else{
                                    return (
                                        <TableCell key={"Headers"+i} align="right">{h}</TableCell>
                                    )
                                }

                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow classes={{root: classes.rows}} key={row.device+row.time+""}>
                                <TableCell component="th" scope="row">
                                    {moment(row.time).format("DD/MM/YYYY HH:mm")}
                                </TableCell>
                                <TableCell align="right">{row.value}</TableCell>
                                <TableCell align="right">{row.l10}</TableCell>
                                <TableCell align="right">{row.l90}</TableCell>
                                <TableCell align="right">{row.device}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
})