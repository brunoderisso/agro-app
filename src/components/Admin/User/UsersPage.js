import React, { useState, useEffect } from 'react';

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core";


//Prediza 
import OrganizationStore from "../../../stores/UserStore";
import OrganizationAdminList from "./UserAdminList";
import history from "../../../history";
import style from "../../../styles/Admin/Organization/OrganizationList"
import tokens from "../../../stores/CancelTokenList";

export default withStyles(style)(function PredizaAdminOrganizations(props) {

    const [organizations, setOrganizations] = useState([]);
    const tokenList = new tokens();
    const { classes } = props;
    //Component default methods
    useEffect(() => {
        getOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Event methods
    const onClickAdd = () => {
        history.push("/admin/users/new");
    }

    //Component methods
    const responseGetOrganizations = (response) => {
        setOrganizations(response.data);
    };

    //Store methods
    const getOrganizations = () => {
        let cancelToken = {};
        cancelToken.id = tokenList.add();
        cancelToken.token = tokenList.get(cancelToken.id);
        OrganizationStore.getUsers(cancelToken, responseGetOrganizations);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end" className={classes.Button}>
                    <Button onClick={onClickAdd} color="primary">Adicionar Usuário</Button>
                </Grid>
            </Grid>
            <Grid style={{ margin: "10px" }}></Grid>
            <Grid item xs={12}>
                {organizations.length > 0 && <OrganizationAdminList users={organizations} />}
            </Grid>
        </Grid>
    );


});
