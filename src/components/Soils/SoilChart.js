import React, {  useEffect, useRef } from 'react';

import styles from "../../styles/Soils/SoilsPage";
import { Card, Grid, Grow, Typography } from '@material-ui/core';
import ReactApexChart from "react-apexcharts";

export default function SoilChart(props) {

    const classes = styles();

    const options = useRef(
        {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: {
                    show: false,
                }
            },
            series: props.data.series,
            xaxis: {
                categories: props.data.categories,
                labels: {
                    style: {
                        color: '#757680',
                        fontSize: '12px',
                        fontFamily: 'Poppins,sans-serif',
                        fontWeight: 400,
                    }
                },
                title: {
                    text: "pH do solo",
                    rotate: 0,
                    style: {
                        color: '#00174B',
                        fontSize: '20px',
                        fontFamily: 'Poppins,sans-serif',
                        fontWeight: 500,
                    }
                },
            },
            yaxis: {
                labels: {
                    style: {
                        color: '#757680',
                        fontSize: '12px',
                        fontFamily: 'Poppins,sans-serif',
                        fontWeight: 400,
                    }
                },
                title: {
                    text: "%",
                    rotate: 0,
                    style: {
                        color: '#00174B',
                        fontSize: '20px',
                        fontFamily: 'Poppins,sans-serif',
                        fontWeight: 500,
                    }
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: "55%",
                    horizontal: false,
                    dataLabels: {
                        position: 'top',
                    },
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                position: "top",
                fontSize: '16px',
                fontFamily: 'Poppins,sans-serif',
                markers: {
                    width: 24,
                    height: 24
                },
                itemMargin: {
                    horizontal: 24,
                    vertical: 0
                }
            },
            colors: ['#0053DB', '#00174B', '#B4C5FF'],
        }
    )

    useEffect(() => {
        console.log(options)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);




    return (
        <Grid className={classes.chartContainer}>
            <Grow in={options.current}>
                <Card elevation={1} className={classes.cardContainer}>
                    <Grid container spacing={3} justifyContent='center'>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Typography variant='h5' className={classes.textColor}>
                                {"Assimilação (N – P – K) x pH"}
                            </Typography>
                        </Grid>
                        <ReactApexChart id={"chartTest"} className={classes.chart} options={options.current} series={options.current.series} type="bar" height={350} width={444} />
                    </Grid>
                </Card>
            </Grow>
        </Grid>
    )
};