import React from 'react';

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import DeviceAdminListRow from "./DeviceAdminListRow";
import { useTranslation } from 'react-i18next';


export default function EnvironmentAdminList(props) {
    const { t } = useTranslation();
    return (
        <Grid container >
            <Grid item xs={12}>
                <List>
                    <ListItem key={0}>
                        <Grid container>
                            <Grid item xs={10}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <ListItemText ><strong>{t('common.name')}</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <ListItemText><strong>{t('admin.DevAddr')}</strong></ListItemText>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <ListItemText><strong>{t('admin.DevEUI')}</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <ListItemText><strong>{t('admin.lastTransmission')}</strong></ListItemText>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={2}>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    {props.devices.map((device) => {
                        return (< DeviceAdminListRow device={device} key={device.objectid} />);
                    })}
                </List>
            </Grid>
        </Grid>
    );

}
