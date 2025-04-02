import React, { useRef } from 'react';
import ReactApexChart from "react-apexcharts";
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

import styles from "../../../styles/Notebook/NotebookPestPage";


export default withStyles(styles)(function NotebookDisease(props) {
    const { t } = useTranslation();

    const options = useRef({
        chart: {
            height: 150,
            type: 'radialBar',
        },
        labels: ['Desenvolvimento'],
        generation: (Math.floor(props.stage.gdd)),
        series: [((props.stage.gdd % 1)*100).toFixed(1)],
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 3,
                        fontSize: "12px",
                        fontWeight: 700
                    }
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "horizontal",
            }
        },
        responsive: [{
            breakpoint: 400,
            options: {
                chart: {
                    width: 85
                },
            }
        }],
        stroke: {
            lineCap: "round"
        },
    });

    return (
        <Grid style={{ paddingTop: "10px" }}>
            {options.current && options.current.series &&
                <ReactApexChart options={options.current} series={options.current.series} type="radialBar" height={150} />
            }
            <Grid item xs={12} style={{ marginTop: "-10px" }}>
                { `${t('notebook.pests_generation')}: ` + options.current.generation.toFixed(0)}
            </Grid>
        </Grid>
    )
})