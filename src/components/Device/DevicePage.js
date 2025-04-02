import React, { useState, useEffect, useRef } from "react";

import Grid from '@material-ui/core/Grid';

import Devices from "./Devices";
import PredizaTabs from "../Common/PredizaTabs";
import PredizaDeviceAddCard from "../PredizaDeviceAddCard";
import { useTranslation } from "react-i18next";

export default function DevicePage() {
    const [tab, setTab] = useState(null);
    const change =  useRef(false);

    const { t } = useTranslation();

    const changeTab = (num) => {
        change.current = true
        setTab(num)
    }

    useEffect(()=>{
        if (tab !== null && change.current){
            setTab(null)
            change.current = false
        }
    },[tab])

    return (
        <Grid container>
            <Grid item xs={12}>
                <PredizaTabs
                    tab={tab || 0}
                    data={[
                        {label: t('common.devices'), component:<Devices/>},
                        {label: t('device.associateDevice'), component:<PredizaDeviceAddCard change={changeTab}/>}
                    ]}/>
            </Grid>
        </Grid>
    );

};