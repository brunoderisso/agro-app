import React, { useEffect, useState } from 'react';

import { Typography, Grid } from '@material-ui/core';

import useStyles from '../../../../../styles/Billing/user/managementAccount/propertyUser/PropertyAccountPage';
import PropertyCardInfo from './PropertyCardInfo';
// import NewPropertyCard from './NewPropertyCard';
import SessionStore from '../../../../../stores/SessionStore';
import PoligonStore from '../../../../../stores/PoligonStore';
import stringsUtils from '../../../../../utils/stringsUtils';
import { useTranslation } from 'react-i18next';


function PropertyAccountPage() {
    const classes = useStyles();

    const [properties, setProperties] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        formatEnvironments();
    }, []);

    const formatEnvironments = () => {
        const environments = SessionStore.getEnvironments().map(env => {
            return {
                ...env,
                size: stringsUtils.formatToHa(PoligonStore.convertAreaToHa(env.area)),
                productiveSize: '',  // TODO: atribuir valor quando tiver no environment
            }
        });
        setProperties(environments);
    }

    // const confirmNewProperty = (newProp) => {
    //     // TODO: serviço POST da propriedade nova
    //     setProperties([ ...properties, newProp ]);
    // }

    const handleProperty = (props) => {
        setProperties(props);
    }

    return (
        <Grid className={classes.content}>
            <Typography variant='h4' className={classes.subtitle}>{t('management.myProperties_registeredPropertiesTitle')}</Typography>
            <Grid className={classes.contentCards}>
                <PropertyCardInfo properties={properties} handleProperty={handleProperty} />
                {/* TODO: comentado até solução definitiva */}
                {/* <NewPropertyCard index={properties.length} confirmNewProperty={confirmNewProperty}/> */}
            </Grid>
        </Grid>
    );
}

export default PropertyAccountPage;