import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import AddIcon from '@material-ui/icons/Add';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import styles from "../../../styles/Notebook/NotebookRastreabilityPage";
import NotebookNutritionalTable from './NotebookNutritionalTable';
import SessionStore from "../../../stores/SessionStore";
import toolsUtils from "../../../utils/toolsUtils";
import GMap from '../../Common/GoogleMaps/GoogleMaps';
import NoteStore from '../../../stores/NoteStore';
import CancelTokenList from '../../../stores/CancelTokenList';
import NotebookDrawer from '../NotebookDrawer';
import { ReactComponent as EnvironmentIcon } from '../../../img/EnvironmentIcon.svg';
import { ReactComponent as TasksIcon } from '../../../img/TasksIcon.svg';
import { ReactComponent as RastreabilityIcon } from '../../../img/RastreabilityIcon.svg';
import { ReactComponent as RastreabilityPageIcon } from '../../../img/RastreabilityPageIcon.svg';

import history from '../../../history';
import useResize from "../../../Hook/useResize";
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function NotebookRastreabilityPage(props) {
    const [environment, setEnvironment] = useState({});
    const [environmentCrop, setEnvironmentCrop] = useState({});

    const { classes } = props;
    const tokenList = new CancelTokenList();

    const { t } = useTranslation();

    const window = useResize();

    useEffect(() => {
        setEnvironment(SessionStore.getEnvironment(props.environment));
        getEnvironmentCrop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getEnvironmentCrop = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        NoteStore.getEnvCrop(props.envCrop, cancelToken, responseGetCrop);
    }

    const responseGetCrop = (response) => {
        tokenList.remove(response.id);
        setEnvironmentCrop(response.data);
    }

    const onChange = (a) => {
        if (a !== "PageGenerator") {
            history.push("/note");
        }
    }

    const getAll = () => {
        return (
            <Grid>
                {window.width > 600 &&
                    <NotebookDrawer component={"PageGenerator"} changeComponent={onChange} />
                }
                {window.width <= 600 &&
                    <BottomNavigation value={"PageGenerator"} onChange={onChange} className={classes.root}>
                        <BottomNavigationAction classes={{ label: classes.label }} className={classes.ad} label="Propriedades" value="Propriedades" icon={<EnvironmentIcon className={classes.icons} />} />
                        <BottomNavigationAction classes={{ label: classes.label }} className={classes.ad} label="Tarefas" value="Tarefas" icon={<TasksIcon className={classes.icons} />} />
                        <BottomNavigationAction className={classes.meio} label="" value="Add" icon={<AddIcon className={classes.more} />} />
                        <BottomNavigationAction classes={{ label: classes.label }} className={classes.ad} label="Etiquetas" value="Etiquetas" icon={<RastreabilityIcon className={classes.icons} />} />
                        <BottomNavigationAction className={classes.ad} label="Rastreio" value="PageGenerator" icon={<RastreabilityPageIcon className={classes.icons} />} />
                    </BottomNavigation>
                }
                {!toolsUtils.isNullOrEmpty(environment, "objectid") && !toolsUtils.isNullOrEmpty(environmentCrop, "objectid") &&
                    <Grid className={classes.container}>
                        <Grid className={classes.header}>
                            {t('common.previewPage')}
                        </Grid>
                        <Grid container className={classes.padding}>
                            <Grid item xs={12} md={4}>
                                <Grid container>
                                    <Grid item xs={12} className={classes.productinfo}>
                                        <Grid container >
                                            <Grid item xs={12} className={classes.name}>
                                                {environmentCrop.cropname.toUpperCase() + " " + environmentCrop.cropvariety.toUpperCase()}
                                            </Grid>
                                            <Grid item xs={12}>
                                                {environmentCrop.cropabout || ""}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <NotebookNutritionalTable nutritional={environmentCrop.nutritional} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container>
                                    <Grid item xs={12} className={classes.uploader}>
                                        <img src={"https://prediza.io/images/crop/" + environmentCrop.cropobjectid + ".jpg"} height={250} alt="Imagem do produto" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid>
                                            {!toolsUtils.isNullOrEmpty(environment, "latitude") &&
                                                <GMap page={"Rastreability"} environment noControl classMap={classes.GMap} config={{
                                                    center: {
                                                        lat: environment.latitude,
                                                        lng: environment.longitude,
                                                    },
                                                    zoom: 17,
                                                }} />
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container className={classes.spaces}>
                                    <Grid item xs={12} className={classes.titles}>
                                        {t('notebook.tags_netWeight')}:
                                    </Grid>
                                    <Grid item xs={12}>
                                        0g
                                    </Grid>
                                    <Grid item xs={12} className={classes.spaces}>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Grid container>
                                                    <Grid item xs={12} className={classes.titles}>
                                                        {t('notebook.tags_manufacturedIn')}:
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        01/01/2022
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Grid container>
                                                    <Grid item xs={12} className={classes.titles}>
                                                        {t('notebook.tags_validUntil')}:
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        01/01/2022
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} className={classes.spaces}>
                                        <Grid container>
                                            <Grid item xs={12} className={classes.titles}>
                                                {t('common.producer')}
                                            </Grid>
                                            <Grid item xs={12}>
                                                Nome Do Produtor Da Silva
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid className={classes.subtitles}>
                                                    CNPJ:
                                                </Grid>
                                                <Grid>
                                                    000000.0001/00
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid className={classes.subtitles}>
                                                    {t('common.phoneNumber')}:
                                                </Grid>
                                                <Grid>
                                                    (00) 0 0000-0000
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid className={classes.subtitles}>
                                                    {t('common.email')}:
                                                </Grid>
                                                <Grid>
                                                    prediza@prediza.io
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} className={classes.spaces}>
                                        <Grid container>
                                            <Grid item xs={12} className={classes.titles}>
                                            {t('common.trackingCode')} 
                                            </Grid>
                                            <Grid item xs={12}>
                                                00000000000
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Grid>
        )
    }

    return (
        getAll()
    )

})