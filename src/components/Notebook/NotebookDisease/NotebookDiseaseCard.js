import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ReactApexChart from "react-apexcharts";

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import { Divider } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import Grow from '@material-ui/core/Grow';
import BarChartIcon from '@material-ui/icons/BarChart';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';

import styles from "../../../styles/Notebook/NotebookDiseaseCard";
import useResize from "../../../Hook/useResize";
import toolsUtils from '../../../utils/toolsUtils';
import SessionStore from '../../../stores/SessionStore';
import GraphicsStore from '../../../stores/GraphicsStore';

let classification = {
    NAN: 0.1,
    BAIXA: 1.4,
    MEDIA: 2.3,
    ALTA: 4
}

let meta = {
    NAN: '#007eff',
    BAIXA: '#ffff00',
    MEDIA: '#ff7200',
    ALTA: '#ff0000'
}

let barOptions = {
    chart: {
        toolbar: {
            show: false,
        }
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                return value.toFixed(0)
            },
            title: {
                formatter: (seriesName) => "Índice",
            },
        }
    },
    yaxis: {
        labels: {
            style: {
                fontSize: "7px"
            },
            formatter: (val) => { return val.toFixed(0) },
        },
    },
    xaxis: {
        labels: {
            style: {
                fontSize: "7px"
            }
        },
    },
}

export default withStyles(styles)(function NotebookDiseaseCard(props) {
    const [visibility, setVisibility] = useState(false);
    const [environment, setEnvironment] = useState({});
    const [worst, setWorst] = useState("NAN");
    const [disease, setDisease] = useState([]);
    const [worstDisease, setWorstDisease] = useState([]);

    const { classes } = props;

    const { t } = useTranslation();

    const options = useRef({
        legend: {
            show: false
        },
        tooltip: {
            enabled: false,
        },
        labels: ["Alta", "Media", "Baixa", "NAN"],
        colors: ['#ff0000', '#ff7200', '#ffff00', '#007eff'],
        dataLabels: {
            enabled: false,
            formatter: function (val, opt) {
                return val.toFixed(1) + "%";
            },
            style: {
                colors: ['#000'],
                fontSize: '10px'
            },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 110
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    })

    const gradientBar = useRef(null);
    const window = useResize();

    useEffect(() => {
        setEnvironment(SessionStore.getEnvironment(SessionStore.getEnvironment()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.disease) {
            setDisease(props.disease);
            GraphicsStore.add("DiseaseCard" + props.disease.polygon_name);
        }
    }, [props.disease]);

    useEffect(() => {
        GraphicsStore.update(GraphicsStore.getSizesById(document, "DiseaseCard" + disease.polygon_name));

        if (visibility) {
            let s = GraphicsStore.find("DiseaseCard" + disease.polygon_name);
            if (s !== null) {
                let c = document.getElementById("Canvas" + disease.polygon_name);
                if (c !== null) {
                    c.style.height = s.height + "px";
                }
            }
        } else {
            let c = document.getElementById("Canvas" + disease.polygon_name);
            if (c !== null) {
                c.style.height = checkHeight() + "px";
            }
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibility]);

    const getPercentValue = (dis) => {
        if (dis.evaluation) {
            let vals = dis.evaluation.evaluation;
            return findDiseasePercent(vals);
        } else {
            return (null);
        }
    }

    const findDiseasePercent = (vals) => {
        let ret = [];

        ret[0] = vals.find((val) => {
            return val.class === "ALTA"
        })
        ret[1] = vals.find((val) => {
            return val.class === "MEDIA"
        })
        ret[2] = vals.find((val) => {
            return val.class === "BAIXA"
        })
        ret[3] = vals.find((val) => {
            return val.class === "NAN"
        })

        return ret.find((obj) => {
            return obj.value > 0
        })

    }

    const setGradientBarData = (dis) => {
        if (dis.evaluation?.evaluation && worstDisease.length === 0) {
            setWorstDisease(dis.evaluation.evaluation);
        }
    }

    const checkHeight = () => {
        if (disease.crop_disease.length > 2 && window.width < 600) {
            return 490
        }
        if (disease.crop_disease.length > 4) {
            return 635
        }
        if (disease.crop_disease.length > 2) {
            return 435
        }
        if (window.width < 600) {
            return 290
        }
        if (window.width < 1280) {
            return 235
        }
        if (window.width > 1600) {
            return 310
        }
        else {
            return 250
        }
    }

    const getInfoCards = (dis) => {
        let max = getPercentValue(dis);

        if (gradientBar.current !== null && max !== null) {
            if (max.class === "ALTA") {
                if (gradientBar.current.class === "ALTA") {
                    if (max.value > gradientBar.current.value) {
                        gradientBar.current = max;
                        setGradientBarData(dis);
                    }
                } else {
                    gradientBar.current = max;
                    setGradientBarData(dis);
                }
            } else if (max.class === "MEDIA" && gradientBar.current.class !== "ALTA") {
                if (gradientBar.current.class === "MEDIA") {
                    if (max.value > gradientBar.current.value) {
                        gradientBar.current = max;
                        setGradientBarData(dis);
                    }
                } else {
                    gradientBar.current = max;
                    setGradientBarData(dis);
                }
            } else if (max.class === "BAIXA" && gradientBar.current.class !== "MEDIA" && gradientBar.current.class !== "ALTA") {
                if (gradientBar.current.class === "BAIXA") {
                    if (max.value > gradientBar.current.value) {
                        gradientBar.current = max;
                        setGradientBarData(dis);
                    }
                } else {
                    gradientBar.current = max;
                    setGradientBarData(dis);
                }
            }
        }

        if (max !== null) {
            if (gradientBar.current === null) {
                gradientBar.current = max;
                setGradientBarData(dis);
            }
            if (classification[max.class] > classification[worst]) {
                setWorst(max.class);
            }
        }
    }

    const onClickVisibility = () => {
        let f = visibility;
        setVisibility(!f);
    }

    const orderRisk = (vals) => {
        let ret = [];

        ret[0] = vals.find((val) => {
            return val.class === "NAN"
        })
        ret[1] = vals.find((val) => {

            return val.class === "BAIXA"
        })
        ret[2] = vals.find((val) => {
            return val.class === "MEDIA"
        })
        ret[3] = vals.find((val) => {
            return val.class === "ALTA"
        })

        return ret;
    }

    const getNewChart = (cropDisease) => {
        getInfoCards(cropDisease);
        let vals;

        if (cropDisease.evaluation)
            vals = orderRisk(cropDisease.evaluation.evaluation);
        else
            vals = [];

        let max = "";

        if (vals.length > 0)
            max = findDiseasePercent(vals);

        let series = [];
        let lab = [];
        let cor = [];
        let risk = true;

        let data = [];

        vals.forEach(d => {
            if (risk !== false) {
                data.push({ x: d.class, y: d.value, fillColor: meta[d.class] })
                cor.push(meta[d.class]);
                lab.push(d.class);
                series.push(d.value);
            }
        });

        let op = { ...options.current, labels: lab, colors: cor }
        options.current = op;

        let series2 = [{ data: data }];

        const translationMapping = {
            "NAN": t('notebook.pests_NAN'),
            "BAIXA": t('notebook.pests_BAIXA'),
            "MEDIA": t('notebook.pests_MEDIA'),
            "ALTA": t('notebook.pests_ALTA')
        };

        data.forEach(item => {
            item.x = translationMapping[item.x] || item.x;
        });

        if (series.length > 0) {
            return (
                <Grid
                    container
                    className={classes.infoContainer}
                    style={(visibility && { paddingBottom: "0px", paddingTop: "3px" }) || {}}
                >
                    <Grid
                        item
                        xs={12}
                        style={(cropDisease.name.length > 10 && { fontSize: "8px" }) || { fontSize: "10px" }}
                        className={classes.infoTitle}
                    >
                        {cropDisease.name.toUpperCase()}
                    </Grid>
                    {!visibility &&
                        <Grow in={!visibility} unmountOnExit>
                            <Grid container>
                                <Grid item xs={12} className={classes.responsivePie}>
                                    <ReactApexChart options={options.current} series={series} type="donut" width={118} height={100} />
                                </Grid>
                                <Grid item xs={12}>
                                    {risk && t('notebook.pests_atRisk')}
                                    {!risk && t('notebook.pests_noRisk')}
                                </Grid>
                                <Grid item xs={12} className={classes.riskCard}>
                                    {(max.class && t(`notebook.pests_${max.class}`)) || ""}
                                </Grid>
                            </Grid>
                        </Grow>
                    }
                    {visibility &&
                        <Grow in={visibility} unmountOnExit>
                            <Grid container>
                                <Grid item xs={12} style={{ marginLeft: "-15px", marginTop: "-15px", marginBottom: "-15px" }}>
                                    <ReactApexChart options={barOptions} type='bar' series={series2} width={"125%"} height={150} />
                                </Grid>
                            </Grid>
                        </Grow>
                    }
                </Grid>
            )
        }
        else {
            return (
                <Grid container className={classes.infoContainer}>
                    <Grid item xs={12} className={classes.infoTitle}>
                        {cropDisease.name.toUpperCase()}
                    </Grid>
                    <Grid item xs={12}>
                        {t('notebook.pests_noData')}
                    </Grid>
                    <Grid item xs={12}>
                        <WarningIcon />
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <div style={{ height: '100%' }}>
            {!toolsUtils.isNullOrEmpty(disease, "crop_objectid") && !toolsUtils.isNullOrEmpty(environment, "objectid") &&
                <Grid container id={"DiseaseCard" + disease.polygon_name} className={classes.containerDiseaseCard}>
                    <Grid item xs={11}>
                        <Grid container className={classes.gridContainer}>
                            <Grid item xs={12} className={classes.cropName}>
                                {disease.crop_name.toUpperCase() + " " + disease.crop_variety.toUpperCase()}
                            </Grid>
                            <Divider />
                            <Grid item xs={12} className={classes.visibility}>
                                <IconButton onClick={onClickVisibility} aria-label={t('notebook.pests_changeView')}>
                                    {visibility && <BarChartIcon />}
                                    {!visibility && <BarChartIcon style={{ opacity: "0.2" }} />}
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={1}>
                                        <MapIcon className={classes.icon} fontSize='small' />
                                    </Grid>
                                    {disease.polygon_name &&
                                        <Grid item xs={11} className={classes.environmentInfo}>
                                            {environment.name + ", " + disease.polygon_name[0].toUpperCase() + disease.polygon_name.substring(1)}
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {disease.crop_disease.length > 0 &&
                                    <Grid container className={classes.containerInfoCards} spacing={4}>
                                        {
                                            disease.crop_disease.map((cropDisease, i) => {
                                                return (
                                                    <Grid item xs={6} key={"diseaseCard" + i}>
                                                        {getNewChart(cropDisease)}
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                }
                                {disease.crop_disease.length === 0 &&
                                    <Grid container alignItems='center' style={{ marginTop: "25px" }}>
                                        <Grid item xs={12}>
                                            {t('notebook.pests_noDiseases')}
                                        </Grid>
                                        <Grid item xs={12} style={{ marginTop: "25px", marginLeft: "25%" }}>
                                            <WarningIcon />
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }
        </div>
    )
})