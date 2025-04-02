import React, { useEffect, useState } from 'react';

import { withStyles } from "@material-ui/core/styles";
import { Grid, Button, Card, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddIcon from '@material-ui/icons/Add';

import InnerForm from '../../Common/Billing/InnerForm';
import BillingStore from '../../../stores/BillingStore';
import history from '../../../history';
import styles from "../../../styles/Billing/PropertyForm";
import PolygonStore from '../../../stores/PoligonStore';
import { useTranslation } from 'react-i18next';


export default withStyles(styles)(function PropertyForm(props) {
    const [properties, setProperties] = useState([]);
    const [flagAddProperty, setFlagAddProperty] = useState(false);
    const [flagDeleteProperty, setFlagDeleteProperty] = useState(true);
    const [flagImportedProperty, setFlagImportedProperty] = useState(false);

    const { classes } = props;

    const { t } = useTranslation();

    useEffect(() => {
        bind();

        if (BillingStore.getProperties().length > 0) {
            setProperties([...BillingStore.getProperties()]);
        } else if (PolygonStore.getSelectedPolygon()) {
            let newProperty = {
                ...PolygonStore.getSelectedPolygon(),
                size: PolygonStore.convertAreaToHa(PolygonStore.getSelectedPolygon().area)
            }
            setProperties([...properties, newProperty])
        } else {
            onAddProperty(null, true);
        }

        return clear;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (properties.length === 1) {
            setFlagAddProperty(false);
        } else {
            setFlagAddProperty(true);
        }

        BillingStore.setProperties([...properties])
    }, [properties]);

    const bind = () => {
        PolygonStore.addListener("import_polygon_sucess", handlePolygonImported);
    }

    const clear = () => {
        PolygonStore.removeListener("import_polygon_sucess", handlePolygonImported);
    }

    const handlePolygonImported = () => {
        if (PolygonStore.getSelectedPolygon()) {
            const newProperty = {
                ...PolygonStore.getSelectedPolygon(),
                size: PolygonStore.convertAreaToHa(PolygonStore.getSelectedPolygon().area)
            }
            const newProperties = [...BillingStore.getProperties()];
            newProperties[newProperty.index] = newProperty;

            setProperties(newProperties);
            setFlagImportedProperty(true);
        }
    }

    const confirm = () => {
        if (properties.length > 0) {
            const property = properties[0];
            if (property.name.length > 0 && property.size.length > 0) {
                BillingStore.setProperties([...properties]);

                history.push("/subscription/resume");
            } else {
                BillingStore.emit('fields.error', [property.name.length, property.size.length]);
            }
        }
    }

    const cleanFields = () => {
        const auxProperties = [];

        setFlagDeleteProperty(false);

        properties.forEach((_) => {
            auxProperties.push({
                ...blankProperty()
            })
        })
        setProperties(auxProperties);
    }

    const prev = () => {
        history.push("/subscription/customer");
    }

    const blankProperty = () => {
        return {
            name: "",
            size: "",
            productiveSize: ""
        };
    }

    const onAddProperty = (_, firstItem = false) => {
        const newProperty = {
            ...blankProperty()
        }

        if (!firstItem) {
            setFlagAddProperty(true);
        }

        setFlagDeleteProperty(false);
        setProperties([...properties, newProperty]);
    }

    const onChangeProperties = (property, index) => {
        const id = properties.findIndex((_, i) => { return i === index });

        if (id === -1) {
            setProperties([...properties, property])
        } else if (flagImportedProperty) {
            setFlagImportedProperty(false);
        } else {
            const newProperties = [...properties];
            newProperties[id] = property;

            setProperties(newProperties);
        }
    }

    const onRemoveProperty = (index) => {
        let newProperties = Array.from(properties);

        newProperties.splice(index, 1);

        setFlagDeleteProperty(true);
        setProperties(newProperties);
    }

    return (
        <Card elevation={2} className={classes.container}>
            {properties.map((property, index) => {
                return (
                    <InnerForm
                        index={index}
                        property={property}
                        onChange={onChangeProperties}
                        enabledDeleteBtn={flagAddProperty}
                        onRemoveProperty={onRemoveProperty}
                        propertyDeleted={flagDeleteProperty}
                        key={index}
                    />
                )
            })}

            <Grid item xs={12} style={{ margin: "40px 0px" }}>
                <Button className={classes.importButton} onClick={onAddProperty} startIcon={<AddIcon />}>{t('management.myProperties_addProperty')}</Button>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: "40px" }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Button className={classes.cleanButton} onClick={cleanFields}>
                            {t("common.clearButton")}
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button
                            className={classes.prevButton}
                            startIcon={<ArrowBackIosIcon
                                className={classes.iconSize} />}
                            onClick={prev}
                            variant='outlined'
                        >
                            {t('common.backButton')}
                        </Button>
                    </Grid>
                    <Grid item md>
                        <Button
                            className={classes.nextButton}
                            endIcon={<ArrowForwardIosIcon
                                className={classes.iconSize} />}
                            fullWidth
                            onClick={confirm}
                            variant='contained'
                        >
                            {t('common.forwardButton')}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Typography variant='caption'>
                    {t('management.payment_planVariationInfo')}
                </Typography>
            </Grid>

        </Card>
    )
});