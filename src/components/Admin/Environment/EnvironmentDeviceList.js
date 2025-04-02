import React from 'react';

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";

import EnvironmentDeviceListRow from "./EnvironmentDeviceListRow";


export default function EnvironmentUserList(props) {
    return (
        <Grid container >
            <Grid item xs={12}>
                <List>
                    {
                        props.devices !== undefined
                            ? props.devices.map(device => {
                                return (
                                    <EnvironmentDeviceListRow
                                        disabled={props.disabled}
                                        environment={props.environment}
                                        device={device}
                                        key={device.deveui}
                                    />
                                );
                            })
                            : ""
                    }
                </List>
            </Grid>
        </Grid>
    );
}
