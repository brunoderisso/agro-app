import React, { Component } from 'react';

import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import MetaAdminListRow from "../components/MetaAdminListRow";
import toolsUtils from "../utils/toolsUtils";

const styles = {

};

class MetaAdminList extends Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        };

    }

    render() {
        return (
            <Grid container >
                <Grid item xs={12}>
                    <List>
                        <ListItem key={0}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <ListItemText><strong>Medida</strong></ListItemText>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <ListItemText><strong>Título</strong></ListItemText>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <ListItemText><strong>Eixo X</strong></ListItemText>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <ListItemText><strong>Eixo Y</strong></ListItemText>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <ListItemText><strong>Blur</strong></ListItemText>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <ListItemText><strong>Raio</strong></ListItemText>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3}>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <Divider />
                        {!toolsUtils.isNullOrEmpty(this.props,"metas") && this.props.metas.map((v) => {
                            return (<MetaAdminListRow meta={v} key={v.objectid} />);
                        })}
                    </List>
                </Grid>
            </Grid>);
    }

}

export default withStyles(styles)(MetaAdminList);