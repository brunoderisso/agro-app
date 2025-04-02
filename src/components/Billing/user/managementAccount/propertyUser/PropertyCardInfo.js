import React, { useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import clsx from 'clsx';
import PropTypes from "prop-types";

import { Typography, Grid, Card, Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { ReactComponent as DeleteIcon } from '../../../../../img/DeleteIcon.svg';
import { ReactComponent as EditIcon } from '../../../../../img/EditIcon.svg';
import styles from '../../../../../styles/Billing/user/managementAccount/propertyUser/PropertyCardInfo';
import theme from '../../../../../styles/Utils/theme';
import InnerForm from '../../../../Common/Billing/InnerForm';
import PredizaModal from '../../../../Common/PredizaModal';
import { ConstantsUtils } from '../../../../../utils/constantsUtils';
import AccountStore from '../../../../../stores/AccountStore';
import TokenList from '../../../../../stores/CancelTokenList';
import stringsUtils from '../../../../../utils/stringsUtils';
import UserFeedback from '../../../../Common/UserFeedback';
import sessionStore from '../../../../../stores/SessionStore';
import { useTranslation } from 'react-i18next';


function PropertyCardInfo(props) {
    const classes = styles();
    const { t } = useTranslation();

    const modalButtons = [
        { label: t('common.deleteButton'), action: () => deleteProperty(), color: theme.colors.error[40] },
        { label: t('common.cancelButton'), action: (status) => { handleModal(status); } }
    ];

    const [properties, setProperties] = useState([]);
    const [editProperty, setEditProperty] = useState(null);
    const [copiedProperty, setCopiedProperty] = useState(null);
    const [indexEditProperty, setIndexEditProperty] = useState(-1);
    const [indexDeleteProperty, setIndexDeleteProperty] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [errorStatusResponse, setErrorStatusResponse] = useState('');

    const tokenList = new TokenList();


    useEffect(() => {
        setProperties(props.properties);
    }, [props.properties]);

    const onChangeProperty = (prop) => {
        setEditProperty(prop);
    }

    const cancelEditForm = () => {
        setCopiedProperty(null);
        setEditProperty(null);
        setIndexEditProperty(-1);
    }

    const confirmEditProperty = () => {
        const cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        setLoader(true);

        // TODO: adicionar size e productiveSize no objeto
        const formattedEditProperty = {
            name: editProperty.name,
        };
        AccountStore.updateEnvironment(
            cancelToken,
            formattedEditProperty,
            properties[indexEditProperty].objectid,
            responseEditProperty
        );
    }

    const responseEditProperty = (response) => {
        tokenList.remove(response.id);
        setLoader(false);

        if (response.data?.status === 200) {
            const stringEditProperty = {
                ...properties[indexEditProperty],
                name: editProperty.name,
                size: stringsUtils.formatToHa(editProperty.size.toString()),
                productiveSize: editProperty.productiveSize,
            }
            const newProperties = [...properties];

            newProperties[indexEditProperty] = stringEditProperty;
            setIndexEditProperty(-1);
            props.handleProperty(newProperties);

            sessionStore.updateStoredEnvironments(stringEditProperty);
        }

        if (response.status) {
            setErrorStatusResponse(response.status.toString());
        }
    }

    const formatToNumber = (size) => {
        const splittedSize = size.split(' ')[0].replace(',', '.');
        return +splittedSize;
    }

    const handleEditProperty = (property, index) => {
        setCopiedProperty({
            name: property.name, size: formatToNumber(property.size), productiveSize: property.productiveSize
        });
        setIndexEditProperty(index);
    }

    const bodyModal = () => {
        return (
            <Grid>
                <Typography className={classes.textModal}>
                    <span>{t('management.myProperties_confirmPropertyRemoval')}</span>
                    <span className={classes.highlightText}>{copiedProperty?.name}</span>
                    <span>{t('management.myProperties_cannotUndoAction')}</span>
                </Typography>
                <Grid container className={classes.contentWarningText}>
                    <InfoIcon className={classes.iconWarning} />
                    <Typography className={classes.warningText}>
                        {t('management.myProperties_dataNotAvailable')}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    const handleModal = () => {
        setOpenModal(false);
        setCopiedProperty(null);
    }

    const handleDeleteProperty = (property, index) => {
        setOpenModal(true);
        setCopiedProperty(property);
        setIndexDeleteProperty(index);
    }

    const deleteProperty = () => {
        // TODO: serviço DELETE da propriedade
        const newProperties = Array.from(properties);

        newProperties.splice(indexDeleteProperty, 1);
        props.handleProperty(newProperties);

        setOpenModal(false);
        setIndexDeleteProperty(-1);
    }

    return (
        <Grid>
            <Card className={classes.contentCard}>
                {properties && properties.map((property, index) => {
                    return (
                        <Grid key={index} className={clsx({
                            [classes.spacingWrapper]: properties.length !== index + 1
                        })}>
                            {indexEditProperty !== index &&
                                <Grid>
                                    <Grid container className={classes.spacingWrapper}>
                                        <Grid item xs={10}>
                                            <Typography className={clsx(classes.titleCard, classes.colorText)}>
                                                {t('common.property') + ` ${index + 1}`}
                                            </Typography>
                                        </Grid>
                                        <Grid container item xs={2} className={classes.iconContent}>
                                            <Button
                                                className={classes.iconButton}
                                                onClick={() => { handleEditProperty(property, index) }}
                                                id={"editBtn" + parseInt(index + 1)}
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Button
                                                className={classes.iconButton}
                                                onClick={() => { handleDeleteProperty(property, index) }}
                                                id={"delBtn" + parseInt(index + 1)}
                                                disabled
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid className={clsx(classes.fieldItem, classes.mbFieldItem)}>
                                        <Typography className={clsx(classes.outlineText, classes.commonText)}>{t('management.myProperties_propertyName')}</Typography>
                                        <Typography className={clsx(classes.commonText, classes.colorText)}>{property.name}</Typography>
                                    </Grid>
                                    <Grid className={clsx(classes.fieldItem, classes.mbFieldItem)}>
                                        <Typography className={clsx(classes.outlineText, classes.commonText)}>{t('management.myProperties_propertySize')}</Typography>
                                        <Typography className={clsx(classes.commonText, classes.colorText)}>{property.size}</Typography>
                                    </Grid>
                                    <Grid className={clsx(classes.fieldItem, {
                                        [classes.mbFieldItem]: properties.length !== index + 1
                                    })}>
                                        <Typography className={clsx(classes.outlineText, classes.commonText)}>{t('management.myProperties_productiveArea')}</Typography>
                                        <Typography className={clsx(classes.commonText, classes.colorText)}>
                                            {property.productiveSize || ConstantsUtils.NullFieldMask}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            }
                            {indexEditProperty === index && !loader &&
                                <InnerForm
                                    index={index}
                                    property={copiedProperty || editProperty}
                                    onChange={onChangeProperty}
                                    onHandleCloseBt={cancelEditForm}
                                    onHandleDoneBt={confirmEditProperty}
                                    showDeleteBt={false}
                                    showConfirmBt={true}
                                    editMode={true}
                                />
                            }
                            {indexEditProperty === index && loader &&
                                <Grid container justifyContent='center' alignItems='center'>
                                    <BeatLoader color={theme.colors.onSurfaceVariant} sizeUnit={'px'} size={12} />
                                </Grid>
                            }
                        </Grid>
                    );
                })}
                {properties.length === 0 &&
                    <Typography className={classes.emptyText}>{t('management.myProperties_noRegisteredProperties')}</Typography>
                }
            </Card>
            <PredizaModal
                open={openModal}
                dispense={modalButtons[1]}
                confirm={modalButtons[0]}
                title={t('management.removeProperty')}
            >
                {bodyModal()}
            </PredizaModal>
            <UserFeedback error={errorStatusResponse} setError={setErrorStatusResponse} />
        </Grid>
    );
}

PropertyCardInfo.propTypes = {
    properties: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            size: PropTypes.string,
            productiveSize: PropTypes.string,
        })
    ),
    handleProperty: PropTypes.func.isRequired
}

export default PropertyCardInfo;