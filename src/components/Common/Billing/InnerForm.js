import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { withStyles } from "@material-ui/core/styles";
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import styles from "../../../styles/Common/Billing/InnerForm";
import { ReactComponent as DeleteIcon } from '../../../img/DeleteIcon.svg';
import toolsUtils from '../../../utils/toolsUtils';
import masksUtils from '../../../utils/masksUtils';
import BillingStore from '../../../stores/BillingStore';


export default withStyles(styles)(function InnerForm(props) {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [size, setSize] = useState("");
    const [productiveSize, setProductiveSize] = useState("");
    const [disableDelete, setDisableDelete] = useState(false);
    const [showDeleteBt, setShowDeleteBt] = useState(true);
    const [showConfirmBt, setShowConfirmBt] = useState(false);
    const [flagNameError, setFlagNameError] = useState(false);
    const [textNameError, setTextNameError] = useState('');
    const [flagSizeError, setFlagSizeError] = useState(false);
    const [textSizeError, setTextSizeError] = useState(
        `${t("management.myProperties_costOf")} ${masksUtils.currencyFormat(BillingStore.getHatax())}/ha.`
    );

    const { classes } = props;

    useEffect(() => {
        bind();

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.property) {
            setName(props.property.name);
            setSize(props.property.size);
            setProductiveSize(props.property.productiveSize);
        }
    }, [props.property]);

    useEffect(() => {
        if (props.showDeleteBt !== undefined) {
            setShowDeleteBt(props.showDeleteBt);
        }
    }, [props.showDeleteBt]);

    useEffect(() => {
        if (props.showConfirmBt !== undefined) {
            setShowConfirmBt(props.showConfirmBt);
        }
    }, [props.showConfirmBt]);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, 'enabledDeleteBtn')) {
            if (props.enabledDeleteBtn) {
                setDisableDelete(false);
            } else {
                setDisableDelete(true);
            }

            for (let i = 1; i <= parseInt(props.index + 1); i++) {
                const delbtn = document.getElementById('delBtn' + i);

                delbtn.disabled = !props.enabledDeleteBtn;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.enabledDeleteBtn]);

    useEffect(() => {
        if (!toolsUtils.isNullOrEmpty(props, 'enabledDeleteBtn')) {
            const delbtn = document.getElementById('delBtn1');

            if (disableDelete) {
                delbtn.classList.add(classes.disableIcon);
            } else {
                delbtn.classList.remove(classes.disableIcon);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disableDelete]);

    useEffect(() => {
        if (name.length > 0) {
            setFlagNameError(false);
            setTextNameError('');
        }

        if (size.length > 0) {
            const textError = `${t('management.myProperties_costOf')} ${masksUtils.currencyFormat(BillingStore.getHatax())}/ha.`;

            setFlagSizeError(false);
            setTextSizeError(textError);
        }

        if (typeof props.onChange === "function" && !props.propertyDeleted) {
            const property = {
                name: name,
                size: size,
                productiveSize: productiveSize
            }

            props.onChange(property, props.index);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, size, productiveSize]);

    const bind = () => {
        BillingStore.addListener('fields.error', handleFieldsError);
    }

    const clear = () => {
        BillingStore.removeListener('fields.error', handleFieldsError);
    }

    const handleChangeValue = (e) => {
        if (e.target.name === "name") {
            setName(e.target.value);
        }
        if (e.target.name === "size") {
            setSize(e.target.value);
        }
        if (e.target.name === "productiveSize") {
            setProductiveSize(e.target.value);
        }
    }

    // Função de callback para o evento de clique do botão
    const handleImportBt = () => {
        BillingStore.emit("import_click", props.index);
    };

    const deleteProperty = () => {
        props.onRemoveProperty(props.index);
    }

    const handleCloseBt = () => {
        props.onHandleCloseBt();
    }

    const handleDoneBt = () => {
        if (name.length > 0 && size.toString().length > 0) {
            props.onHandleDoneBt();
        }

        handleFieldsError([name.length, size.length]);
    }

    const handleFieldsError = (lengthFields) => {
        if (lengthFields[0] === 0) {
            setFlagNameError(true);
            setTextNameError(t('alert.requiredToFillIn'));
        }

        if (lengthFields[1] === 0) {
            setFlagSizeError(true);
            setTextSizeError(t('alert.requiredToFillIn'));
        }
    }

    return (
        <Grid style={{ marginBottom: "15px" }}>
            <Grid item xs={12} className={classes.margin}>
                <Grid container alignItems='center'>
                    <Grid item xs={showDeleteBt
                        ? 8
                        : (props.editMode ? 10 : 7)
                    }>
                        <Typography variant='overline' className={classes.subTitle}>
                            {"PROPRIEDADE " + parseInt(props.index + 1)}
                        </Typography>
                    </Grid>
                    {showDeleteBt &&
                        <Grid item xs={1} style={{ textAlign: 'end' }}>
                            <Button
                                onClick={deleteProperty}
                                className={classes.iconButton}
                                id={'delBtn' + parseInt(props.index + 1)}
                                disabled={disableDelete}
                            >
                                <DeleteIcon />
                            </Button>
                        </Grid>
                    }
                    {!props.editMode &&
                        <Grid item xs={3} style={{ textAlign: 'end' }}>
                            <Button onClick={handleImportBt} className={classes.importButton}>{t('common.import')}</Button>
                        </Grid>
                    }
                    {showConfirmBt &&
                        <Grid item xs={2} className={classes.contentConfirmIcon}>
                            <Button onClick={handleDoneBt} className={classes.iconButton}>
                                <DoneIcon fontSize='small' className={classes.iconProp} />
                            </Button>
                            <Button onClick={handleCloseBt} className={classes.iconButton}>
                                <CloseIcon fontSize='small' className={classes.iconProp} />
                            </Button>
                        </Grid>
                    }
                </Grid>
            </Grid>

            <FormControl fullWidth className={classes.margin}>
                <TextField
                    id="name"
                    name="name"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.inputs}
                    value={name}
                    onChange={handleChangeValue}
                    label={t('management.myProperties_propertyName')}
                    variant="outlined"
                    placeholder={t('management.myProperties_identificationOnPlatform')}
                    size='small'
                    error={flagNameError}
                    helperText={textNameError}
                />
            </FormControl>

            <FormControl fullWidth className={classes.margin}>
                <TextField
                    id="size"
                    name="size"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={clsx({
                        [classes.sizeInput]: !flagSizeError
                    }, classes.inputs)}
                    value={size}
                    onChange={handleChangeValue}
                    label={t('management.myProperties_propertySizeHa')}
                    variant="outlined"
                    placeholder={t('management.myProperties_totalSizePropertyLimit')}
                    size='small'
                    type='number'
                    error={flagSizeError}
                    helperText={textSizeError}
                    disabled={props.editMode} // TODO: paliativo, remover quando tiver solução definitiva
                />
            </FormControl>

            <FormControl fullWidth>
                <TextField
                    id="productiveSize"
                    name="productiveSize"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    className={classes.inputs}
                    value={productiveSize}
                    onChange={handleChangeValue}
                    label={t('management.myProperties_productiveArea')}
                    variant="outlined"
                    placeholder={t('management.myProperties_totalProductiveArea')}
                    size='small'
                />
            </FormControl>
        </Grid>
    )
});