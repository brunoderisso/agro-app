import React from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

//Prediza 
import EnvironmentAdminListRow from "./Admin/Environment/EnvironmentAdminListRow";
import { useTranslation } from 'react-i18next';

const styles = {

};

export default withStyles(styles)(function EnvironmentAdminList(props) {

    const { t } = useTranslation();

    return (
        <Grid container >
            <Grid item xs={12}>
                <List>
                    <ListItem key={0}>
                        <Grid container>
                            <Grid item xs={9}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <ListItemText ><strong>{t('common.objectID')}</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <ListItemText><strong>{t('common.name')}</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <ListItemText><strong>{t('common.description')}</strong></ListItemText>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    {props.environments.map((v) => {
                        return (<EnvironmentAdminListRow environment={v} key={v.objectid} />);
                    })}
                </List>
            </Grid>
        </Grid>);
})