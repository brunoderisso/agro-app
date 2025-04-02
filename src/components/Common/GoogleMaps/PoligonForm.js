import React, { useState, useEffect, useRef } from 'react';
import { TwitterPicker } from 'react-color';

import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Styles from '../../../styles/Poligon/PoligonForm'
import PolygonStore from '../../../stores/PoligonStore'
import NoteStore from '../../../stores/NoteStore'
import toolsUtils from '../../../utils/toolsUtils'
import tokens from '../../../stores/CancelTokenList'
import PredizaAlertDialog from '../../PredizaAlertDialog';
import SessionStore from '../../../stores/SessionStore';
import UserFeedback from '../../Common/UserFeedback';
import { useTranslation } from 'react-i18next';


const tokenList = new tokens();

export default withStyles(Styles)(function PoligonForm(props) {
    const { classes } = props;
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [visible, setVisible] = useState(false);
    const [crops, setCrops] = useState([]);
    const [crop, setCrop] = useState(null);
    const [color, setColor] = useState('#2196f3');
    const [flags, setFlags] = useState({});
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isenvironment, setIsEnvironment] = useState(false);

    const polygonIdRef = useRef('');

    useEffect(() => {
        getCrops();
        setFlags({
            dialogIsOpen: false,
            error: false
        })
        setName(props.polName);
        setIsEnvironment(props.onCreateEnvironmentPolygon);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCrops = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        NoteStore.getCrops(cancelToken, responseCrops);
    }

    const responseCrops = (response) => {
        tokenList.remove(response.id);

        if (response !== null && response.data !== undefined) {
            setCrops([]);
            setCrops(response.data);
        }
    }

    const handleChangeSelect = (event) => {
        setCrop(event.target.value);
    };

    const handleChangeComplete = (color, event) => {
        setVisible(false);
        setColor(color.hex);
    };

    const getCropResponse = (response) => {
        setError('');
        if (response.data !== undefined && response.data !== null && !toolsUtils.isNullOrEmpty(response.data, 'objectid')) {
            savePolygon(response.data.objectid);
        }

        if (response?.status === 400) {
            setError(response.status.toString());
            setErrorMessage(t('alert.errorMessageField'));
        }
    }

    const save = () => {
        if (isenvironment) {
            savePolygon();
        } else {
            let envCrop = {
                cropobjectid: crop,
            }

            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            NoteStore.addNoteCrop(envCrop, cancelToken, (response) => { getCropResponse(response) })
        }
    }

    const savePolygon = (id) => {
        if (props.points.length < 2) {
            setError('400');
            setErrorMessage(t('alert.needCreatePointsPolygon'));

            return;
        }

        const bounds = PolygonStore.arrayToString(props.points);

        if (isenvironment) {
            let env = {
                bounds
            }

            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            PolygonStore.updateEnvironmentPolygon(cancelToken, env, responseUpdateEnvironmentPolygon);

        } else {
            let pol = {
                name: name,
                color: color,
                cropobjectid: id,
                area: props.area,
                bounds
            }

            let cancelToken = {};
            cancelToken.id = tokenList.add();
            cancelToken.token = tokenList.get(cancelToken.id);

            if (!toolsUtils.isEmptyString(name)) {
                PolygonStore.addPolygon(cancelToken, pol, responseAddPolygon);
            } else {
                setFlags({
                    ...flags,
                    error: true
                })
            }
        }
    }

    const responseUpdateEnvironmentPolygon = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            const bounds = PolygonStore.arrayToString(props.points);

            SessionStore.updateEnvironmentPolygon({ bounds });
            setFlags({
                ...flags,
                dialogIsOpen: true
            })
        }
    }

    const toggleDialog = () => {
        let dialog = flags.dialogIsOpen;
        setFlags({
            ...flags,
            dialogIsOpen: !dialog,
        })

        SessionStore.storePolygons(true);
        PolygonStore.sucessPolygon();
    };

    const responseAddPolygon = (response) => {
        tokenList.remove(response.id);

        if (response.data) {
            setFlags({
                ...flags,
                dialogIsOpen: true
            })

            polygonIdRef.current = response.data.objectid;
        }

        if (response.status) {
            setError(response.status.toString());
            setErrorMessage('');
        }
    }

    const colorComponent = () => {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        {t('common.color')}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: '35px' }}>
                        <div style={{ width: '40px', height: '25px', border: 'solid 1px black', borderRadius: '1em', background: color }}
                            onClick={() => { setVisible(!visible) }}>
                        </div>
                    </div>
                </Grid>
                {visible &&
                    <Grid item xs={12}>
                        <TwitterPicker
                            color={color}
                            onChangeComplete={handleChangeComplete}
                            styles={{ maxWidth: '100px' }}
                        />
                    </Grid>
                }
            </Grid>
        )
    }

    const cropComponent = () => {
        return (
            <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-label'>{t('dashboard.textCultivate')}</InputLabel>
                <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={crop}
                    onChange={handleChangeSelect}
                    disabled={isenvironment}
                >
                    {crops.map((c, index) => {
                        return (
                            <MenuItem key={index} value={c.objectid}>{(c.name + ' ' + c.variety).toUpperCase()}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }

    const handleChange = (event) => {
        setName(event.target.value);
        setFlags({
            ...flags,
            error: false
        })
    };


    return (
        <Grid container className={(props.page !== 'PoligonList' && classes.container) || classes.formContainer}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h5' gutterBottom>
                            {t('dashboard.fieldIn') + ' ' + props.env.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.margins}>
                        <form noValidate autoComplete='off'>
                            <TextField className={classes.textField}
                                variant='outlined'
                                error={flags.error}
                                margin='dense'
                                label={t('common.name')}
                                value={name}
                                onChange={handleChange}
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        {cropComponent()}
                    </Grid>
                    {!isenvironment &&
                        <Grid item xs={12}>
                            {colorComponent()}
                        </Grid>
                    }
                </Grid>
            </Grid>
            {!visible &&
                <Grid item xs={12} className={classes.btns}>
                    <Button color='primary' onClick={save}>{t('common.saveButton')}</Button>
                </Grid>
            }
            <PredizaAlertDialog title={t('alert.successMessage')} method={'alert'} open={flags.dialogIsOpen} close={toggleDialog} />
            <UserFeedback error={error} message={errorMessage} setError={setError} />
        </Grid>
    );
})