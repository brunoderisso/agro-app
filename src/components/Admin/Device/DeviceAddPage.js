import React from 'react';
import { withStyles } from "@material-ui/core/styles";

import Grid from '@material-ui/core/Grid';

import styles from "../../../styles/Device/DeviceAdd"
import PredizaTabs from "../../Common/PredizaTabs"
import DeviceForm from "./DeviceForm";
import PinMap from "../../Common/PinMap";
import { useTranslation } from 'react-i18next';

export default withStyles(styles)(function DeviceAddPage() {
    const { t } = useTranslation();
    return (
        <Grid container>
            <Grid item xs={12} style={{paddingLeft:"11vw"}}>
                <PredizaTabs data={[{ label: t('common.settings'), component: <DeviceForm method={"POST"} /> },
                { label: t('common.location'), component: <PinMap method={"POST"} />, disabled: true }]} />
            </Grid>
        </Grid>
    );
})
