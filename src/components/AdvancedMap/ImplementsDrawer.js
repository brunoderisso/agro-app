import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/es';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles';
import { Box, Button, Drawer, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import styles from "../../styles/GoogleMaps/ImplementsDrawer"
import PredizaScrollBar from '../Common/PredizaScrollBar';
import GoogleMapStore from '../../stores/GoogleMapsStore';
import stringsUtils from '../../utils/stringsUtils';
import { ReactComponent as FlagIcon } from "../../img/FlagIcon.svg";
import { ReactComponent as ImplementIcon } from "../../img/ImplementIcon.svg";
import TokenList from '../../stores/CancelTokenList';
import MeasureStore from '../../stores/MeasureStore';
import DeviceStore from '../../stores/DeviceStore';
import { useTranslation } from 'react-i18next';


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const StyledTableCell = withStyles(() => ({
    root: {
        padding: "4px 8px"
    },
}))(TableCell);

export default function ImplementsDrawer(props) {
    const classes = styles();
    const tokenList = new TokenList();
    const { i18n: { language }, t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [environmentImplement, setEnvironmentImplement] = useState({});
    const [measures, setMeasures] = useState([]);

    const settings = {
        dots: true,
        infinite: false,
        focusOnSelect: false,
        speed: 500,
        slidesToShow: 1,
        swipeToSlide: true,
        slidesToScroll: 1,
        arrows: false,
        appendDots: dots => (
            <div
                style={{
                    color: "#00174B",
                    position: "relative",
                    left: "-20px",
                    top: "-10px"
                }}
            >
                <ul style={{ margin: "0px", color: "white" }}> {dots} </ul>
            </div>
        ),
    };

    useEffect(() => {
        bind();
        moment.locale(language.toLowerCase());

        return clear;
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!environmentImplement?.pictures) {
            getEnvironmentImplement();
        } else {
            setOpen(true);
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environmentImplement]);

    useEffect(() => {
        setOpen(props.open);

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const bind = () => {
        GoogleMapStore.addListener("implement_click", getImplement);
    }

    const clear = () => {
        GoogleMapStore.removeListener("implement_click", getImplement);
    }

    const getEnvironmentImplement = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        DeviceStore.getMachines(cancelToken, responseGetMachine);
    }

    const getImplement = (impl) => {
        setEnvironmentImplement(impl);
        getStats(impl);
    }

    const responseGetMachine = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            let impl = response.data.find((item) => { return item.deveui === environmentImplement.deveui });
            if (impl && environmentImplement) {
                const mach = Object.assign(impl, environmentImplement)
                setEnvironmentImplement(mach);
            }
        }
    }

    const getStats = (impl) => {
        const measures = impl.Stats;
        let m = Object.keys(measures).map((measure) => { return ({ name: measure, value: measures[measure].last }) })

        setMeasures(m);
    }

    const ActivityStatus = () => {
        const lastActivity = environmentImplement.lastseenat;
        let status = "";
        let time = moment().diff(lastActivity, 'minutes');

        if (time < 3) {
            status = 'active';
        } else if (time > 3 && time < 10) {
            status = 'inactive';
        }

        return (
            <Grid
                container
                style={{ textAlign: 'center' }}
                className={(status === 'active' && classes.active) || (status === 'inactive' && classes.inactive) || classes.stoped}
            >
                <Typography variant='caption'>
                    {
                        (status === 'active' && t("advancedmap.machine_activity")) ||
                        (status === 'inactive' && t("advancedmap.machine_inactivity")) ||
                        t("advancedmap.machine_stopped")}
                </Typography>
            </Grid>
        )
    }

    const sumDistance = (activities) => {
        let totalDistance = 0;

        for (let i = 0; i < activities.length; i++) {
            totalDistance += activities[i].distance;
        }
        return totalDistance;
    }

    const getBody = () => {
        return (
            <Box role="presentation">
                <PredizaScrollBar customHeight={"calc(100vh - 64px)"}>
                    <Grid container className={classes.container} spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justifyContent='space-between' alignItems='center'>
                                <Grid item>
                                    <Typography variant='subtitle1' className={classes.text}>
                                        {stringsUtils.toCapitalize(environmentImplement.vendor_name + " " + environmentImplement.vendor_model)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size='small' onClick={() => { setOpen(false) }}>
                                        <CloseIcon className={classes.icon} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justifyContent='center' spacing={1}>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <Slider {...settings}>
                                        {environmentImplement.pictures?.map(function (pic, i) {
                                            return (
                                                <div id={"div-slide" + i} key={i}>
                                                    <img height={140} alt={'implement' + i} src={"https://prediza.io" + pic} />
                                                </div>
                                            )
                                        })}

                                    </Slider>

                                </Grid>
                                <Grid item xs={12} style={{ textAlign: "center" }}>
                                    <Typography variant='caption' className={classes.subtext}>
                                        {environmentImplement.serial_number}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent='space-between' alignItems='center'>
                                        <Grid item xs={6}>
                                            <ActivityStatus />
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: "right" }}>
                                            <Typography variant='caption' className={classes.text}>
                                                {moment(environmentImplement.lastseenat).fromNow()}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant='caption' className={classes.text}>
                                        {t("common.now").toUpperCase()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableBody>
                                                {measures && measures.map((measure, i) => {
                                                    let meta = MeasureStore.getMeasureDetail(measure.name)?.meta;
                                                    return (
                                                        <StyledTableRow key={'measure' + i} >
                                                            <StyledTableCell component="th" scope="row">
                                                                <Typography variant='caption' className={classes.subtext}>
                                                                    {meta?.title || measure.name}
                                                                </Typography>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="right">
                                                                {<Typography
                                                                    variant='overline'
                                                                    className={classes.text}
                                                                >
                                                                    {measure?.value?.toFixed(2) + (meta?.ylegend || "")}
                                                                </Typography>}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Grid item xs={12}>
                                        <Button size='small' className={classes.buttons}>
                                            {t("advancedmap.machine_history")}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='caption' className={classes.text}>
                                        {t("common.today")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <FlagIcon />
                                        </Grid>
                                        {environmentImplement?.activity &&
                                            <Grid item xs={8} className={classes.activity}>
                                                {sumDistance(environmentImplement.activity) + "KM"}
                                            </Grid>
                                        }
                                        <Grid item xs={2}>
                                            <ImplementIcon />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableBody>
                                                {environmentImplement?.activity && environmentImplement.activity.map(act => {

                                                    return (
                                                        <StyledTableRow key={'asda'} >
                                                            <StyledTableCell component="th" scope="row">
                                                                <Typography variant='caption' className={classes.subtext}>
                                                                    {act.name}
                                                                </Typography>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="right">
                                                                {<Typography variant='overline' className={classes.text}>{act.value}</Typography>}
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button size='small' className={classes.buttons}>
                                        {t("common.plus")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </PredizaScrollBar>
            </Box>
        )
    }

    return (
        <Grid>
            <Drawer
                anchor={"right"}
                open={open}
                elevation={4}
                className={classes.drawer}
                onClose={props.onClose}
                ref={props.reference}
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant='persistent'
            >
                {environmentImplement && getBody()}
            </Drawer>
        </Grid>
    );
}