import React from 'react';
import SessionStore from '../../stores/SessionStore';
import { Grid } from '@material-ui/core';
import { ReactComponent as InmetIcon } from '../../img/InmetIcon.svg';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = {};

export default withStyles(styles)(function InmetWidgetsInfo(props) {

    const { t } = useTranslation();
    
    return (
        <Grid container style={{ marginLeft: "5px", marginBottom: "5px" }}>
            <Grid>
                <Grid container style={{ border: "1px solid black", padding: "3px", paddingTop: "6px", borderRadius: "10px" }}>
                    <Grid item xs={4} style={{ marginRight: "5px" }}>
                        <TrackChangesIcon />
                    </Grid>
                    <Grid item xs={2} style={{ marginTop: "3px" }}>
                        {SessionStore.getRadius() / 1000 + "Km"}
                    </Grid>
                </Grid>
            </Grid>
            <Grid style={{ marginLeft: "5px", width: "fit-content" }}>
                <Grid container style={{ border: "1px solid black", padding: "3px", paddingTop: "6px", paddingRight: "5px", borderRadius: "10px" }}>
                    <Grid item style={{ marginRight: "5px" }}>
                        <InmetIcon style={{ transform: "scale(0.5)", margin: "-10px" }} />
                    </Grid>
                    <Grid item style={{ marginTop: "3px" }}>
                        {props.length + ` ${t('common.stations')}`}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});