import React, { useState, useEffect } from "react";
import LaunchIcon from "@material-ui/icons/Launch";

//import { Skeleton } from "@material-ui/lab";

import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import useStyles from "../../../styles/Dashboardv2/PestCard";
import PredizaScrollBar from "../../Common/PredizaScrollBar";

import moment from 'moment';
import 'moment/locale/pt-br';
import ReactApexChart from "react-apexcharts";


const series = [
  {
    name: "Lagarta-do-cartucho",
    data: [
      { x: "2025-01-01", y: 0 },
      { x: "2025-01-02", y: 0 },
      { x: "2025-01-03", y: 30 },
      { x: "2025-01-04", y: 30 },
      { x: "2025-01-05", y: 70 },
      { x: "2025-01-06", y: 70 },
      { x: "2025-01-07", y: 100},
    ],
  },
  {
    name: "Percevejo-marrom",
    data: [
      { x: "2025-01-01", y: 70 },
      { x: "2025-01-02", y: 80 },
      { x: "2025-01-03", y: 65 },
      { x: "2025-01-04", y: 40 },
      { x: "2025-01-05", y: 55 },
      { x: "2025-01-06", y: 45 },
      { x: "2025-01-07", y: 0 },
    ],
  },
  {
    name: "Mosca-branca",
    data: [
      { x: "2025-01-01", y: 10 },
      { x: "2025-01-02", y: 20 },
      { x: "2025-01-03", y: 30 },
      { x: "2025-01-04", y: 40 },
      { x: "2025-01-05", y: 55 },
      { x: "2025-01-06", y: 70 },
      { x: "2025-01-07", y: 100 },
    ],
  },
  {
    name: "Broca-do-café",
    data: [
      { x: "2025-01-01", y: 90 },
      { x: "2025-01-02", y: 20 },
      { x: "2025-01-03", y: 30 },
      { x: "2025-01-04", y: 40 },
      { x: "2025-01-05", y: 55 },
      { x: "2025-01-06", y: 70 },
      { x: "2025-01-07", y: 100 },
    ],
  },
  {
    name: "Cigarrinha-do-milho",
    data: [
      { x: "2025-01-01", y: 40 },
      { x: "2025-01-02", y: 20 },
      { x: "2025-01-03", y: 36 },
      { x: "2025-01-04", y: 40 },
      { x: "2025-01-05", y: 48 },
      { x: "2025-01-06", y: 70 },
      { x: "2025-01-07", y: 10 },
    ],
  },
];




function PestCard({ edit }) {

  const [date, setDate] = useState([]);

  const classes = useStyles();
  const { t, i18n: { language } } = useTranslation();

  const height = 52 + series.length * 24;

  const chartOptions = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              name: 'Sem Risco',
              color: '#2B87F8',
            },
            {
              from: 1,
              to: 30,
              name: 'Risco Baixo',
              color: '#FFFF58',
            },
            {
              from: 31,
              to: 70,
              name: 'Risco Médio',
              color: '#FE7604',
            },
            {
              from: 71,
              to: 100,
              name: 'Risco Alto',
              color: '#E81218',
            }
          ]
        }
      }
    },
    xaxis: {
      show: true,
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      labels: {
        show: true,
        formatter: function (value) {
          const formattedValue = formatString(value, 22);
          return formattedValue;
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['#000000'],
      },
    },
    legend: {
      show: false,
    }
  }

  useEffect(() => {
    moment.locale(language.toLowerCase())
    setDate(generateLast7DaysTimestamps());
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatString(str, maxLength) {
    if (typeof str !== "string") {
      return
    }

    if (str.length > maxLength) {
      // Adiciona ... quando nao cabe
      return str.slice(0, maxLength - 3) + "...";
    } else {
      return str.padStart(maxLength, " ");
    }
  }

  const generateLast7DaysTimestamps = () => {
    const daysArray = [];

    for (let i = 6; i >= 0; i--) {
      daysArray.push(moment().subtract(i, 'days').startOf('day'));
    }

    return daysArray;
  };


  return (
    <Card
      style={{
        boxShadow: edit ? '0px 8px 15px rgba(0, 0, 0, 0.2)' : '0px 4px 6px rgba(0, 0, 0, 0.1)',
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={<Typography variant="h6" className={classes.cardTitle}>{t('dashboard.pestRisk')}</Typography>}
        action={
          <IconButton size="small" className={classes.externalButton}>
            <LaunchIcon fontSize="small" />
          </IconButton>
        }
      />
      <CardContent
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          height: "75%"
        }}
      >
        <Grid container style={{ height: "100%" }}>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end" style={{ paddingRight: "20px" }}>
              {date.map((date) => {
                return (
                  <Grid item>
                    <Grid container style={{ textAlign: "center", marginRight: "0px" }}>
                      <Grid item xs={12}>
                        <Typography className={classes.letterDay} variant="body2">
                          {moment(date).format('dddd')[0].toUpperCase()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography className={classes.numberDay} variant="caption">
                          {moment(date).format("DD")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ height: "85%" }}>
            <PredizaScrollBar customHeight={"100%"}>
              <Grid container>
                {/* PEST CHART */}
                <Grid item xs={12}>
                  <Grid container justifyContent="flex-end">
                    <ReactApexChart className={classes.chartCSS} options={chartOptions} series={series} type="heatmap" height={height} width={"315px"} />
                  </Grid>
                </Grid>

              </Grid>
            </PredizaScrollBar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PestCard;