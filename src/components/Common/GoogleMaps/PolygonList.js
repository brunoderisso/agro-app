import React, { useState, useEffect } from 'react';
import Scrollbars from 'react-custom-scrollbars';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Collapse, Button, Typography } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';

import Canvas from '../Canvas';
import Styles from "../../../styles/GoogleMaps/PolygonList";
import EvapoStore from '../../../stores/EvapoStore';
import PoligonForm from './PoligonForm';
import sessionStore from '../../../stores/SessionStore';
import PoligonStore from '../../../stores/PoligonStore';
import useResize from '../../../Hook/useResize';

import moment from "moment";
import { useTranslation } from 'react-i18next';

export default withStyles(Styles)(function PolygonList(props) {
    const [polygons, setPolygons] = useState([]);
    const [environment, setEnvironment] = useState({});

    const [formView, setFormView] = useState(false);
    const [collapse, setCollapse] = useState(true);

    const { classes } = props;

    const { t } = useTranslation();

    const window = useResize();

    useEffect(() => {
        bind();
        setEnvironment(sessionStore.getEnvironmentDetail());

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCollapse(props.open);
        setFormView(props.flag);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    useEffect(() => {
        if (props.polygons[0]) {
            setPolygons(props.polygons);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.polygons]);

    const bind = () => {
        PoligonStore.addListener("polygons_refresh", updatePolygons)
        PoligonStore.addListener("property_refresh", updateProperty)
    }

    const clear = () => {
        PoligonStore.removeListener("polygons_refresh", updatePolygons)
        PoligonStore.removeListener("property_refresh", updateProperty)
    }

    const updatePolygons = () => {
        setPolygons(sessionStore.getDataLocalStorage("polygons"));
    }

    const updateProperty = () => {
        if (sessionStore.getEnvironmentPolygon()) {
            const envPolygon = {
                ...sessionStore.getEnvironmentPolygon(),
                Points: PoligonStore.mapCoordinatesPoints(sessionStore.getEnvironmentPolygon().Points)
            }

            if (envPolygon) {
                setPolygons([envPolygon]);
            }
        } else {
            setPolygons([]);
        }
    }

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }

    const onClickPolygon = (polygon) => {
        EvapoStore.centerMap(polygon);
    }

    const createPolygon = () => {
        PoligonStore.emit('create_poligon');
    }

    return (
        <Grid className={classes.containerList}>
            <Collapse in={collapse}>
                {!formView &&
                    <Grid>
                        <Scrollbars style={{ width: (formView && "530px") || "230px", height: (window.width < 600 && "17vh") || "40vh" }} renderThumbVertical={thumb} className={classes.scrollList}>

                            <List className={classes.root}>
                                {!formView && polygons.length === 0 &&
                                    <Grid container>
                                        <Grid item xs={12} className={classes.infoPoligons}>
                                            {t("note.management.rightClickOrHold")}
                                        </Grid>
                                    </Grid>
                                }
                                {polygons && polygons[0] !== undefined && polygons.map((polygon, index) => {
                                    return (
                                        <Grid key={index} className={classes.polygonItemList}>
                                            <div onClick={() => { onClickPolygon(polygon) }}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Canvas style={{ transform: "scale(0.5)", margin: "-25px" }} pts={polygon.Points} width="100" height="70" />
                                                    </ListItemAvatar>
                                                    <ListItemText style={{ textAlign: "center" }} primary={polygon.name} secondary={moment(polygon.updatedat).format("D MMM, YYYY")} />
                                                </ListItem>
                                            </div>
                                        </Grid>
                                    )
                                })}
                            </List>
                        </Scrollbars>
                        <Button
                            color='primary'
                            className={classes.btPrimary}
                            startIcon={<AddIcon className={classes.iconBt} />}
                            onClick={createPolygon}
                        >
                            <Typography className={classes.textBtPrimary}>
                                {t('note.management.addPolygon')}
                            </Typography>
                        </Button>
                    </Grid>
                }
                {formView &&
                    <Grid>
                        <PoligonForm page={"PoligonList"} area={props.area} points={props.points} env={environment} onCreateEnvironmentPolygon={props.onCreateEnvironmentPolygon} />
                    </Grid>
                }
            </Collapse>
        </Grid>
    );
})