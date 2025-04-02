import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { Scrollbars } from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";

import EnvironmentStore from "../../../stores/EnvironmentStore";
import TokenList from '../../../stores/CancelTokenList';
import toolsUtils from "../../../utils/toolsUtils";
import styles from "../../../styles/Notebook/NotebookEnvironmentCard";
import useResize from "../../../Hook/useResize";


export default withStyles(styles)(function NotebookEnvironmentCard(props) {
    const { t } = useTranslation();
    const tokenList = new TokenList();

    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [toggleLocation, setToggleLocation] = useState(false);

    const [environment, setEnvironment] = useState({});
    const [environmentP, setEnvironmentP] = useState({});

    //TextField Values
    const [information, setInformation] = useState({});

    const window = useResize();

    useEffect(() => {
        setEnvironment(props.env);
        if (props.content === "form") {
            setExpanded(true);
            getPreferences();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        onClickEdit(props.editing);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.editing]);

    useEffect(() => {
        if (typeof props.toggleLocation === "function") {
            props.toggleLocation(toggleLocation);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleLocation]);

    useEffect(() => {
        setInformation(environmentP);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [environmentP]);

    const { classes } = props;

    const getPreferences = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);

        EnvironmentStore.getEnvironmentPreferences(cancelToken, responsePreferences);
    }

    const responsePreferences = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setEnvironmentP(response.data);
        }
    }

    const onClickEdit = (e) => {
        if (information.zipcode !== undefined && information.zipcode !== null && information.zipcode[8] === "_") {
            setInformation({
                ...information,
                error: true
            })
            return
        }

        if (editing && !toolsUtils.isNullOrEmpty(environmentP, "objectid")) {
            let preferences = {
                objectid: environmentP.objectid,
                email: information.email || null,
                telephone: information.telephone || null,
                street: information.street || null,
                zipcode: information.zipcode || null,
            }

            EnvironmentStore.setEnvironmentPreferences(preferences, responseSetEnvironmentPreferences);
        } else if (editing && toolsUtils.isNullOrEmpty(environmentP, "objectid")) {
            EnvironmentStore.postEnvironmentPreferences(responsePostPreference);
        }

        if (e !== undefined) {
            setEditing(e);
            return
        }
        let f = editing;
        setEditing(!f);
        return;
    }

    const responsePostPreference = (data) => {
        if (!toolsUtils.isNullOrEmpty(data, "objectid")) {
            let preferences = {
                objectid: data.objectid,
                email: information.email || null,
                telephone: information.telephone || null,
                street: information.street || null,
                zipcode: information.zipcode || null,
            }

            EnvironmentStore.setEnvironmentPreferences(preferences, responseSetEnvironmentPreferences);
        }
    }

    const responseSetEnvironmentPreferences = (response) => {
        if (response === "OK") {
            getPreferences();
        }
    }

    const onClickEditLocation = () => {
        setToggleLocation(!toggleLocation);
    }

    const onChangeInput = (event) => {
        if (event.target.name === 'zipcode' && event.target.value[8] !== "_") {
            setInformation({
                ...information,
                [event.target.name]: event.target.value,
                error: false
            })
            return
        }
        setInformation({
            ...information,
            [event.target.name]: event.target.value,
        });
    };

    const handleExpandClick = () => {
        if (!expanded) {
            getPreferences();
        }
        setExpanded(!expanded);
    };

    const thumb = () => {
        return (
            <Grid id={"thumb"} className={classes.thumb}>
            </Grid>
        )
    }

    const getForm = () => {
        return (
            <Collapse in={true} timeout={2000} unmountOnExit className={clsx({ [classes.collapseMobile]: window.width < 600 && !expanded })}>
                <Scrollbars style={{ width: "100%", height: "25vh" }} renderThumbVertical={thumb}>
                    <CardContent className={classes.contentExpand}>
                        <Grid container style={props.content === "form" && { margin: "-16px" }}>
                            {(window.width < 600 ? expanded : true) &&
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={10} xl={11}>
                                            <Grid container>
                                                <Grid>
                                                    <Typography className={classes.envItens} gutterBottom>{t('common.producerCompany')}</Typography>
                                                </Grid>
                                            </Grid>
                                            {!editing &&
                                                <Typography variant="button" display="block" gutterBottom>{environment.name}</Typography>
                                            }
                                            {editing &&
                                                <TextField
                                                    name="name"
                                                    onChange={onChangeInput}
                                                    defaultValue={environment.name}
                                                    fullWidth
                                                />
                                            }
                                        </Grid>
                                        {props.content === undefined &&
                                            <Grid item xs={2} xl={1}>
                                                <IconButton style={{ marginRight: "15px", color: "#4285F4" }} onClick={onClickEdit} aria-label="edit" size="medium">
                                                    {editing &&
                                                        <CheckIcon fontSize="medium" />
                                                    }
                                                    {!editing &&
                                                        <EditOutlinedIcon fontSize="medium" />
                                                    }
                                                </IconButton>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            }
                            {expanded &&
                                <Grid item xs={12}>
                                    <Typography className={classes.envItens} gutterBottom>{t('common.address')}</Typography>
                                    {!toolsUtils.isNullOrEmpty(environmentP, "street") && !editing &&
                                        <Typography variant="button" display="block" gutterBottom>{environmentP.street || ""}</Typography>
                                    }
                                    {editing &&
                                        <TextField
                                            name="street"
                                            label={information.street ? "" : t('common.address')}
                                            onChange={onChangeInput}
                                            value={information.street}
                                            defaultValue={environmentP.street || ""}
                                            fullWidth
                                        />
                                    }
                                </Grid>
                            }
                            {expanded &&
                                <Grid item xs={12}>
                                    <Typography className={classes.envItens} gutterBottom>CEP</Typography>
                                    {!toolsUtils.isNullOrEmpty(environmentP, "zipcode") && !editing &&
                                        <Typography variant="button" display="block" gutterBottom>{environmentP.zipcode || ""}</Typography>
                                    }
                                    {editing &&
                                        <InputMask mask="99999-999" name={"zipcode"} value={information.zipcode || environmentP.zipcode} onChange={onChangeInput}>
                                            {(inputProps) => <TextField {...inputProps} error={information.error} />}
                                        </InputMask>
                                    }
                                </Grid>
                            }
                            {expanded &&
                                <Grid item xs={12}>
                                    <Typography className={classes.envItens} gutterBottom>{t('common.email')}</Typography>
                                    {!toolsUtils.isNullOrEmpty(environmentP, "email") && !editing &&
                                        <Typography variant="button" display="block" gutterBottom>{environmentP.email || ""}</Typography>
                                    }
                                    {editing &&
                                        <TextField
                                            name="email"
                                            label={information.email ? "" : t('common.email')}
                                            onChange={onChangeInput}
                                            value={information.email}
                                            defaultValue={environmentP.email || ""}
                                        />
                                    }
                                </Grid>
                            }
                            {expanded &&
                                <Grid item xs={12}>
                                    <Typography className={classes.envItens} gutterBottom>{t('common.phoneNumber')}</Typography>
                                    {!toolsUtils.isNullOrEmpty(environmentP, "telephone") && !editing &&
                                        <Typography variant="button" display="block" gutterBottom>{environmentP.telephone || ""}</Typography>
                                    }
                                    {editing &&
                                        <InputMask mask="(99) 9 9999-9999" name={"telephone"} value={information.telephone || environmentP.telephone} onChange={onChangeInput}>
                                            {(inputProps) => <TextField {...inputProps} />}
                                        </InputMask>
                                    }
                                </Grid>
                            }
                            {expanded &&
                                <Grid item xs={12}>
                                    <Typography className={classes.envItens} gutterBottom>{t('common.producerRegistration')}</Typography>
                                    {!toolsUtils.isNullOrEmpty(environmentP, "inscription") && !editing &&
                                        <Typography variant="button" display="block" gutterBottom>{""}</Typography>
                                    }
                                    {editing &&
                                        <TextField
                                            name="inscription"
                                            label={t('common.registrationNumber')}
                                            onChange={onChangeInput}
                                            defaultValue={environmentP.inscription || ""}
                                        />
                                    }
                                </Grid>
                            }
                            <Grid item xs={12} className={classes.viewMore}>
                                {props.content !== "form" &&
                                    <Button onClick={handleExpandClick} className={classes.buttonMore} color="primary">{expanded ? t('common.seeLess') : t('common.seeMore')}</Button>
                                }
                            </Grid>
                        </Grid>
                    </CardContent>
                </Scrollbars>
            </Collapse>
        )
    }

    if (props.content === "form") {
        return getForm();
    } else {
        return (
            <Grid container>
                <Card className={classes.styleCard}>
                    <CardContent>
                        <Grid container style={{ paddingTop: "8px" }}>
                            <Grid item xs={11} xl={11}>
                                <Typography className={classes.environmentText} variant="h6" gutterBottom>
                                    {environment.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={1} xl={1}>
                                <IconButton style={(toggleLocation && { color: 'white', backgroundColor: "rgba(55, 55, 55, 0.3)", marginRight: "15px" }) || { color: 'white', marginRight: "15px" }} onClick={onClickEditLocation} aria-label="Location">
                                    <LocationSearchingIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                    {getForm()}
                </Card>
            </Grid>
        )
    }
})