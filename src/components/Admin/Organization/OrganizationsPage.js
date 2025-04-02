import React, { useState, useEffect } from 'react';

//Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core";


//Prediza 
import OrganizationStore from "../../../stores/OrganizationStore";
import OrganizationAdminList from "./OrganizationAdminList";
import history from "../../../history";
import style from "../../../styles/Admin/Organization/OrganizationList"

export default withStyles(style)(function PredizaAdminOrganizations(props) {

    const [organizations, setOrganizations] = useState([]);

    const {classes} = props;
    //Component default methods
    useEffect(() => {
        getOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //Event methods
    const onClickAdd = () => {
        history.push("/admin/organizations/new");
    }

    //Component methods
    const responseGetOrganizations = (response) => {
        setOrganizations(response);
    };

    //Store methods
    const getOrganizations = () => {
        OrganizationStore.getOrganizations(responseGetOrganizations);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end" className={classes.Button}>
                    <Button onClick={onClickAdd} color="primary">Adicionar Organização</Button>
                </Grid>
            </Grid>
            <Grid style={{margin:"10px"}}></Grid>
            <Grid item xs={12}>
                {organizations.length > 0 && <OrganizationAdminList organizations={organizations} />}
            </Grid>
        </Grid>
    );


});
