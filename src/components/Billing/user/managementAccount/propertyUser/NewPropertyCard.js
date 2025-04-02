import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';

import { Typography, Card, Button, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import styles from '../../../../../styles/Billing/user/managementAccount/propertyUser/NewPropertyCard';
import InnerForm from '../../../../Common/Billing/InnerForm';
import { useTranslation } from 'react-i18next';

function NewPropertyCard(props) {
    const classes = styles();

    const { t } = useTranslation();

    const [flagFormNew, setFlagFormNew] = useState(false);
    const [flagButtonNew, setFlagButtonNew] = useState(true);
    const [property, setProperty] = useState(null);

    useEffect(() => {
        setFlagButtonNew(!flagFormNew);
    }, [flagFormNew])

    const addNewProperty = () => {
        setFlagFormNew(true);
    }

    const confirmNewProperty = () => {
        props.confirmNewProperty(property);
    }

    const onChangeProperties = (prop) => {
        setProperty(prop);
    }

    const cancelNewForm = () => {
        setFlagButtonNew(true);
        setFlagFormNew(false);
    }

    return (
        <Card className={classes.wrapperCard}>
            {flagFormNew &&
                <Grid className={clsx({
                    [classes.containerForm]: flagButtonNew
                })}>
                    <InnerForm
                        index={props.index}
                        onChange={onChangeProperties}
                        onHandleCloseBt={cancelNewForm}
                        onHandleDoneBt={confirmNewProperty}
                        showDeleteBt={false}
                        showConfirmBt={true}
                    />
                </Grid>
            }
            {flagButtonNew &&
                <Button
                    color='primary'
                    className={classes.btPrimary}
                    startIcon={<AddIcon className={classes.iconBt}/>}
                    onClick={addNewProperty}
                >
                    <Typography className={classes.textBtPrimary}>
                        {t('management.myProperties_addProperty')}
                    </Typography>
                </Button>
            }
        </Card>
    );
}

NewPropertyCard.propTypes = {
    index: PropTypes.number.isRequired
}

export default NewPropertyCard;