import React from 'react';
import { withStyles } from "@material-ui/core/styles";

//Material UI
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

//Prediza
import GatewayAdminListRow from "./GatewayAdminListRow";

const styles = {

};

export default withStyles(styles)(function GatewayAdminList(props) {


    return (
        <Grid container >
            <Grid item xs={12}>
                <List>
                    <ListItem key={0}>
                        <Grid container>
                            <Grid item xs={9}>
                                <Grid container>
                                    <Grid item xs={4}>
                                        <ListItemText ><strong>Nome</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <ListItemText><strong>MAC</strong></ListItemText>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <ListItemText><strong>Ativo</strong></ListItemText>
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    {props.gateways.map((g) => {
                        let open = false;
                        if(props?.mac.length > 0 && props.mac === g.mac){
                            open = true
                        }

                        return (<GatewayAdminListRow gateway={g} open={open} key={g.objectid} />);
                    })}
                </List>
            </Grid>
        </Grid>);


})