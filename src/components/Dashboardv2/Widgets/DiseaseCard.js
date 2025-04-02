import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";

import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';

import LaunchIcon from "@material-ui/icons/Launch";
import { Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
//import { Skeleton } from "@material-ui/lab";

import useStyles from "../../../styles/Dashboardv2/DiseaseCard";
import PredizaScrollBar from "../../Common/PredizaScrollBar";



const series = [
  {
    name: "Oídio",
    data: [
      { x: "2024-11-23", y: 19 },
      { x: "2024-11-24", y: 60 },
      { x: "2024-11-25", y: 75 },
      { x: "2024-11-26", y: 0 },
      { x: "2024-11-27", y: 20 },
      { x: "2024-11-28", y: 50 },
      { x: "2024-11-29", y: 40 },
    ],
  },
  {
    name: "Míldio",
    data: [
      { x: "2024-11-23", y: 70 },
      { x: "2024-11-24", y: 80 },
      { x: "2024-11-25", y: 65 },
      { x: "2024-11-26", y: 40 },
      { x: "2024-11-27", y: 55 },
      { x: "2024-11-28", y: 45 },
      { x: "2024-11-29", y: 0 },
    ],
  },
  {
    name: "Sarna",
    data: [
      { x: "2024-11-23", y: 10 },
      { x: "2024-11-24", y: 20 },
      { x: "2024-11-25", y: 30 },
      { x: "2024-11-26", y: 40 },
      { x: "2024-11-27", y: 55 },
      { x: "2024-11-28", y: 70 },
      { x: "2024-11-29", y: 100 },
    ],
  },
  {
    name: "Ferrugem Foliar do Milho",
    data: [
      { x: "2024-11-23", y: 90 },
      { x: "2024-11-24", y: 20 },
      { x: "2024-11-25", y: 30 },
      { x: "2024-11-26", y: 40 },
      { x: "2024-11-27", y: 55 },
      { x: "2024-11-28", y: 70 },
      { x: "2024-11-29", y: 100 },
    ],
  },
  {
    name: "Ferrugem Asiatica",
    data: [
      { x: "2024-11-23", y: 40 },
      { x: "2024-11-24", y: 20 },
      { x: "2024-11-25", y: 36 },
      { x: "2024-11-26", y: 40 },
      { x: "2024-11-27", y: 48 },
      { x: "2024-11-28", y: 70 },
      { x: "2024-11-29", y: 10 },
    ],
  },
];



function DiseaseCard({ edit }) {

  const [date, setDate] = useState([]);

  const classes = useStyles();
  const { t, i18n: { language } } = useTranslation();

  const height = 52 + series.length * 24;

  const chartOptions = {
    chart: {
      type: 'heatmap',
      toolbar: {
        show: false, // Remove todos os controles (zoom, reset, etc)
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
      show: true, // Exibe o eixo X
      labels: {
        show: false, // Remove as labels do eixo X (datas)
      },
    },
    yaxis: {
      show: true, // Mantém o eixo Y
      labels: {
        show: true, // Exibe as labels do eixo Y
        formatter: function (value) {
          // Formata o valor com espaços no início ou truncamento
          const formattedValue = formatString(value, 22); // Tamanho fixo: 10 caracteres
          return formattedValue;
        },
      },
      tooltip: {
        enabled: false, // Tooltip para eixo Y
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false, // Habilita dataLabels para o eixo Y
      style: {
        colors: ['#000000'], // Define a cor das labels no gráfico, você pode ajustar conforme necessário
      },
    },
    legend: {
      show: false, // Remove a legenda
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
      // Trunca a string e adiciona "..."
      return str.slice(0, maxLength - 3) + "...";
    } else {
      // Preenche com espaços no início para ajustar o comprimento
      return str.padStart(maxLength, " ");
    }
  }

  const generateLast7DaysTimestamps = () => {
    const daysArray = [];

    for (let i = 6; i >= 0; i--) {
      // Subtraia dias começando do mais antigo e adicione ao array
      daysArray.push(moment().subtract(i, 'days').startOf('day'));
    }

    return daysArray;
  };


  // const getXsFromWidth = (w) => {
  //   if (w === 3) return 12;  // 1 card
  //   if (w === 4 || w === 5) return 6;  // 2 cards
  //   if (w === 6 || w === 7) return 4;  // 3 cards
  //   if (w === 8 || w === 9) return 3;  // 4 cards
  //   if (w === 10) return 3;
  //   if (w > 10) return 2;  // 5 cards
  //   return 3;  // Caso default
  // };

  //const xs = widget ? getXsFromWidth(widget.w) : 12; // Use o valor de `w` do widget

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
        title={<Typography variant="h6" className={classes.cardTitle}>{t('dashboard.diseaseRisk')}</Typography>}
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
                {/* CROP MAP */}
                <Grid item xs={12} style={{ height: "0px", marginLeft: "16px" }}>
                  <Typography className={classes.diseaseTitle} variant="subtitle2">MILHO P3808VYHR</Typography>
                </Grid>
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

export default DiseaseCard;